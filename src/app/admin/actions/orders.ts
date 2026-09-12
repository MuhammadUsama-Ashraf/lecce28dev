"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { assertRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { OrderStatus } from "@/generated/prisma/enums";

export type OrderActionState = { error?: string; success?: string } | null;

/** Stamps the matching timestamp so the order history reads correctly. */
function timestampsFor(status: OrderStatus) {
  const now = new Date();
  switch (status) {
    case OrderStatus.PAID:
      return { paidAt: now, cancelledAt: null };
    case OrderStatus.FULFILLED:
      return { fulfilledAt: now };
    case OrderStatus.CANCELLED:
      return { cancelledAt: now };
    default:
      return {};
  }
}

export async function setOrderStatus(
  _prev: OrderActionState,
  form: FormData,
): Promise<OrderActionState> {
  const user = await assertRole("STAFF");
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "") as OrderStatus;

  if (!Object.values(OrderStatus).includes(status)) return { error: "Unknown status." };

  const before = await db.order.findUnique({ where: { id }, select: { status: true, number: true } });
  if (!before) return { error: "That order no longer exists." };
  if (before.status === status) return { success: "Nothing to change." };

  // Refunds and cancellations move money around, so keep them off the staff role.
  const restricted: OrderStatus[] = [OrderStatus.REFUNDED, OrderStatus.CANCELLED];
  if (restricted.includes(status) && user.role === "STAFF") {
    return { error: "Only an admin can cancel or refund an order." };
  }

  await db.order.update({ where: { id }, data: { status, ...timestampsFor(status) } });
  await logAudit({
    userId: user.id,
    action: status === OrderStatus.REFUNDED ? "refunded" : "status_changed",
    entity: "order",
    entityId: id,
    summary: `${before.number}: ${before.status.toLowerCase()} → ${status.toLowerCase()}`,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: `Order marked ${status.toLowerCase()}.` };
}

export async function saveOrderNote(
  _prev: OrderActionState,
  form: FormData,
): Promise<OrderActionState> {
  const user = await assertRole("STAFF");
  const id = String(form.get("id") ?? "");
  const notes = String(form.get("notes") ?? "").slice(0, 4000);

  const order = await db.order.findUnique({ where: { id }, select: { number: true } });
  if (!order) return { error: "That order no longer exists." };

  await db.order.update({ where: { id }, data: { notes: notes || null } });
  await logAudit({
    userId: user.id,
    action: "updated",
    entity: "order",
    entityId: id,
    summary: `note on ${order.number}`,
  });

  revalidatePath(`/admin/orders/${id}`);
  return { success: "Note saved." };
}
