"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import ImageBlock from "@/components/ImageBlock";
import TyreGraphic from "./TyreGraphic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrambleTextPlugin);

// ---- Tunables ----------------------------------------------------------
const DESKTOP_QUERY = "(min-width: 1024px)";
const MOBILE_QUERY = "(max-width: 1023px)";
const PIN_END = "+=250%"; // total desktop scroll length while pinned
const SCRUB = 1; // scrub smoothing (seconds of "catch-up" lag)
const CARD_STAGGER = 0.15; // seconds between each card's land animation
const HOLD_PAD = 0.6; // seconds of idle timeline at the end (~10% hold)
const GLOW_COLOR = "#F28C28";
const PARTICLE_COLORS = {
  oil: "#E8A33D",
  char: "#4A554E",
  steel: "#8A948D",
};

export type HomeProduct = {
  num: string;
  name: string;
  tag: string;
  short: string;
  href: string;
  imageSrc: string | null;
  imageAlt: string;
};

export default function ProductsScrub({ products: homeProducts }: { products: HomeProduct[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tyreRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const oilRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const steelRef = useRef<HTMLDivElement>(null);
  const steelStrokeRefs = useRef<(SVGPathElement | null)[]>([]);

  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageInnerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const reducedMotion = useReducedMotion();

  // Re-measure pin/trigger positions once card images have actually loaded
  // (their real aspect ratio can shift layout slightly from the reserved
  // placeholder box).
  useEffect(() => {
    if (loadedCount >= homeProducts.length) ScrollTrigger.refresh();
  }, [loadedCount, homeProducts.length]);

  useGSAP(
    () => {
      const animatedEls = () => [
        ...cardRefs.current,
        ...imageWrapRefs.current,
        ...imageInnerRefs.current,
        tyreRef.current,
        glowRef.current,
        oilRef.current,
        charRef.current,
        steelRef.current,
      ].filter(Boolean) as (HTMLElement | SVGElement)[];

      if (reducedMotion) {
        // Content is already visible by default (no CSS hides it); just a
        // gentle one-time fade so the section doesn't pop in abruptly.
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.08, ease: "power1.out" }
        );
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_QUERY, () => {
        // ---- Initial hidden state, set only here (never in CSS) so the
        // section is fully visible if JS never runs. ----
        gsap.set(headingRef.current, { yPercent: 100, opacity: 0 });
        gsap.set(cardRefs.current, { opacity: 0, y: 60 });
        gsap.set(imageWrapRefs.current, { clipPath: "inset(45% 0 45% 0 round 16px)" });
        gsap.set(imageInnerRefs.current, { scale: 1.2 });
        gsap.set(titleRefs.current, { opacity: 0, y: 16 });
        gsap.set(tagRefs.current, { opacity: 0 });
        gsap.set(tyreRef.current, { scale: 0.8, rotate: 0, opacity: 1 });
        gsap.set(glowRef.current, { opacity: 0 });
        gsap.set([oilRef.current, charRef.current, steelRef.current], {
          opacity: 0,
          x: 0,
          y: 0,
        });

        const getOffset = (targetEl: HTMLElement | null) => {
          const stageEl = stageRef.current;
          if (!stageEl || !targetEl) return { x: 0, y: 0 };
          const stageRect = stageEl.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();
          return {
            x: targetRect.left + targetRect.width / 2 - (stageRect.left + stageRect.width / 2),
            y: targetRect.top + targetRect.height / 2 - (stageRect.top + stageRect.height / 2),
          };
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: PIN_END,
            scrub: SCRUB,
            pin: true,
            anticipatePin: 1,
            onToggle: (self) => {
              const value = self.isActive ? "transform, opacity, clip-path" : "auto";
              animatedEls().forEach((el) => {
                (el as HTMLElement).style.willChange = value;
              });
            },
          },
        });

        // 6. Heading mask reveal — first, before the tyre heats up.
        tl.to(headingRef.current, { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0);

        // 2. Heat — tyre scales/rotates, glow builds behind it.
        tl.to(tyreRef.current, { scale: 1, rotate: 90, duration: 1.4, ease: "power2.inOut" }, 0.9);
        tl.to(glowRef.current, { opacity: 0.8, duration: 1.1, ease: "power2.out" }, 1.0);

        // 3. Split — tyre shrinks away, three particles burst toward the cards.
        tl.to(tyreRef.current, { scale: 0.35, opacity: 0, duration: 0.9, ease: "power2.in" }, 2.4);
        tl.to(glowRef.current, { opacity: 0, duration: 0.9, ease: "power2.in" }, 2.4);

        const particles = [oilRef, charRef, steelRef];
        particles.forEach((particleRef, i) => {
          const target = imageWrapRefs.current[i];
          const offset = getOffset(target);
          const startTime = 2.5 + i * 0.12;
          tl.to(particleRef.current, { opacity: 1, duration: 0.2 }, startTime);
          tl.to(
            particleRef.current,
            {
              motionPath: {
                path: [
                  { x: 0, y: 0 },
                  { x: offset.x * 0.5, y: offset.y * 0.5 - 80 },
                  { x: offset.x, y: offset.y },
                ],
                curviness: 1.25,
              },
              duration: 1.3,
              ease: "power2.inOut",
            },
            startTime
          );
        });

        // Steel wire strokes "draw on" as they travel.
        steelStrokeRefs.current.forEach((path) => {
          if (!path) return;
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, 2.5 + 2 * 0.12);
        });

        // 4/5. Land — particles fade on arrival; cards + images + text reveal.
        const landStart = 3.8;
        particles.forEach((particleRef, i) => {
          tl.to(
            particleRef.current,
            { opacity: 0, duration: 0.25, ease: "power1.in" },
            landStart + i * CARD_STAGGER - 0.1
          );
        });

        tl.to(
          cardRefs.current,
          { opacity: 1, y: 0, duration: 0.7, stagger: CARD_STAGGER, ease: "power2.out" },
          landStart
        );
        tl.to(
          imageWrapRefs.current,
          { clipPath: "inset(0% 0 0% 0 round 16px)", duration: 0.8, stagger: CARD_STAGGER, ease: "power3.out" },
          landStart
        );
        tl.to(
          imageInnerRefs.current,
          { scale: 1, duration: 0.9, stagger: CARD_STAGGER, ease: "power3.out" },
          landStart
        );
        tl.to(
          titleRefs.current,
          { opacity: 1, y: 0, duration: 0.5, stagger: CARD_STAGGER, ease: "power2.out" },
          landStart + 0.25
        );

        // Mono label character-scramble decode.
        homeProducts.forEach((p, i) => {
          const el = tagRefs.current[i];
          if (!el) return;
          const at = landStart + 0.35 + i * CARD_STAGGER;
          tl.to(el, { opacity: 1, duration: 0.1 }, at);
          tl.to(el, { duration: 0.5, scrambleText: { text: p.tag, chars: "upperCase", speed: 0.4 }, ease: "none" }, at);
        });

        // Hold the landed state for the last stretch of the pin.
        tl.to({}, { duration: HOLD_PAD });
      });

      mm.add(MOBILE_QUERY, () => {
        gsap.set(headingRef.current, { opacity: 0 });
        gsap.to(headingRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });

        gsap.set(imageWrapRefs.current, { clipPath: "inset(45% 0 45% 0 round 16px)" });
        gsap.set(imageInnerRefs.current, { scale: 1.2 });
        gsap.set(titleRefs.current, { opacity: 0, y: 16 });
        gsap.set(tagRefs.current, { opacity: 0 });

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const wrap = imageWrapRefs.current[i];
          const img = imageInnerRefs.current[i];
          const title = titleRefs.current[i];
          const tag = tagRefs.current[i];
          const scrollTrigger = { trigger: card, start: "top 85%", end: "top 45%", scrub: SCRUB };

          gsap.to(wrap, { clipPath: "inset(0% 0 0% 0 round 16px)", ease: "none", scrollTrigger });
          gsap.to(img, { scale: 1, ease: "none", scrollTrigger: { ...scrollTrigger } });
          gsap.to([title, tag], { opacity: 1, y: 0, ease: "none", scrollTrigger: { ...scrollTrigger } });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-[1320px] px-5 py-[clamp(96px,12vw,160px)] sm:px-8"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-none tracking-[-0.02em] text-ink"
          >
            What we produce
          </h2>
        </div>
        <a href="/products" className="text-[15px] font-semibold text-forest hover:text-leaf">
          All products →
        </a>
      </div>

      {/* Decorative pinned stage — desktop only. Absolutely positioned and
          aria-hidden so it never affects layout or gets announced. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[210px] z-10 hidden h-[220px] w-[220px] -translate-x-1/2 lg:block"
      >
        <div
          ref={glowRef}
          className="absolute inset-[-40%] rounded-full opacity-0"
          style={{ background: `radial-gradient(circle, ${GLOW_COLOR} 0%, transparent 70%)` }}
        />
        <TyreGraphic ref={tyreRef} className="absolute inset-0 h-full w-full opacity-0" />

        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 opacity-0" ref={oilRef}>
          <svg viewBox="0 0 24 24" className="h-full w-full">
            <path
              d="M12 2C12 2 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 2 12 2Z"
              fill={PARTICLE_COLORS.oil}
            />
          </svg>
        </div>

        <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-0" ref={charRef}>
          <svg viewBox="0 0 32 32" className="h-full w-full">
            {[
              [6, 8],
              [14, 5],
              [22, 9],
              [8, 18],
              [18, 20],
              [25, 16],
              [12, 24],
              [20, 27],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="2.4" fill={PARTICLE_COLORS.char} />
            ))}
          </svg>
        </div>

        <div className="absolute left-1/2 top-1/2 h-8 w-10 -translate-x-1/2 -translate-y-1/2 opacity-0" ref={steelRef}>
          <svg viewBox="0 0 40 32" className="h-full w-full" fill="none">
            <path
              ref={(el) => {
                steelStrokeRefs.current[0] = el;
              }}
              d="M2 16C10 4 20 4 28 16"
              stroke={PARTICLE_COLORS.steel}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              ref={(el) => {
                steelStrokeRefs.current[1] = el;
              }}
              d="M6 24C14 12 24 12 32 24"
              stroke={PARTICLE_COLORS.steel}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              ref={(el) => {
                steelStrokeRefs.current[2] = el;
              }}
              d="M10 8C16 -1 24 -1 30 8"
              stroke={PARTICLE_COLORS.steel}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {homeProducts.map((p, i) => (
          <a
            key={p.num}
            href={p.href}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="group flex flex-col gap-5"
          >
            <ImageBlock
              ref={(el) => {
                imageWrapRefs.current[i] = el;
              }}
              imgRef={(el) => {
                imageInnerRefs.current[i] = el;
              }}
              onImgLoad={() => setLoadedCount((n) => n + 1)}
              src={p.imageSrc ?? undefined}
              alt={p.imageAlt}
              placeholderLabel={`[ ${p.name} — image pending ]`}
              aspect="aspect-[4/5]"
              rounded="rounded-2xl"
              className="transition-transform duration-500 group-hover:scale-[0.985]"
            />
            <div className="flex items-baseline justify-between gap-3">
              <h3
                ref={(el) => {
                  titleRefs.current[i] = el;
                }}
                className="font-display text-[32px] font-semibold text-ink"
              >
                {p.name}
              </h3>
              <span
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="font-mono-label text-[11px] text-leaf"
              >
                {p.tag}
              </span>
            </div>
            <p className="-mt-2 text-[15px] leading-[1.55] text-muted-2">{p.short}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
