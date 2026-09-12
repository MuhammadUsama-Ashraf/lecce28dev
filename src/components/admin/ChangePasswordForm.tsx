"use client";

import { useActionState } from "react";
import { changeOwnPassword, type StaffState } from "@/app/admin/actions/staff";
import { Button, Field, FormMessage, Input } from "@/components/admin/ui";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState<StaffState, FormData>(changeOwnPassword, null);

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <Field label="Current password">
        <Input name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="New password" hint="At least 10 characters, with a letter and a number.">
        <Input name="newPassword" type="password" autoComplete="new-password" required />
      </Field>
      <Button type="submit" tone="secondary" disabled={pending}>
        {pending ? "Changing…" : "Change password"}
      </Button>
    </form>
  );
}
