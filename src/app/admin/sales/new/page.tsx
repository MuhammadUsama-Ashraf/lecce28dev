import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { PageHeader } from "@/components/admin/ui";
import SaleForm, { BLANK_SALE } from "@/components/admin/SaleForm";

export const metadata = { title: "New sale" };

export default async function NewSalePage() {
  await requireRole("ADMIN");
  const products = await db.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return (
    <>
      <PageHeader title="New sale" />
      <SaleForm sale={BLANK_SALE} products={products} />
    </>
  );
}
