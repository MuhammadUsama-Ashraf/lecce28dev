"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { philosophy, testimonials } from "@/content/site";

const ROTATE_MS = 9000;

/** The live site's paired block: a dashed philosophy panel beside a black
 *  testimonial slider with chevron paging. */
export default function PhilosophySection() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const step = useCallback((delta: number) => {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % testimonials.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const active = testimonials[index];

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid items-stretch gap-10 lg:grid-cols-2">
        {/* Philosophy — dashed outline panel */}
        <div className="flex items-center justify-center border border-dashed border-ink/35 px-6 py-16 sm:px-10">
          <div className="text-center">
            <h2 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] leading-none font-light tracking-[0.03em] whitespace-nowrap uppercase">
              {philosophy.heading}
            </h2>
            <p className="mx-auto mt-8 max-w-md text-[15px] leading-[1.85] text-ink-soft">
              {philosophy.body}
            </p>
          </div>
        </div>

        {/* Testimonial slider */}
        <div
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          className="relative flex items-center bg-ink px-12 py-16 text-sand-100 sm:px-16"
        >
          <button
            onClick={() => step(-1)}
            aria-label="Previous testimonial"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-2xl leading-none text-sand-100/70 transition-colors hover:text-sand-50"
          >
            ‹
          </button>

          <figure key={active.name} className="mx-auto max-w-md text-center">
            <Image
              src={active.avatar}
              alt={active.name}
              width={96}
              height={96}
              className="mx-auto h-[88px] w-[88px] rounded-full object-cover"
            />
            <blockquote className="mt-7 text-[15px] leading-[1.75] italic">
              &ldquo;{active.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-7 font-mono text-sm tracking-[0.12em] text-sand-200">
              {active.name}
            </figcaption>
          </figure>

          <button
            onClick={() => step(1)}
            aria-label="Next testimonial"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-2xl leading-none text-sand-100/70 transition-colors hover:text-sand-50"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial from ${t.name}`}
                aria-current={i === index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-sand-100" : "bg-sand-100/30 hover:bg-sand-100/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
