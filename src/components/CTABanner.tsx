import Button from "./Button";
import Container from "./Container";
import RevealOnScroll from "./RevealOnScroll";
import { getI18n } from "@/i18n/server";

export default async function CTABanner() {
  const { t, href } = await getI18n();
  return (
    <Container className="py-[clamp(80px,10vw,140px)]">
      <RevealOnScroll className="flex flex-wrap items-end justify-between gap-8">
        <h2 className="max-w-[820px] font-display text-[clamp(44px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.02em] text-ink">
          {t.cta.title.pre}
          <em className="not-italic text-leaf">{t.cta.title.em}</em>
          {t.cta.title.post}
        </h2>
        <Button href={href("/contact")} variant="forest" className="px-8 py-[18px] text-base">
          {t.cta.button}
        </Button>
      </RevealOnScroll>
    </Container>
  );
}
