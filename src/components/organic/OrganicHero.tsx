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
        className="relative h-[380px] w-full overflow-hidden bg-[var(--oc-sand)] sm:h-[460px] lg:aspect-[2361/1001] lg:h-auto"
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

/** Editorial face beside the coral product panel. The supplied artwork carries
 *  no baked-in copy, so the offer and button are set live at every size. */
function EditorialSlide() {
  return (
    <Link href="/about-us" aria-label="Natural Body Butter — learn more" className="block h-full">
      {/* phones: the banner cropped so the face/coral split lands dead centre,
          which forces a wide window because the jar sits at the far right. The
          copy goes on its own ground underneath — overlaying it would either
          cover the label or sit on the jar's dark glass. */}
      <div className="flex h-full flex-col justify-center bg-white lg:hidden">
        <div className="relative aspect-[2130/1001] w-full shrink-0 overflow-hidden">
          <Image
            src="/hero/banner1-phone2.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex shrink-0 flex-col items-center bg-white px-5 pt-7 pb-8 text-center">
          <p className="font-mono text-[13.5px] leading-snug tracking-[0.02em] text-black">
            Free Shipping For Purchases Over $100
          </p>
          <span className="mt-3.5 inline-block rounded-full border border-black px-9 py-3 text-[14px] tracking-[0.08em] text-black uppercase">
            {hero.cta}
          </span>
        </div>
      </div>

      {/* lg and up: the full banner, copy centred on the coral panel */}
      <div className="relative hidden h-full lg:block">
        <Image
          src="/hero/banner1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* The jar runs almost to the bottom of the coral panel, and its base is
            dark glass that black copy cannot sit on. A short fade to the coral
            sampled from the artwork clears a footing without touching the
            label. */}
        <div className="absolute right-0 bottom-0 left-[49%] flex h-[26%] flex-col justify-end bg-gradient-to-t from-[#f0aa86] from-50% to-transparent px-6 pb-8 text-center">
          <p className="font-mono text-[16px] tracking-[0.02em] text-black">
            Free Shipping For Purchases Over $100
          </p>
          <span className="mx-auto mt-4 inline-block rounded-full border border-black px-11 py-3.5 text-[15px] tracking-[0.1em] text-black uppercase transition-colors hover:bg-black hover:text-white">
            {hero.cta}
          </span>
        </div>
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
      {/* same band as slide one — an identical 2130:1001 crop, so both hero
          images stand the same height. The copy and pager dots baked into the
          artwork were painted out of the backdrop to free the frame. */}
      <div className="flex h-full flex-col justify-center bg-[#efe7dc] lg:hidden">
        <div className="relative aspect-[2130/1001] w-full shrink-0 overflow-hidden">
          <Image
            src="/hero/h2-phone4.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex shrink-0 flex-col bg-[#efe7dc] px-5 pt-6 pb-8">
          <h2 className="text-[19px] leading-[1.15] font-light text-black">
            WHERE LUXURY &amp; SELF-CARE COLLIDE
          </h2>
          <p className="mt-2 text-[11px] leading-[1.55] text-black/70">{hero.body}</p>
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
