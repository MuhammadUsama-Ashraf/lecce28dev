"use client";

import { useActionState } from "react";
import {
  saveOrderNote,
  setOrderStatus,
  type OrderActionState,
} from "@/app/admin/actions/orders";
import { Button, Card, FormMessage, Select, Textarea } from "@/components/admin/ui";
import { ORDER_STATUSES } from "@/components/admin/orderStatus";
import type { OrderStatus } from "@/generated/prisma/enums";

export default function OrderControls({
  orderId,
  status,
  notes,
  canRefund,
}: {
  orderId: string;
  status: OrderStatus;
  notes: string | null;
  canRefund: boolean;
}) {
  const [statusState, statusAction, statusPending] = useActionState<OrderActionState, FormData>(
    setOrderStatus,
    null,
  );
  const [noteState, noteAction, notePending] = useActionState<OrderActionState, FormData>(
    saveOrderNote,
    null,
  );

  const options = ORDER_STATUSES.filter(
    (s) => canRefund || (s !== "REFUNDED" && s !== "CANCELLED"),
  );

  return (
    <>
      <Card title="Update status">
        <form action={statusAction} className="space-y-3">
          <input type="hidden" name="id" value={orderId} />
          <FormMessage state={statusState} />
          <Select name="status" defaultValue={status}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0) + option.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={statusPending} className="w-full">
            {statusPending ? "Saving…" : "Update"}
          </Button>
          {!canRefund ? (
            <p className="text-[12px] text-neutral-500">
              Cancelling and refunding are limited to admins.
            </p>
          ) : (
            <p className="text-[12px] text-neutral-500">
              Marking an order refunded records it here — issue the money back in Stripe.
            </p>
          )}
        </form>
      </Card>

      <Card title="Internal note">
        <form action={noteAction} className="space-y-3">
          <input type="hidden" name="id" value={orderId} />
          <FormMessage state={noteState} />
          <Textarea name="notes" defaultValue={notes ?? ""} rows={4} placeholder="Only staff see this." />
          <Button type="submit" tone="secondary" disabled={notePending} className="w-full">
            {notePending ? "Saving…" : "Save note"}
          </Button>
        </form>
      </Card>
    </>
  );
}
