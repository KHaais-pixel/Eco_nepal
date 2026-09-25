import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import SpecList from "@/components/SpecList";
import ApplicationGrid from "@/components/ApplicationGrid";
import CTABanner from "@/components/CTABanner";
import { fuelCharApplications, fuelCharSpecs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Pyrolysis Fuel Char / Carbon Product",
  description:
    "Pyrolysis Fuel Char — the carbon-rich solid left after tyre pyrolysis, for selected industrial fuel and material applications.",
};

export default function FuelCharPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 pb-20 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-24">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href="/products" className="text-leaf">PRODUCTS</Link>
            <span>/</span>
            <span>FUEL CHAR</span>
          </div>
          <h1 className="mb-7 font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Fuel <em className="not-italic text-leaf">char</em>
          </h1>
          <p className="mb-8 max-w-[480px] text-lg leading-[1.6] text-muted-1">
            The carbon-rich solid left after tyre pyrolysis. Can be considered for
            selected industrial fuel applications and material uses, depending on its
            quality, composition, and the requirements of the end user.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" variant="dark">Request a quote</Button>
            <Button href="/contact" variant="outline">Request datasheet</Button>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <ImageBlock
            src="/brand/fuel-char-photo.jpg"
            alt="Bowl of recovered pyrolysis fuel char, a fine black carbon-rich powder"
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
            <SpecList rows={fuelCharSpecs} />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="py-[clamp(80px,10vw,130px)]">
        <RevealOnScroll>
          <h2 className="mb-12 font-display text-[clamp(36px,4vw,56px)] font-semibold leading-none text-ink">
            Where it&rsquo;s used
          </h2>
        </RevealOnScroll>
        <ApplicationGrid items={fuelCharApplications} />
        <p className="mt-8 max-w-[520px] text-sm leading-[1.6] text-muted-3">
          Potential application categories, subject to quality and technical evaluation.
          End users should confirm suitability against their own requirements before
          adoption.
        </p>
      </Container>

      <CTABanner />
    </>
  );
}
