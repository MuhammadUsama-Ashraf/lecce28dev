import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import ValuesCircle from "@/components/organic/ValuesCircle";
import Reveal from "@/components/ui/Reveal";
import { about, site, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description: about.principles[1],
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <OrganicPageHeader
        kicker="About Us"
        accent="conscious beauty"
        image="/template/awareness.jpg"
      />

      {/* Core principles */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="t-h2">{about.principlesHeading}</h2>
            <p className="t-editorial mt-1">what we stand for</p>
          </Reveal>
          <Reveal delay={120} className="space-y-6">
            {about.principles.map((p) => (
              <p key={p.slice(0, 32)} className="t-body text-black/70">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <ValuesCircle />
      </section>

      {/* Founder */}
      <section className="bg-[var(--oc-sand)] py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/founder.webp"
              alt={about.founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="t-editorial">{about.founder.name}</p>
            <h2 className="t-h2 mt-1">{about.founder.role}</h2>
            <p className="t-body mt-7 text-black/70">{about.founder.bio}</p>
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

      {/* Closing line */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:py-32">
        <Reveal>
          <p className="t-editorial-sm">
            Conscious beauty has never been more important. Together we will explore and
            influence the future of skincare.
          </p>
          <p className="t-body mt-8 text-black/55">{site.tagline}</p>
        </Reveal>
      </section>
    </main>
  );
}
