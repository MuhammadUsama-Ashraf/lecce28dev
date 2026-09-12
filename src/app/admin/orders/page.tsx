import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/dal";
import { formatMoney } from "@/lib/money";
import { Badge, EmptyState, PageHeader, Table, Td } from "@/components/admin/ui";
import { OrderStatus } from "@/generated/prisma/enums";
import { statusTone } from "@/components/admin/orderStatus";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const PAGE_SIZE = 25;

const TABS = [
  { key: "all", label: "All" },
  { key: "PENDING", label: "Awaiting payment" },
  { key: "PAID", label: "Paid" },
  { key: "FULFILLED", label: "Fulfilled" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "REFUNDED", label: "Refunded" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireUser();
  const { status = "all", q, page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);

  const where = {
    ...(status !== "all" && Object.values(OrderStatus).includes(status as OrderStatus)
      ? { status: status as OrderStatus }
      : {}),
    ...(q
      ? {
          OR: [
            { number: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { customerName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { placedAt: "desc" },
      skip: (pageNumber - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { items: true } } },
    }),
    db.order.count({ where }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, q, page: String(pageNumber), ...next };
    for (const [key, value] of Object.entries(merged)) {
      if (value && !(key === "status" && value === "all") && !(key === "page" && value === "1")) {
        params.set(key, value);
      }
    }
    const s = params.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Orders" subtitle={`${total} ${total === 1 ? "order" : "orders"}`} />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={qs({ status: tab.key, page: "1" })}
            className={`rounded-full px-3.5 py-1.5 text-[13px] transition ${
              status === tab.key
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <form className="ml-auto" action="/admin/orders">
          {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Order number or email…"
            className="w-60 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-neutral-900"
          />
        </form>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders match"
          hint="Completed checkouts land here automatically once Stripe confirms the payment."
        />
      ) : (
        <>
          <Table head={["Order", "Placed", "Customer", "Items", "Status", "Total"]}>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <Td>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {order.number}
                  </Link>
                </Td>
                <Td className="text-neutral-500">
                  {order.placedAt.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Td>
                <Td>
                  <span className="block text-neutral-800">{order.customerName ?? "—"}</span>
                  <span className="text-[12px] text-neutral-500">{order.email}</span>
                </Td>
                <Td className="text-neutral-600">{order._count.items}</Td>
                <Td>
                  <Badge tone={statusTone(order.status)}>{order.status.toLowerCase()}</Badge>
                </Td>
                <Td>{formatMoney(order.totalCents, order.currency)}</Td>
              </tr>
            ))}
          </Table>

          {pages > 1 ? (
            <div className="mt-4 flex items-center justify-between text-[13px] text-neutral-600">
              <span>
                Page {pageNumber} of {pages}
              </span>
              <div className="flex gap-2">
                {pageNumber > 1 ? (
                  <Link href={qs({ page: String(pageNumber - 1) })} className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5">
                    Previous
                  </Link>
                ) : null}
                {pageNumber < pages ? (
                  <Link href={qs({ page: String(pageNumber + 1) })} className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5">
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
