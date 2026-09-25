import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ActionForm from "@/components/admin/ActionForm";
import PageHeader from "@/components/admin/PageHeader";
import Thumb from "@/components/admin/Thumb";
import { Field, SpecsEditor, SubmitButton, TextArea, TextInput } from "@/components/admin/fields";
import { saveProduct } from "@/app/admin/actions";
import { verifyAdmin } from "@/lib/auth/dal";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await verifyAdmin();
  const { slug } = await params;
  const product = (await getContent()).products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-2 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>
      <PageHeader title={product.name} description="Changes appear on the website as soon as you save.">
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-leaf"
        >
          View product page <ExternalLink className="h-4 w-4" />
        </Link>
      </PageHeader>

      <ActionForm action={saveProduct} className="max-w-[860px]">
        <input type="hidden" name="slug" value={product.slug} />
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-ink/[0.08] bg-white p-6 sm:p-8">
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Name">
              <TextInput name="name" defaultValue={product.name} required maxLength={80} />
            </Field>
            <Field label="Tag" hint="Short label, e.g. LIQUID FUEL">
              <TextInput name="tag" defaultValue={product.tag} maxLength={40} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Short summary" hint="Shown on the homepage product card.">
                <TextInput name="short" defaultValue={product.short} maxLength={200} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" hint="Shown on the products page and at the top of this product's page.">
                <TextArea name="description" defaultValue={product.description} rows={4} maxLength={1500} />
              </Field>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 border-t border-ink/[0.08] pt-8 sm:grid-cols-[220px_1fr]">
            <Thumb src={product.image} alt={product.imageAlt} className="aspect-square" />
            <div className="flex flex-col gap-5">
              <Field label="Replace image" hint="JPEG, PNG or WebP, up to 8 MB. Leave empty to keep the current image.">
                <TextInput name="image" type="file" accept="image/jpeg,image/png,image/webp" />
              </Field>
              <Field label="Image description (alt text)" hint="Describes the image for screen readers and search engines.">
                <TextInput name="imageAlt" defaultValue={product.imageAlt} maxLength={200} />
              </Field>
            </div>
          </section>

          <section className="border-t border-ink/[0.08] pt-8">
            <Field label="Applications" hint="One per line.">
              <TextArea name="applications" defaultValue={product.applications.join("\n")} rows={6} />
            </Field>
          </section>

          <section className="border-t border-ink/[0.08] pt-8">
            <p className="mb-3 text-[13px] font-semibold">Specifications</p>
            <SpecsEditor initial={product.specs} />
          </section>

          <div className="border-t border-ink/[0.08] pt-6">
            <SubmitButton>Save product</SubmitButton>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
