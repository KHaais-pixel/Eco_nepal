import Image from "next/image";
import Link from "next/link";
import { getCompany } from "@/lib/cms/content";
import { getI18n } from "@/i18n/server";

const year = new Date().getFullYear();

export default async function Footer() {
  const { locale, t, href } = await getI18n();
  const company = await getCompany(locale);
  const f = t.footer;
  const linkClass = "py-2.5 text-cream/70 hover:text-cream";
  return (
    <footer className="bg-ink text-muted-4">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-cream/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3.5 lg:col-span-2">
            <Link
              href={href("/")}
              aria-label={t.common.homeAria}
              className="mb-2 w-fit rounded-2xl bg-white p-4 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)]"
            >
              <Image src="/brand/logo-full.png" alt={f.logoAlt} width={640} height={656} className="h-auto w-[150px]" />
            </Link>
            <span className="text-[17px] font-bold text-cream">{company.shortName}</span>
            <span className="text-sm leading-relaxed">
              {f.tagline}
              <br />
              {company.address}
            </span>
          </div>

          <div className="flex flex-col text-sm">
            <span className="font-mono-label mb-1.5 text-[11px] text-leaf/80">{f.products}</span>
            <Link href={href("/products/pyrolysis-oil")} className={linkClass}>{f.pyrolysisOil}</Link>
            <Link href={href("/products/fuel-char")} className={linkClass}>{f.fuelChar}</Link>
            <Link href={href("/products/recovered-steel")} className={linkClass}>{f.recoveredSteel}</Link>
          </div>

          <div className="flex flex-col text-sm">
            <span className="font-mono-label mb-1.5 text-[11px] text-leaf/80">{f.company}</span>
            <Link href={href("/about")} className={linkClass}>{f.about}</Link>
            <Link href={href("/process")} className={linkClass}>{f.process}</Link>
            <Link href={href("/sustainability")} className={linkClass}>{f.sustainability}</Link>
            <Link href={href("/faq")} className={linkClass}>{f.faq}</Link>
            <Link href={href("/contact")} className={linkClass}>{f.contact}</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-7 text-[13px]">
          <span>© {year} {company.legalName}</span>
          <div className="flex flex-wrap gap-x-5 gap-y-0">
            <a href={company.telephoneHref} className={linkClass}>{company.telephone}</a>
            <a href={`mailto:${company.email}`} className={linkClass}>{company.email}</a>
            <a href={company.websiteHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {company.website}
            </a>
          </div>
          <span className="font-mono-label text-[11px]">27.5°N · 83.4°E</span>
        </div>
      </div>
    </footer>
  );
}
