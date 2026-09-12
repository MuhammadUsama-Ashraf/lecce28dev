"use client";

import { useActionState, useState } from "react";
import { saveSale, type SaleFormState } from "@/app/admin/actions/sales";
import { Button, Card, Checkbox, Field, FormMessage, Input, Select } from "@/components/admin/ui";
import { centsToInput } from "@/lib/money";

export type SaleValues = {
  id?: string;
  name: string;
  badge: string | null;
  discountType: string;
  value: number;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
  appliesToAll: boolean;
  productIds: string[];
};

export const BLANK_SALE: SaleValues = {
  name: "",
  badge: "Sale",
  discountType: "PERCENT",
  value: 15,
  startsAt: null,
  endsAt: null,
  isActive: true,
  appliesToAll: false,
  productIds: [],
};

function toLocalInput(date: Date | null) {
  if (!date) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function SaleForm({
  sale,
  products,
}: {
  sale: SaleValues;
  products: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<SaleFormState, FormData>(saveSale, null);
  const [type, setType] = useState(sale.discountType);
  const [all, setAll] = useState(sale.appliesToAll);

  return (
    <form action={action} className="space-y-5">
      {sale.id ? <input type="hidden" name="id" value={sale.id} /> : null}
      <FormMessage state={state} />

      <Card title="The markdown" description="Applies automatically — customers do not type anything.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" hint="Internal, and shown in reports">
            <Input name="name" defaultValue={sale.name} required placeholder="Spring refresh" />
          </Field>
          <Field label="Badge" hint="Shown on the product card, for example Sale">
            <Input name="badge" defaultValue={sale.badge ?? ""} />
          </Field>
          <Field label="Discount type">
            <Select name="discountType" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="PERCENT">Percentage off</option>
              <option value="FIXED">Fixed amount off</option>
            </Select>
          </Field>
          <Field
            label={type === "PERCENT" ? "Percent off" : "Amount off"}
            hint={type === "PERCENT" ? "1–100" : "In dollars"}
          >
            <Input
              name="value"
              inputMode="decimal"
              defaultValue={type === "PERCENT" ? String(sale.value) : centsToInput(sale.value)}
              required
            />
          </Field>
          <Field label="Starts at">
            <Input name="startsAt" type="datetime-local" defaultValue={toLocalInput(sale.startsAt)} />
          </Field>
          <Field label="Ends at">
            <Input name="endsAt" type="datetime-local" defaultValue={toLocalInput(sale.endsAt)} />
          </Field>
        </div>
        <div className="mt-4">
          <Checkbox name="isActive" label="Active" defaultChecked={sale.isActive} />
        </div>
      </Card>

      <Card title="What goes on sale">
        <Checkbox
          name="appliesToAll"
          label="Every product (storewide)"
          checked={all}
          onChange={(e) => setAll(e.target.checked)}
        />
        {!all ? (
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-neutral-200 p-3">
            {products.map((product) => (
              <Checkbox
                key={product.id}
                name="productIds"
                value={product.id}
                label={product.name}
                defaultChecked={sale.productIds.includes(product.id)}
              />
            ))}
          </div>
        ) : null}
        <p className="mt-3 text-[12px] text-neutral-500">
          When several sales cover the same product the customer gets the lowest resulting price.
        </p>
      </Card>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : sale.id ? "Save changes" : "Create sale"}
      </Button>
    </form>
  );
}
