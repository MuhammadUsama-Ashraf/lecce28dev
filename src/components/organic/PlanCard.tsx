"use client";

import Link from "next/link";
import { formatPrice, type Product } from "@/content/products";
import { useCart } from "@/components/cart/CartProvider";

const TINTS = ["var(--oc-grey)", "var(--oc-cream)", "var(--oc-blush)"];

/** Staggered bundle card with the design's round arrow action. */
export default function PlanCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { add } = useCart();

  return (
    <div
      className="flex h-full flex-col rounded-2xl p-7"
      style={{ background: TINTS[index % TINTS.length] }}
    >
      <p className="t-body text-black/70">{product.name}</p>
      <p className="t-stat mt-3 tabular-nums">{formatPrice(product.price)}</p>
      <p className="t-body mt-4 text-black/70">{product.tagline}</p>

      <ul className="mt-7 space-y-1.5">
        {(product.includes ?? []).map((item) => (
          <li key={item} className="t-body text-black/80">
            – {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-4 pt-8">
        <Link
          href={`/product/${product.slug}`}
          className="t-body underline underline-offset-4 hover:opacity-70"
        >
          Details
        </Link>
        <button
          onClick={() => add(product.slug)}
          aria-label={`Add ${product.name} to cart`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
        >
          ↗
        </button>
      </div>
    </div>
  );
}
