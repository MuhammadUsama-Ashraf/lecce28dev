import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FollowStrip from "@/components/organic/FollowStrip";
import BadgeRow from "@/components/organic/BadgeRow";
import OrganicHero from "@/components/organic/OrganicHero";
import PlanCard from "@/components/organic/PlanCard";
import ProductRail from "@/components/organic/ProductRail";
import ReviewsCarousel from "@/components/organic/ReviewsCarousel";
import SectionTitle from "@/components/organic/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import { getProduct, products } from "@/content/products";
import { journal, philosophy, site, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Lecce28 — Elevate your beauty. Embrace your wellness.",
  description:
    "Naturally derived body care from Lecce 28: chamomile and olive oil body wash, jojoba intense therapy lotion, natural body butter and scrub, scented in Fumo di Cocco.",
};

const singles = products.filter((p) => p.vessel !== "trio");
const bundles = ["shower-bundle", "bellissimo-bundle", "body-bundle"]
  .map(getProduct)
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const wash = getProduct("chamomile-olive-oil");

export default function OrganicHome() {
  return (
    <main className="flex-1">
      <OrganicHero />

      {/* ── Brand standards ────────────────────────────────────────────── */}
      <BadgeRow />

      {/* ── Explore ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-14 lg:px-10">
        <Reveal>
          <SectionTitle kicker="Explore" accent="the collection" />
        </Reveal>
      </section>

      {/* ── Product rails ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] space-y-20 px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal>
          <ProductRail
            kicker="Fumo di Cocco"
            accent="Body care"
            caption="One unisex signature runs through the collection, so a full ritual layers rather than competes."
            items={singles.slice(0, 3)}
            images={["/template/ritual-1.jpg", "/template/journal-1.jpg"]}
          />
        </Reveal>

        <Reveal>
          <ProductRail
            kicker="Natural"
            accent="Butters & scrubs"
            caption="Over 98% natural, more than 50% oil content, and never a greasy residue."
            items={singles.slice(3)}
            reverse
            images={["/template/ritual-2.jpg", "/template/journal-2.jpg"]}
          />
        </Reveal>
      </section>

      {/* ── Awareness ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/template/awareness.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-28 text-white lg:px-10 lg:py-40">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal className="min-w-0">
              <h2 className="text-[clamp(2.75rem,8.5vw,8rem)] leading-[0.92] font-semibold uppercase">
                Conscious
                <br />
                beauty
              </h2>
            </Reveal>
            <Reveal delay={120} className="min-w-0 lg:pt-6">
              <p className="t-body text-white/85">{philosophy.body}</p>
            </Reveal>
          </div>

          <Reveal delay={200} className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <p className="t-editorial-sm">
              Elevate your beauty. <span className="not-italic">Embrace your wellness.</span>
            </p>
            <div>
              <p className="t-body max-w-lg text-white/85">
                Lecce 28 is dedicated to trust and quality in every aspect of our business,
                from our product offerings to our customer interactions. We aim to help our
                customers make educated purchasing decisions that support better health
                outcomes.
              </p>
              <Link
                href="/about-us"
                className="t-body mt-6 inline-block border-b border-white pb-0.5 hover:opacity-80"
              >
                Learn more about Lecce 28
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The ritual (service block) ─────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="t-editorial">Directions for use</p>
            <h2 className="t-h2 mt-2">The ritual</h2>
            <p className="t-body mt-5 max-w-sm text-black/65">
              {wash?.directions}
            </p>
            <Link
              href="/shop"
              className="t-body mt-7 inline-block border-b border-black pb-0.5 hover:opacity-70"
            >
              Shop all products
            </Link>
          </Reveal>

          <Reveal delay={120} className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/template/service.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ── Reviews ────────────────────────────────────────────────────── */}
      <section className="bg-[var(--oc-grey)] py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <SectionTitle kicker="Reviews" accent="Kind words" />
          </Reveal>
          <Reveal delay={120} className="mt-14">
            <ReviewsCarousel />
          </Reveal>
        </div>
      </section>

      {/* ── Bundles / pricing ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/template/pricing-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/15" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <Reveal>
            <div className="text-center text-white">
              <h2 className="t-h2">Bundles</h2>
              <p className="t-editorial mt-1">Build the ritual</p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-start">
            {bundles.map((p, i) => (
              <Reveal
                key={p.slug}
                delay={i * 110}
                className={i === 1 ? "lg:mt-16" : i === 2 ? "lg:mt-32" : ""}
              >
                <PlanCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blogs ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="Blogs" accent="All latest" align="left" />
          <Link
            href="/blogs"
            className="t-body border-b border-black pb-0.5 hover:opacity-70"
          >
            View All
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {journal.slice(0, 2).map((post, i) => (
            <Reveal key={post.slug} delay={i * 110} as="article">
              <Link href={`/blogs/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={i === 0 ? "/template/journal-1.jpg" : "/template/journal-2.jpg"}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                </div>
                <h3 className="t-h3 mt-6">{post.title}</h3>
                <p className="t-body mt-3 max-w-md text-black/65">{post.excerpt}</p>
                <span className="t-body mt-4 inline-block border-b border-black pb-0.5">
                  Read More
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Follow ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--oc-sand)] py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <SectionTitle kicker="Follow Us" accent="@lecce28_skincare" />
          </Reveal>
          <Reveal delay={140} className="mt-16">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Lecce 28 on Instagram"
              className="block"
            >
              <FollowStrip />
            </a>
          </Reveal>
          <Reveal delay={220} className="mt-16 text-center">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="t-body border-b border-black pb-0.5 hover:opacity-70"
            >
              {SUPPORT_EMAIL}
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
