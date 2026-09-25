import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import HeroVideo from "@/components/HeroVideo";
import RevealOnScroll from "@/components/RevealOnScroll";
import HomeStoryScroll from "@/components/HomeStoryScroll";
import ProductsScrub from "@/components/home/ProductsScrub";
import CTABanner from "@/components/CTABanner";
import { audiences } from "@/lib/site-data";
import { getProducts } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Waste Tyre Recycling & Pyrolysis in Nepal",
  description:
    "Eco Nepal Energy Industries converts end-of-life tyres into pyrolysis oil, fuel char, and recovered steel at SEZ Bhairahawa, Nepal.",
};

export default async function HomePage() {
  const products = (await getProducts()).map((p) => ({
    num: p.num,
    name: p.name,
    tag: p.tag,
    short: p.short,
    href: `/products/${p.slug}`,
    imageSrc: p.image,
    imageAlt: p.imageAlt,
  }));
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-20">
        <RevealOnScroll>
          <Eyebrow className="mb-7">SEZ BHAIRAHAWA · RUPANDEHI · NEPAL</Eyebrow>
          <h1 className="font-display text-[clamp(56px,8.4vw,128px)] font-semibold leading-[0.92] tracking-[-0.025em] text-ink">
            Old tyres,
            <br />
            <em className="not-italic text-leaf">new energy.</em>
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={100} className="max-w-[460px] pb-3">
          <p className="mb-8 text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-muted-1">
            Eco Nepal Energy Industries converts end-of-life tyres into pyrolysis oil,
            fuel char and recovered steel, keeping waste out of landfills and open fires
            and putting it back to work in Nepal&rsquo;s industries.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/products" variant="dark">Explore products</Button>
            <Button href="/process" variant="outline">How it works →</Button>
          </div>
        </RevealOnScroll>
      </section>

      <Container>
        <HeroVideo />
      </Container>

      {/* Statement */}
      <section className="mx-auto max-w-[1100px] px-5 py-[clamp(96px,14vw,180px)] sm:px-8">
        <RevealOnScroll>
          <p className="font-display text-[clamp(32px,4.2vw,58px)] font-medium leading-[1.12] tracking-[-0.015em] text-ink">
            A tyre takes centuries to break down. Burned in the open, it poisons the air.{" "}
            <span className="text-muted-4">
              We heat it without oxygen instead, and recover almost everything it was made
              of.
            </span>
          </p>
        </RevealOnScroll>
      </section>

      {/* One tyre, four stages — sticky scroll story */}
      <HomeStoryScroll />

      {/* What we produce — scroll-scrubbed tyre-to-products animation */}
      <ProductsScrub products={products} />

      {/* Work with us */}
      <section className="bg-deep text-cream">
        <div className="mx-auto max-w-[1320px] px-5 py-[clamp(96px,12vw,160px)] sm:px-8">
          <RevealOnScroll>
            <h2 className="mb-16 max-w-[760px] font-display text-[clamp(40px,5vw,72px)] font-semibold leading-none tracking-[-0.02em]">
              Work with us
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 gap-px border-y border-cream/[0.14] bg-cream/[0.14] sm:grid-cols-3">
            {audiences.map((a, i) => (
              <RevealOnScroll
                key={a.who}
                delay={i * 90}
                className="flex min-h-[260px] flex-col gap-4 bg-deep py-9 pr-0 sm:pr-8"
              >
                <span className="font-mono-label text-xs text-lime">{a.who}</span>
                <h3 className="font-display text-[32px] font-semibold leading-[1.1]">{a.title}</h3>
                <p className="flex-1 text-[15px] leading-[1.6] text-cream/70">{a.body}</p>
                <Link href="/contact" className="text-sm font-semibold text-cream hover:text-lime">
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
