"use client";

import { useMemo, useState } from "react";
import OrganicProductCard from "./OrganicProductCard";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/content/products";
import { SUPPORT_EMAIL } from "@/content/site";

type Scent = "all" | "fumo" | "unscented";
type Category = "all" | "single" | "bundle";
type Sort = "featured" | "price-asc" | "price-desc";

const SCENTS: { id: Scent; label: string }[] = [
  { id: "all", label: "All scents" },
  { id: "fumo", label: "Fumo di Cocco" },
  { id: "unscented", label: "Unscented" },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All products" },
  { id: "single", label: "Body care" },
  { id: "bundle", label: "Bundles" },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

const matchesScent = (p: Product, scent: Scent) => {
  if (scent === "all") return true;
  const s = p.scent.toLowerCase();
  return scent === "fumo" ? s.includes("fumo di cocco") : s.includes("unscented");
};

const matchesCategory = (p: Product, category: Category) => {
  if (category === "all") return true;
  return category === "bundle" ? p.vessel === "trio" : p.vessel !== "trio";
};

export default function ShopGrid({ products }: { products: Product[] }) {
  const [scent, setScent] = useState<Scent>("all");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const list = products.filter(
      (p) => matchesScent(p, scent) && matchesCategory(p, category),
    );
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, scent, category, sort]);

  const reset = () => {
    setScent("all");
    setCategory("all");
    setSort("featured");
  };

  const filtered = scent !== "all" || category !== "all";

  return (
    <>
      <div className="border-y border-black/12 py-5">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Group label="Scent">
            {SCENTS.map((o) => (
              <Chip key={o.id} active={scent === o.id} onClick={() => setScent(o.id)}>
                {o.label}
              </Chip>
            ))}
          </Group>

          <Group label="Type">
            {CATEGORIES.map((o) => (
              <Chip
                key={o.id}
                active={category === o.id}
                onClick={() => setCategory(o.id)}
              >
                {o.label}
              </Chip>
            ))}
          </Group>

          <div className="flex items-center gap-3">
            <label
              htmlFor="shop-sort"
              className="text-[13px] tracking-[0.14em] text-[#7A7A7A] uppercase"
            >
              Sort
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="cursor-pointer rounded-full border border-black/30 bg-white px-4 py-1.5 text-[14px] text-black outline-none hover:border-black"
            >
              {SORTS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <span aria-live="polite" className="text-[14px] text-[#7A7A7A]">
              {visible.length} {visible.length === 1 ? "product" : "products"}
            </span>
            {filtered ? (
              <button
                onClick={reset}
                className="text-[14px] text-black underline underline-offset-4 hover:opacity-70"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <p className="t-h3">Nothing matches those filters</p>
          <p className="t-body mx-auto mt-4 max-w-md text-[#7A7A7A]">
            Try a different combination, or write to{" "}
            <a className="underline underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>{" "}
            and we will point you to the right formula.
          </p>
          <button
            onClick={reset}
            className="mt-8 rounded-full border border-black/70 bg-white px-[20px] py-[15px] text-[15px] tracking-[0.04em] text-black uppercase transition-colors hover:bg-black hover:text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <OrganicProductCard product={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[13px] tracking-[0.14em] text-[#7A7A7A] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
        active
          ? "border-black bg-black text-white"
          : "border-black/25 text-[#54595F] hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}
