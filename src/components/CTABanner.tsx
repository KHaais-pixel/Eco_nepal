import Button from "./Button";
import Container from "./Container";
import RevealOnScroll from "./RevealOnScroll";

export default function CTABanner() {
  return (
    <Container className="py-[clamp(80px,10vw,140px)]">
      <RevealOnScroll className="flex flex-wrap items-end justify-between gap-8">
        <h2 className="max-w-[820px] font-display text-[clamp(44px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.02em] text-ink">
          Have tyres to dispose of, or need{" "}
          <em className="not-italic text-leaf">industrial fuel?</em>
        </h2>
        <Button href="/contact" variant="forest" className="px-8 py-[18px] text-base">
          Get in touch →
        </Button>
      </RevealOnScroll>
    </Container>
  );
}
