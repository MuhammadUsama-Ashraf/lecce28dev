import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/dal";
import { formatMoney } from "@/lib/money";
import { Badge, Card, EmptyState, LinkButton, PageHeader, Table, Td } from "@/components/admin/ui";
import { OrderStatus } from "@/generated/prisma/enums";
import { statusTone } from "@/components/admin/orderStatus";

export const dynamic = "force-dynamic";

const PAID = [OrderStatus.PAID, OrderStatus.FULFILLED];

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  await requireUser();
  const { denied } = await searchParams;

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [revenue, revenue30, orderCount, pending, lowStock, recent, activePromos, liveSales] =
    await Promise.all([
      db.order.aggregate({ _sum: { totalCents: true }, where: { status: { in: PAID } } }),
      db.order.aggregate({
        _sum: { totalCents: true },
        _count: true,
        where: { status: { in: PAID }, placedAt: { gte: since } },
      }),
      db.order.count(),
      db.order.count({ where: { status: OrderStatus.PENDING } }),
      db.product.count({ where: { trackStock: true, stock: { lte: 5 }, status: "ACTIVE" } }),
      db.order.findMany({
        orderBy: { placedAt: "desc" },
        take: 8,
        select: {
          id: true,
          number: true,
          email: true,
          status: true,
          totalCents: true,
          currency: true,
          placedAt: true,
        },
      }),
      db.promoCode.count({ where: { isActive: true } }),
      db.sale.count({ where: { isActive: true } }),
    ]);

  const stats = [
    { label: "Revenue, all time", value: formatMoney(revenue._sum.totalCents ?? 0) },
    { label: "Revenue, last 30 days", value: formatMoney(revenue30._sum.totalCents ?? 0) },
    { label: "Orders, last 30 days", value: String(revenue30._count) },
    { label: "Awaiting payment", value: String(pending) },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`${orderCount} orders · ${activePromos} active promo codes · ${liveSales} sales`}
        action={<LinkButton href="/admin/products/new" tone="primary">Add product</LinkButton>}
      />

      {denied ? (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          Your role does not have access to that section.
        </p>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-[12px] tracking-wide text-neutral-500 uppercase">{s.label}</p>
            <p className="mt-2 text-[24px] font-semibold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {lowStock > 0 ? (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          {lowStock} active {lowStock === 1 ? "product is" : "products are"} down to five units or fewer.{" "}
          <Link href="/admin/products?filter=low-stock" className="underline">
            Review stock
          </Link>
        </p>
      ) : null}

      <Card title="Recent orders">
        {recent.length === 0 ? (
          <EmptyState
            title="No orders yet"
            hint="Orders appear here the moment a checkout completes. Stripe's webhook marks them paid."
          />
        ) : (
          <Table head={["Order", "Placed", "Customer", "Status", "Total"]}>
            {recent.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <Td>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium underline-offset-2 hover:underline">
                    {order.number}
                  </Link>
                </Td>
                <Td className="text-neutral-500">
                  {order.placedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Td>
                <Td className="text-neutral-600">{order.email}</Td>
                <Td>
                  <Badge tone={statusTone(order.status)}>{order.status.toLowerCase()}</Badge>
                </Td>
                <Td>{formatMoney(order.totalCents, order.currency)}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
