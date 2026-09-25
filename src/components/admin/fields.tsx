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

type SpecRow = { property: string; value: string; method?: string; unit?: string };

/**
 * Editable specification rows, submitted as specProperty[] / specMethod[] /
 * specUnit[] / specValue[]. Method and unit are optional.
 */
export function SpecsEditor({ initial }: { initial: SpecRow[] }) {
  const [rows, setRows] = useState(() =>
    initial.map((r) => ({ property: r.property, value: r.value, method: r.method ?? "", unit: r.unit ?? "", key: crypto.randomUUID() }))
  );
  const update = (key: string, patch: Partial<SpecRow>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const cols = "grid grid-cols-2 gap-2 sm:grid-cols-[1.3fr_1fr_0.7fr_1fr_auto]";

  return (
    <div className="flex flex-col gap-2">
      <div className={`${cols} font-mono-label hidden text-[11px] text-muted-3 sm:grid`}>
        <span>TEST PARAMETER</span>
        <span>METHOD (OPTIONAL)</span>
        <span>UNIT (OPTIONAL)</span>
        <span>VALUE</span>
        <span className="w-11" />
      </div>
      {rows.map((row) => (
        <div key={row.key} className={cols}>
          <input
            name="specProperty"
            value={row.property}
            onChange={(e) => update(row.key, { property: e.target.value })}
            placeholder="e.g. Density at 15°C"
            aria-label="Test parameter"
            className={inputClass}
          />
          <input
            name="specMethod"
            value={row.method}
            onChange={(e) => update(row.key, { method: e.target.value })}
            placeholder="e.g. ASTM D 1298"
            aria-label="Test method"
            className={inputClass}
          />
          <input
            name="specUnit"
            value={row.unit}
            onChange={(e) => update(row.key, { unit: e.target.value })}
            placeholder="e.g. g/cc"
            aria-label="Unit"
            className={inputClass}
          />
          <input
            name="specValue"
            value={row.value}
            onChange={(e) => update(row.key, { value: e.target.value })}
            placeholder="e.g. 0.87–0.93"
            aria-label="Value"
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
        onClick={() =>
          setRows((rs) => [...rs, { property: "", value: "", method: "", unit: "", key: crypto.randomUUID() }])
        }
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-forest hover:text-forest"
      >
        <Plus className="h-3.5 w-3.5" /> Add row
      </button>
    </div>
  );
}

type SectionRow = { title: string; body?: string; items: string[] };

/**
 * Editable product page sections, submitted as sectionTitle[] /
 * sectionBody[] / sectionItems[] (items one per line).
 */
export function SectionsEditor({ initial }: { initial: SectionRow[] }) {
  const [rows, setRows] = useState(() =>
    initial.map((r) => ({ title: r.title, body: r.body ?? "", items: r.items.join("\n"), key: crypto.randomUUID() }))
  );
  const update = (key: string, patch: Partial<{ title: string; body: string; items: string }>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const move = (index: number, by: number) =>
    setRows((rs) => {
      const next = [...rs];
      const [row] = next.splice(index, 1);
      next.splice(index + by, 0, row);
      return next;
    });

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, i) => (
        <div key={row.key} className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-stone/60 p-4">
          <div className="flex items-center gap-2">
            <input
              name="sectionTitle"
              value={row.title}
              onChange={(e) => update(row.key, { title: e.target.value })}
              placeholder="Heading, e.g. Benefits of carbon powder"
              aria-label="Section heading"
              className={`${inputClass} font-semibold`}
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Move section up"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink/15 text-muted-3 hover:text-ink disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
              aria-label="Move section down"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink/15 text-muted-3 hover:text-ink disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => setRows((rs) => rs.filter((r) => r.key !== row.key))}
              aria-label={`Remove ${row.title || "section"}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink/15 text-muted-3 hover:border-red-600/30 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            name="sectionBody"
            value={row.body}
            onChange={(e) => update(row.key, { body: e.target.value })}
            rows={3}
            placeholder="Paragraphs (optional). Leave a blank line between paragraphs."
            aria-label="Section text"
            className={`${inputClass} resize-y`}
          />
          <textarea
            name="sectionItems"
            value={row.items}
            onChange={(e) => update(row.key, { items: e.target.value })}
            rows={4}
            placeholder="List items (optional), one per line. Short items show as tags, longer ones as a checklist."
            aria-label="Section list items"
            className={`${inputClass} resize-y`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((rs) => [...rs, { title: "", body: "", items: "", key: crypto.randomUUID() }])}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-forest hover:text-forest"
      >
        <Plus className="h-3.5 w-3.5" /> Add section
      </button>
    </div>
  );
}
