import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BundleCard from "@/components/organic/BundleCard";
import OrganicHero from "@/components/organic/OrganicHero";
import OrganicProductCard from "@/components/organic/OrganicProductCard";
import OrganicTestimonial from "@/components/organic/OrganicTestimonial";
import { badges } from "@/components/home/TrustBadges";
import Reveal from "@/components/ui/Reveal";
import { getProduct, products } from "@/content/products";
import { about, journal, philosophy, pillars, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Lecce28 — Elevate your beauty. Embrace your wellness.",
  description:
    "Naturally derived body care from Lecce 28: chamomile and olive oil body wash, jojoba intense therapy lotion, natural body butter and scrub, scented in Fumo di Cocco.",
};

const singles = products.filter((p) => p.vessel !== "trio");
const bundles = ["shower-bundle", "bellissimo-bundle", "body-bundle"]
  .map(getProduct)
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const FUMO = products.find((p) => p.fragrance)?.fragrance;

export default function OrganicHome() {
  return (
    <main className="flex-1">
      <OrganicHero />

      {/* ── Values: four pillars ───────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 90}>
              <Image
                src={badges[i % badges.length].src}
                alt=""
                width={150}
                height={150}
                className="h-12 w-12"
              />
              <h3 className="mt-7 text-[19px] leading-snug">{pillar.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{pillar.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Product showcase ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.05] font-light">
            Body care, formulated to be worn every day
          </h2>
          <Link
            href="/shop"
            className="border-b border-ink pb-1 text-[15px] hover:opacity-70"
          >
            View all
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {singles.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <OrganicProductCard product={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24">
          <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] leading-tight font-light">
            Butters &amp; scrubs
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {singles.slice(3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <OrganicProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Awareness / philosophy ─────────────────────────────────────── */}
      <section className="bg-sand-100 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.1] font-light">
              {philosophy.heading}
            </h2>
            <p className="mt-8 text-[17px] leading-[1.7] text-ink-soft">
              {philosophy.body}
            </p>
            <p className="mt-8 text-[clamp(1.15rem,2.2vw,1.5rem)] leading-[1.5] font-light italic">
              &ldquo;Conscious beauty has never been more important. Together we will
              explore and influence the future of skincare.&rdquo;
            </p>
            <Link
              href="/about-us"
              className="mt-10 inline-block border-b border-ink pb-1 text-[15px] hover:opacity-70"
            >
              Learn more
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── The scent (services analogue) ──────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-light">
              Fumo di Cocco
            </h2>
            <p className="mt-6 max-w-sm text-[17px] leading-[1.6] text-ink-soft">
              One unisex signature runs through the whole collection, so a full ritual
              layers rather than competes.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <dl className="divide-y divide-ink/12 border-y border-ink/12">
              {FUMO ? (
                <>
                  <NoteRow label="Top" value={FUMO.top} />
                  <NoteRow label="Middle" value={FUMO.middle} />
                  <NoteRow label="Base" value={FUMO.base} />
                </>
              ) : null}
              <NoteRow
                label="Unscented"
                value="The Natural Body Butter is also offered entirely fragrance-free, with the same over-98% natural formula."
              />
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonial ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal>
          <OrganicTestimonial />
        </Reveal>
      </section>

      {/* ── Bundles, three-up ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="max-w-2xl">
          <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-light">
            Build the whole ritual
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-ink-soft">
            Free shipping on purchases over 100 dollars.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {bundles.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100} className="h-full">
              <BundleCard product={p} featured={i === 1} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Journal ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-light">
            From the journal
          </h2>
          <Link
            href="/blogs"
            className="border-b border-ink pb-1 text-[15px] hover:opacity-70"
          >
            View all
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {journal.slice(0, 2).map((post, i) => (
            <Reveal key={post.slug} delay={i * 110} as="article">
              <Link
                href={`/blogs/${post.slug}`}
                className="group block h-full rounded-3xl bg-sand-100 p-8 lg:p-10"
              >
                <span className="text-[13px] text-ink-soft">{post.date}</span>
                <h3 className="mt-4 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug font-light">
                  {post.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
                  {post.excerpt}
                </p>
                <span className="mt-7 inline-block border-b border-ink pb-1 text-[15px] transition-opacity group-hover:opacity-70">
                  Read more
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="rounded-3xl bg-[#17120e] px-8 py-20 text-center text-white lg:px-16">
          <h2 className="mx-auto max-w-2xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] font-light">
            {about.principles[2]}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/shop"
              className="rounded-full bg-white px-9 py-3.5 text-[15px] text-ink transition-opacity hover:opacity-85"
            >
              Shop the collection
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="border-b border-white/60 pb-1 text-[15px] text-white/85 hover:text-white"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-7 sm:grid-cols-[150px_1fr] sm:gap-8">
      <dt className="text-[13px] tracking-[0.18em] text-ink-soft uppercase">{label}</dt>
      <dd className="text-[17px] leading-[1.6]">{value}</dd>
    </div>
  );
}
