import { NextResponse } from "next/server";
import { z } from "zod";
import { quote } from "@/lib/pricing";
import type { CartQuote } from "@/lib/quoteTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  lines: z
    .array(z.object({ slug: z.string().max(120), qty: z.number().int().min(1).max(99) }))
    .max(50),
  promoCode: z.string().max(40).nullable().optional(),
});

/** Prices the bag. The browser sends slugs and quantities only — every amount
 *  comes back from the database, so a tampered cart cannot change a total. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad cart payload." }, { status: 400 });
  }

  const result = await quote(parsed.data.lines, parsed.data.promoCode ?? null);

  const payload: CartQuote = {
    lines: result.lines.map((line) => ({
      slug: line.slug,
      name: line.name,
      imageUrl: line.imageUrl,
      qty: line.qty,
      listCents: line.listCents,
      unitCents: line.unitCents,
      lineTotalCents: line.lineTotalCents,
      saleBadge: line.saleBadge,
    })),
    subtotalCents: result.subtotalCents,
    saleSavingsCents: result.saleSavingsCents,
    discountCents: result.discountCents,
    shippingCents: result.shippingCents,
    taxCents: result.taxCents,
    totalCents: result.totalCents,
    currency: result.currency,
    promo: result.promo
      ? result.promo.ok
        ? {
            ok: true,
            code: result.promo.code,
            label: result.promo.label,
            discountCents: result.promo.discountCents,
          }
        : { ok: false, reason: result.promo.reason }
      : null,
    freeShippingOverCents: result.freeShippingOverCents,
  };

  return NextResponse.json(payload);
}
