import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import ActionForm from "@/components/admin/ActionForm";
import PageHeader from "@/components/admin/PageHeader";
import Thumb from "@/components/admin/Thumb";
import { ConfirmButton, Field, Select, SubmitButton, TextInput } from "@/components/admin/fields";
import { addGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/app/admin/actions";
import { verifyAdmin } from "@/lib/auth/dal";
import { getContent } from "@/lib/cms/store";
import { GALLERY_CATEGORIES } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Gallery" };

function CategoryOptions() {
  return GALLERY_CATEGORIES.map((c) => (
    <option key={c} value={c}>
      {c}
    </option>
  ));
}

export default async function GalleryAdminPage() {
  await verifyAdmin();
  const { gallery } = await getContent();

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Upload photos to the website gallery. Items marked “No image yet” show as placeholders on the site until you add a photo."
      />

      <section className="mb-10 rounded-2xl border border-ink/[0.08] bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-display text-lg font-semibold">Add a photo</h2>
        <ActionForm action={addGalleryItem}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Image" hint="JPEG, PNG or WebP, up to 8 MB.">
              <TextInput name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
            </Field>
            <Field label="Title">
              <TextInput name="title" required maxLength={120} placeholder="e.g. Pyrolysis reactors" />
            </Field>
            <Field label="Category">
              <Select name="category" defaultValue={GALLERY_CATEGORIES[0]}>
                <CategoryOptions />
              </Select>
            </Field>
            <Field label="Image description (alt text)" hint="Optional — defaults to the title.">
              <TextInput name="alt" maxLength={200} />
            </Field>
          </div>
          <div className="mt-6">
            <SubmitButton pendingLabel="Uploading…">Upload photo</SubmitButton>
          </div>
        </ActionForm>
      </section>

      <h2 className="mb-4 font-display text-lg font-semibold">{gallery.length} gallery items</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {gallery.map((item) => (
          <li key={item.id} className="rounded-2xl border border-ink/[0.08] bg-white p-4">
            <Thumb src={item.image} alt={item.alt} className="aspect-[4/3]" />
            <ActionForm action={updateGalleryItem} className="mt-4">
              <input type="hidden" name="id" value={item.id} />
              <div className="flex flex-col gap-3">
                <Field label="Title">
                  <TextInput name="title" defaultValue={item.title} required maxLength={120} />
                </Field>
                <Field label="Category">
                  <Select name="category" defaultValue={item.category}>
                    <CategoryOptions />
                  </Select>
                </Field>
                <Field label="Alt text">
                  <TextInput name="alt" defaultValue={item.alt} maxLength={200} />
                </Field>
                <Field label={item.image ? "Replace image" : "Add image"}>
                  <TextInput name="image" type="file" accept="image/jpeg,image/png,image/webp" />
                </Field>
              </div>
              <div className="mt-4">
                <SubmitButton>Save</SubmitButton>
              </div>
            </ActionForm>
            <form action={deleteGalleryItem} className="mt-3 border-t border-ink/[0.08] pt-3">
              <input type="hidden" name="id" value={item.id} />
              <ConfirmButton message={`Remove “${item.title}” from the gallery?`}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remove
              </ConfirmButton>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
