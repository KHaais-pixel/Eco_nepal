import Link from "next/link";
import { company } from "@/lib/site-data";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-ink text-muted-4">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-cream/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3.5 lg:col-span-2">
            <span className="text-[17px] font-bold text-cream">Eco Nepal Energy</span>
            <span className="text-sm leading-relaxed">
              Waste tyre recycling &amp; pyrolysis.
              <br />
              {company.address}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <span className="font-mono-label mb-1 text-[11px] text-leaf/80">PRODUCTS</span>
            <Link href="/products/pyrolysis-oil" className="hover:text-cream">Pyrolysis oil</Link>
            <Link href="/products/fuel-char" className="hover:text-cream">Fuel char</Link>
            <Link href="/products/recovered-steel" className="hover:text-cream">Recovered steel</Link>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <span className="font-mono-label mb-1 text-[11px] text-leaf/80">COMPANY</span>
            <Link href="/about" className="hover:text-cream">About</Link>
            <Link href="/process" className="hover:text-cream">Process</Link>
            <Link href="/sustainability" className="hover:text-cream">Sustainability</Link>
            <Link href="/gallery" className="hover:text-cream">Gallery</Link>
            <Link href="/faq" className="hover:text-cream">FAQ</Link>
            <Link href="/contact" className="hover:text-cream">Contact</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-7 text-[13px]">
          <span>© {year} {company.legalName}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href={company.telephoneHref} className="hover:text-cream">{company.telephone}</a>
            <a href={`mailto:${company.email}`} className="hover:text-cream">{company.email}</a>
            <a href={company.websiteHref} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
              {company.website}
            </a>
          </div>
          <span className="font-mono-label text-[11px]">27.5°N · 83.4°E</span>
        </div>
      </div>
    </footer>
  );
}
