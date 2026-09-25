import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import CTABanner from "@/components/CTABanner";
import { SpecTable, FuelComparisonTable } from "@/components/SpecTable";
import { brochure } from "@/lib/site-data";
import { getProduct } from "@/lib/cms/content";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.labReports.metaTitle, description: t.labReports.metaDescription };
}

function ReportHeading({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="font-mono-label mb-4 text-xs text-leaf">{label}</div>
        <h2 className="max-w-[760px] font-display text-[clamp(34px,4vw,56px)] font-semibold leading-none tracking-[-0.02em] text-ink">
          {title}
        </h2>
      </div>
      {children}
    </RevealOnScroll>
  );
}

export default async function LabReportsPage() {
  const { locale, t, href } = await getI18n();
  const l = t.labReports;
  const [oil, fuelChar] = await Promise.all([getProduct("pyrolysis-oil", locale), getProduct("fuel-char", locale)]);
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-[clamp(64px,8vw,110px)] pt-[clamp(120px,16vh,170px)] sm:px-8">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href={href("/products")} className="-my-3 inline-block py-3 text-leaf">{t.product.breadcrumb}</Link>
            <span>/</span>
            <span>{l.breadcrumb}</span>
          </div>
          <h1 className="mb-8 max-w-[980px] font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {l.title.pre}
            <em className="not-italic text-leaf">{l.title.em}</em>
            {l.title.post}
          </h1>
          <p className="mb-8 max-w-[620px] text-lg leading-[1.6] text-muted-1">{l.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={href("/contact")} variant="dark">{l.requestBatch}</Button>
            <Button href={brochure.pdf} variant="outline" external>{l.downloadBrochure}</Button>
          </div>
        </RevealOnScroll>
      </section>

      {/* Report 01 — TPO specification */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <ReportHeading label={fmt(l.report, { n: "01" })} title={l.r1Title} />
          <RevealOnScroll delay={80}>
            <SpecTable rows={oil.specs} valueLabel={l.r1ValueLabel} caption={l.r1Caption} />
          </RevealOnScroll>
        </Container>
      </section>

      {/* Report 02 — comparison */}
      <Container className="py-[clamp(80px,10vw,130px)]">
        <ReportHeading label={fmt(l.report, { n: "02" })} title={l.r2Title}>
          <p className="max-w-[360px] text-[15px] leading-[1.6] text-muted-2">{l.r2Note}</p>
        </ReportHeading>
        <RevealOnScroll delay={80}>
          <FuelComparisonTable />
        </RevealOnScroll>

        <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-24">
          <RevealOnScroll>
            <h3 className="mb-7 font-display text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.1] text-ink">{l.advantagesTitle}</h3>
            <ul className="flex flex-col">
              {l.advantages.map((a) => (
                <li key={a} className="flex gap-4 border-t border-ink/[0.1] py-4 text-[16px] leading-[1.55] text-muted-1">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <h3 className="mb-7 font-display text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.1] text-ink">{l.usesTitle}</h3>
            <ul className="flex flex-wrap gap-2">
              {l.uses.map((u) => (
                <li key={u} className="rounded-full border border-ink/15 px-4 py-2 text-[14px] text-ink">
                  {u}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </Container>

      {/* Report 03 — fuel char */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="grid grid-cols-1 gap-10 py-[clamp(80px,10vw,130px)] md:grid-cols-[1fr_1.3fr] md:gap-24">
          <div>
            <ReportHeading label={fmt(l.report, { n: "03" })} title={l.r3Title} />
            <RevealOnScroll>
              <p className="max-w-[380px] text-[16px] leading-[1.6] text-muted-1">
                {l.r3Intro}
                <Link href={href("/products/fuel-char")} className="font-semibold text-forest hover:text-leaf">{l.aboutFuelChar}</Link>
              </p>
            </RevealOnScroll>
          </div>
          <RevealOnScroll delay={80}>
            <SpecTable rows={fuelChar.specs} valueLabel={l.r3ValueLabel} caption={l.r3Caption} />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="pt-[clamp(48px,6vw,72px)]">
        <p className="max-w-[640px] text-sm leading-[1.6] text-muted-3">
          {l.footnote}
          <Link href={href("/contact")} className="font-semibold text-forest hover:text-leaf">{l.footnoteLink}</Link>
          {l.footnotePost}
        </p>
      </Container>

      <CTABanner />
    </>
  );
}
