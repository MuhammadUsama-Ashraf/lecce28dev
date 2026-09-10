import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import ProductCard from "@/components/ui/ProductCard";
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
    <>
      <PageBanner
        title="Shop"
        subtitle="Your daily dose of nature's nourishment for a luminous complexion."
      />
      <div className="mx-auto max-w-7xl px-5 pb-24 lg:px-10 lg:pb-32">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-y hairline py-4 text-xs text-ink-soft">
          <span>{products.length} products</span>
          <span>Fumo di Cocco &amp; Unscented</span>
          <span>Over 98% natural</span>
          <span>Cruelty-free</span>
          <a className="ml-auto underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 80}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
