import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import Accordion from "@/components/Accordion";
import CTABanner from "@/components/CTABanner";
import { faqs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Eco Nepal Energy's waste tyre recycling, pyrolysis oil, fuel char, and recovered steel products.",
};

export default function FAQPage() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">FAQ</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[900px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Questions, <em className="not-italic text-leaf">answered.</em>
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={140}>
          <p className="mt-7 max-w-[560px] text-lg leading-[1.6] text-muted-1">
            Where information is not yet confirmed, we encourage you to contact us
            directly.
          </p>
        </RevealOnScroll>
      </section>

      <Container className="max-w-[860px] pb-[120px]">
        <RevealOnScroll>
          <Accordion items={faqs} />
        </RevealOnScroll>
      </Container>

      <CTABanner />
    </>
  );
}
