import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import CTABanner from "@/components/CTABanner";
import { getProducts } from "@/lib/cms/content";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.products.metaTitle, description: t.products.metaDescription };
}

export default async function ProductsPage() {
  const { locale, t, href } = await getI18n();
  const p = t.products;
  const products = (await getProducts(locale)).map((x) => ({
    num: x.num,
    tag: x.tag,
    name: x.name,
    desc: x.description,
    apps: x.applications.slice(0, 4),
    href: href(`/products/${x.slug}`),
    imageSrc: x.image,
    imageAlt: x.imageAlt,
  }));
  return (
    <>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-[clamp(140px,18vh,200px)] sm:px-8 md:grid-cols-2">
        <RevealOnScroll>
          <Eyebrow className="mb-7">{p.eyebrow}</Eyebrow>
          <h1 className="font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            {p.title.pre}
            <br />
            <em className="not-italic text-leaf">{p.title.em}</em>
            {p.title.post}
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <p className="mb-3 max-w-[460px] text-lg leading-[1.6] text-muted-1">{p.intro}</p>
        </RevealOnScroll>
      </section>

      <Container className="flex flex-col pb-[120px]">
        {products.map((x, i) => (
          <RevealOnScroll
            key={x.href}
            delay={i * 80}
            className="grid grid-cols-1 items-center gap-10 border-t border-ink/[0.12] py-14 md:grid-cols-2 md:gap-20"
          >
            <ImageBlock
              src={x.imageSrc ?? undefined}
              alt={x.imageAlt}
              placeholderLabel={fmt(t.common.imagePending, { name: x.name })}
              aspect="aspect-[5/4]"
              rounded="rounded-2xl"
            />
            <div>
              <div className="font-mono-label mb-4 text-xs text-leaf">
                {x.num} · {x.tag}
              </div>
              <h2 className="mb-5 font-display text-[clamp(40px,4.4vw,64px)] font-semibold leading-none text-ink">{x.name}</h2>
              <p className="mb-7 max-w-[480px] text-[17px] leading-[1.6] text-muted-1">{x.desc}</p>
              <div className="font-mono-label mb-2.5 text-[11px] text-muted-3">{p.applications}</div>
              <div className="mb-8 flex flex-wrap gap-2">
                {x.apps.map((app) => (
                  <span key={app} className="rounded-full border border-ink/[0.18] px-3.5 py-[7px] text-[13px]">
                    {app}
                  </span>
                ))}
              </div>
              <Button href={x.href} variant="dark" className="px-[22px] py-[13px] text-sm">
                {p.viewSpecs}
              </Button>
            </div>
          </RevealOnScroll>
        ))}
      </Container>

      <CTABanner />
    </>
  );
}
