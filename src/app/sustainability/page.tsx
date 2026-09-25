import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import CountUpStat from "@/components/CountUpStat";
import CTABanner from "@/components/CTABanner";
import { yields, sustainabilityBenefits } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "How Eco Nepal Energy supports resource recovery and the circular economy through waste tyre recycling and pyrolysis.",
};

export default function SustainabilityPage() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">SUSTAINABILITY</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[1100px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Less waste in the ground.{" "}
            <em className="not-italic text-leaf">Less smoke in the air.</em>
          </h1>
        </RevealOnScroll>
      </section>

      <section className="bg-deep text-cream">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {yields.map((y, i) => (
              <RevealOnScroll
                key={y.k}
                delay={i * 90}
                className="border-t border-cream/20 pt-6"
              >
                <div className="font-display text-[clamp(80px,9vw,140px)] font-medium leading-[0.9] tracking-[-0.03em] text-lime">
                  ~<CountUpStat value={y.v} />%
                </div>
                <div className="mt-4 text-[17px] font-semibold">{y.k}</div>
                <div className="mt-1.5 text-sm text-cream/70">{y.note}</div>
              </RevealOnScroll>
            ))}
          </div>
          <p className="font-mono-label mt-12 text-[11px] leading-[1.5] text-cream/60">
            Typical industry yields by weight of tyre input. Plant-specific figures
            subject to confirmation.
          </p>
        </Container>
      </section>

      <Container className="py-[clamp(80px,10vw,140px)]">
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4">
          {sustainabilityBenefits.map((b, i) => (
            <RevealOnScroll key={b.n} delay={i * 80} className="flex flex-col gap-3.5">
              <span className="font-mono-label text-xs text-leaf">{b.n}</span>
              <h3 className="font-display text-[34px] font-semibold leading-[1.1] text-ink">
                {b.title}
              </h3>
              <p className="text-[16px] leading-[1.6] text-muted-2">{b.body}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>

      <CTABanner />
    </>
  );
}
