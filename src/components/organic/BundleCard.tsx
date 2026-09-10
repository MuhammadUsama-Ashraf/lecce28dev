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
        featured ? "bg-black text-white" : "bg-[var(--oc-cream)] text-black"
      }`}
    >
      <h3 className="t-h3">{product.name}</h3>
      <p
        className={`t-body mt-2 ${featured ? "text-white/60" : "text-[#7A7A7A]"}`}
      >
        {product.scent}
      </p>

      <p className="t-stat mt-7 tabular-nums">
        {formatPrice(product.price)}
      </p>
      <p className={`t-body mt-4 ${featured ? "text-white/70" : "text-[#7A7A7A]"}`}>
        {product.tagline}
      </p>

      <ul className="mt-8 space-y-3">
        {(product.includes ?? []).map((item) => (
          <li key={item} className="t-body flex gap-3">
            <span className={featured ? "text-white/50" : "text-black/45"}>—</span>
            <span className={featured ? "text-white/85" : ""}>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <button
          onClick={() => add(product.slug)}
          className={`t-nav w-full rounded-full py-3 transition-opacity hover:opacity-85 ${
            featured ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          Add to cart
        </button>
        <Link
          href={`/product/${product.slug}`}
          className={`t-body mt-4 block text-center underline underline-offset-4 ${
            featured ? "text-white/70 hover:text-white" : "text-[#7A7A7A] hover:text-black"
          }`}
        >
          View details
        </Link>
      </div>
    </div>
  );
}
