"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatPrice, type Product } from "@/content/products";
import { useCart } from "@/components/cart/CartProvider";

/** Product tile as laid out on lecce28.com: image, bold uppercase name,
 *  scent in mono, orange stars, price, pill "ADD TO CART". */
export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = imageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`;
  };

  const reset = () => {
    const el = imageRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <article className="group flex flex-col">
      <div style={{ perspective: "1100px" }}>
        <div
          ref={imageRef}
          onPointerMove={onMove}
          onPointerLeave={reset}
          className="tilt relative aspect-square overflow-hidden"
        >
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </Link>
        </div>
      </div>

      <Link
        href={`/product/${product.slug}`}
        className="mt-5 text-sm font-bold tracking-[0.04em] uppercase hover:text-amber-deep"
      >
        {product.name}
      </Link>

      <span className="mt-1 font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
        {product.scent}
      </span>

      {product.rating ? (
        <span
          className="mt-2 text-sm text-[#e8552c]"
          aria-label={`Rated ${product.rating} out of 5`}
        >
          ★★★★★
        </span>
      ) : (
        <span className="mt-2 h-5" aria-hidden />
      )}

      <span className="mt-1 text-sm tabular-nums">{formatPrice(product.price)}</span>

      <button
        onClick={() => add(product.slug)}
        className="mt-4 self-start rounded-full border border-ink/60 px-7 py-3 text-[12px] tracking-[0.06em] uppercase transition-colors hover:bg-ink hover:text-sand-50"
      >
        Add to cart
      </button>
    </article>
  );
}
