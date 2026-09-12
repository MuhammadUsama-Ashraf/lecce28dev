"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { logAudit } from "@/lib/audit";

export type AuthState = { error?: string } | null;

const credentials = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  // Compare even when the account is missing, so a wrong email and a wrong
  // password take the same time and cannot be told apart.
  const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const ok = await bcrypt.compare(parsed.data.password, hash);

  if (!user || !ok || !user.isActive) {
    return { error: "Those details do not match an active account." };
  }

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
  await logAudit({ userId: user.id, action: "signed_in", entity: "user", entityId: user.id });

  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}
