"use client";

import { useTransition } from "react";
import { deleteSale } from "@/app/admin/actions/sales";
import { Button, Card } from "@/components/admin/ui";

export default function SaleDangerZone({ saleId }: { saleId: string }) {
  const [pending, start] = useTransition();
  return (
    <Card title="Danger zone">
      <p className="mb-3 text-[13px] text-neutral-600">
        Deleting a sale restores full prices immediately. Past orders keep the price that was charged.
      </p>
      <Button
        tone="danger"
        disabled={pending}
        onClick={() => {
          if (window.confirm("Delete this sale?")) start(() => void deleteSale(saleId));
        }}
      >
        {pending ? "Deleting…" : "Delete sale"}
      </Button>
    </Card>
  );
}
