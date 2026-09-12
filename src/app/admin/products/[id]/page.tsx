import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/dal";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";
import ProductImages from "@/components/admin/ProductImages";
import ProductDangerZone from "@/components/admin/ProductDangerZone";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, select: { name: true } });
  return { title: product?.name ?? "Product" };
}

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { created } = await searchParams;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      _count: { select: { orderItems: true } },
    },
  });
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={`/${product.slug} · ${product._count.orderItems} ordered`}
        action={
          <Link
            href={`/product/${product.slug}`}
            className="text-[13px] text-neutral-600 underline-offset-2 hover:underline"
          >
            View on storefront ↗
          </Link>
        }
      />

      {created ? (
        <p className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
          Product created. Add images below, then set the status to Active to put it on sale.
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <ProductForm
            role={user.role}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              status: product.status,
              priceCents: product.priceCents,
              compareAtCents: product.compareAtCents,
              scent: product.scent,
              tagline: product.tagline,
              description: product.description,
              ingredients: product.ingredients,
              directions: product.directions,
              includes: product.includes,
              fragranceTop: product.fragranceTop,
              fragranceMiddle: product.fragranceMiddle,
              fragranceBase: product.fragranceBase,
              sizeLabel: product.sizeLabel,
              weight: product.weight,
              dimensions: product.dimensions,
              vessel: product.vessel,
              accent: product.accent,
              labelKicker: product.labelKicker,
              labelTitle: product.labelTitle,
              heroImage: product.heroImage,
              rating: product.rating,
              reviewCount: product.reviewCount,
              stock: product.stock,
              trackStock: product.trackStock,
              featured: product.featured,
              position: product.position,
            }}
          />
          {user.role !== "STAFF" ? (
            <ProductDangerZone
              productId={product.id}
              hasOrders={product._count.orderItems > 0}
            />
          ) : null}
        </div>

        <ProductImages
          productId={product.id}
          heroImage={product.heroImage}
          images={product.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt }))}
          canEdit={user.role !== "STAFF"}
        />
      </div>
    </>
  );
}
