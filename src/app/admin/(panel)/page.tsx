import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { verifyAdmin } from "@/lib/auth/dal";
import { getContent, listEnquiries } from "@/lib/cms/store";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await verifyAdmin();
  const [enquiries, content] = await Promise.all([listEnquiries(), getContent()]);
  const newCount = enquiries.filter((e) => e.status === "new").length;
  const withImages = content.gallery.filter((g) => g.image).length;

  const stats = [
    { label: "New enquiries", value: newCount, href: "/admin/enquiries?status=new" },
    { label: "All enquiries", value: enquiries.length, href: "/admin/enquiries" },
    { label: "Gallery photos", value: `${withImages} / ${content.gallery.length}`, href: "/admin/gallery" },
    { label: "Products", value: content.products.length, href: "/admin/products" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of enquiries and site content." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-ink/[0.08] bg-white p-5 transition-shadow hover:shadow-md">
            <div className="font-display text-3xl font-semibold">{s.value}</div>
            <div className="mt-1 text-sm text-muted-3">{s.label}</div>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-semibold text-forest hover:text-leaf">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {enquiries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-muted-3">
            No enquiries yet. Submissions from the website&rsquo;s contact form will appear here.
          </p>
        ) : (
          <ul className="divide-y divide-ink/[0.08] overflow-hidden rounded-2xl border border-ink/[0.08] bg-white">
            {enquiries.slice(0, 5).map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {e.name}
                    {e.company && <span className="font-normal text-muted-3"> · {e.company}</span>}
                  </p>
                  <p className="truncate text-sm text-muted-2">{e.message}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-3">
                  {e.status === "new" && (
                    <span className="rounded-full bg-leaf px-2 py-0.5 font-semibold text-cream">New</span>
                  )}
                  {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
