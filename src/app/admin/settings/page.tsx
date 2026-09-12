import { requireRole } from "@/lib/dal";
import { getStoreSettings } from "@/lib/pricing";
import { PageHeader } from "@/components/admin/ui";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireRole("ADMIN");
  const settings = await getStoreSettings();

  return (
    <>
      <PageHeader
        title="Store settings"
        subtitle="Shipping, tax and order numbering. These feed every quote the checkout produces."
      />
      <SettingsForm
        settings={{
          freeShippingOverCents: settings.freeShippingOverCents,
          flatShippingCents: settings.flatShippingCents,
          taxPercent: settings.taxPercent,
          orderPrefix: settings.orderPrefix,
          nextOrderNumber: settings.nextOrderNumber,
        }}
      />
    </>
  );
}
