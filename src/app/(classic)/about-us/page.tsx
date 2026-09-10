import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import Reveal from "@/components/ui/Reveal";
import { about, pillars, site, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description: about.principles[1],
};

export default function AboutPage() {
  return (
    <div>
      <PageBanner title={about.heading} />

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-10 lg:pb-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-sand-200">
            <Image
              src="/images/about-1.webp"
              alt="Lecce 28 products"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={140}>
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-tight font-light">
              {about.principlesHeading}
            </h2>
            <div className="mt-7 space-y-6 text-[15px] leading-[1.9] text-ink-soft">
              {about.principles.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {pillars.map((p) => (
                <div key={p.title} className="border-t hairline pt-5">
                  <h3 className="eyebrow">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-sand-100 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-24 lg:px-10">
          <Reveal delay={100}>
            <span className="eyebrow text-ink-soft">
              {about.founder.name} — {about.founder.role}
            </span>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] font-light">
              Built from her own skin outward.
            </h2>
            <p className="mt-7 text-[15px] leading-[1.9] text-ink-soft">
              {about.founder.bio}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/shop"
                className="bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.26em] text-sand-50 transition-opacity hover:opacity-85"
              >
                Shop the collection
              </Link>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="eyebrow border-b border-ink pb-1 hover:text-amber-deep"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </Reveal>

          <Reveal className="relative aspect-[4/5] overflow-hidden bg-sand-200 lg:order-first">
            <Image
              src="/images/founder.webp"
              alt={about.founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">
        <Reveal>
          <p className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-tight font-light">
            &ldquo;Conscious beauty has never been more important. Together we will explore
            and influence the future of skincare.&rdquo;
          </p>
          <span className="eyebrow mt-8 block text-ink-soft">{site.tagline}</span>
        </Reveal>
      </section>
    </div>
  );
}
