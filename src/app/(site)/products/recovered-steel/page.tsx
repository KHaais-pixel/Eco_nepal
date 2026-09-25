import type { Metadata } from "next";
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import Container from "@/components/Container";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import SpecList from "@/components/SpecList";
import CTABanner from "@/components/CTABanner";
import ProductSections from "@/components/ProductSections";
import { steelEnquiryPoints } from "@/lib/site-data";
import { getProduct } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Recovered Steel Wire",
  description:
    "Recovered steel wire from end-of-life tyres, prepared as scrap material for suitable industrial metal-recycling applications.",
};

export default async function RecoveredSteelPage() {
  const product = await getProduct("recovered-steel");
  const words = product.name.split(" ");
  const lastWord = words.pop();
  return (
    <>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 pb-20 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-24">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href="/products" className="-my-3 inline-block py-3 text-leaf">PRODUCTS</Link>
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
            <Button href="/contact" variant="dark">Request steel information</Button>
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
        <Container className="grid grid-cols-1 gap-10 py-[clamp(80px,10vw,130px)] sm:grid-cols-2 sm:gap-24">
          <RevealOnScroll>
            <h2 className="mb-5 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">
              Product information
            </h2>
            <p className="font-mono-label max-w-[320px] text-xs leading-[1.6] text-muted-3">
              Company claims and reported test information require confirmation before
              publication as official product standards.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <SpecList rows={product.specs} />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="py-[clamp(80px,10vw,130px)]">
        <RevealOnScroll>
          <h2 className="mb-4 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">
            Where it&rsquo;s used
          </h2>
          <div className="mb-12 flex flex-wrap gap-2">
            {product.applications.map((app) => (
              <span key={app} className="rounded-full border border-ink/[0.18] px-3.5 py-[7px] text-[13px]">
                {app}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <h2 className="mb-8 font-display text-[clamp(28px,3vw,40px)] font-semibold leading-none text-ink">
            Tell us what you need
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steelEnquiryPoints.map((point, i) => (
              <RevealOnScroll
                key={point}
                delay={i * 50}
                className="flex items-center gap-3 border-t border-ink/[0.12] py-4"
              >
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
