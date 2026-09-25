"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Languages, Menu, X } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { localizePath, parsePath, type Locale } from "@/i18n/config";
import Button from "./Button";

export type HeaderLabels = {
  brandName: string;
  brandSub: string;
  homeAria: string;
  openMenu: string;
  closeMenu: string;
  requestQuote: string;
  allProducts: string;
  switchTo: string;
  switchToAria: string;
  items: { label: string; href: string; children?: { label: string; href: string; blurb: string }[] }[];
};

const OTHER: Record<Locale, Locale> = { en: "ne", ne: "en" };

/** Same page in the other language, e.g. /about ⇄ /ne/about. */
function LanguageToggle({ labels, className = "", onClick }: { labels: HeaderLabels; className?: string; onClick?: () => void }) {
  const { locale } = useLocale();
  const { path } = parsePath(usePathname());
  const other = OTHER[locale];
  return (
    <Link
      href={localizePath(other, path)}
      hrefLang={other}
      lang={other}
      aria-label={labels.switchToAria}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-forest hover:text-forest ${className}`}
    >
      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
      {labels.switchTo}
    </Link>
  );
}

export default function Header({ labels }: { labels: HeaderLabels }) {
  const pathname = usePathname();
  const { href } = useLocale();
  const { path } = parsePath(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
  };

  const isActive = (target: string) => (target === "/" ? path === "/" : path.startsWith(target));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/[0.08] bg-cream/[0.96] lg:bg-cream/[0.82] lg:backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href={href("/")} className="flex shrink-0 items-center gap-3" aria-label={labels.homeAria}>
          <Image src="/brand/logo-mark.png" alt="" width={240} height={254} priority className="h-[46px] w-auto shrink-0" />
          <span className="flex flex-col leading-[1.05]">
            <span className="text-[15px] font-bold tracking-tight text-ink">{labels.brandName}</span>
            <span className="font-mono-label text-[10px] text-muted-3">{labels.brandSub}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
          {labels.items.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 border-b-[1.5px] py-1.5 text-sm font-medium ${
                    isActive(item.href) ? "border-leaf text-ink" : "border-transparent text-muted-3"
                  }`}
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  onClick={() => setProductsOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {productsOpen && (
                  <div className="absolute left-0 top-full w-64 rounded-2xl border border-ink/10 bg-cream p-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={href(child.href)}
                        className="block rounded-xl px-3 py-2.5 text-sm hover:bg-stone"
                      >
                        <span className="block font-semibold text-ink">{child.label}</span>
                        <span className="block text-xs text-muted-3">{child.blurb}</span>
                      </Link>
                    ))}
                    <Link
                      href={href("/products")}
                      className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-forest hover:bg-stone"
                    >
                      {labels.allProducts}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={href(item.href)}
                className={`border-b-[1.5px] py-1.5 text-sm font-medium ${
                  isActive(item.href) ? "border-leaf text-ink" : "border-transparent text-muted-3"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          )}
          <LanguageToggle labels={labels} />
          <Button href={href("/contact")} variant="forest" className="px-[18px] py-2.5 text-sm">
            {labels.requestQuote}
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle labels={labels} />
          <button
            className="flex h-10 w-10 items-center justify-center text-ink"
            aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "max-h-[calc(100svh-72px)] overflow-y-auto overscroll-contain opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="space-y-1 border-t border-ink/[0.08] bg-cream px-5 py-4" aria-label="Mobile">
          {labels.items.map((item) =>
            item.children ? (
              <div key={item.href}>
                <button
                  className="flex w-full items-center justify-between rounded-md py-2.5 text-sm font-medium text-ink"
                  onClick={() => setMobileProductsOpen((v) => !v)}
                  aria-expanded={mobileProductsOpen}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden pl-3 transition-[max-height] duration-300 ${
                    mobileProductsOpen ? "max-h-72" : "max-h-0"
                  }`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={href(child.href)}
                      onClick={closeMobileMenu}
                      className="block py-2.5 text-sm text-muted-3 hover:text-forest"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={href(item.href)}
                onClick={closeMobileMenu}
                className="block py-2.5 text-sm font-medium text-ink hover:text-forest"
              >
                {item.label}
              </Link>
            )
          )}
          <div className="pt-3">
            <Button href={href("/contact")} variant="forest" className="w-full" onClick={closeMobileMenu}>
              {labels.requestQuote}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
