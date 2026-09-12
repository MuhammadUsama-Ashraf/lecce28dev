import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { PageHeader } from "@/components/admin/ui";
import SaleForm from "@/components/admin/SaleForm";
import SaleDangerZone from "@/components/admin/SaleDangerZone";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sale = await db.sale.findUnique({ where: { id }, select: { name: true } });
  return { title: sale?.name ?? "Sale" };
}

export default async function EditSalePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const { created } = await searchParams;

  const [sale, products] = await Promise.all([
    db.sale.findUnique({ where: { id }, include: { products: { select: { productId: true } } } }),
    db.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!sale) notFound();

  return (
    <>
      <PageHeader title={sale.name} />
      {created ? (
        <p className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
          Sale created.
        </p>
      ) : null}
      <div className="space-y-5">
        <SaleForm
          products={products}
          sale={{
            id: sale.id,
            name: sale.name,
            badge: sale.badge,
            discountType: sale.discountType,
            value: sale.value,
            startsAt: sale.startsAt,
            endsAt: sale.endsAt,
            isActive: sale.isActive,
            appliesToAll: sale.appliesToAll,
            productIds: sale.products.map((p) => p.productId),
          }}
        />
        <SaleDangerZone saleId={sale.id} />
      </div>
    </>
  );
}
