"use client";

import { FormEvent, useState } from "react";
import { enquiryRoles } from "@/lib/site-data";

type Errors = Record<string, string>;

export default function ContactForm() {
  const [role, setRole] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");

  const activeRole = enquiryRoles[role];

  function validate(formData: FormData): Errors {
    const newErrors: Errors = {};
    const fullName = String(formData.get("fullName") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const consent = formData.get("consent");

    if (!fullName) newErrors.fullName = "Please enter your full name.";
    if (!contact) newErrors.contact = "Please enter an email or phone number.";
    if (!message) newErrors.message = "Please enter your enquiry.";
    if (!consent) newErrors.consent = "Please provide consent to continue.";

    return newErrors;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return; // silently drop likely spam bot submissions
    const formData = new FormData(e.currentTarget);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  }

  const fieldClass =
    "border-0 border-b border-ink/25 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-4 focus:border-forest";

  if (submitted) {
    return (
      <div role="status" className="py-10">
        <div className="mb-4 font-display text-[48px] font-medium leading-none text-ink">
          Thank you.
        </div>
        <p className="text-base leading-[1.6] text-muted-1">
          Your enquiry has been received. This form is not yet connected to a live
          backend, so please also reach our team directly by phone or email to ensure
          time-sensitive enquiries are seen.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-semibold text-forest hover:text-leaf"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="font-mono-label mb-3 text-[11px] text-muted-3">I AM A</div>
      <div className="mb-8 flex flex-wrap gap-2">
        {enquiryRoles.map((r, i) => (
          <button
            key={r.label}
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

      <p className="mb-6 rounded-2xl border border-ink/[0.1] bg-cream px-4 py-3 text-xs leading-relaxed text-muted-3">
        This form is not yet connected to a live email backend. Please also contact us
        directly by phone or email for time-sensitive enquiries.
      </p>

      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          Full name
          <input name="fullName" type="text" autoComplete="name" placeholder="Your name" className={fieldClass} />
          {errors.fullName && <span className="text-xs font-normal text-red-600">{errors.fullName}</span>}
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          Company
          <input name="company" type="text" autoComplete="organization" placeholder="Company name" className={fieldClass} />
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          Email or phone
          <input name="contact" type="text" placeholder="How we reach you" className={fieldClass} />
          {errors.contact && <span className="text-xs font-normal text-red-600">{errors.contact}</span>}
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-semibold">
          {activeRole.msgLabel}
          <textarea
            name="message"
            rows={4}
            placeholder={activeRole.msgPlaceholder}
            className={`${fieldClass} resize-y`}
          />
          {errors.message && <span className="text-xs font-normal text-red-600">{errors.message}</span>}
        </label>

        {/* Honeypot field for basic spam protection — hidden from real users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-2">
          <input
            name="consent"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-ink/25 text-forest focus:ring-leaf/40"
          />
          I consent to Eco Nepal Energy Industries Pvt. Ltd. handling the information I
          have submitted in order to respond to my enquiry.
        </label>
        {errors.consent && <span className="-mt-3 text-xs text-red-600">{errors.consent}</span>}

        <button
          type="submit"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-forest px-7 py-[15px] text-[15px] font-semibold text-cream transition-colors hover:bg-leaf"
        >
          Send enquiry
        </button>
      </div>
    </form>
  );
}
