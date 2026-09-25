import type { Metadata } from "next";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusSelect from "@/components/admin/StatusSelect";
import { ConfirmButton } from "@/components/admin/fields";
import { removeEnquiry, updateEnquiryStatus } from "@/app/admin/actions";
import { verifyAdmin } from "@/lib/auth/dal";
import { listEnquiries } from "@/lib/cms/store";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Enquiries" };

const FILTERS: { value: EnquiryStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function contactHref(contact: string) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return `mailto:${contact}`;
  const digits = contact.replace(/[^\d+]/g, "");
  return digits.length >= 7 ? `tel:${digits}` : null;
}

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await verifyAdmin();
  const { status } = await searchParams;
  const filter = (ENQUIRY_STATUSES as readonly string[]).includes(status ?? "") ? (status as EnquiryStatus) : "all";
  const all = await listEnquiries();
  const enquiries = filter === "all" ? all : all.filter((e) => e.status === filter);

  return (
    <>
      <PageHeader title="Enquiries" description="Messages sent through the website's contact form, newest first." />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? all.length : all.filter((e) => e.status === f.value).length;
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f.value}`}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                active ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white text-ink hover:border-ink"
              }`}
            >
              {f.label} <span className={active ? "text-cream/70" : "text-muted-3"}>{count}</span>
            </Link>
          );
        })}
      </div>

      {enquiries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center text-sm text-muted-3">
          {all.length === 0 ? "No enquiries yet." : "No enquiries with this status."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {enquiries.map((e) => {
            const href = contactHref(e.contact);
            return (
              <li key={e.id} className="rounded-2xl border border-ink/[0.08] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {e.name}
                      {e.company && <span className="font-normal text-muted-3"> · {e.company}</span>}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-2">
                      <span className="font-mono-label text-[11px] text-leaf">{e.role.toUpperCase()}</span>
                      {" · "}
                      {href ? (
                        <a href={href} className="text-forest underline-offset-2 hover:underline">{e.contact}</a>
                      ) : (
                        e.contact
                      )}
                      {" · "}
                      {new Date(e.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={updateEnquiryStatus}>
                      <input type="hidden" name="id" value={e.id} />
                      <StatusSelect value={e.status} />
                    </form>
                    <form action={removeEnquiry}>
                      <input type="hidden" name="id" value={e.id} />
                      <ConfirmButton message={`Delete the enquiry from ${e.name}? This can't be undone.`}>
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{e.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
