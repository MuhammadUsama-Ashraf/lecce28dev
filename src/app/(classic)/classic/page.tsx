import HeroCarousel from "@/components/home/HeroCarousel";
import LatestBlogs from "@/components/home/LatestBlogs";
import PhilosophySection from "@/components/home/PhilosophySection";
import TrustBadges from "@/components/home/TrustBadges";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { products } from "@/content/products";
import { philosophy } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <TrustBadges />

      {/* ── Our Products ───────────────────────────────────────────────── */}
      <section id="shop" className="mx-auto max-w-6xl px-5 py-16 lg:px-10 lg:py-20">
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-light tracking-[0.04em] uppercase">
            {"Our Products"}
          </h2>
          <p className="mt-6 text-[15px] text-ink-soft">{philosophy.lead}</p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <ProductCard product={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Our Philosophy + testimonials ──────────────────────────────── */}
      <PhilosophySection />

      {/* ── Latest Blogs ───────────────────────────────────────────────── */}
      <LatestBlogs />

    </>
  );
}
