"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/actions/products";
import { Button, Card } from "@/components/admin/ui";

export default function ProductDangerZone({
  productId,
  hasOrders,
}: {
  productId: string;
  hasOrders: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <Card title="Danger zone">
      <p className="mb-3 text-[13px] text-neutral-600">
        {hasOrders
          ? "This product appears on existing orders, so it will be archived rather than deleted — order history stays intact."
          : "This product has never been ordered, so it can be deleted outright."}
      </p>
      <Button
        tone="danger"
        disabled={pending}
        onClick={() => {
          const message = hasOrders
            ? "Archive this product? It will disappear from the shop but stay on past orders."
            : "Delete this product permanently?";
          if (window.confirm(message)) start(() => void deleteProduct(productId));
        }}
      >
        {pending ? "Working…" : hasOrders ? "Archive product" : "Delete product"}
      </Button>
    </Card>
  );
}
