import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import CTABanner from "@/components/CTABanner";
import {
  pyrolysisOilApplications,
  fuelCharApplications,
  steelApplications,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Three products recovered from one tyre through pyrolysis: pyrolysis oil, fuel char, and recovered steel.",
};

const products = [
  {
    num: "01",
    tag: "LIQUID FUEL",
    name: "Pyrolysis oil",
    desc: "A liquid fuel condensed from tyre pyrolysis vapour, supplied to industries as a substitute for conventional furnace oil. Subject to equipment suitability, product testing, and safe handling.",
    apps: pyrolysisOilApplications.slice(0, 4),
    href: "/products/pyrolysis-oil",
    imageSrc: "/brand/pyrolysis-oil-product.jpg",
    imageAlt: "Eco Furnace Oil (TPO) product graphic",
  },
  {
    num: "02",
    tag: "SOLID FUEL",
    name: "Fuel char",
    desc: "The carbon-rich solid left after pyrolysis. Can be considered for selected solid fuel and material applications, depending on quality and end-user requirements.",
    apps: fuelCharApplications.slice(0, 4),
    href: "/products/fuel-char",
    imageSrc: "/brand/fuel-char-photo.jpg",
    imageAlt: "Bowl of recovered pyrolysis fuel char",
  },
  {
    num: "03",
    tag: "SCRAP METAL",
    name: "Recovered steel",
    desc: "Bead and belt wire separated from the tyre and prepared as scrap material for suitable industrial metal-recycling applications.",
    apps: steelApplications,
    href: "/products/recovered-steel",
    imageSrc: "/brand/recovered-steel-photo.jpg" as string | null,
    imageAlt: "Coils of recovered steel wire baled for industrial recycling",
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-[clamp(140px,18vh,200px)] sm:px-8 md:grid-cols-2">
        <RevealOnScroll>
          <Eyebrow className="mb-7">PRODUCTS</Eyebrow>
          <h1 className="font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Three products.
            <br />
            <em className="not-italic text-leaf">One tyre.</em>
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <p className="mb-3 max-w-[460px] text-lg leading-[1.6] text-muted-1">
            Each product is recovered from the same pyrolysis cycle and supplied to
            industrial buyers across Nepal. Specifications are available on request.
          </p>
        </RevealOnScroll>
      </section>

      <Container className="flex flex-col pb-[120px]">
        {products.map((p, i) => (
          <RevealOnScroll
            key={p.href}
            delay={i * 80}
            className="grid grid-cols-1 items-center gap-10 border-t border-ink/[0.12] py-14 md:grid-cols-2 md:gap-20"
          >
            <ImageBlock
              src={p.imageSrc ?? undefined}
              alt={p.imageAlt}
              placeholderLabel={`[ ${p.name} — image pending ]`}
              aspect="aspect-[5/4]"
              rounded="rounded-2xl"
            />
            <div>
              <div className="font-mono-label mb-4 text-xs text-leaf">
                {p.num} · {p.tag}
              </div>
              <h2 className="mb-5 font-display text-[clamp(40px,4.4vw,64px)] font-semibold leading-none text-ink">
                {p.name}
              </h2>
              <p className="mb-7 max-w-[480px] text-[17px] leading-[1.6] text-muted-1">
                {p.desc}
              </p>
              <div className="font-mono-label mb-2.5 text-[11px] text-muted-3">
                APPLICATIONS
              </div>
              <div className="mb-8 flex flex-wrap gap-2">
                {p.apps.map((app) => (
                  <span
                    key={app}
                    className="rounded-full border border-ink/[0.18] px-3.5 py-[7px] text-[13px]"
                  >
                    {app}
                  </span>
                ))}
              </div>
              <Button href={p.href} variant="dark" className="px-[22px] py-[13px] text-sm">
                View specifications →
              </Button>
            </div>
          </RevealOnScroll>
        ))}
      </Container>

      <CTABanner />
    </>
  );
}
