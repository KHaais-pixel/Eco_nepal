import type { Metadata } from "next";
import ActionForm from "@/components/admin/ActionForm";
import PageHeader from "@/components/admin/PageHeader";
import { Field, SubmitButton, TextArea, TextInput } from "@/components/admin/fields";
import { saveCompany } from "@/app/admin/actions";
import { verifyAdmin } from "@/lib/auth/dal";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = { title: "Company info" };

export default async function CompanyAdminPage() {
  await verifyAdmin();
  const { company } = await getContent();

  return (
    <>
      <PageHeader
        title="Company info"
        description="Contact details shown in the footer, contact page and About page, and the chairman's message."
      />
      <ActionForm action={saveCompany} className="max-w-[860px]">
        <div className="flex flex-col gap-8 rounded-2xl border border-ink/[0.08] bg-white p-6 sm:p-8">
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <h2 className="font-display text-lg font-semibold sm:col-span-2">Contact details</h2>
            <Field label="Legal company name">
              <TextInput name="legalName" defaultValue={company.legalName} required />
            </Field>
            <Field label="Short name">
              <TextInput name="shortName" defaultValue={company.shortName} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <TextInput name="address" defaultValue={company.address} />
              </Field>
            </div>
            <Field label="Telephone">
              <TextInput name="telephone" defaultValue={company.telephone} />
            </Field>
            <Field label="Mobile numbers" hint="One per line.">
              <TextArea name="mobiles" defaultValue={company.mobiles.join("\n")} rows={3} />
            </Field>
            <Field label="Email">
              <TextInput name="email" type="email" defaultValue={company.email} />
            </Field>
            <Field label="Website">
              <TextInput name="website" defaultValue={company.website} />
            </Field>
          </section>

          <section className="grid grid-cols-1 gap-5 border-t border-ink/[0.08] pt-8 sm:grid-cols-2">
            <h2 className="font-display text-lg font-semibold sm:col-span-2">Chairman&rsquo;s message</h2>
            <Field label="Name">
              <TextInput name="chairmanName" defaultValue={company.chairman.name} />
            </Field>
            <Field label="Title">
              <TextInput name="chairmanTitle" defaultValue={company.chairman.title} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Highlighted quote">
                <TextArea name="chairmanQuote" defaultValue={company.chairman.quote} rows={3} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Message" hint="Leave a blank line between paragraphs.">
                <TextArea name="chairmanMessage" defaultValue={company.chairman.paragraphs.join("\n\n")} rows={10} />
              </Field>
            </div>
          </section>

          <div className="border-t border-ink/[0.08] pt-6">
            <SubmitButton>Save company info</SubmitButton>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
