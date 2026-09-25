import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Thumb from "@/components/admin/Thumb";
import { verifyAdmin } from "@/lib/auth/dal";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsAdminPage() {
  await verifyAdmin();
  const { products } = await getContent();
  return (
    <>
      <PageHeader title="Products" description="Edit product text, images, applications and specification tables." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/products/${p.slug}`}
            className="group rounded-2xl border border-ink/[0.08] bg-white p-4 transition-shadow hover:shadow-md"
          >
            <Thumb src={p.image} alt={p.imageAlt} className="aspect-[4/3]" />
            <div className="mt-4 flex items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">{p.name}</h2>
              <span className="font-mono-label text-[11px] text-leaf">{p.tag}</span>
            </div>
            <p className="mt-1 text-sm text-muted-2">{p.short}</p>
            <p className="mt-3 text-xs text-muted-3">
              {p.specs.length} specs · {p.applications.length} applications
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
