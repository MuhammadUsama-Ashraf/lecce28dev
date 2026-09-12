"use client";

import { useTransition } from "react";
import { deletePromoCode } from "@/app/admin/actions/promoCodes";
import { Button, Card } from "@/components/admin/ui";

export default function PromoDangerZone({
  promoId,
  hasOrders,
}: {
  promoId: string;
  hasOrders: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <Card title="Danger zone">
      <p className="mb-3 text-[13px] text-neutral-600">
        {hasOrders
          ? "This code has been used on orders, so it will be disabled rather than deleted — the orders keep pointing at it."
          : "This code has never been used and can be deleted outright."}
      </p>
      <Button
        tone="danger"
        disabled={pending}
        onClick={() => {
          if (window.confirm(hasOrders ? "Disable this promo code?" : "Delete this promo code?")) {
            start(() => void deletePromoCode(promoId));
          }
        }}
      >
        {pending ? "Working…" : hasOrders ? "Disable code" : "Delete code"}
      </Button>
    </Card>
  );
}
