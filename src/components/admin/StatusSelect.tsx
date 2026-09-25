"use client";

import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/cms/types";

const LABELS: Record<EnquiryStatus, string> = { new: "New", contacted: "Contacted", closed: "Closed" };

/** Saves as soon as a new status is picked (the form's action is a server action). */
export default function StatusSelect({ value }: { value: EnquiryStatus }) {
  return (
    <select
      name="status"
      defaultValue={value}
      aria-label="Enquiry status"
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-forest"
    >
      {ENQUIRY_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
