import type { Metadata } from "next";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import ShopGrid from "@/components/organic/ShopGrid";

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

        <ShopGrid />
      </section>
    </main>
  );
}
