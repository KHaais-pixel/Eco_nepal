import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import CTABanner from "@/components/CTABanner";
import { aboutFacts } from "@/lib/site-data";
import { getCompany } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Eco Nepal Energy Industries Pvt. Ltd. is a waste tyre recycling and pyrolysis company in the Special Economic Zone at Bhairahawa, Rupandehi.",
};

export default async function AboutPage() {
  const company = await getCompany();
  const { chairman } = company;
  // Name/location facts follow the editable company info; the rest are static.
  const facts = aboutFacts.map((f) =>
    f.k === "COMPANY" ? { ...f, v: company.legalName } : f.k === "LOCATION" ? { ...f, v: company.address } : f
  );
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">ABOUT US</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[1100px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Built in Bhairahawa,{" "}
            <em className="not-italic text-leaf">for Nepal&rsquo;s industry.</em>
          </h1>
        </RevealOnScroll>
      </section>

      <Container>
        <ImageBlock
          src="/brand/factory.jpg"
          alt="Eco Nepal Energy pyrolysis plant: two blue reactors under a steel-frame shed with a red roof"
          aspect="h-[clamp(340px,60vh,640px)]"
          clip
          priority
        />
      </Container>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-5 py-[clamp(80px,10vw,140px)] sm:px-8 md:grid-cols-2 md:gap-24">
        <RevealOnScroll>
          <p className="font-display text-[clamp(28px,3vw,40px)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
            Eco Nepal Energy Industries Pvt. Ltd. is a waste tyre recycling and pyrolysis
            company in the Special Economic Zone at Bhairahawa, Rupandehi.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={100} className="flex flex-col">
          {facts.map((f) => (
            <div
              key={f.k}
              className="grid grid-cols-[120px_1fr] gap-4 border-t border-ink/[0.12] py-[18px] text-[15px] sm:grid-cols-[160px_1fr]"
            >
              <span className="font-mono-label pt-0.5 text-xs text-muted-3">{f.k}</span>
              <span className={f.v === "Subject to confirmation" ? "text-muted-4" : "text-ink"}>
                {f.v}
              </span>
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
              alt="Portrait of Ajay Man Shrestha, Chairman of Eco Nepal Energy Industries Pvt. Ltd."
              aspect="aspect-[4/5]"
              rounded="rounded-2xl"
              className="max-w-[440px]"
              priority
            />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <Eyebrow className="mb-7">MESSAGE FROM THE CHAIRMAN</Eyebrow>
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
