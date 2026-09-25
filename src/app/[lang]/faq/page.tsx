import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import Accordion from "@/components/Accordion";
import CTABanner from "@/components/CTABanner";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.faq.metaTitle, description: t.faq.metaDescription };
}

export default async function FAQPage() {
  const { t } = await getI18n();
  const f = t.faq;
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">{f.eyebrow}</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[900px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {f.title.pre}
            <em className="not-italic text-leaf">{f.title.em}</em>
            {f.title.post}
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={140}>
          <p className="mt-7 max-w-[560px] text-lg leading-[1.6] text-muted-1">{f.intro}</p>
        </RevealOnScroll>
      </section>

      <Container className="max-w-[860px] pb-[120px]">
        <RevealOnScroll>
          <Accordion items={f.items} />
        </RevealOnScroll>
      </Container>

      <CTABanner />
    </>
  );
}
