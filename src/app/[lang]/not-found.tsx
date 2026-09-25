import type { Metadata } from "next";
import Button from "@/components/Button";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.notFound.metaTitle };
}

export default async function NotFound() {
  const { t, href } = await getI18n();
  const nf = t.notFound;
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[1320px] flex-col justify-center px-5 py-24 sm:px-8">
      <div className="font-mono-label mb-6 text-xs text-leaf">{nf.eyebrow}</div>
      <h1 className="mb-6 max-w-[900px] font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.98] tracking-[-0.025em] text-ink">
        {nf.title.pre}
        <em className="not-italic text-leaf">{nf.title.em}</em>
        {nf.title.post}
      </h1>
      <p className="mb-10 max-w-[520px] text-lg leading-[1.6] text-muted-1">{nf.text}</p>
      <div className="flex flex-wrap gap-3">
        <Button href={href("/")} variant="dark">{nf.home}</Button>
        <Button href={href("/products")} variant="outline">{nf.products}</Button>
        <Button href={href("/contact")} variant="outline">{nf.contact}</Button>
      </div>
    </div>
  );
}
