/** One specification row. Method and unit are optional (lab-test style rows). */
export type Spec = { property: string; value: string; method?: string; unit?: string };

export type ProductSlug = "pyrolysis-oil" | "fuel-char" | "recovered-steel";

/**
 * A block of product page copy: a heading, optional paragraphs (separated
 * by blank lines) and an optional list. Short list items render as chips,
 * longer ones as a checklist.
 */
export type ProductSection = { title: string; body?: string; items: string[] };

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
};

export type Chairman = {
  name: string;
  title: string;
  quote: string;
  paragraphs: string[];
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
export function companyLinks(c: CompanyInfo) {
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
