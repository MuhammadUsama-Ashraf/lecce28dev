import { requireRole } from "@/lib/dal";
import { PageHeader } from "@/components/admin/ui";
import ProductForm, { BLANK_PRODUCT } from "@/components/admin/ProductForm";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const user = await requireRole("ADMIN");
  return (
    <>
      <PageHeader title="Add product" subtitle="It starts as a draft — publish it when the copy is ready." />
      <ProductForm product={BLANK_PRODUCT} role={user.role} />
    </>
  );
}
