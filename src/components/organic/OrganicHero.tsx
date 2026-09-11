"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { hero } from "@/content/site";

const SLIDE_MS = 7000;

/** Two hero slides. On phones each is rebuilt as a tall layout with live text,
 *  because the wide desktop artwork has its copy baked in and collapses to an
 *  unreadable strip at narrow widths. From lg up the original slides are used. */
export default function OrganicHero() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const go = useCallback((next: number) => {
    setIndex(((next % 2) + 2) % 2);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % 2);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-white pt-[124px] lg:pt-0">
      <section
        aria-roledescription="carousel"
        aria-label="Lecce 28 highlights"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        className="relative h-[460px] w-full overflow-hidden bg-[var(--oc-sand)] sm:h-[520px] lg:aspect-[1901/727] lg:h-auto"
      >
        {/* only needed where the nav floats over the artwork */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-28 bg-gradient-to-b from-white/70 to-transparent lg:block" />

        <Slide active={index === 0}>
          <EditorialSlide />
        </Slide>
        <Slide active={index === 1}>
          <TrifectaSlide />
        </Slide>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2.5 lg:bottom-auto lg:left-[24.5%] lg:top-[88.2%] lg:-translate-y-1/2">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 w-2.5 rounded-full border border-black transition-colors ${
                i === index ? "bg-black" : "bg-white/70 hover:bg-black/40"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function Slide({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/** Editorial half beside the coral product panel. */
function EditorialSlide() {
  return (
    <Link href="/about-us" aria-label="Natural Body Butter — learn more" className="block h-full">
      {/* phones: the same slide, cover-cropped tall so the face/coral split
          lands centre, with the offer set live over it */}
      <div className="relative h-full overflow-hidden lg:hidden">
        <Image
          src="/hero/h1-phone2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 text-center">
          <p className="text-[15px] leading-snug tracking-[0.02em] text-black">
            Free Shipping For Purchases Over $100
          </p>
          <span className="mt-4 inline-block rounded-full border border-black px-9 py-3 text-[14px] tracking-[0.08em] text-black uppercase">
            {hero.cta}
          </span>
        </div>
      </div>

      {/* lg and up: the original wide slide */}
      <div className="relative hidden h-full lg:block">
        <Image
          src="/hero/h1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </Link>
  );
}

/** The trifecta with the headline set live on phones. */
function TrifectaSlide() {
  return (
    <Link
      href="/shop"
      aria-label="Where luxury and self-care collide — shop"
      className="block h-full"
    >
      <div className="relative h-full overflow-hidden lg:hidden">
        <Image
          src="/hero/h2-phone2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 bg-[#efe7dc] px-5 pb-8 pt-6 shadow-[0_-28px_36px_-12px_#efe7dc]">
          <h2 className="text-[23px] leading-[1.12] font-light text-black">
            WHERE LUXURY
            <br />
            <span className="text-[17px]">&amp; SELF-CARE COLLIDE</span>
          </h2>
          <p className="mt-2 text-[12px] leading-[1.45] text-black/70">{hero.body}</p>
        </div>
      </div>

      <div className="relative hidden h-full lg:block">
        <Image
          src="/hero/h2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </Link>
  );
}
