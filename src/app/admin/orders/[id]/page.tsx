import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/dal";
import { formatMoney } from "@/lib/money";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { statusTone } from "@/components/admin/orderStatus";
import OrderControls from "@/components/admin/OrderControls";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, select: { number: true } });
  return { title: order?.number ?? "Order" };
}

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

function AddressBlock({ address }: { address: unknown }) {
  if (!address || typeof address !== "object") {
    return <p className="text-[13px] text-neutral-500">Not provided.</p>;
  }
  const a = address as Address;
  const lines = [
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    a.country,
  ].filter(Boolean);
  if (lines.length === 0) return <p className="text-[13px] text-neutral-500">Not provided.</p>;
  return (
    <address className="text-[13px] leading-relaxed text-neutral-700 not-italic">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </address>
  );
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, promoCode: { select: { code: true } } },
  });
  if (!order) notFound();

  const history = await db.auditLog.findMany({
    where: { entity: "order", entityId: order.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: { select: { name: true } } },
  });

  const rows = [
    { label: "Subtotal", value: formatMoney(order.subtotalCents, order.currency) },
    ...(order.discountCents > 0
      ? [
          {
            label: `Discount${order.promoCodeText ? ` (${order.promoCodeText})` : ""}`,
            value: `−${formatMoney(order.discountCents, order.currency)}`,
          },
        ]
      : []),
    {
      label: "Shipping",
      value: order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents, order.currency),
    },
    ...(order.taxCents > 0
      ? [{ label: "Tax", value: formatMoney(order.taxCents, order.currency) }]
      : []),
  ];

  return (
    <>
      <PageHeader
        title={order.number}
        subtitle={`Placed ${order.placedAt.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}`}
        action={<Badge tone={statusTone(order.status)}>{order.status.toLowerCase()}</Badge>}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <Card title="Items">
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.productId ? (
                      <Link
                        href={`/admin/products/${item.productId}`}
                        className="block truncate text-[14px] font-medium underline-offset-2 hover:underline"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="block truncate text-[14px] font-medium">{item.name}</span>
                    )}
                    <span className="text-[12px] text-neutral-500">
                      {formatMoney(item.unitPriceCents, order.currency)} × {item.qty}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium">
                    {formatMoney(item.lineTotalCents, order.currency)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-1.5 border-t border-neutral-200 pt-4 text-[14px]">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between">
                  <dt className="text-neutral-600">{row.label}</dt>
                  <dd className="text-neutral-800">{row.value}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-[15px] font-semibold">
                <dt>Total</dt>
                <dd>{formatMoney(order.totalCents, order.currency)}</dd>
              </div>
            </dl>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card title="Shipping address">
              <AddressBlock address={order.shippingAddress} />
            </Card>
            <Card title="Billing address">
              <AddressBlock address={order.billingAddress} />
            </Card>
          </div>

          {history.length > 0 ? (
            <Card title="History">
              <ol className="space-y-2 text-[13px]">
                {history.map((entry) => (
                  <li key={entry.id} className="flex flex-wrap justify-between gap-2">
                    <span className="text-neutral-700">{entry.summary ?? entry.action}</span>
                    <span className="text-neutral-400">
                      {entry.user?.name ?? "system"} ·{" "}
                      {entry.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          ) : null}
        </div>

        <div className="space-y-5">
          <Card title="Customer">
            <p className="text-[14px] font-medium text-neutral-900">{order.customerName ?? "—"}</p>
            <a
              href={`mailto:${order.email}`}
              className="mt-0.5 block text-[13px] text-neutral-600 underline-offset-2 hover:underline"
            >
              {order.email}
            </a>
            {order.phone ? <p className="mt-0.5 text-[13px] text-neutral-600">{order.phone}</p> : null}
          </Card>

          <Card title="Payment">
            <dl className="space-y-1.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Status</dt>
                <dd>
                  <Badge tone={statusTone(order.status)}>{order.status.toLowerCase()}</Badge>
                </dd>
              </div>
              {order.paidAt ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Paid</dt>
                  <dd className="text-neutral-800">{order.paidAt.toLocaleDateString("en-US")}</dd>
                </div>
              ) : null}
              {order.stripePaymentIntentId ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Stripe</dt>
                  <dd className="truncate font-mono text-[12px] text-neutral-700">
                    {order.stripePaymentIntentId}
                  </dd>
                </div>
              ) : null}
              {order.promoCode ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Promo</dt>
                  <dd className="font-mono text-[12px]">{order.promoCode.code}</dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <OrderControls
            orderId={order.id}
            status={order.status}
            notes={order.notes}
            canRefund={user.role !== "STAFF"}
          />
        </div>
      </div>
    </>
  );
}
