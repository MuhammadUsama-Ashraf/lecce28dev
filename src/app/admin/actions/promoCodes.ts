"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { parseMoneyToCents } from "@/lib/money";
import { DiscountType } from "@/generated/prisma/enums";

export type PromoFormState = { error?: string; success?: string } | null;

const base = z.object({
  code: z
    .string()
    .min(3, "Codes need at least three characters.")
    .max(40)
    .regex(/^[A-Z0-9][A-Z0-9_-]*$/, "Use letters, numbers, hyphens and underscores only."),
  description: z.string().max(240).nullable(),
  discountType: z.enum(DiscountType),
  value: z.number().int().min(1, "The discount must be greater than zero."),
  minSubtotalCents: z.number().int().min(0).nullable(),
  maxRedemptions: z.number().int().min(1).nullable(),
  perCustomerLimit: z.number().int().min(1).nullable(),
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

function intOrNull(form: FormData, key: string) {
  const raw = text(form, key);
  if (raw === null) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.round(value) : null;
}

function parseForm(form: FormData) {
  const discountType = (text(form, "discountType") ?? DiscountType.PERCENT) as DiscountType;
  // Percent codes carry a plain number; fixed codes carry money.
  const rawValue = text(form, "value");
  const value =
    discountType === DiscountType.PERCENT
      ? Number(rawValue ?? 0)
      : (parseMoneyToCents(rawValue) ?? 0);

  const parsed = base.safeParse({
    code: (text(form, "code") ?? "").toUpperCase(),
    description: text(form, "description"),
    discountType,
    value: Math.round(value),
    minSubtotalCents: parseMoneyToCents(text(form, "minSubtotal")),
    maxRedemptions: intOrNull(form, "maxRedemptions"),
    perCustomerLimit: intOrNull(form, "perCustomerLimit"),
    startsAt: date(form, "startsAt"),
    endsAt: date(form, "endsAt"),
    isActive: form.get("isActive") === "on",
    appliesToAll: form.get("appliesToAll") === "on",
    productIds: form.getAll("productIds").map(String).filter(Boolean),
  });

  if (parsed.success) {
    if (parsed.data.discountType === DiscountType.PERCENT && parsed.data.value > 100) {
      return { success: false as const, message: "A percentage discount cannot exceed 100." };
    }
    if (
      parsed.data.startsAt &&
      parsed.data.endsAt &&
      parsed.data.startsAt >= parsed.data.endsAt
    ) {
      return { success: false as const, message: "The end date must come after the start date." };
    }
    if (!parsed.data.appliesToAll && parsed.data.productIds.length === 0) {
      return { success: false as const, message: "Pick at least one product, or apply to everything." };
    }
    return { success: true as const, data: parsed.data };
  }
  return { success: false as const, message: parsed.error.issues[0]?.message ?? "Check the form." };
}

export async function savePromoCode(
  _prev: PromoFormState,
  form: FormData,
): Promise<PromoFormState> {
  const user = await assertRole("ADMIN");
  const id = text(form, "id");
  const parsed = parseForm(form);
  if (!parsed.success) return { error: parsed.message };

  const { productIds, ...data } = parsed.data;
  const clash = await db.promoCode.findUnique({ where: { code: data.code } });
  if (clash && clash.id !== id) return { error: `The code ${data.code} already exists.` };

  if (id) {
    await db.promoCode.update({
      where: { id },
      data: {
        ...data,
        products: {
          deleteMany: {},
          create: data.appliesToAll ? [] : productIds.map((productId) => ({ productId })),
        },
      },
    });
    await logAudit({ userId: user.id, action: "updated", entity: "promo_code", entityId: id, summary: data.code });
    revalidatePath("/admin/promo-codes");
    return { success: "Promo code saved." };
  }

  const created = await db.promoCode.create({
    data: {
      ...data,
      products: { create: data.appliesToAll ? [] : productIds.map((productId) => ({ productId })) },
    },
  });
  await logAudit({
    userId: user.id,
    action: "created",
    entity: "promo_code",
    entityId: created.id,
    summary: created.code,
  });
  revalidatePath("/admin/promo-codes");
  redirect(`/admin/promo-codes/${created.id}?created=1`);
}

export async function togglePromoCode(id: string, isActive: boolean) {
  const user = await assertRole("ADMIN");
  const promo = await db.promoCode.update({ where: { id }, data: { isActive } });
  await logAudit({
    userId: user.id,
    action: "status_changed",
    entity: "promo_code",
    entityId: id,
    summary: `${promo.code} ${isActive ? "enabled" : "disabled"}`,
  });
  revalidatePath("/admin/promo-codes");
}

export async function deletePromoCode(id: string) {
  const user = await assertRole("ADMIN");
  const promo = await db.promoCode.findUnique({
    where: { id },
    include: { _count: { select: { orders: true } } },
  });
  if (!promo) return;

  if (promo._count.orders > 0) {
    // Orders reference the code; disabling keeps the link readable.
    await db.promoCode.update({ where: { id }, data: { isActive: false } });
    await logAudit({
      userId: user.id,
      action: "status_changed",
      entity: "promo_code",
      entityId: id,
      summary: `${promo.code} disabled (used on ${promo._count.orders} orders)`,
    });
  } else {
    await db.promoCode.delete({ where: { id } });
    await logAudit({ userId: user.id, action: "deleted", entity: "promo_code", entityId: id, summary: promo.code });
  }

  revalidatePath("/admin/promo-codes");
  redirect("/admin/promo-codes");
}
