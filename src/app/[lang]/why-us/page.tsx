import type { Metadata } from "next";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import CTABanner from "@/components/CTABanner";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.whyUs.metaTitle, description: t.whyUs.metaDescription };
}

export default async function WhyUsPage() {
  const { t } = await getI18n();
  const w = t.whyUs;
  const home = t.home.why;
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">{w.eyebrow}</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[1000px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {w.title.pre}
            <em className="not-italic text-leaf">{w.title.em}</em>
            {w.title.post}
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={140}>
          <p className="mt-7 max-w-[620px] text-lg leading-[1.6] text-muted-1">{w.intro}</p>
        </RevealOnScroll>
      </section>

      {/* Six reasons */}
      <Container className="pb-[clamp(80px,10vw,130px)]">
        <div className="grid grid-cols-1 gap-px border-y border-ink/[0.1] bg-ink/[0.1] md:grid-cols-2 lg:grid-cols-3">
          {w.reasons.map((r, i) => (
            <RevealOnScroll key={r.title} delay={i * 70} className="flex flex-col gap-4 bg-cream py-9 md:pr-8">
              <span className="font-mono-label text-xs text-leaf">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-[clamp(24px,2.2vw,30px)] font-semibold leading-[1.15] text-ink">{r.title}</h2>
              <p className="text-[15px] leading-[1.6] text-muted-2">{r.body}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>

      {/* Promise + objectives */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="grid grid-cols-1 gap-14 py-[clamp(80px,10vw,130px)] md:grid-cols-2 md:gap-24">
          <RevealOnScroll>
            <h2 className="mb-8 font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-none tracking-[-0.02em] text-ink">
              {w.promisesTitle}
            </h2>
            <ul className="flex flex-col">
              {home.promises.map((p) => (
                <li key={p.title} className="border-t border-ink/[0.1] py-5">
                  <div className="font-display text-[22px] font-semibold text-ink">{p.title}</div>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-muted-2">{p.body}</p>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <h2 className="mb-8 font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-none tracking-[-0.02em] text-ink">
              {w.objectivesTitle}
            </h2>
            <ul className="flex flex-col">
              {w.objectives.map((o) => (
                <li key={o} className="flex gap-4 border-t border-ink/[0.1] py-4 text-[16px] leading-[1.55] text-muted-1">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Motto */}
      <section className="bg-deep text-cream">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <RevealOnScroll>
            <Eyebrow tone="lime" className="mb-8">{w.mottoTitle}</Eyebrow>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-display text-[clamp(40px,6vw,88px)] font-semibold leading-none tracking-[-0.02em]">
              {home.motto.map((m, i) => (
                <span key={m} className="flex items-baseline gap-6">
                  {i > 0 && <span aria-hidden="true" className="text-lime">•</span>}
                  <span>{m}</span>
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-[720px] font-display text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.25] text-lime">{home.mottoLine}</p>
            <p className="mt-10 max-w-[760px] text-[16px] leading-[1.65] text-cream/75">{w.closing}</p>
          </RevealOnScroll>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
