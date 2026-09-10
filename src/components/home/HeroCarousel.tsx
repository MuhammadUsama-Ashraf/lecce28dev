"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroSceneMount } from "@/components/three/SceneMount";
import { hero } from "@/content/site";

const SLIDE_MS = 7000;
const SLIDES = ["editorial", "trifecta"] as const;

export default function HeroCarousel() {
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
    <section
      aria-roledescription="carousel"
      aria-label="Lecce 28 highlights"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      className="relative h-[460px] overflow-hidden bg-sand-100 sm:h-[540px] lg:h-[600px]"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${SLIDES.length}`}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {slide === "editorial" ? <EditorialSlide /> : <TrifectaSlide active={i === index} />}
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {SLIDES.map((slide, i) => (
          <button
            key={slide}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 w-2.5 rounded-full border border-ink transition-colors ${
              i === index ? "bg-ink" : "bg-transparent hover:bg-ink/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/** Slide 1: B&W editorial half with the orange cross, coral product half. */
function EditorialSlide() {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="relative h-full overflow-hidden bg-[#e8dcd0]">
        <Image
          src="/images/about-1.webp"
          alt="Lecce 28 community"
          fill
          priority
          sizes="50vw"
          className="object-cover grayscale"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-1/2 w-3/5">
            <span className="absolute top-1/2 left-0 h-[16%] w-full -translate-y-1/2 bg-[#e8552c] mix-blend-multiply" />
            <span className="absolute top-0 left-1/2 h-full w-[14%] -translate-x-1/2 bg-[#e8552c] mix-blend-multiply" />
          </div>
        </div>
      </div>

      <div className="relative h-full overflow-hidden bg-[#f0a184]">
        <Image
          src="/products/body-butter.webp"
          alt="Natural Body Butter Fumo di Cocco"
          fill
          priority
          sizes="50vw"
          className="object-cover object-right mix-blend-multiply"
        />
        <div className="absolute inset-y-0 left-0 z-10 flex w-full flex-col justify-end px-5 pb-12 sm:w-3/5 sm:px-8 sm:pb-14">
          <p className="font-mono text-[10px] leading-relaxed tracking-[0.16em] text-ink uppercase sm:text-[11px]">
            Free Shipping For Purchases Over $100
          </p>
          <Link
            href={hero.ctaHref}
            className="mt-4 self-start rounded-full border border-ink bg-[#f0a184] px-7 py-2.5 text-[11px] tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-sand-50"
          >
            {hero.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Slide 2: the live WebGL trifecta behind the site's headline lockup. */
function TrifectaSlide({ active }: { active: boolean }) {
  return (
    <div className="relative h-full">
      {active ? <HeroSceneMount /> : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sand-100/60 via-transparent to-sand-50/70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sand-100 via-sand-100/55 to-transparent lg:from-sand-100/80 lg:via-transparent lg:to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 lg:px-10">
        <div className="max-w-md">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.06] font-bold tracking-[0.01em] uppercase">
            Where Luxury
            <br />
            <span className="text-[0.82em]">&amp; Self-Care Collide</span>
          </h2>
          <p className="mt-5 max-w-sm text-[13px] leading-[1.75] text-ink-soft">{hero.body}</p>
        </div>
      </div>
    </div>
  );
}
