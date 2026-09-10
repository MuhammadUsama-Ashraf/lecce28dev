"use client";

import Image from "next/image";
import { useState } from "react";
import { testimonials } from "@/content/site";

const SIDE = ["/template/review-left.jpg", "/template/review-right.jpg"];

/** Reviews block: ellipse outline, tilted centre portrait, tilted side cards. */
export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];
  const step = (d: number) =>
    setIndex((i) => (i + d + testimonials.length) % testimonials.length);

  return (
    <div className="relative">
      <div className="relative mx-auto flex max-w-5xl items-center justify-center">
        {/* thin ellipse behind the centre card */}
        <svg
          viewBox="0 0 460 520"
          aria-hidden
          className="pointer-events-none absolute aspect-[460/520] w-[min(380px,90vw)] sm:w-[460px]"
        >
          <ellipse
            cx="230"
            cy="260"
            rx="228"
            ry="258"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1"
          />
        </svg>

        <div className="relative flex w-full items-center justify-center py-10 sm:py-16">
          <div className="relative h-[300px] w-[220px] sm:h-[360px] sm:w-[264px]">
            <Image
              key={active.name}
              src={active.avatar}
              alt={active.name}
              fill
              sizes="264px"
              className="rounded-lg object-cover shadow-xl"
              style={{ transform: "rotate(-4deg)" }}
            />
          </div>

          {SIDE.map((src, i) => (
            <div
              key={src}
              aria-hidden
              className={`absolute top-1/2 hidden h-[150px] w-[110px] -translate-y-1/2 overflow-hidden rounded-md opacity-90 lg:block ${
                i === 0 ? "left-0" : "right-0"
              }`}
              style={{ transform: `rotate(${i === 0 ? -8 : 8}deg)` }}
            >
              <Image src={src} alt="" fill sizes="110px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-2 flex max-w-3xl flex-col items-center gap-6 text-center">
        <div className="flex gap-2">
          <button
            onClick={() => step(-1)}
            aria-label="Previous review"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
          >
            ←
          </button>
          <button
            onClick={() => step(1)}
            aria-label="Next review"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
          >
            →
          </button>
        </div>

        <div>
          <p className="t-stat">{active.name}</p>
          <p className="t-body mx-auto mt-4 max-w-xl text-black/65">{active.quote}</p>
        </div>
      </div>
    </div>
  );
}
