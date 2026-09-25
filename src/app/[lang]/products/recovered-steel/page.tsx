import type { Metadata } from "next";
import { CheckSquare } from "lucide-react";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import SpecList from "@/components/SpecList";
import CTABanner from "@/components/CTABanner";
import ProductSections from "@/components/ProductSections";
import ProductHero from "@/components/ProductHero";
import { getProduct } from "@/lib/cms/content";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.product.metaTitles["recovered-steel"], description: t.product.metaDescriptions["recovered-steel"] };
}

export default async function RecoveredSteelPage() {
  const { locale, t, href } = await getI18n();
  const p = t.product;
  const product = await getProduct("recovered-steel", locale);
  return (
    <>
      <ProductHero
        product={product}
        actions={<Button href={href("/contact")} variant="dark">{p.requestSteelInfo}</Button>}
      />

      <ProductSections sections={product.sections} />

      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="grid grid-cols-1 gap-10 py-[clamp(80px,10vw,130px)] sm:grid-cols-2 sm:gap-24">
          <RevealOnScroll>
            <h2 className="mb-5 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">{p.productInfo}</h2>
            <p className="font-mono-label max-w-[320px] text-xs leading-[1.6] text-muted-3">{p.productInfoNote}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <SpecList rows={product.specs} />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="py-[clamp(80px,10vw,130px)]">
        <RevealOnScroll>
          <h2 className="mb-4 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">{p.whereUsed}</h2>
          <div className="mb-12 flex flex-wrap gap-2">
            {product.applications.map((app) => (
              <span key={app} className="rounded-full border border-ink/[0.18] px-3.5 py-[7px] text-[13px]">
                {app}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <h2 className="mb-8 font-display text-[clamp(28px,3vw,40px)] font-semibold leading-none text-ink">{p.tellUs}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {p.steelPoints.map((point, i) => (
              <RevealOnScroll key={point} delay={i * 50} className="flex items-center gap-3 border-t border-ink/[0.12] py-4">
                <CheckSquare className="h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                <span className="text-[15px] text-muted-1">{point}</span>
              </RevealOnScroll>
            ))}
          </div>
        </RevealOnScroll>
      </Container>

      <CTABanner />
    </>
  );
}
