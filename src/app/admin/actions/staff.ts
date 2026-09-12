"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertRole, getCurrentUser } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { Role } from "@/generated/prisma/enums";

export type StaffState = { error?: string; success?: string } | null;

const password = z
  .string()
  .min(10, "Passwords need at least 10 characters.")
  .regex(/[a-zA-Z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  name: z.string().min(2, "Enter a name.").max(80),
  role: z.enum(Role),
  password,
});

export async function createStaff(_prev: StaffState, form: FormData): Promise<StaffState> {
  const actor = await assertRole("OWNER");
  const parsed = inviteSchema.safeParse({
    email: String(form.get("email") ?? "").trim().toLowerCase(),
    name: String(form.get("name") ?? "").trim(),
    role: String(form.get("role") ?? Role.STAFF),
    password: String(form.get("password") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const clash = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (clash) return { error: "Someone already uses that email." };

  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
  });
  await logAudit({
    userId: actor.id,
    action: "created",
    entity: "user",
    entityId: user.id,
    summary: `${user.email} as ${user.role.toLowerCase()}`,
  });

  revalidatePath("/admin/staff");
  return { success: `${user.email} can now sign in.` };
}

export async function setStaffRole(userId: string, role: Role) {
  const actor = await assertRole("OWNER");
  if (actor.id === userId) throw new Error("You cannot change your own role.");
  const user = await db.user.update({ where: { id: userId }, data: { role } });
  await logAudit({
    userId: actor.id,
    action: "updated",
    entity: "user",
    entityId: userId,
    summary: `${user.email} → ${role.toLowerCase()}`,
  });
  revalidatePath("/admin/staff");
}

export async function setStaffActive(userId: string, isActive: boolean) {
  const actor = await assertRole("OWNER");
  if (actor.id === userId) throw new Error("You cannot deactivate your own account.");
  const user = await db.user.update({ where: { id: userId }, data: { isActive } });
  await logAudit({
    userId: actor.id,
    action: "status_changed",
    entity: "user",
    entityId: userId,
    summary: `${user.email} ${isActive ? "reactivated" : "deactivated"}`,
  });
  revalidatePath("/admin/staff");
}

/** Anyone signed in can change their own password. */
export async function changeOwnPassword(_prev: StaffState, form: FormData): Promise<StaffState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Sign in first." };

  const current = String(form.get("currentPassword") ?? "");
  const next = password.safeParse(String(form.get("newPassword") ?? ""));
  if (!next.success) return { error: next.error.issues[0]?.message ?? "Choose a stronger password." };

  const record = await db.user.findUnique({ where: { id: me.id } });
  if (!record || !(await bcrypt.compare(current, record.passwordHash))) {
    return { error: "Your current password is not right." };
  }

  await db.user.update({
    where: { id: me.id },
    data: { passwordHash: await bcrypt.hash(next.data, 12) },
  });
  await logAudit({ userId: me.id, action: "updated", entity: "user", entityId: me.id, summary: "password changed" });

  return { success: "Password changed." };
}
