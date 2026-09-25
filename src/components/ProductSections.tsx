import { Check } from "lucide-react";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { ProductSection } from "@/lib/cms/types";

const CHIP_MAX = 40; // lists whose items are all this short render as chips

function Paragraphs({ text }: { text: string }) {
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((p, i) => (
      <p key={i} className="mb-4 max-w-[60ch] text-[17px] leading-[1.65] text-muted-1 last:mb-0">
        {p}
      </p>
    ));
}

/** Admin-editable product copy blocks: heading, paragraphs and a list. */
export default function ProductSections({ sections }: { sections: ProductSection[] }) {
  if (!sections.length) return null;
  return (
    <Container className="py-[clamp(64px,8vw,110px)]">
      {sections.map((section, i) => {
        const chips = section.items.length > 0 && section.items.every((item) => item.length <= CHIP_MAX);
        const hasList = section.items.length > 0;
        return (
          <section
            key={`${section.title}-${i}`}
            className="grid grid-cols-1 gap-8 border-t border-ink/[0.1] py-[clamp(40px,5vw,64px)] first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[0.85fr_1.15fr] md:gap-20"
          >
            <RevealOnScroll>
              <h2 className="font-display text-[clamp(28px,3vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
                {section.title}
              </h2>
              {hasList && section.body && (
                <div className="mt-5">
                  <Paragraphs text={section.body} />
                </div>
              )}
            </RevealOnScroll>
            <RevealOnScroll delay={80}>
              {!hasList && section.body && <Paragraphs text={section.body} />}
              {chips && (
                <ul className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <li key={item} className="rounded-full border border-ink/15 bg-white/60 px-4 py-2 text-[14px] text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {hasList && !chips && (
                <ul className="flex flex-col">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 border-t border-ink/[0.1] py-4 text-[16px] leading-[1.55] text-muted-1 first:border-t-0 first:pt-0"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </RevealOnScroll>
          </section>
        );
      })}
    </Container>
  );
}
