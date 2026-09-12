"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/admin/actions/auth";
import { Button, Field, FormMessage, Input } from "@/components/admin/ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, null);

  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <FormMessage state={state} />
      <Field label="Email">
        <Input name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
