import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import CTABanner from "@/components/CTABanner";
import { getCompany } from "@/lib/cms/content";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.about.metaTitle, description: t.about.metaDescription };
}

export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const a = t.about;
  const company = await getCompany(locale);
  const { chairman } = company;
  const facts = [
    { k: a.facts.company, v: company.legalName },
    { k: a.facts.location, v: company.address },
    { k: a.facts.industry, v: a.industryValue },
    { k: a.facts.products, v: a.productsValue },
    { k: a.facts.capacity, v: a.capacityValue, muted: true },
  ];
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">{a.eyebrow}</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[1100px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {a.title.pre}
            <em className="not-italic text-leaf">{a.title.em}</em>
            {a.title.post}
          </h1>
        </RevealOnScroll>
      </section>

      <Container>
        <ImageBlock src="/brand/factory.jpg" alt={a.factoryAlt} aspect="h-[clamp(340px,60vh,640px)]" clip priority />
      </Container>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-5 py-[clamp(80px,10vw,140px)] sm:px-8 md:grid-cols-2 md:gap-24">
        <RevealOnScroll>
          <p className="font-display text-[clamp(28px,3vw,40px)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">{a.intro}</p>
        </RevealOnScroll>
        <RevealOnScroll delay={100} className="flex flex-col">
          {facts.map((f) => (
            <div
              key={f.k}
              className="grid grid-cols-[120px_1fr] gap-4 border-t border-ink/[0.12] py-[18px] text-[15px] sm:grid-cols-[160px_1fr]"
            >
              <span className="font-mono-label pt-0.5 text-xs text-muted-3">{f.k}</span>
              <span className={f.muted ? "text-muted-4" : "text-ink"}>{f.v}</span>
            </div>
          ))}
        </RevealOnScroll>
      </section>

      {/* Chairman's message */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 py-[clamp(80px,10vw,140px)] sm:px-8 md:grid-cols-2 md:gap-24">
          <RevealOnScroll>
            <ImageBlock
              src="/brand/chairman.jpg"
              alt={fmt(a.chairmanAlt, { name: chairman.name })}
              aspect="aspect-[4/5]"
              rounded="rounded-2xl"
              className="max-w-[440px]"
              priority
            />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <Eyebrow className="mb-7">{a.chairmanEyebrow}</Eyebrow>
            <p className="mb-8 font-display text-[clamp(28px,3vw,42px)] font-medium leading-[1.2] tracking-[-0.02em] text-muted-4">
              &ldquo;{chairman.quote}&rdquo;
            </p>
            <div className="space-y-4 text-[15px] leading-[1.6] text-muted-2">
              {chairman.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-7">
              <div className="font-semibold text-ink">{chairman.name}</div>
              <div className="text-sm text-muted-3">{chairman.title}</div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
