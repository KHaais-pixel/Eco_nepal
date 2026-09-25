"use client";

import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { GALLERY_CATEGORIES, type GalleryItem } from "@/lib/cms/types";

const FILTERS = ["All", ...GALLERY_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

export default function GalleryGrid({ items: galleryImages }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? galleryImages
        : galleryImages.filter((img) => img.category === activeCategory),
    [activeCategory, galleryImages]
  );

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));

  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
        {FILTERS.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "border-ink bg-ink text-cream"
                : "border-ink/[0.18] text-ink hover:border-ink"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(i)}
            className="group block w-full break-inside-avoid overflow-hidden rounded-2xl border border-ink/[0.08] bg-stone text-left"
          >
            {img.image ? (
              <div
                className={`relative overflow-hidden ${
                  i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img.image}
                  alt={img.alt}
                  fill
                  unoptimized={img.image.startsWith("/uploads/")}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div
                role="img"
                aria-label={img.alt}
                className={`stripe-placeholder-light flex items-center justify-center text-muted-3 ${
                  i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                }`}
              >
                <ImageIcon className="h-9 w-9 opacity-60" strokeWidth={1.5} aria-hidden="true" />
              </div>
            )}
            <div className="p-3.5">
              <p className="text-sm font-semibold text-ink">{img.title}</p>
              <p className="font-mono-label text-[11px] text-muted-3">{img.category}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-3">No images in this category yet.</p>
      )}

      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 rounded-2xl bg-deep p-4 text-cream"
            onClick={(e) => e.stopPropagation()}
          >
            {activeImage.image ? (
              <div className="relative h-[70vh] w-full">
                <Image
                  src={activeImage.image}
                  alt={activeImage.alt}
                  fill
                  unoptimized={activeImage.image.startsWith("/uploads/")}
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <ImageIcon className="my-16 h-16 w-16 opacity-70" strokeWidth={1.5} aria-hidden="true" />
            )}
            <div className="text-center">
              <p className="text-lg font-semibold">{activeImage.title}</p>
              <p className="text-sm text-cream/70">{activeImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
