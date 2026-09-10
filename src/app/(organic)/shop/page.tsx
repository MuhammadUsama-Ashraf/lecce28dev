import type { Metadata } from "next";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import OrganicProductCard from "@/components/organic/OrganicProductCard";
import Reveal from "@/components/ui/Reveal";
import { products } from "@/content/products";
import { SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Your daily dose of nature's nourishment for a luminous complexion. Shop the Lecce 28 body care collection.",
};

export default function ShopPage() {
  return (
    <main className="flex-1">
      <OrganicPageHeader kicker="Shop" accent="" wave />

      <section className="mx-auto max-w-[1400px] px-6 pt-8 pb-24 lg:px-10 lg:pt-12 lg:pb-32">
        <div className="mb-12 text-center">
          <h2 className="t-h2">Our Products</h2>
          <p className="t-body mx-auto mt-4 max-w-xl text-[#7A7A7A]">
            Your daily dose of nature&apos;s nourishment for a luminous complexion.
          </p>
        </div>

        <div className="t-body flex flex-wrap items-center gap-x-8 gap-y-2 border-y border-black/12 py-4 text-[#7A7A7A]">
          <span>{products.length} products</span>
          <span>Fumo di Cocco &amp; Unscented</span>
          <span>Over 98% natural</span>
          <span>Cruelty-free</span>
          <a
            className="underline underline-offset-4 hover:text-black sm:ml-auto"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <OrganicProductCard product={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
