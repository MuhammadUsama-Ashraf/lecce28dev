"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatPrice, type Product } from "@/content/products";
import { useCart } from "@/components/cart/CartProvider";

export default function OrganicProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
  };

  const reset = () => {
    const el = frame.current;
    if (el) el.style.transform = "";
  };

  return (
    <article className="group flex flex-col">
      <div style={{ perspective: "1200px" }}>
        <div
          ref={frame}
          onPointerMove={onMove}
          onPointerLeave={reset}
          className="tilt relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--oc-stone)]"
        >
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            />
          </Link>

        </div>
      </div>

      {/* Metrics follow the live cards: 15px title, 12px price, 15px button */}
      <Link
        href={`/product/${product.slug}`}
        className="mt-4 block py-[7.5px] text-[15px] leading-snug font-bold tracking-[0.02em] text-black uppercase hover:opacity-70"
      >
        {product.name}
      </Link>
      <span className="block text-[13px] tracking-[0.06em] text-[#7A7A7A] uppercase">
        {product.scent}
      </span>
      <span className="mt-2 block text-[12px] tabular-nums text-black">
        {formatPrice(product.price)}
      </span>

      <button
        onClick={() => add(product.slug)}
        className="mt-4 self-start rounded-full border border-black/70 bg-white px-[20px] py-[15px] text-[15px] tracking-[0.04em] text-black uppercase transition-colors hover:bg-black hover:text-white"
      >
        Add to cart
      </button>
    </article>
  );
}
