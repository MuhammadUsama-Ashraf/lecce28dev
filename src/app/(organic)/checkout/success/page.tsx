import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import ClearCart from "@/components/cart/ClearCart";
import { SUPPORT_EMAIL } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  // The order is looked up by session, but its status still comes from the
  // webhook — this page never marks anything paid.
  const order = sessionId
    ? await db.order.findUnique({ where: { stripeSessionId: sessionId }, include: { items: true } })
    : null;

  return (
    <main className="flex-1 bg-white">
      <ClearCart />
      <section className="mx-auto max-w-2xl px-6 pt-[160px] pb-28 text-center lg:pt-[200px]">
        <p className="t-label tracking-[0.2em] text-[#7A7A7A] uppercase">Order received</p>
        <h1 className="t-h2 mt-4">Thank you</h1>

        {order ? (
          <>
            <p className="t-body mx-auto mt-5 max-w-md text-[#54595F]">
              Your order <strong className="font-mono">{order.number}</strong> is confirmed. A receipt
              is on its way to {order.email}.
            </p>

            <ul className="mx-auto mt-10 max-w-md space-y-3 border-y border-black/10 py-6 text-left">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-[14px]">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span className="tabular-nums">
                    {formatMoney(item.lineTotalCents, order.currency)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between border-t border-black/10 pt-3 text-[15px] font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(order.totalCents, order.currency)}</span>
              </li>
            </ul>
          </>
        ) : (
          <p className="t-body mx-auto mt-5 max-w-md text-[#54595F]">
            Your payment went through. If the details do not appear in your inbox shortly, write to{" "}
            <a className="underline underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        )}

        <Link
          href="/shop"
          className="mt-10 inline-block rounded-full border border-black px-9 py-3.5 text-[14px] tracking-[0.08em] uppercase transition-colors hover:bg-black hover:text-white"
        >
          Keep shopping
        </Link>
      </section>
    </main>
  );
}
