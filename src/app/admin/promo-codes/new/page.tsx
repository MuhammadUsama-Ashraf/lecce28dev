import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { PageHeader } from "@/components/admin/ui";
import PromoCodeForm, { BLANK_PROMO } from "@/components/admin/PromoCodeForm";

export const metadata = { title: "New promo code" };

export default async function NewPromoCodePage() {
  await requireRole("ADMIN");
  const products = await db.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return (
    <>
      <PageHeader title="New promo code" />
      <PromoCodeForm promo={BLANK_PROMO} products={products} />
    </>
  );
}
