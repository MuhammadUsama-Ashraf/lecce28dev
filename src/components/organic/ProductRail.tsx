"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatPrice, type Product } from "@/content/products";
import { useCart } from "@/components/cart/CartProvider";

const TINTS = ["var(--oc-blush)", "var(--oc-cream)", "var(--oc-clay)", "var(--oc-stone)"];

/** Horizontal product rail with the design's round prev/next controls. */
export default function ProductRail({
  kicker,
  accent,
  caption,
  items,
  reverse = false,
  images,
}: {
  kicker: string;
  accent: string;
  caption?: string;
  items: Product[];
  reverse?: boolean;
  images: [string, string];
}) {
  const rail = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  const scrollBy = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  const media = (
    <div className="grid grid-cols-1 gap-2">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={images[0]}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={images[1]}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
    </div>
  );

  const rows = (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="t-stat">{kicker}</h3>
          <p className="t-editorial-sm">{accent}</p>
        </div>
        <div className="flex shrink-0 gap-2 pt-2">
          <RoundButton label="Previous" onClick={() => scrollBy(-1)}>
            ←
          </RoundButton>
          <RoundButton label="Next" onClick={() => scrollBy(1)}>
            →
          </RoundButton>
        </div>
      </div>

      <div
        ref={rail}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p, i) => (
          <div
            key={p.slug}
            className="w-[248px] shrink-0 snap-start rounded-2xl p-3"
            style={{ background: TINTS[i % TINTS.length] }}
          >
            <div className="flex items-center justify-between">
              <span className="t-body rounded-full bg-white px-3 py-1 text-[13px]">
                {p.scent}
              </span>
              <button
                onClick={() => add(p.slug)}
                aria-label={`Add ${p.name} to cart`}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6h12l-1 10.5a1.2 1.2 0 0 1-1.2 1.1H6.2A1.2 1.2 0 0 1 5 16.5L4 6Z" />
                  <path d="M7.4 6V4.6a2.6 2.6 0 0 1 5.2 0V6" />
                </svg>
              </button>
            </div>

            <Link href={`/product/${p.slug}`} className="mt-2 block">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="248px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Link>

            <div className="mt-3 flex items-start justify-between gap-3">
              <Link href={`/product/${p.slug}`} className="t-body max-w-[9rem] hover:opacity-70">
                {p.name}
              </Link>
              <span className="t-body shrink-0 tabular-nums">{formatPrice(p.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {caption ? <p className="t-body mt-6 max-w-xs text-black/60">{caption}</p> : null}
    </div>
  );

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      {reverse ? (
        <>
          <div className="order-2 lg:order-1">{rows}</div>
          <div className="order-1 lg:order-2">{media}</div>
        </>
      ) : (
        <>
          {media}
          {rows}
        </>
      )}
    </div>
  );
}

function RoundButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
    >
      {children}
    </button>
  );
}
