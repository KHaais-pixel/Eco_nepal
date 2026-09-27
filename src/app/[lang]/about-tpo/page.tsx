import type { Metadata } from "next";
import Link from "next/link";
import { Check, AlertTriangle } from "lucide-react";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import CTABanner from "@/components/CTABanner";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.tpo.metaTitle, description: t.tpo.metaDescription };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 max-w-[760px] font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-none tracking-[-0.02em] text-ink">
      {children}
    </h2>
  );
}

function TitledList({ items, tone = "check" }: { items: { title: string; body: string }[]; tone?: "check" | "warn" }) {
  const Icon = tone === "warn" ? AlertTriangle : Check;
  const color = tone === "warn" ? "text-[#E07A2E]" : "text-leaf";
  return (
    <ul className="flex flex-col">
      {items.map((it) => (
        <li key={it.title} className="grid grid-cols-[28px_1fr] gap-3 border-t border-ink/[0.1] py-4">
          <Icon className={`mt-1 h-4 w-4 ${color}`} aria-hidden="true" />
          <div>
            <div className="font-semibold text-ink">{it.title}</div>
            <p className="mt-1 text-[15px] leading-[1.55] text-muted-2">{it.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function AboutTpoPage() {
  const { t, href } = await getI18n();
  const p = t.tpo;
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-[clamp(64px,8vw,110px)] pt-[clamp(120px,16vh,170px)] sm:px-8">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href={href("/products")} className="-my-3 inline-block py-3 text-leaf">{t.product.breadcrumb}</Link>
            <span>/</span>
            <span>{p.breadcrumb}</span>
          </div>
          <h1 className="mb-8 max-w-[980px] font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {p.title.pre}
            <em className="not-italic text-leaf">{p.title.em}</em>
            {p.title.post}
          </h1>
          <p className="mb-8 max-w-[680px] text-lg leading-[1.6] text-muted-1">{p.intro}</p>
          <Button href={href("/products/pyrolysis-oil")} variant="dark">{p.ourProduct}</Button>
        </RevealOnScroll>
      </section>

      {/* How it is produced */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <RevealOnScroll>
            <SectionTitle>{p.producedTitle}</SectionTitle>
            <p className="mb-6 text-[16px] text-muted-2">{p.producedIntro}</p>
          </RevealOnScroll>
          <ol className="grid grid-cols-1 gap-px border-y border-ink/[0.1] bg-ink/[0.1] md:grid-cols-2 lg:grid-cols-3">
            {p.produced.map((step, i) => (
              <RevealOnScroll key={step.title} delay={i * 60} className="flex flex-col gap-3 bg-stone py-7 md:pr-8">
                <span className="font-mono-label text-xs text-leaf">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[22px] font-semibold leading-[1.15] text-ink">{step.title}</h3>
                <p className="text-[15px] leading-[1.6] text-muted-2">{step.body}</p>
              </RevealOnScroll>
            ))}
          </ol>
          <RevealOnScroll>
            <p className="mt-8 max-w-[760px] text-[15px] leading-[1.6] text-muted-3">{p.plantTypes}</p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Uses */}
      <Container className="py-[clamp(80px,10vw,130px)]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-24">
          <RevealOnScroll>
            <SectionTitle>{p.usesTitle}</SectionTitle>
            <p className="max-w-[440px] text-[16px] leading-[1.65] text-muted-1">{p.usesIntro}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <TitledList items={p.uses} />
          </RevealOnScroll>
        </div>
      </Container>

      {/* Environmental impact */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <RevealOnScroll>
            <SectionTitle>{p.impactTitle}</SectionTitle>
            <p className="mb-10 max-w-[680px] text-[16px] leading-[1.65] text-muted-1">{p.impactIntro}</p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-24">
            <RevealOnScroll>
              <TitledList items={p.benefits} />
            </RevealOnScroll>
            <RevealOnScroll delay={80}>
              <h3 className="mb-4 font-display text-[22px] font-semibold text-ink">{p.concernsTitle}</h3>
              <TitledList items={p.concerns} tone="warn" />
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* Advantages / disadvantages */}
      <Container className="py-[clamp(80px,10vw,130px)]">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-24">
          <RevealOnScroll>
            <SectionTitle>{p.advantagesTitle}</SectionTitle>
            <TitledList items={p.advantages} />
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <SectionTitle>{p.disadvantagesTitle}</SectionTitle>
            <TitledList items={p.disadvantages} tone="warn" />
          </RevealOnScroll>
        </div>
      </Container>

      {/* Market */}
      <section className="bg-deep text-cream">
        <Container className="grid grid-cols-1 gap-12 py-[clamp(80px,10vw,130px)] md:grid-cols-2 md:gap-24">
          <RevealOnScroll>
            <h2 className="mb-8 font-display text-[clamp(32px,3.6vw,52px)] font-semibold leading-none tracking-[-0.02em]">{p.marketTitle}</h2>
            <p className="text-[16px] leading-[1.65] text-cream/80">{p.market}</p>
            <p className="mt-5 text-[16px] leading-[1.65] text-cream/80">{p.revenue}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <h3 className="mb-5 font-display text-[22px] font-semibold text-lime">{p.driversTitle}</h3>
            <ul className="flex flex-col">
              {p.drivers.map((d) => (
                <li key={d} className="flex gap-4 border-t border-cream/15 py-4 text-[15px] leading-[1.55] text-cream/85">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[15px] leading-[1.65] text-cream/70">{p.summary}</p>
          </RevealOnScroll>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
