"use client";

import Link from "next/link";
import { formatPrice, type Product } from "@/content/products";
import { useCart } from "@/components/cart/CartProvider";

/** Bundle presented in the reference's three-up plan-card layout. */
export default function BundleCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { add } = useCart();

  return (
    <div
      className={`flex h-full flex-col rounded-3xl p-8 lg:p-10 ${
        featured ? "bg-[#17120e] text-white" : "bg-sand-100 text-ink"
      }`}
    >
      <h3 className="text-[19px]">{product.name}</h3>
      <p
        className={`mt-1 text-[14px] ${featured ? "text-white/60" : "text-ink-soft"}`}
      >
        {product.scent}
      </p>

      <p className="mt-7 text-[clamp(2rem,3.4vw,2.75rem)] leading-none font-light tabular-nums">
        {formatPrice(product.price)}
      </p>
      <p
        className={`mt-4 text-[15px] leading-[1.6] ${
          featured ? "text-white/70" : "text-ink-soft"
        }`}
      >
        {product.tagline}
      </p>

      <ul className="mt-8 space-y-3">
        {(product.includes ?? []).map((item) => (
          <li key={item} className="flex gap-3 text-[15px]">
            <span className={featured ? "text-white/50" : "text-ink-soft"}>—</span>
            <span className={featured ? "text-white/85" : ""}>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <button
          onClick={() => add(product.slug)}
          className={`w-full rounded-full py-3.5 text-[15px] transition-opacity hover:opacity-85 ${
            featured ? "bg-white text-ink" : "bg-ink text-sand-50"
          }`}
        >
          Add to cart
        </button>
        <Link
          href={`/product/${product.slug}`}
          className={`mt-4 block text-center text-[14px] underline underline-offset-4 ${
            featured ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          View details
        </Link>
      </div>
    </div>
  );
}
