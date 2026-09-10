"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { philosophy, testimonials } from "@/content/site";

/** Dashed philosophy panel beside the black testimonial slider, as the live
 *  home page pairs them. */
export default function OrganicPhilosophy() {
  const [index, setIndex] = useState(0);

  const step = useCallback((delta: number) => {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }, []);

  const active = testimonials[index];

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center border border-dashed border-black/45 px-8 py-16 sm:px-14">
          <div className="text-center">
            <h2 className="t-h2">{philosophy.heading}</h2>
            <p className="t-body mx-auto mt-8 max-w-lg text-[#7A7A7A]">
              {philosophy.body}
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center bg-black px-14 py-16 sm:px-20">
          <button
            onClick={() => step(-1)}
            aria-label="Previous testimonial"
            className="absolute top-1/2 left-3 -translate-y-1/2 p-3 text-2xl leading-none text-white/60 transition-colors hover:text-white"
          >
            ‹
          </button>

          <figure key={active.name} className="mx-auto max-w-md text-center">
            <Image
              src={active.avatar}
              alt={active.name}
              width={96}
              height={96}
              className="mx-auto h-[86px] w-[86px] rounded-full border-2 border-[#e8552c] object-cover"
            />
            <blockquote className="mt-7 text-[15px] leading-[1.7] text-white italic">
              &ldquo;{active.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-7 text-[18px] text-white">{active.name}</figcaption>
          </figure>

          <button
            onClick={() => step(1)}
            aria-label="Next testimonial"
            className="absolute top-1/2 right-3 -translate-y-1/2 p-3 text-2xl leading-none text-white/60 transition-colors hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
