"use client";

import { useActionState, useState } from "react";
import { useLocale } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { submitEnquiry, type EnquiryState } from "@/app/[lang]/contact/actions";

type FormLabels = Dictionary["contact"]["form"];

const initialState: EnquiryState = { status: "idle" };

const fieldClass =
  "border-0 border-b border-ink/25 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-4 focus:border-forest";

export default function ContactForm({ labels }: { labels: FormLabels }) {
  // Bumping the key remounts the form, resetting both the fields and the
  // server action state for "Submit another enquiry".
  const [formKey, setFormKey] = useState(0);
  return <EnquiryForm key={formKey} labels={labels} onReset={() => setFormKey((k) => k + 1)} />;
}

function EnquiryForm({ labels, onReset }: { labels: FormLabels; onReset: () => void }) {
  const { locale } = useLocale();
  const [role, setRole] = useState(0);
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const activeRole = labels.roles[role];
  const errors = state.errors ?? {};
  const values = state.values;

  if (state.status === "success") {
    return (
      <div role="status" className="py-10">
        <div className="mb-4 font-display text-[48px] font-medium leading-none text-ink">{labels.thanks}</div>
        <p className="text-base leading-[1.6] text-muted-1">{labels.thanksText}</p>
        <button type="button" onClick={onReset} className="mt-6 text-sm font-semibold text-forest hover:text-leaf">
          {labels.another}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="role" value={activeRole.key} />
      <div className="font-mono-label mb-3 text-[11px] text-muted-3">{labels.iAmA}</div>
      <div className="mb-8 flex flex-wrap gap-2">
        {labels.roles.map((r, i) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRole(i)}
            aria-pressed={role === i}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
              role === i ? "border-ink bg-ink text-cream" : "border-ink/20 text-ink"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mb-6 rounded-2xl border border-red-600/20 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          {labels.fullName}
          <input name="fullName" type="text" autoComplete="name" defaultValue={values?.fullName} placeholder={labels.namePlaceholder} className={fieldClass} />
          {errors.fullName && <span className="text-xs font-normal text-red-600">{errors.fullName}</span>}
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          {labels.company}
          <input name="company" type="text" autoComplete="organization" defaultValue={values?.company} placeholder={labels.companyPlaceholder} className={fieldClass} />
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          {labels.contact}
          <input name="contact" type="text" defaultValue={values?.contact} placeholder={labels.contactPlaceholder} className={fieldClass} />
          {errors.contact && <span className="text-xs font-normal text-red-600">{errors.contact}</span>}
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          {activeRole.msgLabel}
          <textarea
            name="message"
            rows={4}
            defaultValue={values?.message}
            placeholder={activeRole.msgPlaceholder}
            className={`${fieldClass} resize-y`}
          />
          {errors.message && <span className="text-xs font-normal text-red-600">{errors.message}</span>}
        </label>

        {/* Honeypot field for basic spam protection — hidden from real users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{labels.honeypot}</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-2">
          <input
            name="consent"
            type="checkbox"
            defaultChecked={values?.consent}
            className="mt-1 h-4 w-4 rounded border-ink/25 text-forest focus:ring-leaf/40"
          />
          {labels.consent}
        </label>
        {errors.consent && <span className="-mt-3 text-xs text-red-600">{errors.consent}</span>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-forest px-7 py-[15px] text-[15px] font-semibold text-cream transition-colors hover:bg-leaf disabled:opacity-60"
        >
          {pending ? labels.sending : labels.send}
        </button>
      </div>
    </form>
  );
}
