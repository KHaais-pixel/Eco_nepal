import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import HomeStoryScroll from "@/components/HomeStoryScroll";
import BrochureFlip from "@/components/home/BrochureFlip";
import CTABanner from "@/components/CTABanner";
import { brochure, storyItems } from "@/lib/site-data";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.home.metaTitle, description: t.home.metaDescription };
}

export default async function HomePage() {
  const { t, href } = await getI18n();
  const h = t.home;
  const story = {
    eyebrow: h.story.eyebrow,
    videoAria: h.story.videoAria,
    note: h.story.note,
    items: storyItems.map((s, i) => ({ n: s.n, pct: s.pct, ...h.story.items[i] })),
  };
  const brochurePages = brochure.pages.map((p, i) => ({ src: p.src, alt: h.brochure.pageAlts[i] ?? p.alt }));

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-20">
        <RevealOnScroll>
          <Eyebrow className="mb-7">{h.eyebrow}</Eyebrow>
          <h1 className="font-display text-[clamp(56px,8.4vw,128px)] font-semibold leading-[0.92] tracking-[-0.025em] text-ink">
            {h.heroTitle.pre}
            <br />
            <em className="not-italic text-leaf">{h.heroTitle.em}</em>
            {h.heroTitle.post}
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={100} className="max-w-[460px] pb-3">
          <p className="mb-8 text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-muted-1">{h.heroText}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={href("/products")} variant="dark">{h.exploreProducts}</Button>
            <Button href={href("/process")} variant="outline">{h.howItWorks}</Button>
          </div>
        </RevealOnScroll>
      </section>

      {/* Statement */}
      <section className="mx-auto max-w-[1100px] px-5 py-[clamp(96px,14vw,180px)] sm:px-8">
        <RevealOnScroll>
          <p className="font-display text-[clamp(32px,4.2vw,58px)] font-medium leading-[1.12] tracking-[-0.015em] text-ink">
            {h.statement1}
            <span className="text-muted-4">{h.statement2}</span>
          </p>
        </RevealOnScroll>
      </section>

      {/* One tyre, four stages — sticky scroll story */}
      <HomeStoryScroll labels={story} />

      {/* The plant at a glance — published annual figures */}
      <section className="bg-deep text-cream">
        <div className="mx-auto max-w-[1320px] px-5 py-[clamp(96px,12vw,160px)] sm:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.1fr] md:gap-24">
            <RevealOnScroll>
              <Eyebrow tone="lime" className="mb-6">{h.glance.eyebrow}</Eyebrow>
              <h2 className="mb-7 font-display text-[clamp(36px,4.4vw,64px)] font-semibold leading-[1.02] tracking-[-0.02em]">
                {h.glance.title.pre}
                <em className="not-italic text-lime">{h.glance.title.em}</em>
                {h.glance.title.post}
              </h2>
              <p className="max-w-[520px] text-[16px] leading-[1.65] text-cream/75">{h.glance.text}</p>
            </RevealOnScroll>
            <div className="grid grid-cols-1 gap-px border-y border-cream/[0.14] bg-cream/[0.14] sm:grid-cols-2">
              {h.glance.stats.map((s, i) => (
                <RevealOnScroll key={s.label} delay={i * 80} className="flex flex-col gap-2 bg-deep py-7 sm:pr-8">
                  <div className="font-display text-[clamp(44px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] text-lime">
                    {s.value}
                  </div>
                  <div className="font-mono-label text-[11px] text-cream/60">{s.unit}</div>
                  <div className="text-[15px] leading-[1.5] text-cream/85">{s.label}</div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
          <p className="font-mono-label mt-10 text-[11px] leading-[1.5] text-cream/50">{h.glance.note}</p>
        </div>
      </section>

      {/* Why us — three promises and the motto */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <div className="mx-auto max-w-[1320px] px-5 py-[clamp(80px,10vw,130px)] sm:px-8">
          <RevealOnScroll className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-6">{h.why.eyebrow}</Eyebrow>
              <h2 className="max-w-[820px] font-display text-[clamp(32px,4vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
                {h.why.slogan}
              </h2>
            </div>
            <Link href={href("/why-us")} className="-my-3 py-3 text-[15px] font-semibold text-forest hover:text-leaf">
              {h.why.link}
            </Link>
          </RevealOnScroll>
          <div className="grid grid-cols-1 gap-px border-y border-ink/[0.1] bg-ink/[0.1] sm:grid-cols-3">
            {h.why.promises.map((p, i) => (
              <RevealOnScroll key={p.title} delay={i * 80} className="flex flex-col gap-3 bg-stone py-8 sm:pr-8">
                <h3 className="font-display text-[28px] font-semibold leading-[1.1] text-ink">{p.title}</h3>
                <p className="text-[15px] leading-[1.6] text-muted-2">{p.body}</p>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll className="mt-12 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="font-mono-label text-[13px] tracking-[0.18em] text-forest">
              {h.why.motto.map((m) => m.toUpperCase()).join(" • ")}
            </span>
            <span className="font-display text-[18px] font-medium text-muted-2">{h.why.mottoLine}</span>
          </RevealOnScroll>
        </div>
      </section>

      {/* Company brochure — scroll-driven 3D page turns */}
      <BrochureFlip pages={brochurePages} pdf={brochure.pdf} labels={h.brochure} />

      {/* Work with us */}
      <section className="bg-deep text-cream">
        <div className="mx-auto max-w-[1320px] px-5 py-[clamp(96px,12vw,160px)] sm:px-8">
          <RevealOnScroll>
            <h2 className="mb-16 max-w-[760px] font-display text-[clamp(40px,5vw,72px)] font-semibold leading-none tracking-[-0.02em]">
              {h.work.title}
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 gap-px border-y border-cream/[0.14] bg-cream/[0.14] sm:grid-cols-3">
            {h.work.audiences.map((a, i) => (
              <RevealOnScroll
                key={a.who}
                delay={i * 90}
                className="flex min-h-[260px] flex-col gap-4 bg-deep py-9 pr-0 sm:pr-8"
              >
                <span className="font-mono-label text-xs text-lime">{a.who}</span>
                <h3 className="font-display text-[32px] font-semibold leading-[1.1]">{a.title}</h3>
                <p className="flex-1 text-[15px] leading-[1.6] text-cream/70">{a.body}</p>
                <Link href={href("/contact")} className="-my-3 w-fit py-3 text-sm font-semibold text-cream hover:text-lime">
                  {a.cta} →
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
