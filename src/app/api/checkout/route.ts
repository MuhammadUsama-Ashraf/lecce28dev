import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { quote } from "@/lib/pricing";
import { nextOrderNumber } from "@/lib/orders";
import { siteUrl, stripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  lines: z
    .array(z.object({ slug: z.string().max(120), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
  promoCode: z.string().max(40).nullable().optional(),
  email: z.string().email().optional(),
});

/** Opens a Stripe Checkout session and records the order as pending. The order
 *  only becomes PAID when Stripe's webhook confirms it — never here, because a
 *  browser reaching the success page proves nothing. */
export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Add STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad cart payload." }, { status: 400 });

  const priced = await quote(parsed.data.lines, parsed.data.promoCode ?? null);
  if (priced.lines.length === 0) {
    return NextResponse.json({ error: "Nothing in the bag is available." }, { status: 400 });
  }

  // Refuse rather than oversell.
  const shortages: string[] = [];
  for (const line of priced.lines) {
    const product = await db.product.findUnique({
      where: { id: line.productId },
      select: { stock: true, trackStock: true, name: true },
    });
    if (product?.trackStock && product.stock < line.qty) {
      shortages.push(`${product.name} (${product.stock} left)`);
    }
  }
  if (shortages.length > 0) {
    return NextResponse.json(
      { error: `Not enough stock for ${shortages.join(", ")}.` },
      { status: 409 },
    );
  }

  const promoId = priced.promo?.ok ? priced.promo.promoCodeId : null;
  const order = await db.order.create({
    data: {
      number: await nextOrderNumber(),
      email: parsed.data.email ?? "pending@checkout",
      subtotalCents: priced.subtotalCents,
      discountCents: priced.discountCents,
      shippingCents: priced.shippingCents,
      taxCents: priced.taxCents,
      totalCents: priced.totalCents,
      currency: priced.currency,
      promoCodeId: promoId,
      promoCodeText: priced.promo?.ok ? priced.promo.code : null,
      items: {
        create: priced.lines.map((line) => ({
          productId: line.productId,
          slug: line.slug,
          name: line.name,
          imageUrl: line.imageUrl,
          unitPriceCents: line.unitCents,
          qty: line.qty,
          lineTotalCents: line.lineTotalCents,
        })),
      },
    },
  });

  const origin = siteUrl();
  const absolute = (url: string | null) =>
    url && url.startsWith("http") ? url : url ? `${origin}${url}` : undefined;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.lines.map((line) => ({
    quantity: line.qty,
    price_data: {
      currency: priced.currency,
      unit_amount: line.unitCents,
      product_data: {
        name: line.name,
        images: absolute(line.imageUrl) ? [absolute(line.imageUrl) as string] : undefined,
      },
    },
  }));

  if (priced.taxCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: priced.currency,
        unit_amount: priced.taxCents,
        product_data: { name: "Tax" },
      },
    });
  }

  // Stripe has no negative line item, so a discount rides as a one-off coupon.
  const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
  if (priced.discountCents > 0 && priced.promo?.ok) {
    const coupon = await stripe().coupons.create({
      amount_off: priced.discountCents,
      currency: priced.currency,
      duration: "once",
      name: `${priced.promo.code} (${priced.promo.label})`,
    });
    discounts.push({ coupon: coupon.id });
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    discounts: discounts.length > 0 ? discounts : undefined,
    customer_email: parsed.data.email,
    client_reference_id: order.id,
    metadata: { orderId: order.id, orderNumber: order.number },
    phone_number_collection: { enabled: true },
    billing_address_collection: "auto",
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "IE", "AU", "DE", "FR", "IT"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: priced.shippingCents === 0 ? "Free shipping" : "Standard shipping",
          fixed_amount: { amount: priced.shippingCents, currency: priced.currency },
        },
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop?checkout=cancelled`,
  });

  await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

  return NextResponse.json({ url: session.url });
}
