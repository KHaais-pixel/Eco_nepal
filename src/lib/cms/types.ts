export type Spec = { property: string; value: string };

export type ProductSlug = "pyrolysis-oil" | "fuel-char" | "recovered-steel";

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

export const GALLERY_CATEGORIES = [
  "Factory",
  "Machinery",
  "Production Process",
  "Products",
  "Recovered Steel",
  "Team & Workers",
  "Packaging & Dispatch",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  alt: string;
  image: string | null;
};

export type SiteContent = {
  company: CompanyInfo;
  products: Product[];
  gallery: GalleryItem[];
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
