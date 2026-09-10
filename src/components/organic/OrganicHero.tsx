"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDE_MS = 7000;

/** The two hero slides as composed by the brand. Copy, pager dots and the
 *  LEARN MORE button are part of the artwork, so the banner is sized by the
 *  image's own aspect ratio and never cropped. */
const SLIDES = [
  { src: "/hero/h1.jpg", href: "/about-us", label: "Natural Body Butter — learn more" },
  { src: "/hero/h2.jpg", href: "/shop", label: "Where luxury and self-care collide — shop" },
];

export default function OrganicHero() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const go = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-white">
      <section
        aria-roledescription="carousel"
        aria-label="Lecce 28 highlights"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        className="relative aspect-[1901/727] w-full overflow-hidden bg-[var(--oc-sand)]"
      >
        {/* keeps the nav legible where it overlaps the artwork */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-white/70 to-transparent" />
        {SLIDES.map((slide, i) => (
          <Link
            key={slide.src}
            href={slide.href}
            aria-label={slide.label}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </Link>
        ))}

        {/* Sits over the pager dots painted into the artwork */}
        <div className="absolute top-[88.2%] left-[24.5%] z-20 flex -translate-x-1/2 -translate-y-1/2 gap-[0.9%]">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-[0.9vw] max-h-2.5 min-h-1.5 w-[0.9vw] max-w-2.5 min-w-1.5 rounded-full border border-black transition-colors ${
                i === index ? "bg-black" : "bg-white hover:bg-black/40"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
