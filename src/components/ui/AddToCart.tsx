"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-8 flex flex-wrap items-stretch gap-4">
      <div className="flex items-center border border-ink">
        <button
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-4 text-sm hover:bg-sand-100"
        >
          −
        </button>
        <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => setQty((q) => q + 1)}
          className="px-4 py-4 text-sm hover:bg-sand-100"
        >
          +
        </button>
      </div>
      <button
        onClick={() => add(slug, qty)}
        className="flex-1 bg-ink px-10 py-4 text-[11px] uppercase tracking-[0.26em] text-sand-50 transition-opacity hover:opacity-85"
      >
        Add to cart
      </button>
    </div>
  );
}
