"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";
import { Field, SubmitButton, TextInput } from "./fields";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, { status: "idle" } as ActionState);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <Field label="Email">
        <TextInput name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Field label="Password">
        <TextInput name="password" type="password" autoComplete="current-password" required />
      </Field>
      <div className="pt-2">
        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
      </div>
    </form>
  );
}
