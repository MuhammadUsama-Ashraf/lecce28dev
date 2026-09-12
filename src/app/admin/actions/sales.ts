"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { parseMoneyToCents } from "@/lib/money";
import { DiscountType } from "@/generated/prisma/enums";

export type SaleFormState = { error?: string; success?: string } | null;

const schema = z.object({
  name: z.string().min(2, "Give the sale a name.").max(120),
  badge: z.string().max(40).nullable(),
  discountType: z.enum(DiscountType),
  value: z.number().int().min(1, "The discount must be greater than zero."),
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  isActive: z.boolean(),
  appliesToAll: z.boolean(),
  productIds: z.array(z.string()),
});

function text(form: FormData, key: string) {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function date(form: FormData, key: string) {
  const raw = text(form, key);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function saveSale(_prev: SaleFormState, form: FormData): Promise<SaleFormState> {
  const user = await assertRole("ADMIN");
  const id = text(form, "id");

  const discountType = (text(form, "discountType") ?? DiscountType.PERCENT) as DiscountType;
  const rawValue = text(form, "value");
  const value =
    discountType === DiscountType.PERCENT
      ? Number(rawValue ?? 0)
      : (parseMoneyToCents(rawValue) ?? 0);

  const parsed = schema.safeParse({
    name: text(form, "name") ?? "",
    badge: text(form, "badge"),
    discountType,
    value: Math.round(value),
    startsAt: date(form, "startsAt"),
    endsAt: date(form, "endsAt"),
    isActive: form.get("isActive") === "on",
    appliesToAll: form.get("appliesToAll") === "on",
    productIds: form.getAll("productIds").map(String).filter(Boolean),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const data = parsed.data;
  if (data.discountType === DiscountType.PERCENT && data.value > 100) {
    return { error: "A percentage discount cannot exceed 100." };
  }
  if (data.startsAt && data.endsAt && data.startsAt >= data.endsAt) {
    return { error: "The end date must come after the start date." };
  }
  if (!data.appliesToAll && data.productIds.length === 0) {
    return { error: "Pick at least one product, or apply the sale to everything." };
  }

  const { productIds, ...fields } = data;
  const links = data.appliesToAll ? [] : productIds.map((productId) => ({ productId }));

  if (id) {
    await db.sale.update({
      where: { id },
      data: { ...fields, products: { deleteMany: {}, create: links } },
    });
    await logAudit({ userId: user.id, action: "updated", entity: "sale", entityId: id, summary: fields.name });
    revalidatePath("/admin/sales");
    revalidatePath("/shop");
    return { success: "Sale saved." };
  }

  const created = await db.sale.create({ data: { ...fields, products: { create: links } } });
  await logAudit({
    userId: user.id,
    action: "created",
    entity: "sale",
    entityId: created.id,
    summary: created.name,
  });
  revalidatePath("/admin/sales");
  revalidatePath("/shop");
  redirect(`/admin/sales/${created.id}?created=1`);
}

export async function toggleSale(id: string, isActive: boolean) {
  const user = await assertRole("ADMIN");
  const sale = await db.sale.update({ where: { id }, data: { isActive } });
  await logAudit({
    userId: user.id,
    action: "status_changed",
    entity: "sale",
    entityId: id,
    summary: `${sale.name} ${isActive ? "enabled" : "disabled"}`,
  });
  revalidatePath("/admin/sales");
  revalidatePath("/shop");
}

export async function deleteSale(id: string) {
  const user = await assertRole("ADMIN");
  const sale = await db.sale.findUnique({ where: { id } });
  if (!sale) return;
  // Sales are not referenced by orders — the discount is baked into the line
  // price at checkout — so removing one is safe.
  await db.sale.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "deleted", entity: "sale", entityId: id, summary: sale.name });
  revalidatePath("/admin/sales");
  revalidatePath("/shop");
  redirect("/admin/sales");
}
