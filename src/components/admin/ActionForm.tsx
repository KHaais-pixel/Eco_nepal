"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "@/app/admin/actions";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;

/**
 * Wraps a server action form with a success/error message area. File inputs
 * work without an encType: React sends server-action forms as multipart.
 */
export default function ActionForm({
  action,
  children,
  className = "",
}: {
  action: Action;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as ActionState);
  return (
    <form action={formAction} className={className}>
      {state.status !== "idle" && state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`mb-5 rounded-xl px-4 py-3 text-sm ${
            state.status === "error" ? "bg-red-50 text-red-700" : "bg-leaf/10 text-forest"
          }`}
        >
          {state.message}
        </p>
      )}
      {children}
    </form>
  );
}
