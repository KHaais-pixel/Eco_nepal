"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { processSteps } from "@/lib/site-data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { splitWordsInline, groupIntoLines, wrapLines } from "@/lib/animation/textSplitter";
import { buildOdometerColumn, type OdometerColumn } from "@/lib/animation/odometer";
import ReactorIllustration, { type PartKey } from "./ReactorIllustration";

gsap.registerPlugin(ScrollTrigger);

// ---- Tunables --------------------------------------------------------------
const STEP_COUNT = processSteps.length; // 7
const VH_PER_STEP = 60; // pin length per step (desktop)
const SCRUB = 1; // scrub smoothing
const TRANSITION_FRACTION = 0.2; // fraction of a segment used for the step-to-step crossfade
const TITLE_ROLL_FRACTION = 0.15; // fraction of a new segment used for the title roll
const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DIGIT_HEIGHT = 20;
const HEADER_OFFSET = 72;

// Ring colour across the whole scroll (0–1): green → orange peak mid-step 03
// → held through 04 → amber by 06 → back to green for 07.
const RING_COLOR_STOPS = [
  { at: 0, value: "#2f7a4d" },
  { at: 2 / 7, value: "#2f7a4d" },
  { at: 2.5 / 7, value: "#E07A2E" },
  { at: 4 / 7, value: "#E07A2E" },
  { at: 5 / 7, value: "#D99A2B" },
  { at: 6 / 7, value: "#2f7a4d" },
  { at: 1, value: "#2f7a4d" },
];

const TEMP_STOPS = [
  { at: 0, value: 25 },
  { at: 1 / 7, value: 25 },
  { at: 2.5 / 7, value: 450 },
  { at: 4 / 7, value: 450 },
  { at: 1, value: 60 },
];

function sampleStops<T>(
  stops: { at: number; value: T }[],
  t: number,
  lerp: (a: T, b: T, k: number) => T
): T {
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.at && t <= b.at) {
      const localT = (t - a.at) / (b.at - a.at || 1);
      return lerp(a.value, b.value, localT);
    }
  }
  return stops[stops.length - 1].value;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerpNum = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (a: string, b: string, t: number) => gsap.utils.interpolate(a, b, t);

type PartRefs = Partial<Record<PartKey, SVGElement | null>>;

/** Per-step, within-segment animation of the illustration's own parts. */
function applyStepParts(idx: number, t: number, parts: PartRefs) {
  const set = (key: PartKey, vars: gsap.TweenVars) => {
    const el = parts[key];
    if (el) gsap.set(el, vars);
  };

  switch (idx) {
    case 0:
      for (let i = 0; i < 3; i++) {
        const localT = clamp01((t - i * 0.12) / 0.4);
        set(`tyre-${i}` as PartKey, { y: -40 * (1 - localT), opacity: localT });
      }
      break;
    case 1:
      for (let i = 0; i < 12; i++) {
        const localT = clamp01((t - (i % 12) * 0.025) / 0.5);
        const angle = (i / 12) * Math.PI * 2;
        const dist = (1 - localT) * 10;
        set(`chip-${i}` as PartKey, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: localT });
      }
      break;
    case 2:
      set("chamber-glow", { opacity: Math.min(0.6, (t / 0.5) * 0.6) });
      for (let i = 0; i < 3; i++) {
        const loopT = (t * 1.6 + i * 0.33) % 1;
        set(`heat-${i}` as PartKey, { y: -loopT * 18, opacity: 1 - loopT });
      }
      break;
    case 3: {
      for (let i = 0; i < 3; i++) {
        const dropT = clamp01((t - i * 0.2) / 0.4);
        set(`droplet-${i}` as PartKey, { y: dropT * 58, opacity: 1 - dropT });
      }
      const fillT = clamp01(t / 0.8);
      const fillEl = parts["container-fill"];
      if (fillEl) gsap.set(fillEl, { attr: { height: 40 * fillT, y: 163 - 40 * fillT } });
      break;
    }
    case 4:
      for (let i = 0; i < 10; i++) {
        const localT = clamp01((t - i * 0.06) / 0.4);
        set(`pile-${i}` as PartKey, { opacity: localT, scale: localT });
      }
      break;
    case 5:
      for (let i = 0; i < 3; i++) {
        const el = parts[`wire-${i}` as PartKey] as SVGPathElement | undefined;
        if (!el) continue;
        const len = el.getTotalLength();
        const drawT = clamp01(t / 0.5);
        const pullT = clamp01((t - 0.5) / 0.5);
        gsap.set(el, {
          strokeDasharray: len,
          strokeDashoffset: len * (1 - drawT),
          x: pullT * 22,
          opacity: 1 - pullT * 0.4,
        });
      }
      break;
    case 6: {
      const checkEl = parts["check-mark"] as SVGPathElement | undefined;
      if (checkEl) {
        const len = checkEl.getTotalLength();
        gsap.set(checkEl, { strokeDasharray: len, strokeDashoffset: len * (1 - clamp01(t / 0.6)) });
      }
      set("check-circle", { opacity: Math.min(1, t / 0.3) });
      break;
    }
    default:
      break;
  }
}

/** Rolls a pre-split, line-wrapped title block in (`dir: 1`) or out (`dir: -1`). */
function setTitleRoll(block: HTMLDivElement, t: number, dir: 1 | -1) {
  const lines = Array.from(block.children) as HTMLElement[];
  let anyVisible = false;
  lines.forEach((line, li) => {
    const content = line.firstElementChild as HTMLElement | null;
    const staggered = clamp01(t - li * 0.08);
    if (dir === 1) {
      gsap.set(line, { opacity: staggered > 0 ? 1 : 0 });
      if (content) gsap.set(content, { yPercent: 100 * (1 - staggered) });
      if (staggered > 0) anyVisible = true;
    } else {
      gsap.set(line, { opacity: 1 - Math.min(1, staggered) });
      if (content) gsap.set(content, { yPercent: -100 * staggered });
      if (staggered < 1) anyVisible = true;
    }
  });
  block.style.visibility = anyVisible ? "visible" : "hidden";
}

export default function ProcessScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const stepLabelRef = useRef<HTMLDivElement>(null);
  const digitHostRef = useRef<HTMLSpanElement>(null);
  const tempRef = useRef<HTMLDivElement>(null);
  const titleBlockRefs = useRef<(HTMLDivElement | null)[]>([]);

  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const partRefs = useRef<PartRefs[]>(processSteps.map(() => ({})));

  const trackFillRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const numberTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberCheckRefs = useRef<(SVGSVGElement | null)[]>([]);
  const titleTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descHeights = useRef<number[]>([]);

  const masterTriggerRef = useRef<ScrollTrigger | null>(null);
  const reducedMotion = useReducedMotion();

  const groupRef = (i: number, el: SVGGElement | null) => {
    groupRefs.current[i] = el;
  };
  const partRef = (i: number, key: PartKey, el: SVGElement | null) => {
    partRefs.current[i][key] = el;
  };

  const scrollToStep = (index: number) => {
    const st = masterTriggerRef.current;
    if (!st) {
      rowRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const target = st.start + ((index + 0.5) / STEP_COUNT) * (st.end - st.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // The inner <p> is never height-constrained (only its wrapper is), so its
  // natural height is always measurable — even while collapsed.
  const measureDescriptions = () => {
    descTextRefs.current.forEach((p, i) => {
      if (p) descHeights.current[i] = p.getBoundingClientRect().height;
    });
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      measureDescriptions();

      // Split each pre-rendered title into masked lines once, so the roll
      // stays purely transform-driven and trivially reversible under scrub.
      titleBlockRefs.current.forEach((block) => {
        if (!block || block.dataset.split === "1") return;
        const words = splitWordsInline(block);
        wrapLines(groupIntoLines(words));
        block.dataset.split = "1";
      });

      if (reducedMotion) {
        // No motion: descriptions stay fully expanded and readable; the list
        // and arc just reflect the step in view via plain opacity/offset
        // changes, with no colour animation and no illustration/counters.
        const setStatic = (idx: number) => {
          gsap.set(ringRef.current, { strokeDashoffset: CIRCUMFERENCE * (1 - (idx + 1) / STEP_COUNT) });
          titleBlockRefs.current.forEach((block, i) => {
            if (block) block.style.visibility = i === idx ? "visible" : "hidden";
          });
          const fallback = digitHostRef.current?.querySelector<HTMLElement>("[data-odometer-fallback]");
          if (fallback) fallback.textContent = String(idx + 1);
          groupRefs.current.forEach((g, i) => g && gsap.set(g, { opacity: i === idx ? 1 : 0 }));
          rowRefs.current.forEach((row, i) => {
            const titleEl = titleTextRefs.current[i];
            if (titleEl) titleEl.style.opacity = i === idx ? "1" : i < idx ? "0.7" : "0.4";
            row?.setAttribute("aria-current", i === idx ? "step" : "false");
          });
        };
        if (tempRef.current) tempRef.current.style.visibility = "hidden";
        setStatic(0);
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          ScrollTrigger.create({
            trigger: row,
            start: "top 70%",
            onEnter: () => setStatic(i),
            onEnterBack: () => setStatic(i),
          });
        });
        return;
      }

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      const odometer: OdometerColumn = buildOdometerColumn(
        digitHostRef.current!,
        processSteps.map((s) => s.number[1]),
        DIGIT_HEIGHT
      );

      const update = (progress: number) => {
        const idx = Math.min(STEP_COUNT - 1, Math.floor(progress * STEP_COUNT));
        const segStart = idx / STEP_COUNT;
        const localT = clamp01((progress - segStart) / (1 / STEP_COUNT));
        const transitionT = clamp01(localT / TRANSITION_FRACTION);
        const titleT = clamp01(localT / TITLE_ROLL_FRACTION);
        // Step 01 has nothing to transition in from, so it's fully "entered"
        // from the first pixel of the pin (its tyres still drop in as parts).
        const enterT = idx === 0 ? 1 : transitionT;

        // Ring progress + colour. The STEP label and temperature share the
        // exact same sampled colour, so they turn orange in lockstep.
        const ringColor = sampleStops(RING_COLOR_STOPS, progress, lerpColor);
        if (ringRef.current) {
          gsap.set(ringRef.current, {
            strokeDashoffset: CIRCUMFERENCE * (1 - Math.max(0.02, progress)),
            stroke: ringColor,
          });
        }
        const temp = Math.round(sampleStops(TEMP_STOPS, progress, lerpNum));
        if (tempRef.current) {
          tempRef.current.textContent = `${temp}°C`;
          tempRef.current.style.color = ringColor;
        }
        if (stepLabelRef.current) stepLabelRef.current.style.color = ringColor;

        // Odometer step digit: rolls from the previous digit to this one
        // during the same window as the title roll, then sits settled.
        odometer.setIndex(idx === 0 ? 0 : idx - 1 + titleT);

        // Reactor illustration: crossfade groups, animate the active one's parts.
        groupRefs.current.forEach((g, i) => {
          if (!g) return;
          let opacity = 0;
          let scale = 1;
          if (i === idx) {
            opacity = enterT;
            scale = 0.95 + 0.05 * enterT;
          } else if (i === idx - 1 && localT < TRANSITION_FRACTION) {
            opacity = 1 - transitionT;
            scale = 1 - 0.05 * transitionT;
          }
          gsap.set(g, { opacity, scale, transformOrigin: "100px 100px" });
        });
        applyStepParts(idx, localT, partRefs.current[idx]);

        // Centre title roll
        titleBlockRefs.current.forEach((block, i) => {
          if (!block) return;
          if (i === idx) setTitleRoll(block, idx === 0 ? 1 : titleT, 1);
          else if (i === idx - 1 && localT < TITLE_ROLL_FRACTION) setTitleRoll(block, titleT, -1);
          else block.style.visibility = "hidden";
        });

        // Step list: track fill + active/completed/upcoming state + the
        // symmetric expand/collapse of the active description.
        if (trackFillRef.current) gsap.set(trackFillRef.current, { scaleY: progress });

        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const titleEl = titleTextRefs.current[i];
          const descWrap = descWrapRefs.current[i];
          const numberText = numberTextRefs.current[i];
          const numberCheck = numberCheckRefs.current[i];
          const naturalHeight = descHeights.current[i] ?? 0;

          let openT = 0;
          if (i === idx) openT = enterT;
          else if (i === idx - 1 && localT < TRANSITION_FRACTION) openT = 1 - transitionT;

          if (descWrap) gsap.set(descWrap, { height: naturalHeight * openT, opacity: openT });

          const isActive = i === idx;
          const isCompleted = i < idx;
          if (titleEl) titleEl.style.opacity = isActive ? "1" : isCompleted ? "0.7" : "0.28";
          if (numberText) numberText.style.opacity = isCompleted ? "0" : "1";
          if (numberCheck) numberCheck.style.opacity = isCompleted ? "1" : "0";
          row.setAttribute("aria-current", isActive ? "step" : "false");
        });
      };

      if (isDesktop) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: `top top+=${HEADER_OFFSET}`,
          end: `+=${STEP_COUNT * VH_PER_STEP}%`,
          scrub: SCRUB,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
        });
        masterTriggerRef.current = st;
        update(0);
      } else {
        update(0);
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const tweenTo = (p: number) => {
            const proxy = { p: 0 };
            gsap.to(proxy, { p, duration: 0.5, ease: "power2.out", onUpdate: () => update(proxy.p) });
          };
          ScrollTrigger.create({
            trigger: row,
            start: "top 70%",
            onEnter: () => tweenTo((i + 0.5) / STEP_COUNT),
            onEnterBack: () => tweenTo((i + 0.5) / STEP_COUNT),
          });
        });
      }

      return () => {
        masterTriggerRef.current = null;
        odometer.el.remove();
        digitHostRef.current
          ?.querySelectorAll<HTMLElement>("[data-odometer-fallback]")
          .forEach((n) => (n.style.display = ""));
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  // Fonts change text metrics (description heights, title line breaks and
  // the pin's measured size), so re-measure and refresh once they settle.
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      measureDescriptions();
      ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-10 sm:px-8 lg:h-[calc(100vh-72px)] lg:grid-cols-2 lg:gap-20 lg:py-4">
        <div className="relative mx-auto aspect-square w-[70%] lg:w-[min(100%,440px,70vh)]">
          <svg viewBox="0 0 320 320" className="h-full w-full -rotate-90">
            <circle cx="160" cy="160" r={RADIUS} fill="none" stroke="rgba(21,32,26,.1)" strokeWidth="2" />
            <circle
              ref={ringRef}
              cx="160"
              cy="160"
              r={RADIUS}
              fill="none"
              stroke="#2f7a4d"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - 1 / STEP_COUNT)}
            />
          </svg>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[27%] h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2"
          >
            <ReactorIllustration groupRef={groupRef} partRef={partRef} className="h-full w-full" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center px-10 text-center"
          >
            <div
              ref={stepLabelRef}
              className="font-mono-label mb-2 flex items-center justify-center text-xs text-leaf"
            >
              <span>STEP 0</span>
              <span ref={digitHostRef} className="inline-block" style={{ width: 9 }}>
                <span data-odometer-fallback>1</span>
              </span>
              <span>&nbsp;/ {String(STEP_COUNT).padStart(2, "0")}</span>
            </div>
            <div ref={tempRef} className="font-mono-label mb-3 text-[11px] text-leaf">
              25&deg;C
            </div>
            <div className="relative h-[2.4em] w-full max-w-[260px] overflow-hidden">
              {processSteps.map((step, i) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    titleBlockRefs.current[i] = el;
                  }}
                  className="absolute inset-0 font-display text-[clamp(20px,2.4vw,32px)] font-medium leading-[1.1] text-ink"
                  style={{ visibility: i === 0 ? "visible" : "hidden" }}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col pl-6">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-ink/10" aria-hidden="true">
            <div ref={trackFillRef} className="h-full w-full origin-top bg-leaf" style={{ transform: "scaleY(0)" }} />
          </div>
          {processSteps.map((step, i) => (
            <button
              key={step.number}
              type="button"
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              onClick={() => scrollToStep(i)}
              className="border-t border-ink/10 py-2 text-left first:border-t-0 sm:py-2.5"
              aria-current={i === 0 ? "step" : undefined}
            >
              <div className="flex items-baseline gap-4">
                <span className="relative flex h-4 w-6 items-center">
                  <span
                    ref={(el) => {
                      numberTextRefs.current[i] = el;
                    }}
                    className="font-mono-label absolute text-xs text-leaf"
                    style={{ opacity: 1 }}
                  >
                    {step.number}
                  </span>
                  <Check
                    ref={(el) => {
                      numberCheckRefs.current[i] = el;
                    }}
                    className="absolute h-3.5 w-3.5 text-leaf"
                    style={{ opacity: 0 }}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </span>
                <span
                  ref={(el) => {
                    titleTextRefs.current[i] = el;
                  }}
                  className="text-[17px] font-semibold text-ink"
                >
                  {step.title}
                </span>
              </div>
              <div
                ref={(el) => {
                  descWrapRefs.current[i] = el;
                }}
                className="ml-9 overflow-hidden"
              >
                <p
                  ref={(el) => {
                    descTextRefs.current[i] = el;
                  }}
                  className="max-w-[440px] pt-2 text-[15px] leading-[1.55] text-muted-2"
                >
                  {step.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
