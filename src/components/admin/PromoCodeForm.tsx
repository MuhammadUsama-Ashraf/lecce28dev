"use client";

import { useActionState, useState } from "react";
import { savePromoCode, type PromoFormState } from "@/app/admin/actions/promoCodes";
import { Button, Card, Checkbox, Field, FormMessage, Input, Select } from "@/components/admin/ui";
import { centsToInput } from "@/lib/money";

export type PromoValues = {
  id?: string;
  code: string;
  description: string | null;
  discountType: string;
  value: number;
  minSubtotalCents: number | null;
  maxRedemptions: number | null;
  perCustomerLimit: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
  appliesToAll: boolean;
  productIds: string[];
};

export const BLANK_PROMO: PromoValues = {
  code: "",
  description: null,
  discountType: "PERCENT",
  value: 10,
  minSubtotalCents: null,
  maxRedemptions: null,
  perCustomerLimit: null,
  startsAt: null,
  endsAt: null,
  isActive: true,
  appliesToAll: true,
  productIds: [],
};

/** <input type="datetime-local"> wants a local yyyy-MM-ddTHH:mm string. */
function toLocalInput(date: Date | null) {
  if (!date) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function PromoCodeForm({
  promo,
  products,
}: {
  promo: PromoValues;
  products: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<PromoFormState, FormData>(savePromoCode, null);
  const [type, setType] = useState(promo.discountType);
  const [all, setAll] = useState(promo.appliesToAll);

  return (
    <form action={action} className="space-y-5">
      {promo.id ? <input type="hidden" name="id" value={promo.id} /> : null}
      <FormMessage state={state} />

      <Card title="The code">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Code" hint="Customers type this at checkout. Stored upper-case.">
            <Input
              name="code"
              defaultValue={promo.code}
              required
              className="font-mono uppercase"
              placeholder="WELCOME10"
            />
          </Field>
          <Field label="Internal description">
            <Input name="description" defaultValue={promo.description ?? ""} placeholder="First-order discount" />
          </Field>
          <Field label="Discount type">
            <Select name="discountType" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="PERCENT">Percentage off</option>
              <option value="FIXED">Fixed amount off</option>
            </Select>
          </Field>
          <Field
            label={type === "PERCENT" ? "Percent off" : "Amount off"}
            hint={type === "PERCENT" ? "1–100" : "In dollars, e.g. 15"}
          >
            <Input
              name="value"
              inputMode="decimal"
              defaultValue={type === "PERCENT" ? String(promo.value) : centsToInput(promo.value)}
              required
            />
          </Field>
        </div>
        <div className="mt-4">
          <Checkbox name="isActive" label="Active" defaultChecked={promo.isActive} />
        </div>
      </Card>

      <Card title="Conditions" description="Leave a field empty for no limit.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Minimum order subtotal" hint="In dollars">
            <Input name="minSubtotal" inputMode="decimal" defaultValue={centsToInput(promo.minSubtotalCents)} />
          </Field>
          <Field label="Maximum total redemptions">
            <Input name="maxRedemptions" type="number" min={1} defaultValue={promo.maxRedemptions ?? ""} />
          </Field>
          <Field label="Starts at">
            <Input name="startsAt" type="datetime-local" defaultValue={toLocalInput(promo.startsAt)} />
          </Field>
          <Field label="Ends at">
            <Input name="endsAt" type="datetime-local" defaultValue={toLocalInput(promo.endsAt)} />
          </Field>
        </div>
      </Card>

      <Card title="What it applies to">
        <Checkbox
          name="appliesToAll"
          label="Every product"
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
                defaultChecked={promo.productIds.includes(product.id)}
              />
            ))}
          </div>
        ) : null}
      </Card>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : promo.id ? "Save changes" : "Create promo code"}
      </Button>
    </form>
  );
}
