import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import SpecList from "@/components/SpecList";
import ApplicationGrid from "@/components/ApplicationGrid";
import CTABanner from "@/components/CTABanner";
import { pyrolysisOilApplications, pyrolysisOilSpecs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Tyre Pyrolysis Oil (TPO)",
  description:
    "Tyre Pyrolysis Oil (TPO) — a dark liquid fuel condensed from tyre pyrolysis vapour, for compatible industrial heating applications.",
};

export default function PyrolysisOilPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 pb-20 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-24">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href="/products" className="text-leaf">PRODUCTS</Link>
            <span>/</span>
            <span>PYROLYSIS OIL</span>
          </div>
          <h1 className="mb-7 font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Pyrolysis <em className="not-italic text-leaf">oil</em>
          </h1>
          <p className="mb-8 max-w-[480px] text-lg leading-[1.6] text-muted-1">
            A dark liquid fuel condensed from tyre pyrolysis vapour. Intended for use as
            an industrial furnace oil substitute in compatible boilers, kilns, and
            furnaces, subject to equipment suitability, product testing, and safe
            handling.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" variant="dark">Request a quote</Button>
            <Button href="/contact" variant="outline">Request datasheet</Button>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <ImageBlock
            src="/brand/pyrolysis-oil-product.jpg"
            alt="Eco Furnace Oil (TPO) product graphic representing tyre pyrolysis oil"
            aspect="aspect-square"
            rounded="rounded-[20px]"
            priority
          />
        </RevealOnScroll>
      </section>

      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="grid grid-cols-1 gap-10 py-[clamp(80px,10vw,130px)] sm:grid-cols-2 sm:gap-24">
          <RevealOnScroll>
            <h2 className="mb-5 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">
              Typical specifications
            </h2>
            <p className="font-mono-label max-w-[320px] text-xs leading-[1.6] text-muted-3">
              Company-reported figures — confirm against the latest laboratory report
              before publication as official product standards.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <SpecList rows={pyrolysisOilSpecs} />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="py-[clamp(80px,10vw,130px)]">
        <RevealOnScroll>
          <h2 className="mb-12 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">
            Where it&rsquo;s used
          </h2>
        </RevealOnScroll>
        <ApplicationGrid items={pyrolysisOilApplications} />
        <p className="mt-8 max-w-[520px] text-sm leading-[1.6] text-muted-3">
          Potential application categories only. Suitability depends on equipment
          compatibility, product testing, and applicable requirements — please contact
          us to discuss your specific use case.
        </p>
      </Container>

      <CTABanner />
    </>
  );
}
