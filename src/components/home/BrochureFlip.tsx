"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// ---- Tunables ----------------------------------------------------------
const DESKTOP_QUERY = "(min-width: 768px)";
const MOBILE_QUERY = "(max-width: 767px)";
const SCRUB = 0.7; // scrub smoothing (seconds of "catch-up" lag)
const FLIP = 1; // timeline seconds per page turn
const REST = 0.4; // timeline seconds each spread rests fully open
const SCROLL_PER_FLIP = 75; // % of viewport height scrolled per page turn
const PERSPECTIVE = 2600; // px; lower = more dramatic 3D
const TURN_SHADE = 0.4; // max darkening of a page as it stands on edge
const STACK_SCALE = 0.94; // mobile: scale of the pages waiting underneath

type Page = { src: string; alt: string };

// Performance: only `transform` and `opacity` are ever animated, so every
// frame is composited on the GPU with no layout or paint. The flip runs at
// the display's native refresh rate (60/120/144/240 Hz).
const face =
  "absolute inset-0 overflow-hidden bg-white [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

export default function BrochureFlip({ pages, pdf }: { pages: Page[]; pdf: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const shadowLeftRef = useRef<HTMLDivElement>(null);
  const shadowRightRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontShadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backShadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mPageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mShadeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll position of each resting state, for the prev/next buttons.
  const stopsRef = useRef<number[]>([]);
  const [layout, setLayout] = useState<"book" | "stack">("book");
  const [stop, setStop] = useState(0);
  const stopRef = useRef(0);
  const reducedMotion = useReducedMotion();

  // Desktop: pages bound in pairs as double-sided leaves. 8 pages = 4 leaves:
  // cover alone on the right, spreads 2–3, 4–5, 6–7, back cover alone on the left.
  const leaves = Array.from({ length: Math.ceil(pages.length / 2) }, (_, i) => ({
    front: pages[i * 2],
    back: pages[i * 2 + 1] as Page | undefined,
  }));

  const stopLabels =
    layout === "book"
      ? leaves.map((_, i) => (i === 0 ? "Cover" : `Pages ${i * 2}–${i * 2 + 1}`)).concat(
          pages.length % 2 === 0 ? "Back cover" : `Page ${pages.length}`
        )
      : pages.map((_, i) => `Page ${i + 1} of ${pages.length}`);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const section = sectionRef.current;
      if (!section) return;

      // Decode page images ahead of the pin so no frame waits on a decode.
      ScrollTrigger.create({
        trigger: section,
        start: "top 250%",
        once: true,
        onEnter: () =>
          section.querySelectorAll("img").forEach((img) => img.decode?.().catch(() => undefined)),
      });

      // Builds the pinned, scrubbed timeline and records each resting point.
      const pin = (tl: gsap.core.Timeline, stopTimes: number[], animated: Element[]) => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${(stopTimes.length - 1) * SCROLL_PER_FLIP}%`,
          pin: true,
          scrub: SCRUB,
          animation: tl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            const value = self.isActive ? "transform" : "auto";
            animated.forEach((el) => ((el as HTMLElement).style.willChange = value));
          },
          onUpdate: (self) => {
            // Nearest resting state to the playhead; re-render only on change.
            const t = self.progress * tl.duration();
            let current = 0;
            stopTimes.forEach((time, i) => {
              if (t >= time - FLIP / 2) current = i;
            });
            if (current !== stopRef.current) {
              stopRef.current = current;
              setStop(current);
            }
          },
          onRefresh: (self) => {
            stopsRef.current = stopTimes.map(
              (time) => self.start + (self.end - self.start) * (time / tl.duration())
            );
          },
        });
        return st;
      };

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_QUERY, () => {
        setLayout("book");
        const leafEls = leafRefs.current.filter(Boolean) as HTMLDivElement[];
        const n = leafEls.length;

        // Closed book: the cover (right half) is centred on screen.
        gsap.set(bookRef.current, { xPercent: -25 });
        leafEls.forEach((leaf, i) =>
          gsap.set(leaf, {
            rotationY: 0,
            transformPerspective: PERSPECTIVE,
            transformOrigin: "0% 50%",
            zIndex: n - i,
            force3D: true,
          })
        );
        gsap.set(frontShadeRefs.current, { opacity: 0 });
        gsap.set(backShadeRefs.current, { opacity: TURN_SHADE });
        // Floor shadow only under halves that hold a page.
        gsap.set(shadowLeftRef.current, { opacity: 0 });
        gsap.set(shadowRightRef.current, { opacity: 1 });

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        const stopTimes = [0];
        leafEls.forEach((leaf, i) => {
          const at = REST + i * (FLIP + REST);
          tl.to(leaf, { rotationY: -180, duration: FLIP, ease: "power1.inOut" }, at)
            .to(frontShadeRefs.current[i], { opacity: TURN_SHADE, duration: FLIP / 2, ease: "power1.in" }, at)
            // Past vertical the leaf lies on the left pile, above earlier leaves.
            .set(leaf, { zIndex: n + i + 1 }, at + FLIP / 2)
            .to(backShadeRefs.current[i], { opacity: 0, duration: FLIP / 2, ease: "power1.out" }, at + FLIP / 2);
          // Opening re-centres the spread; closing centres the back cover.
          if (i === 0)
            tl.to(bookRef.current, { xPercent: 0, duration: FLIP, ease: "power1.inOut" }, at).to(
              shadowLeftRef.current,
              { opacity: 1, duration: FLIP / 2 },
              at + FLIP / 2
            );
          if (i === n - 1 && pages.length % 2 === 0)
            tl.to(bookRef.current, { xPercent: 25, duration: FLIP, ease: "power1.inOut" }, at).to(
              shadowRightRef.current,
              { opacity: 0, duration: FLIP / 2 },
              at
            );
          stopTimes.push(at + FLIP);
        });
        tl.to({}, { duration: REST }); // hold the last spread briefly

        pin(tl, stopTimes, [bookRef.current!, ...leafEls]);
      });

      mm.add(MOBILE_QUERY, () => {
        setLayout("stack");
        // Phone: one page at a time. The top page turns away over its left
        // edge, revealing the next page as it rises out of the stack.
        const pageEls = mPageRefs.current.filter(Boolean) as HTMLDivElement[];
        const n = pageEls.length;
        pageEls.forEach((page, i) =>
          gsap.set(page, {
            rotationY: 0,
            scale: i === 0 ? 1 : STACK_SCALE,
            transformPerspective: PERSPECTIVE * 0.6,
            transformOrigin: "0% 50%",
            zIndex: n - i,
            visibility: "visible",
            force3D: true,
          })
        );
        mShadeRefs.current.forEach((shade, i) => gsap.set(shade, { opacity: i === 0 ? 0 : 0.18 }));

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        const stopTimes = [0];
        pageEls.slice(0, -1).forEach((page, i) => {
          const at = REST + i * (FLIP + REST);
          tl.to(page, { rotationY: -180, duration: FLIP, ease: "power1.inOut" }, at)
            .to(mShadeRefs.current[i], { opacity: TURN_SHADE, duration: FLIP / 2, ease: "power1.in" }, at)
            // Edge-on at the midpoint: hide it outright so nothing of the
            // turned page (e.g. its shadow) can paint off to the left.
            .set(page, { visibility: "hidden" }, at + FLIP / 2)
            .to(pageEls[i + 1], { scale: 1, duration: FLIP, ease: "power2.out" }, at)
            .to(mShadeRefs.current[i + 1], { opacity: 0, duration: FLIP, ease: "power1.out" }, at);
          stopTimes.push(at + FLIP);
        });
        tl.to({}, { duration: REST });

        pin(tl, stopTimes, pageEls);
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion, pages.length], revertOnUpdate: true }
  );

  const goTo = (index: number) => {
    const top = stopsRef.current[index];
    if (top === undefined) return;
    window.scrollTo({ top: Math.ceil(top) + 1, behavior: "smooth" });
  };

  const header = (
    <div className="mb-[clamp(20px,3vh,36px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div>
        <div className="font-mono-label mb-3 text-xs text-leaf">COMPANY BROCHURE</div>
        <h2 className="font-display text-[clamp(34px,4.4vw,60px)] font-semibold leading-[0.98] tracking-[-0.02em] text-ink">
          Flip through <em className="not-italic text-leaf">our story.</em>
        </h2>
      </div>
      <a
        href={pdf}
        download
        className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-forest hover:text-forest"
      >
        <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
      </a>
    </div>
  );

  // Reduced motion: a plain, swipeable row of pages. No 3D, no pinning.
  if (reducedMotion) {
    return (
      <section aria-label="Company brochure" className="mx-auto max-w-[1320px] px-5 py-[clamp(80px,10vw,140px)] sm:px-8">
        {header}
        <ol className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
          {pages.map((p, i) => (
            <li key={p.src} className="w-[min(78vw,380px)] shrink-0 snap-start">
              <div className="relative aspect-[595/842] overflow-hidden rounded-md bg-white shadow-[0_18px_40px_-20px_rgba(21,32,26,0.45)]">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 380px, 78vw" className="object-cover" />
              </div>
              <p className="font-mono-label mt-3 text-[11px] text-muted-3">PAGE {i + 1}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const atStart = stop === 0;
  const atEnd = stop === stopLabels.length - 1;

  return (
    <section
      ref={sectionRef}
      aria-label="Company brochure"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-cream pb-6 pt-[92px]"
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">{header}</div>

      {/* Stage */}
      <div className="flex flex-1 items-center justify-center">
        {/* Desktop / tablet: the open book */}
        <div
          ref={bookRef}
          className="relative hidden md:block"
          style={{
            width: "calc(var(--pw) * 2)",
            height: "calc(var(--pw) * 1.4143)",
            ["--pw" as string]: "min(40vw, calc((100svh - 300px) * 0.7071))",
          }}
        >
          {/* Soft floor shadow, one half per page side */}
          <div
            ref={shadowLeftRef}
            aria-hidden="true"
            className="absolute -bottom-6 left-[4%] right-1/2 h-10 rounded-l-[50%] bg-ink/25 blur-2xl"
          />
          <div
            ref={shadowRightRef}
            aria-hidden="true"
            className="absolute -bottom-6 left-1/2 right-[4%] h-10 rounded-r-[50%] bg-ink/25 blur-2xl"
          />
          {leaves.map((leaf, i) => (
            <div
              key={leaf.front.src}
              ref={(el) => {
                leafRefs.current[i] = el;
              }}
              className="absolute inset-y-0 left-1/2 w-1/2 [transform-style:preserve-3d]"
              style={{ zIndex: leaves.length - i }}
            >
              {/* Front (right-hand page) */}
              <div className={`${face} rounded-r-[4px]`}>
                <Image src={leaf.front.src} alt={leaf.front.alt} fill sizes="(min-width: 768px) 40vw, 80vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[9%] bg-linear-to-r from-ink/25 to-transparent" />
                <div
                  aria-hidden="true"
                  ref={(el) => {
                    frontShadeRefs.current[i] = el;
                  }}
                  className="absolute inset-0 bg-linear-to-l from-ink to-ink/40 opacity-0"
                />
              </div>
              {/* Back (left-hand page once turned) */}
              <div className={`${face} rounded-l-[4px] [transform:rotateY(180deg)]`}>
                {leaf.back ? (
                  <Image src={leaf.back.src} alt={leaf.back.alt} fill sizes="(min-width: 768px) 40vw, 80vw" className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-stone" />
                )}
                <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[9%] bg-linear-to-l from-ink/25 to-transparent" />
                <div
                  aria-hidden="true"
                  ref={(el) => {
                    backShadeRefs.current[i] = el;
                  }}
                  className="absolute inset-0 bg-linear-to-r from-ink to-ink/40 opacity-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Phone: a single-page stack */}
        <div
          className="relative md:hidden"
          style={{
            width: "var(--pw)",
            height: "calc(var(--pw) * 1.4143)",
            ["--pw" as string]: "min(80vw, calc((100svh - 290px) * 0.7071))",
          }}
        >
          <div aria-hidden="true" className="absolute inset-x-[6%] -bottom-5 h-8 rounded-[50%] bg-ink/25 blur-xl" />
          {pages.map((p, i) => (
            <div
              key={p.src}
              ref={(el) => {
                mPageRefs.current[i] = el;
              }}
              className={`${face} rounded-[4px] shadow-[0_10px_30px_-18px_rgba(21,32,26,0.5)]`}
              style={{ zIndex: pages.length - i }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="80vw" className="object-cover" />
              <div
                aria-hidden="true"
                ref={(el) => {
                  mShadeRefs.current[i] = el;
                }}
                className="absolute inset-0 bg-linear-to-l from-ink to-ink/40 opacity-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto mt-[clamp(20px,3.5vh,40px)] flex items-center gap-5">
        <button
          type="button"
          onClick={() => goTo(stop - 1)}
          disabled={atStart}
          aria-label="Previous page"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-forest hover:text-forest disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="min-w-[132px] text-center">
          <p aria-live="polite" className="font-mono-label text-[11px] text-muted-2">
            {stopLabels[stop]?.toUpperCase()}
          </p>
          <div aria-hidden="true" className="mt-2 flex justify-center gap-1.5">
            {stopLabels.map((label, i) => (
              <span
                key={label}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === stop ? "w-5 bg-leaf" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => goTo(stop + 1)}
          disabled={atEnd}
          aria-label="Next page"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-forest hover:text-forest disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
