import "server-only";

import { db } from "@/lib/db";
import { DiscountType } from "@/generated/prisma/enums";

/** Every total the customer is shown is recomputed here from the database
 *  before it reaches Stripe. Nothing the browser sends about price is trusted. */

export type CartInput = { slug: string; qty: number }[];

export type PricedLine = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  qty: number;
  /** Catalogue price before any markdown. */
  listCents: number;
  /** What this unit actually costs after an active sale. */
  unitCents: number;
  lineTotalCents: number;
  saleName: string | null;
  saleBadge: string | null;
};

export type PromoResult =
  | { ok: true; code: string; label: string; discountCents: number; promoCodeId: string }
  | { ok: false; reason: string };

export type Quote = {
  lines: PricedLine[];
  subtotalCents: number;
  saleSavingsCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  promo: PromoResult | null;
  freeShippingOverCents: number;
};

export async function getStoreSettings() {
  const existing = await db.storeSetting.findUnique({ where: { id: "store" } });
  if (existing) return existing;
  return db.storeSetting.create({ data: { id: "store" } });
}

function applyDiscount(cents: number, type: DiscountType, value: number) {
  const off = type === DiscountType.PERCENT ? Math.round((cents * value) / 100) : value;
  return Math.max(0, Math.min(cents, off));
}

function withinWindow(startsAt: Date | null, endsAt: Date | null, now: Date) {
  if (startsAt && startsAt > now) return false;
  if (endsAt && endsAt < now) return false;
  return true;
}

/** productId → the best active markdown, if any. */
export async function activeSaleMap(now = new Date()) {
  const sales = await db.sale.findMany({
    where: { isActive: true },
    include: { products: { select: { productId: true } } },
    orderBy: { createdAt: "asc" },
  });

  const live = sales.filter((s) => withinWindow(s.startsAt, s.endsAt, now));
  const storewide = live.filter((s) => s.appliesToAll);
  const targeted = new Map<string, typeof live>();

  for (const sale of live) {
    if (sale.appliesToAll) continue;
    for (const { productId } of sale.products) {
      const list = targeted.get(productId) ?? [];
      list.push(sale);
      targeted.set(productId, list);
    }
  }

  return function saleFor(productId: string, priceCents: number) {
    const candidates = [...storewide, ...(targeted.get(productId) ?? [])];
    let best: { unitCents: number; name: string; badge: string | null } | null = null;
    for (const sale of candidates) {
      const unitCents = priceCents - applyDiscount(priceCents, sale.discountType, sale.value);
      if (!best || unitCents < best.unitCents) {
        best = { unitCents, name: sale.name, badge: sale.badge };
      }
    }
    return best;
  };
}

async function priceLines(cart: CartInput): Promise<PricedLine[]> {
  const slugs = [...new Set(cart.map((l) => l.slug))];
  if (slugs.length === 0) return [];

  const products = await db.product.findMany({
    where: { slug: { in: slugs }, status: "ACTIVE" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });
  const saleFor = await activeSaleMap();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const lines: PricedLine[] = [];
  for (const line of cart) {
    const product = bySlug.get(line.slug);
    if (!product) continue; // silently drop unknown or unpublished items
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
    const sale = saleFor(product.id, product.priceCents);
    const unitCents = sale ? sale.unitCents : product.priceCents;
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.images[0]?.url ?? product.heroImage ?? null,
      qty,
      listCents: product.priceCents,
      unitCents,
      lineTotalCents: unitCents * qty,
      saleName: sale?.name ?? null,
      saleBadge: sale?.badge ?? null,
    });
  }
  return lines;
}

async function resolvePromo(
  rawCode: string,
  lines: PricedLine[],
  subtotalCents: number,
): Promise<PromoResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, reason: "Enter a code." };

  const promo = await db.promoCode.findUnique({
    where: { code },
    include: { products: { select: { productId: true } } },
  });
  if (!promo || !promo.isActive) return { ok: false, reason: "That code is not valid." };

  const now = new Date();
  if (promo.startsAt && promo.startsAt > now) return { ok: false, reason: "That code is not active yet." };
  if (promo.endsAt && promo.endsAt < now) return { ok: false, reason: "That code has expired." };
  if (promo.maxRedemptions !== null && promo.timesRedeemed >= promo.maxRedemptions) {
    return { ok: false, reason: "That code has been fully redeemed." };
  }
  if (promo.minSubtotalCents !== null && subtotalCents < promo.minSubtotalCents) {
    return {
      ok: false,
      reason: `Spend ${(promo.minSubtotalCents / 100).toFixed(0)} or more to use this code.`,
    };
  }

  const eligibleIds = new Set(promo.products.map((p) => p.productId));
  const base = promo.appliesToAll
    ? subtotalCents
    : lines
        .filter((l) => eligibleIds.has(l.productId))
        .reduce((sum, l) => sum + l.lineTotalCents, 0);

  if (base <= 0) return { ok: false, reason: "That code does not apply to anything in your bag." };

  const discountCents = applyDiscount(base, promo.discountType, promo.value);
  if (discountCents <= 0) return { ok: false, reason: "That code has no effect on this order." };

  const label =
    promo.discountType === DiscountType.PERCENT
      ? `${promo.value}% off`
      : `${(promo.value / 100).toFixed(2)} off`;

  return { ok: true, code, label, discountCents, promoCodeId: promo.id };
}

/** The single source of truth for what an order costs. */
export async function quote(cart: CartInput, promoCode?: string | null): Promise<Quote> {
  const settings = await getStoreSettings();
  const lines = await priceLines(cart);

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const saleSavingsCents = lines.reduce(
    (sum, l) => sum + (l.listCents - l.unitCents) * l.qty,
    0,
  );

  const promo = promoCode ? await resolvePromo(promoCode, lines, subtotalCents) : null;
  const discountCents = promo?.ok ? promo.discountCents : 0;

  const afterDiscount = Math.max(0, subtotalCents - discountCents);
  const shippingCents =
    lines.length === 0 || afterDiscount >= settings.freeShippingOverCents
      ? 0
      : settings.flatShippingCents;
  const taxCents = Math.round((afterDiscount * settings.taxPercent) / 100);

  return {
    lines,
    subtotalCents,
    saleSavingsCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents: afterDiscount + shippingCents + taxCents,
    currency: settings.currency,
    promo,
    freeShippingOverCents: settings.freeShippingOverCents,
  };
}
