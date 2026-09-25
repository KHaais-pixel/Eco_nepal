"use client";

import Image from "next/image";
import { forwardRef, useEffect, useRef, useState, type Ref } from "react";

type ImageBlockProps = {
  src?: string;
  alt: string;
  placeholderLabel?: string;
  tone?: "light" | "dark";
  aspect?: string;
  rounded?: string;
  clip?: boolean;
  className?: string;
  priority?: boolean;
  /** Ref to the inner <img> element — used when a caller needs to animate
   * the image itself (e.g. a scale tween) independently of the wrapper. */
  imgRef?: Ref<HTMLImageElement>;
  onImgLoad?: () => void;
};

/**
 * A photo block matching the editorial design: either a real photo, or a
 * diagonal-stripe placeholder labeled for future replacement. Optionally
 * reveals via an animated clip-path "zoom out" the first time it scrolls
 * into view.
 *
 * Forwards its ref to the outer (clipped) wrapper, so a caller driving its
 * own clip-path animation (e.g. a GSAP scroll-scrub) can target the wrapper
 * and, via `imgRef`, the inner image separately.
 */
const ImageBlock = forwardRef<HTMLDivElement, ImageBlockProps>(function ImageBlock(
  {
    src,
    alt,
    placeholderLabel,
    tone = "light",
    aspect = "aspect-[4/3]",
    rounded = "rounded-[20px]",
    clip = false,
    className = "",
    priority = false,
    imgRef,
    onImgLoad,
  },
  ref
) {
  const localRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!clip);

  useEffect(() => {
    if (!clip) return;
    const el = localRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [clip]);

  return (
    <div
      ref={(el) => {
        localRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className={`${aspect} ${rounded} overflow-hidden ${
        clip ? `clip-reveal ${visible ? "clip-reveal-visible" : ""}` : ""
      } ${className}`}
    >
      {src ? (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          width={1200}
          height={900}
          priority={priority}
          onLoad={onImgLoad}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={`flex h-full w-full items-end p-5 font-mono-label text-[11px] ${
            tone === "dark" ? "stripe-placeholder-dark text-muted-4" : "stripe-placeholder-light text-muted-3"
          }`}
        >
          {placeholderLabel ?? alt}
        </div>
      )}
    </div>
  );
});

export default ImageBlock;
