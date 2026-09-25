import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import HeroVideo from "@/components/HeroVideo";
import RevealOnScroll from "@/components/RevealOnScroll";
import HomeStoryScroll from "@/components/HomeStoryScroll";
import ProductsScrub from "@/components/home/ProductsScrub";
import BrochureFlip from "@/components/home/BrochureFlip";
import CTABanner from "@/components/CTABanner";
import { brochure, storyItems } from "@/lib/site-data";
import { getProducts } from "@/lib/cms/content";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.home.metaTitle, description: t.home.metaDescription };
}

export default async function HomePage() {
  const { locale, t, href } = await getI18n();
  const h = t.home;
  const products = (await getProducts(locale)).map((p) => ({
    num: p.num,
    name: p.name,
    tag: p.tag,
    short: p.short,
    href: href(`/products/${p.slug}`),
    imageSrc: p.image,
    imageAlt: p.imageAlt,
  }));
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

      <Container>
        <HeroVideo labels={{ aria: h.videoAria, mute: h.mute, unmute: h.unmute }} />
      </Container>

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

      {/* What we produce — scroll-scrubbed tyre-to-products animation */}
      <ProductsScrub products={products} labels={h.produce} />

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
