import Link from "next/link";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { LocalizedProduct } from "@/lib/cms/content";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

/** Breadcrumb, headline (last word in green), description, buttons and image. */
export default async function ProductHero({ product, actions }: { product: LocalizedProduct; actions: React.ReactNode }) {
  const { t, href } = await getI18n();
  const words = product.name.split(" ");
  const lastWord = words.pop();
  return (
    <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 pb-20 pt-[clamp(120px,16vh,170px)] sm:px-8 md:grid-cols-2 md:gap-24">
      <RevealOnScroll>
        <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
          <Link href={href("/products")} className="-my-3 inline-block py-3 text-leaf">{t.product.breadcrumb}</Link>
          <span>/</span>
          <span>{product.name.toUpperCase()}</span>
        </div>
        <h1 className="mb-7 font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
          {words.join(" ")}
          {words.length ? " " : ""}
          <em className="not-italic text-leaf">{lastWord}</em>
        </h1>
        <p className="mb-8 max-w-[480px] text-lg leading-[1.6] text-muted-1">{product.description}</p>
        <div className="flex flex-wrap gap-3">{actions}</div>
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <ImageBlock
          src={product.image ?? undefined}
          alt={product.imageAlt}
          placeholderLabel={fmt(t.common.imagePending, { name: product.name })}
          aspect="aspect-square"
          rounded="rounded-[20px]"
          priority
        />
      </RevealOnScroll>
    </section>
  );
}
