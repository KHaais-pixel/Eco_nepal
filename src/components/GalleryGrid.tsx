"use client";

import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/lib/site-data";

export default function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? galleryImages
        : galleryImages.filter((img) => img.category === activeCategory),
    [activeCategory]
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
        {galleryCategories.map((category) => (
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
            <div
              role="img"
              aria-label={img.alt}
              className={`stripe-placeholder-light flex items-center justify-center text-muted-3 ${
                i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
              }`}
            >
              <ImageIcon className="h-9 w-9 opacity-60" strokeWidth={1.5} aria-hidden="true" />
            </div>
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
            className="flex aspect-[4/3] w-full max-w-xl flex-col items-center justify-center gap-4 rounded-2xl bg-deep text-cream"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageIcon className="h-16 w-16 opacity-70" strokeWidth={1.5} aria-hidden="true" />
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
