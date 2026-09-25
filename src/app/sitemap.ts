import type { MetadataRoute } from "next";
import { LOCALES, localizePath } from "@/i18n/config";

const baseUrl = "https://www.econepalenergy.com.np";

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
  return routes.flatMap((route) => {
    const path = route || "/";
    const languages = Object.fromEntries(LOCALES.map((l) => [l, `${baseUrl}${localizePath(l, path)}`]));
    return LOCALES.map((locale) => ({
      url: `${baseUrl}${localizePath(locale, path)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
