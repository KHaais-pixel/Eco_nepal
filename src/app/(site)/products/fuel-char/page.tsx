import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import { SpecTable } from "@/components/SpecTable";
import CTABanner from "@/components/CTABanner";
import ProductSections from "@/components/ProductSections";
import { getProduct } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Pyrolysis Fuel Char / Carbon Product",
  description:
    "Pyrolysis Fuel Char — the carbon-rich solid left after tyre pyrolysis, for selected industrial fuel and material applications.",
};

export default async function FuelCharPage() {
  const product = await getProduct("fuel-char");
  const words = product.name.split(" ");
  const lastWord = words.pop();
  return (
    <>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 pb-20 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-24">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href="/products" className="text-leaf">PRODUCTS</Link>
            <span>/</span>
            <span>{product.name.toUpperCase()}</span>
          </div>
          <h1 className="mb-7 font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {words.join(" ")}{words.length ? " " : ""}<em className="not-italic text-leaf">{lastWord}</em>
          </h1>
          <p className="mb-8 max-w-[480px] text-lg leading-[1.6] text-muted-1">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" variant="dark">Request a quote</Button>
            <Button href="/contact" variant="outline">Request datasheet</Button>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <ImageBlock
            src={product.image ?? undefined}
            alt={product.imageAlt}
            placeholderLabel={`[ ${product.name} — image pending ]`}
            aspect="aspect-square"
            rounded="rounded-[20px]"
            priority
          />
        </RevealOnScroll>
      </section>

      <ProductSections sections={product.sections} />

      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">
              Specification
            </h2>
            <p className="font-mono-label max-w-[340px] text-xs leading-[1.6] text-muted-3">
              Company-reported figures — confirm against the latest laboratory report
              before publication as official product standards.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <SpecTable rows={product.specs} valueLabel={product.name} caption="Fuel char (pyrolysis carbon powder) specification" />
          </RevealOnScroll>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
