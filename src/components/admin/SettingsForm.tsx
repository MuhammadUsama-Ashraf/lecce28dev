"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsState } from "@/app/admin/actions/settings";
import { Button, Card, Field, FormMessage, Input } from "@/components/admin/ui";
import { centsToInput } from "@/lib/money";

export default function SettingsForm({
  settings,
}: {
  settings: {
    freeShippingOverCents: number;
    flatShippingCents: number;
    taxPercent: number;
    orderPrefix: string;
    nextOrderNumber: number;
  };
}) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettings, null);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />

      <Card title="Shipping">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Flat shipping rate" hint="Charged when the order is below the threshold">
            <Input name="flatShipping" inputMode="decimal" defaultValue={centsToInput(settings.flatShippingCents)} />
          </Field>
          <Field label="Free shipping over" hint="The site advertises free shipping over $100">
            <Input
              name="freeShippingOver"
              inputMode="decimal"
              defaultValue={centsToInput(settings.freeShippingOverCents)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Tax">
        <Field label="Tax percent" hint="Applied after discounts. Leave at 0 to let Stripe Tax handle it.">
          <Input name="taxPercent" type="number" step="0.01" min={0} max={30} defaultValue={settings.taxPercent} />
        </Field>
      </Card>

      <Card title="Order numbers">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prefix" hint="Order numbers read like L28-1042">
            <Input name="orderPrefix" defaultValue={settings.orderPrefix} className="uppercase" />
          </Field>
          <Field label="Next number" hint="Increments automatically — read only">
            <Input value={settings.nextOrderNumber} disabled readOnly />
          </Field>
        </div>
      </Card>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
