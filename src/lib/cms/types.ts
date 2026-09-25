/**
 * One specification row. Method and unit are optional (lab-test style rows).
 * `propertyNe` / `valueNe` hold the Nepali text for the same row; the
 * English text is shown on Nepali pages where they are empty.
 */
export type Spec = { property: string; value: string; method?: string; unit?: string; propertyNe?: string; valueNe?: string };

export type ProductSlug = "pyrolysis-oil" | "fuel-char" | "recovered-steel";

/** Text of a product page section in one language. */
export type SectionText = { title: string; body?: string; items: string[] };

/**
 * A block of product page copy: a heading, optional paragraphs (separated
 * by blank lines) and an optional list. Short list items render as chips,
 * longer ones as a checklist. `ne` is the Nepali version of the block.
 */
export type ProductSection = SectionText & { ne?: SectionText };

/** Nepali text for a product's own fields. */
export type ProductNe = {
  name: string;
  tag: string;
  short: string;
  description: string;
  imageAlt: string;
  applications: string[];
};

export type Product = {
  slug: ProductSlug;
  num: string;
  name: string;
  tag: string;
  short: string;
  description: string;
  image: string | null;
  imageAlt: string;
  applications: string[];
  specs: Spec[];
  sections: ProductSection[];
  ne: ProductNe;
};

export type Chairman = {
  name: string;
  title: string;
  quote: string;
  paragraphs: string[];
};

/** Nepali text for the company fields that are language-specific. */
export type CompanyNe = {
  legalName: string;
  shortName: string;
  address: string;
  chairman: Chairman;
};

export type CompanyInfo = {
  legalName: string;
  shortName: string;
  address: string;
  telephone: string;
  mobiles: string[];
  email: string;
  website: string;
  chairman: Chairman;
  ne: CompanyNe;
};

export type SiteContent = {
  company: CompanyInfo;
  products: Product[];
};

export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type Enquiry = {
  id: string;
  createdAt: string;
  role: string;
  name: string;
  company: string;
  contact: string;
  message: string;
  status: EnquiryStatus;
};

/** Derived, display-ready company links (tel:/https:). */
export function companyLinks(c: Pick<CompanyInfo, "telephone" | "mobiles" | "website">) {
  const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
  const mobileTel = (n: string) => {
    const digits = n.replace(/[^\d+]/g, "");
    return `tel:${digits.startsWith("+") ? digits : `+977${digits}`}`;
  };
  return {
    telephoneHref: tel(c.telephone),
    mobiles: c.mobiles.map((m) => ({ label: m, href: mobileTel(m) })),
    websiteHref: c.website.startsWith("http") ? c.website : `https://${c.website}`,
  };
}
