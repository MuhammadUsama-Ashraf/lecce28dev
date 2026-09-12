import type { Metadata } from "next";
import BadgeRow from "@/components/organic/BadgeRow";
import OrganicHero from "@/components/organic/OrganicHero";
import OrganicLatestBlogs from "@/components/organic/OrganicLatestBlogs";
import OrganicPhilosophy from "@/components/organic/OrganicPhilosophy";
import OrganicProductCard from "@/components/organic/OrganicProductCard";
import Reveal from "@/components/ui/Reveal";
import { getShopProducts } from "@/lib/catalog";
import { philosophy } from "@/content/site";

// Reads live catalogue data, so it renders per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lecce28 — Elevate your beauty. Embrace your wellness.",
  description:
    "Naturally derived body care from Lecce 28: chamomile and olive oil body wash, jojoba intense therapy lotion, natural body butter and scrub, scented in Fumo di Cocco.",
};

export default async function OrganicHome() {
  const products = await getShopProducts();

  return (
    <main className="flex-1">
      <OrganicHero />

      <BadgeRow />

      {/* ── Our Products ───────────────────────────────────────────────── */}
      <section id="shop" className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-10 lg:pb-24">
        <Reveal className="text-center">
          <h2 className="t-h2">Our Products</h2>
          <p className="t-body mx-auto mt-4 max-w-xl text-[#7A7A7A]">{philosophy.lead}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <OrganicProductCard product={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Our Philosophy + testimonials ──────────────────────────────── */}
      <OrganicPhilosophy />

      {/* ── Latest Blogs ───────────────────────────────────────────────── */}
      <OrganicLatestBlogs />
    </main>
  );
}
