"use client";

import { useActionState } from "react";
import { createStaff, type StaffState } from "@/app/admin/actions/staff";
import { Button, Field, FormMessage, Input, Select } from "@/components/admin/ui";

export default function InviteStaffForm() {
  const [state, action, pending] = useActionState<StaffState, FormData>(createStaff, null);

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <Field label="Name">
        <Input name="name" required />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required />
      </Field>
      <Field label="Role">
        <Select name="role" defaultValue="STAFF">
          <option value="STAFF">Staff — orders and stock</option>
          <option value="ADMIN">Admin — full store access</option>
          <option value="OWNER">Owner — can manage people</option>
        </Select>
      </Field>
      <Field label="Temporary password" hint="At least 10 characters with a number. Ask them to change it.">
        <Input name="password" type="text" autoComplete="new-password" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add person"}
      </Button>
    </form>
  );
}
