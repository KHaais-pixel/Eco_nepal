"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, localizePath, type Locale } from "./config";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Current locale and an href helper, for Client Components. */
export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, href: (path: string) => localizePath(locale, path) };
}
