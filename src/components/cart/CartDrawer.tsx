"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatPrice, products } from "@/content/products";
import { SUPPORT_EMAIL } from "@/content/site";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartDrawer() {
  const { isOpen, close, lines, subtotal, setQty, remove } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
    >
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
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-sand-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b hairline px-6 py-5">
          <span className="eyebrow">Your Cart</span>
          <button onClick={close} className="text-sm text-ink-soft hover:text-ink">
            Close
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="font-display text-2xl">Your cart is empty</p>
            <p className="text-sm text-ink-soft">Let&apos;s start shopping!</p>
            <Link
              href="/shop"
              onClick={close}
              className="mt-4 border border-ink px-7 py-3 text-xs tracking-[0.24em] uppercase hover:bg-ink hover:text-sand-50 transition-colors"
            >
              Shop all
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y hairline overflow-y-auto px-6">
              {lines.map((line) => {
                const p = products.find((x) => x.slug === line.slug);
                if (!p) return null;
                return (
                  <li key={line.slug} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand-100">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={close}
                        className="text-sm font-medium hover:underline"
                      >
                        {p.name}
                      </Link>
                      <span className="text-xs text-ink-soft">{p.scent}</span>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border hairline">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(p.slug, line.qty - 1)}
                            className="px-3 py-1 text-sm hover:bg-sand-100"
                          >
                            −
                          </button>
                          <span className="px-3 text-sm tabular-nums">{line.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(p.slug, line.qty + 1)}
                            className="px-3 py-1 text-sm hover:bg-sand-100"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm tabular-nums">
                          {formatPrice(p.price * line.qty)}
                        </span>
                      </div>
                      <button
                        onClick={() => remove(p.slug)}
                        className="mt-2 self-start text-[11px] uppercase tracking-widest text-ink-soft hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t hairline px-6 py-6">
              <div className="flex items-center justify-between text-sm">
                <span className="eyebrow">Subtotal</span>
                <span className="tabular-nums text-base">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                {remaining > 0
                  ? `Add ${formatPrice(remaining)} for free shipping.`
                  : "You have earned free shipping."}
              </p>
              <button className="mt-5 w-full bg-ink py-4 text-xs uppercase tracking-[0.26em] text-sand-50 transition-opacity hover:opacity-85">
                Checkout
              </button>
              <p className="mt-3 text-center text-[11px] text-ink-soft">
                Questions? <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
