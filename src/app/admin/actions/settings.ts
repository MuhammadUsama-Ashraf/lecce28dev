"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { parseMoneyToCents } from "@/lib/money";

export type SettingsState = { error?: string; success?: string } | null;

const schema = z.object({
  freeShippingOverCents: z.number().int().min(0),
  flatShippingCents: z.number().int().min(0),
  taxPercent: z.number().min(0).max(30),
  orderPrefix: z.string().min(1).max(8).regex(/^[A-Z0-9-]+$/, "Use capitals, digits and hyphens."),
});

export async function saveSettings(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  const user = await assertRole("ADMIN");

  const parsed = schema.safeParse({
    freeShippingOverCents: parseMoneyToCents(String(form.get("freeShippingOver") ?? "")) ?? 0,
    flatShippingCents: parseMoneyToCents(String(form.get("flatShipping") ?? "")) ?? 0,
    taxPercent: Number(form.get("taxPercent") ?? 0),
    orderPrefix: String(form.get("orderPrefix") ?? "L28").toUpperCase(),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await db.storeSetting.upsert({
    where: { id: "store" },
    update: parsed.data,
    create: { id: "store", ...parsed.data },
  });
  await logAudit({ userId: user.id, action: "updated", entity: "settings", entityId: "store" });

  revalidatePath("/admin/settings");
  revalidatePath("/shop");
  return { success: "Settings saved." };
}
