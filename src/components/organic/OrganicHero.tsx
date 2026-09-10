"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const HeroScene3D = dynamic(() => import("./HeroScene3D"), { ssr: false });

export default function OrganicHero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;
    } catch {
      return;
    }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex h-screen min-h-[620px] flex-col overflow-hidden bg-[#17120e]"
    >
      <div className="absolute inset-0">{ready ? <HeroScene3D /> : null}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17120e] via-transparent to-[#17120e]/45" />

      <div className="relative mt-auto w-full px-6 pb-4 lg:px-10">
        <p className="max-w-md text-[17px] leading-[1.5] text-white/90">
          {site.tagline} Naturally derived formulas, over 98% natural, never tested on
          animals.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-block border-b border-white/70 pb-1 text-[17px] text-white transition-colors hover:border-white hover:opacity-80"
        >
          Shop the collection
        </Link>
      </div>

      {/* Oversized wordmark bleeding off the bottom edge */}
      <div className="relative w-full overflow-hidden px-4 lg:px-6">
        <span className="block w-full text-center text-[19vw] leading-[0.78] font-light tracking-[-0.02em] text-white select-none">
          LECCE 28
        </span>
      </div>
    </section>
  );
}
