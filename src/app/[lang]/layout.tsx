import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EcoRibbon from "@/components/EcoRibbon";
import { LocaleProvider } from "@/i18n/client";
import { LOCALES, isLocale, localizePath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { fontClasses } from "../fonts";
import "../globals.css";

// Public pages are prerendered from the admin-editable content in DATA_DIR.
// Admin saves refresh them immediately (revalidatePath); this is a safety net
// so a build made without the live data catches up within 5 minutes.
export const revalidate = 300;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SITE = "https://www.econepalenergy.com.np";

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(SITE),
    title: { default: t.siteTitle, template: t.titleTemplate },
    description: t.description,
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      url: localizePath(lang, "/"),
      siteName: t.ogTitle,
      locale: t.ogLocale,
      type: "website",
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <html lang={locale}>
      <body className={fontClasses}>
        <LocaleProvider locale={locale}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
          >
            {t.common.skipToContent}
          </a>
          {/* Relative wrapper so the decorative ribbon spans exactly the page. */}
          <div className="relative">
            <Header
              labels={{
                brandName: t.common.brandName,
                brandSub: t.common.brandSub,
                homeAria: t.common.homeAria,
                openMenu: t.common.openMenu,
                closeMenu: t.common.closeMenu,
                requestQuote: t.common.requestQuote,
                allProducts: t.common.allProducts,
                switchTo: t.common.switchTo,
                switchToAria: t.common.switchToAria,
                items: [
                  { label: t.nav.home, href: "/" },
                  { label: t.nav.about, href: "/about" },
                  { label: t.nav.products, href: "/products", children: t.nav.productLinks },
                  { label: t.nav.process, href: "/process" },
                  { label: t.nav.sustainability, href: "/sustainability" },
                  { label: t.nav.faq, href: "/faq" },
                ],
              }}
            />
            <main id="main-content">{children}</main>
            <Footer />
            <EcoRibbon />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
