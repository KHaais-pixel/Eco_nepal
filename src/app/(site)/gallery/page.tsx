import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import GalleryGrid from "@/components/GalleryGrid";
import { getGallery } from "@/lib/cms/content";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A gallery of the Eco Nepal Energy facility, machinery, production process, and recovered products.",
};

export default async function GalleryPage() {
  const gallery = await getGallery();
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-[clamp(140px,18vh,200px)] sm:px-8">
        <RevealOnScroll>
          <Eyebrow className="mb-7">GALLERY</Eyebrow>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <h1 className="max-w-[900px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Our facility <em className="not-italic text-leaf">and process.</em>
          </h1>
        </RevealOnScroll>
        {gallery.some((g) => !g.image) && (
          <RevealOnScroll delay={140}>
            <p className="mt-7 max-w-[560px] text-lg leading-[1.6] text-muted-1">
              Some images below are labeled placeholders pending official company
              photography, and will be replaced with verified images of the actual
              facility, equipment, and products.
            </p>
          </RevealOnScroll>
        )}
      </section>

      <Container className="pb-[120px]">
        <GalleryGrid items={gallery} />
      </Container>

      <CTABanner />
    </>
  );
}
