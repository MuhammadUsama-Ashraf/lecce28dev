import Link from "next/link";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { formatMoney } from "@/lib/money";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td } from "@/components/admin/ui";
import { DiscountType } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sales" };

export default async function SalesPage() {
  await requireRole("ADMIN");
  const sales = await db.sale.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
  const now = new Date();
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <PageHeader
        title="Sales"
        subtitle="Scheduled markdowns. No code needed — the shop shows the reduced price while a sale is live."
        action={<LinkButton href="/admin/sales/new" tone="primary">New sale</LinkButton>}
      />

      {sales.length === 0 ? (
        <EmptyState
          title="No sales scheduled"
          hint="Set one up to mark down a collection for a weekend, or the whole store for a season."
          action={<LinkButton href="/admin/sales/new" tone="primary">New sale</LinkButton>}
        />
      ) : (
        <Table head={["Sale", "Discount", "Applies to", "Window", "Status"]}>
          {sales.map((sale) => {
            const expired = sale.endsAt !== null && sale.endsAt < now;
            const scheduled = sale.startsAt !== null && sale.startsAt > now;
            return (
              <tr key={sale.id} className="hover:bg-neutral-50">
                <Td>
                  <Link
                    href={`/admin/sales/${sale.id}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {sale.name}
                  </Link>
                  {sale.badge ? (
                    <p className="text-[12px] text-neutral-500">badge: {sale.badge}</p>
                  ) : null}
                </Td>
                <Td>
                  {sale.discountType === DiscountType.PERCENT
                    ? `${sale.value}% off`
                    : `${formatMoney(sale.value)} off`}
                </Td>
                <Td className="text-neutral-600">
                  {sale.appliesToAll ? "Storewide" : `${sale._count.products} products`}
                </Td>
                <Td className="text-neutral-600">
                  {sale.startsAt || sale.endsAt
                    ? `${sale.startsAt ? fmt(sale.startsAt) : "now"} – ${sale.endsAt ? fmt(sale.endsAt) : "open"}`
                    : "always"}
                </Td>
                <Td>
                  {!sale.isActive ? (
                    <Badge tone="neutral">disabled</Badge>
                  ) : expired ? (
                    <Badge tone="red">ended</Badge>
                  ) : scheduled ? (
                    <Badge tone="amber">scheduled</Badge>
                  ) : (
                    <Badge tone="green">live</Badge>
                  )}
                </Td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
