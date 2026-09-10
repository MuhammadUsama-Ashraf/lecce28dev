"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { testimonials } from "@/content/site";

export default function OrganicTestimonial() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      9000,
    );
    return () => window.clearInterval(id);
  }, []);

  const active = testimonials[index];

  return (
    <div className="rounded-3xl bg-sand-100 px-8 py-14 sm:px-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-[#e8552c]" aria-label="Rated 5 out of 5">
          ★★★★★
        </span>
        <blockquote className="mt-8 text-[clamp(1.15rem,2.2vw,1.6rem)] leading-[1.5] font-light">
          &ldquo;{active.quote}&rdquo;
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Image
            src={active.avatar}
            alt={active.name}
            width={56}
            height={56}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="text-[15px]">{active.name}</span>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
