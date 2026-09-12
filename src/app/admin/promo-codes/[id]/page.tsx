import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { PageHeader } from "@/components/admin/ui";
import PromoCodeForm from "@/components/admin/PromoCodeForm";
import PromoDangerZone from "@/components/admin/PromoDangerZone";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promo = await db.promoCode.findUnique({ where: { id }, select: { code: true } });
  return { title: promo?.code ?? "Promo code" };
}

export default async function EditPromoCodePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const { created } = await searchParams;

  const [promo, products] = await Promise.all([
    db.promoCode.findUnique({
      where: { id },
      include: { products: { select: { productId: true } }, _count: { select: { orders: true } } },
    }),
    db.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!promo) notFound();

  return (
    <>
      <PageHeader
        title={promo.code}
        subtitle={`Redeemed ${promo.timesRedeemed} times · ${promo._count.orders} orders`}
      />
      {created ? (
        <p className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
          Promo code created.
        </p>
      ) : null}
      <div className="space-y-5">
        <PromoCodeForm
          products={products}
          promo={{
            id: promo.id,
            code: promo.code,
            description: promo.description,
            discountType: promo.discountType,
            value: promo.value,
            minSubtotalCents: promo.minSubtotalCents,
            maxRedemptions: promo.maxRedemptions,
            perCustomerLimit: promo.perCustomerLimit,
            startsAt: promo.startsAt,
            endsAt: promo.endsAt,
            isActive: promo.isActive,
            appliesToAll: promo.appliesToAll,
            productIds: promo.products.map((p) => p.productId),
          }}
        />
        <PromoDangerZone promoId={promo.id} hasOrders={promo._count.orders > 0} />
      </div>
    </>
  );
}
