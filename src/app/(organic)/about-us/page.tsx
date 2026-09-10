import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import Reveal from "@/components/ui/Reveal";
import { about, site, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description: about.principles[1],
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <OrganicPageHeader kicker="About Us" accent="" wave />

      {/* ── Our Core Principles ────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <h2 className="t-h2">{about.principlesHeading}</h2>
            <div className="mt-7 space-y-5">
              {about.principles.map((p) => (
                <p key={p.slice(0, 32)} className="t-body text-[#7A7A7A]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/about-1.webp"
              alt="Lecce 28 community"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ── Founder ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/founder.webp"
              alt={about.founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={120}>
            <h2 className="t-h2">{about.founder.name}</h2>
            <p className="t-label mt-2 uppercase">{about.founder.role}</p>
            <span className="mt-7 block h-px w-20 bg-black/50" />
            <p className="t-body mt-7 text-[#7A7A7A]">{about.founder.bio}</p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href="/shop"
                className="t-nav rounded-full bg-black px-8 py-3 text-white transition-opacity hover:opacity-85"
              >
                Shop the collection
              </Link>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="t-body border-b border-black pb-0.5 hover:opacity-70"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing line ───────────────────────────────────────────────── */}
      <section className="bg-[var(--oc-sand)] py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="t-editorial-sm">{site.tagline}</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
