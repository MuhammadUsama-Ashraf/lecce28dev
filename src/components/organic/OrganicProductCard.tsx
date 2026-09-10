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
          className="tilt relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand-100"
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
          <button
            onClick={() => add(product.slug)}
            className="absolute right-4 bottom-4 translate-y-2 rounded-full bg-ink px-5 py-2.5 text-[13px] text-sand-50 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <Link href={`/product/${product.slug}`} className="text-[17px] hover:opacity-70">
          {product.name}
        </Link>
        <span className="shrink-0 text-[17px] tabular-nums">
          {formatPrice(product.price)}
        </span>
      </div>
      <span className="mt-1 text-[14px] text-ink-soft">{product.scent}</span>
    </article>
  );
}
