import Link from "next/link";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { formatMoney } from "@/lib/money";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td } from "@/components/admin/ui";
import { DiscountType } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";
export const metadata = { title: "Promo codes" };

function windowLabel(startsAt: Date | null, endsAt: Date | null) {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (startsAt && endsAt) return `${fmt(startsAt)} – ${fmt(endsAt)}`;
  if (startsAt) return `from ${fmt(startsAt)}`;
  if (endsAt) return `until ${fmt(endsAt)}`;
  return "always";
}

export default async function PromoCodesPage() {
  await requireRole("ADMIN");
  const codes = await db.promoCode.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true, products: true } } },
  });

  const now = new Date();

  return (
    <>
      <PageHeader
        title="Promo codes"
        subtitle="Codes a customer types at checkout. Totals are recalculated on the server before payment."
        action={<LinkButton href="/admin/promo-codes/new" tone="primary">New code</LinkButton>}
      />

      {codes.length === 0 ? (
        <EmptyState
          title="No promo codes yet"
          hint="Create one to run a launch offer, a win-back campaign or a partner discount."
          action={<LinkButton href="/admin/promo-codes/new" tone="primary">New code</LinkButton>}
        />
      ) : (
        <Table head={["Code", "Discount", "Applies to", "Window", "Used", "Status"]}>
          {codes.map((code) => {
            const expired = code.endsAt !== null && code.endsAt < now;
            const pending = code.startsAt !== null && code.startsAt > now;
            const exhausted =
              code.maxRedemptions !== null && code.timesRedeemed >= code.maxRedemptions;
            return (
              <tr key={code.id} className="hover:bg-neutral-50">
                <Td>
                  <Link
                    href={`/admin/promo-codes/${code.id}`}
                    className="font-mono font-medium underline-offset-2 hover:underline"
                  >
                    {code.code}
                  </Link>
                  {code.description ? (
                    <p className="text-[12px] text-neutral-500">{code.description}</p>
                  ) : null}
                </Td>
                <Td>
                  {code.discountType === DiscountType.PERCENT
                    ? `${code.value}% off`
                    : `${formatMoney(code.value)} off`}
                  {code.minSubtotalCents ? (
                    <p className="text-[12px] text-neutral-500">
                      over {formatMoney(code.minSubtotalCents)}
                    </p>
                  ) : null}
                </Td>
                <Td className="text-neutral-600">
                  {code.appliesToAll ? "Everything" : `${code._count.products} products`}
                </Td>
                <Td className="text-neutral-600">{windowLabel(code.startsAt, code.endsAt)}</Td>
                <Td className="text-neutral-600">
                  {code.timesRedeemed}
                  {code.maxRedemptions ? ` / ${code.maxRedemptions}` : ""}
                </Td>
                <Td>
                  {!code.isActive ? (
                    <Badge tone="neutral">disabled</Badge>
                  ) : expired ? (
                    <Badge tone="red">expired</Badge>
                  ) : exhausted ? (
                    <Badge tone="red">used up</Badge>
                  ) : pending ? (
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
