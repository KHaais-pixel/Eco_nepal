import type { MetadataRoute } from "next";

const baseUrl = "https://www.econepalenergy.com";

const routes = [
  "",
  "/about",
  "/products",
  "/products/pyrolysis-oil",
  "/products/fuel-char",
  "/products/recovered-steel",
  "/lab-reports",
  "/process",
  "/sustainability",
  "/faq",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
