"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { SUPPORT_EMAIL } from "@/content/site";
import { formatMoney } from "@/lib/money";

export default function CartDrawer() {
  const {
    isOpen,
    close,
    lines,
    quote,
    pricing,
    promoCode,
    promoError,
    applyPromo,
    clearPromo,
    setQty,
    remove,
  } = useCart();

  const [codeInput, setCodeInput] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const remaining = Math.max(0, quote.freeShippingOverCents - quote.subtotalCents);
  const applied = quote.promo?.ok ? quote.promo : null;

  async function checkout() {
    setCheckoutError(null);
    setCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines, promoCode }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setCheckoutError(data.error ?? "Checkout could not be started.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Checkout could not be reached. Try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}>
      <button
        aria-label="Close cart"
        onClick={close}
        className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-sand-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="hairline flex items-center justify-between border-b px-6 py-5">
          <span className="eyebrow">Your Cart</span>
          <button onClick={close} className="text-sm text-ink-soft hover:text-ink">
            Close
          </button>
        </header>

        {quote.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="font-display text-2xl">Your cart is empty</p>
            <p className="text-sm text-ink-soft">Let&apos;s start shopping!</p>
            <Link
              href="/shop"
              onClick={close}
              className="mt-4 border border-ink px-7 py-3 text-xs tracking-[0.24em] uppercase transition-colors hover:bg-ink hover:text-sand-50"
            >
              Shop all
            </Link>
          </div>
        ) : (
          <>
            <ul className="hairline flex-1 divide-y overflow-y-auto px-6">
              {quote.lines.map((line) => (
                <li key={line.slug} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand-100">
                    {line.imageUrl ? (
                      <Image src={line.imageUrl} alt={line.name} fill sizes="80px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={close}
                      className="text-sm font-medium hover:underline"
                    >
                      {line.name}
                    </Link>
                    {line.saleBadge ? (
                      <span className="mt-0.5 w-fit bg-ink px-1.5 py-0.5 text-[10px] tracking-widest text-sand-50 uppercase">
                        {line.saleBadge}
                      </span>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="hairline flex items-center border">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(line.slug, line.qty - 1)}
                          className="px-3 py-1 text-sm hover:bg-sand-100"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm tabular-nums">{line.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(line.slug, line.qty + 1)}
                          className="px-3 py-1 text-sm hover:bg-sand-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm tabular-nums">
                        {line.unitCents < line.listCents ? (
                          <span className="mr-2 text-ink-soft line-through">
                            {formatMoney(line.listCents * line.qty, quote.currency)}
                          </span>
                        ) : null}
                        {formatMoney(line.lineTotalCents, quote.currency)}
                      </span>
                    </div>
                    <button
                      onClick={() => remove(line.slug)}
                      className="mt-2 self-start text-[11px] tracking-widest text-ink-soft uppercase hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="hairline border-t px-6 py-6">
              {applied ? (
                <div className="mb-3 flex items-center justify-between rounded-sm bg-sand-100 px-3 py-2 text-xs">
                  <span>
                    <strong className="font-mono">{applied.code}</strong> — {applied.label}
                  </span>
                  <button onClick={clearPromo} className="text-ink-soft underline hover:text-ink">
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  className="mb-3 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyPromo(codeInput);
                    setCodeInput("");
                  }}
                >
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Promo code"
                    aria-label="Promo code"
                    className="hairline min-w-0 flex-1 border bg-white px-3 py-2 text-xs tracking-widest uppercase outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="hairline border px-4 py-2 text-[11px] tracking-widest uppercase hover:bg-ink hover:text-sand-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError ? <p className="mb-3 text-xs text-red-700">{promoError}</p> : null}

              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(quote.subtotalCents, quote.currency)}</dd>
                </div>
                {quote.discountCents > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Discount</dt>
                    <dd className="tabular-nums">
                      −{formatMoney(quote.discountCents, quote.currency)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd className="tabular-nums">
                    {quote.shippingCents === 0
                      ? "Free"
                      : formatMoney(quote.shippingCents, quote.currency)}
                  </dd>
                </div>
                {quote.taxCents > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Tax</dt>
                    <dd className="tabular-nums">{formatMoney(quote.taxCents, quote.currency)}</dd>
                  </div>
                ) : null}
                <div className="hairline flex justify-between border-t pt-2 text-base">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMoney(quote.totalCents, quote.currency)}</dd>
                </div>
              </dl>

              <p className="mt-2 text-xs text-ink-soft">
                {remaining > 0
                  ? `Add ${formatMoney(remaining, quote.currency)} for free shipping.`
                  : "You have earned free shipping."}
              </p>

              {checkoutError ? <p className="mt-3 text-xs text-red-700">{checkoutError}</p> : null}

              <button
                onClick={checkout}
                disabled={checkingOut || pricing}
                className="mt-5 w-full bg-ink py-4 text-xs tracking-[0.26em] text-sand-50 uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {checkingOut ? "Redirecting…" : pricing ? "Pricing…" : "Checkout"}
              </button>
              <p className="mt-3 text-center text-[11px] text-ink-soft">
                Questions?{" "}
                <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
