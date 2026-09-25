export const LOCALES = ["en", "ne"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** Prefix an internal href for the given locale. English keeps clean root URLs. */
export function localizePath(locale: Locale, href: string) {
  if (locale === DEFAULT_LOCALE) return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** Split a pathname into its locale and the locale-free path. */
export function parsePath(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, path: `/${rest.join("/")}` };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Fill `{name}` placeholders in a dictionary string. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
