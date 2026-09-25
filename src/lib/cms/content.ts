import "server-only";

import { getContent } from "./store";
import { companyLinks, type ProductSlug } from "./types";

/** Company info in the same shape the public components already use. */
export async function getCompany() {
  const { company } = await getContent();
  return { ...company, ...companyLinks(company) };
}

export async function getProducts() {
  return (await getContent()).products;
}

export async function getProduct(slug: ProductSlug) {
  const product = (await getContent()).products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}

export async function getGallery() {
  return (await getContent()).gallery;
}
