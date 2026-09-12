import "server-only";

import { db } from "@/lib/db";
import { activeSaleMap } from "@/lib/pricing";
import type { Product, Vessel } from "@/content/products";

/** The storefront's product shape. It keeps every field the existing
 *  components read, so pages only had to swap where the data comes from,
 *  and adds what the database made possible: live pricing and stock. */
export type StoreProduct = Product & {
  id: string;
  priceCents: number;
  /** Set when a sale is running — `price` already reflects it. */
  listPriceCents: number | null;
  saleBadge: string | null;
  stock: number;
  trackStock: boolean;
  inStock: boolean;
  images: string[];
};

type Row = Awaited<ReturnType<typeof fetchRows>>[number];
type SaleLookup = Awaited<ReturnType<typeof activeSaleMap>>;

function fetchRows(where: Record<string, unknown>) {
  return db.product.findMany({
    where,
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    include: { images: { orderBy: { position: "asc" } } },
  });
}

function toStoreProduct(row: Row, saleFor: SaleLookup): StoreProduct {
  const sale = saleFor(row.id, row.priceCents);
  const effective = sale ? sale.unitCents : row.priceCents;
  const images = row.images.map((i) => i.url);
  const hero = row.heroImage ?? images[0] ?? "/products/body-butter.webp";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    scent: row.scent ?? "",
    price: effective / 100,
    priceCents: effective,
    listPriceCents: effective < row.priceCents ? row.priceCents : row.compareAtCents,
    saleBadge: sale?.badge ?? (sale ? "Sale" : null),
    image: hero,
    images: images.length > 0 ? images : [hero],
    vessel: (row.vessel ?? "jar") as Vessel,
    accent: row.accent ?? "#A2662B",
    label: { kicker: row.labelKicker ?? row.scent ?? "", title: row.labelTitle ?? row.name },
    rating: row.rating,
    reviews: row.reviewCount,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    includes: row.includes.length > 0 ? row.includes : undefined,
    fragrance:
      row.fragranceTop || row.fragranceMiddle || row.fragranceBase
        ? {
            top: row.fragranceTop ?? "",
            middle: row.fragranceMiddle ?? "",
            base: row.fragranceBase ?? "",
          }
        : undefined,
    ingredients: row.ingredients ?? "",
    directions: row.directions ?? "",
    size: row.sizeLabel ?? undefined,
    weight: row.weight ?? "",
    dimensions: row.dimensions ?? "",
    stock: row.stock,
    trackStock: row.trackStock,
    inStock: !row.trackStock || row.stock > 0,
  };
}

export async function getShopProducts(): Promise<StoreProduct[]> {
  const [rows, saleFor] = await Promise.all([fetchRows({ status: "ACTIVE" }), activeSaleMap()]);
  return rows.map((row) => toStoreProduct(row, saleFor));
}

export async function getFeaturedProducts(limit = 4): Promise<StoreProduct[]> {
  const all = await getShopProducts();
  const featured = all.filter((p) => (p as StoreProduct & { featured?: boolean }).featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getShopProduct(slug: string): Promise<StoreProduct | null> {
  const [rows, saleFor] = await Promise.all([
    fetchRows({ slug, status: { not: "DRAFT" } }),
    activeSaleMap(),
  ]);
  const row = rows[0];
  return row ? toStoreProduct(row, saleFor) : null;
}

/** Slugs for generateStaticParams and sitemaps. */
export async function getProductSlugs() {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
