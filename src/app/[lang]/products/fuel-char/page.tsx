import type { Metadata } from "next";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import { SpecTable } from "@/components/SpecTable";
import CTABanner from "@/components/CTABanner";
import ProductSections from "@/components/ProductSections";
import ProductHero from "@/components/ProductHero";
import { getProduct } from "@/lib/cms/content";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.product.metaTitles["fuel-char"], description: t.product.metaDescriptions["fuel-char"] };
}

export default async function FuelCharPage() {
  const { locale, t, href } = await getI18n();
  const p = t.product;
  const product = await getProduct("fuel-char", locale);
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
            <SpecTable rows={product.specs} valueLabel={product.name} caption={t.labReports.r3Caption} />
          </RevealOnScroll>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
