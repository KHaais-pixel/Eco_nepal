import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import { SpecTable, FuelComparisonTable } from "@/components/SpecTable";
import CTABanner from "@/components/CTABanner";
import ProductSections from "@/components/ProductSections";
import ProductHero from "@/components/ProductHero";
import { getProduct } from "@/lib/cms/content";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.product.metaTitles["pyrolysis-oil"], description: t.product.metaDescriptions["pyrolysis-oil"] };
}

export default async function PyrolysisOilPage() {
  const { locale, t, href } = await getI18n();
  const p = t.product;
  const product = await getProduct("pyrolysis-oil", locale);
  return (
    <>
      <ProductHero
        product={product}
        actions={
          <>
            <Button href={href("/contact")} variant="dark">{p.requestQuote}</Button>
            <Button href={href("/contact")} variant="outline">{p.requestDatasheet}</Button>
          </>
        }
      />

      <ProductSections sections={product.sections} />

      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">{p.specification}</h2>
            <p className="font-mono-label max-w-[340px] text-xs leading-[1.6] text-muted-3">{p.specNote}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <SpecTable rows={product.specs} valueLabel={product.name} caption={t.labReports.r1Caption} />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="py-[clamp(80px,10vw,130px)]">
        <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[760px] font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">{p.comparisonTitle}</h2>
          <p className="max-w-[360px] text-[15px] leading-[1.6] text-muted-2">{p.comparisonNote}</p>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <FuelComparisonTable />
        </RevealOnScroll>
        <p className="mt-6 text-sm text-muted-3">
          {p.fullData}
          <Link href={href("/lab-reports")} className="font-semibold text-forest hover:text-leaf">{p.labReportsLink}</Link>
        </p>
      </Container>

      <CTABanner />
    </>
  );
}
