import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { OrderStatus } from "@/generated/prisma/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stripe is the only thing that may mark an order paid. The signature check
 *  is what makes that trustworthy, so an unsigned request is rejected. */
export async function POST(request: Request) {
  if (!stripeConfigured()) return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret missing." }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("stripe signature verification failed", error);
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await markPaid(event.data.object);
        break;
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        await markCancelled(event.data.object);
        break;
      case "charge.refunded":
        await markRefunded(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    // A 500 makes Stripe retry, which is what we want for a transient failure.
    console.error(`webhook handler failed for ${event.type}`, error);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function address(source: Stripe.Address | null | undefined) {
  if (!source) return undefined;
  return {
    line1: source.line1 ?? undefined,
    line2: source.line2 ?? undefined,
    city: source.city ?? undefined,
    state: source.state ?? undefined,
    postalCode: source.postal_code ?? undefined,
    country: source.country ?? undefined,
  };
}

async function findOrder(session: Stripe.Checkout.Session) {
  const id = session.metadata?.orderId ?? session.client_reference_id ?? undefined;
  if (id) {
    const byId = await db.order.findUnique({ where: { id } });
    if (byId) return byId;
  }
  return db.order.findUnique({ where: { stripeSessionId: session.id } });
}

async function markPaid(session: Stripe.Checkout.Session) {
  const order = await findOrder(session);
  if (!order) {
    console.error("paid session with no matching order", session.id);
    return;
  }
  // Stripe retries; doing the stock and redemption maths twice would be wrong.
  if (order.status === OrderStatus.PAID || order.status === OrderStatus.FULFILLED) return;

  const details = session.customer_details;
  const shipping = (session as Stripe.Checkout.Session & {
    shipping_details?: { address?: Stripe.Address; name?: string };
  }).shipping_details;

  await db.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.PAID,
      paidAt: new Date(),
      email: details?.email ?? order.email,
      customerName: shipping?.name ?? details?.name ?? order.customerName,
      phone: details?.phone ?? order.phone,
      shippingAddress: address(shipping?.address) ?? address(details?.address),
      billingAddress: address(details?.address),
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
    },
  });

  const items = await db.orderItem.findMany({ where: { orderId: order.id } });
  for (const item of items) {
    if (!item.productId) continue;
    await db.product.updateMany({
      where: { id: item.productId, trackStock: true },
      data: { stock: { decrement: item.qty } },
    });
  }

  if (order.promoCodeId) {
    await db.promoCode.update({
      where: { id: order.promoCodeId },
      data: { timesRedeemed: { increment: 1 } },
    });
  }

  await logAudit({
    action: "status_changed",
    entity: "order",
    entityId: order.id,
    summary: `${order.number}: paid via Stripe`,
  });
}

async function markCancelled(session: Stripe.Checkout.Session) {
  const order = await findOrder(session);
  if (!order || order.status !== OrderStatus.PENDING) return;
  await db.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED, cancelledAt: new Date() },
  });
  await logAudit({
    action: "status_changed",
    entity: "order",
    entityId: order.id,
    summary: `${order.number}: checkout expired`,
  });
}

async function markRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  const order = await db.order.findFirst({ where: { stripePaymentIntentId: paymentIntentId } });
  if (!order || order.status === OrderStatus.REFUNDED) return;

  await db.order.update({ where: { id: order.id }, data: { status: OrderStatus.REFUNDED } });
  await logAudit({
    action: "refunded",
    entity: "order",
    entityId: order.id,
    summary: `${order.number}: refunded in Stripe`,
  });
}
