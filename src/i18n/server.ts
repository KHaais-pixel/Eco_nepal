import "server-only";

import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, localizePath, type Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";
import ne from "./dictionaries/ne";

const dictionaries: Record<Locale, Dictionary> = { en, ne };

/** The current page's locale (from the `[lang]` root segment). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Locale, its dictionary, and an href helper, for any Server Component. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale], href: (path: string) => localizePath(locale, path) };
}
