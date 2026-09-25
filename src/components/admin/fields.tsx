"use client";

import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-4 focus:border-forest focus:ring-2 focus:ring-leaf/20";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-3">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${inputClass} resize-y ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function SubmitButton({ children, pendingLabel = "Saving…" }: { children: ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-leaf disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** A submit button that asks for confirmation first (for destructive actions). */
export function ConfirmButton({ message, children }: { message: string; children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-600/20 px-3.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

/** Editable property/value rows, submitted as specProperty[] / specValue[]. */
export function SpecsEditor({ initial }: { initial: { property: string; value: string }[] }) {
  const [rows, setRows] = useState(() =>
    initial.map((r) => ({ ...r, key: crypto.randomUUID() }))
  );
  const update = (key: string, patch: Partial<{ property: string; value: string }>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
          <input
            name="specProperty"
            value={row.property}
            onChange={(e) => update(row.key, { property: e.target.value })}
            placeholder="Property (e.g. Density)"
            aria-label="Specification property"
            className={inputClass}
          />
          <input
            name="specValue"
            value={row.value}
            onChange={(e) => update(row.key, { value: e.target.value })}
            placeholder="Value (e.g. 0.87–0.93 g/cc)"
            aria-label="Specification value"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setRows((rs) => rs.filter((r) => r.key !== row.key))}
            aria-label={`Remove ${row.property || "row"}`}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink/15 text-muted-3 hover:border-red-600/30 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((rs) => [...rs, { property: "", value: "", key: crypto.randomUUID() }])}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-forest hover:text-forest"
      >
        <Plus className="h-3.5 w-3.5" /> Add row
      </button>
    </div>
  );
}
