import "server-only";

import type { Locale } from "@/i18n/config";
import { getContent } from "./store";
import { companyLinks, type Product, type ProductSlug, type SectionText, type Spec } from "./types";

// Nepali falls back to the English text wherever a Nepali field is empty,
// so a half-translated admin edit never leaves a blank on the page.
const pick = (locale: Locale, ne: string | undefined, en: string) => (locale === "ne" && ne?.trim() ? ne : en);

/** Company info in the same shape the public components already use. */
export async function getCompany(locale: Locale) {
  const { company } = await getContent();
  const ne = company.ne;
  return {
    legalName: pick(locale, ne.legalName, company.legalName),
    shortName: pick(locale, ne.shortName, company.shortName),
    address: pick(locale, ne.address, company.address),
    telephone: company.telephone,
    email: company.email,
    website: company.website,
    chairman: {
      name: pick(locale, ne.chairman.name, company.chairman.name),
      title: pick(locale, ne.chairman.title, company.chairman.title),
      quote: pick(locale, ne.chairman.quote, company.chairman.quote),
      paragraphs: locale === "ne" && ne.chairman.paragraphs.length ? ne.chairman.paragraphs : company.chairman.paragraphs,
    },
    ...companyLinks(company),
  };
}

export type LocalizedSpec = Omit<Spec, "propertyNe" | "valueNe">;
export type LocalizedProduct = Omit<Product, "ne" | "specs" | "sections"> & {
  specs: LocalizedSpec[];
  sections: SectionText[];
};

function localizeProduct(p: Product, locale: Locale): LocalizedProduct {
  const { ne, specs, sections, ...rest } = p;
  return {
    ...rest,
    name: pick(locale, ne.name, p.name),
    tag: pick(locale, ne.tag, p.tag),
    short: pick(locale, ne.short, p.short),
    description: pick(locale, ne.description, p.description),
    imageAlt: pick(locale, ne.imageAlt, p.imageAlt),
    applications: locale === "ne" && ne.applications.length ? ne.applications : p.applications,
    specs: specs.map(({ propertyNe, valueNe, ...s }) => ({
      ...s,
      property: pick(locale, propertyNe, s.property),
      value: pick(locale, valueNe, s.value),
    })),
    sections: sections.map(({ ne: sNe, ...s }) =>
      locale === "ne" && sNe?.title?.trim()
        ? { title: sNe.title, body: sNe.body, items: sNe.items.length ? sNe.items : s.items }
        : s
    ),
  };
}

export async function getProducts(locale: Locale) {
  return (await getContent()).products.map((p) => localizeProduct(p, locale));
}

export async function getProduct(slug: ProductSlug, locale: Locale) {
  const product = (await getContent()).products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return localizeProduct(product, locale);
}
