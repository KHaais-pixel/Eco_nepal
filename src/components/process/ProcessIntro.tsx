"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Eyebrow from "@/components/Eyebrow";
import { splitWordsInline } from "@/lib/animation/textSplitter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// ---- Tunables ------------------------------------------------------------
const PARTICLE_COUNT_DESKTOP = 40;
const PARTICLE_COUNT_MOBILE = 20;
const PARTICLE_COLOR = "#1B2420";
const HEAT_TINT = "#E07A2E";
const TAIL_START_COLOR = "#c7cbc8"; // light grey "Nothing burns." starts from
const SCRUB = 1;
const HEADER_OFFSET = 72;
const START = `top top+=${HEADER_OFFSET}`; // begins with the very first scroll
const END = `70% top+=${HEADER_OFFSET}`; // headline ~70% scrolled up past the header

type Particle = {
  id: number;
  isLabel: boolean;
  xPct: number;
  yPct: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  delay: number;
};

// Simple seeded PRNG (mulberry32) so particle layout is deterministic and
// never mismatches between a server render and the client.
function makeRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateParticles(count: number): Particle[] {
  const rng = makeRng(20260101);
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    isLabel: i % 7 === 0,
    xPct: rng() * 100,
    yPct: rng() * 100,
    size: i % 7 === 0 ? 11 : 3 + rng() * 3,
    opacity: 0.1 + rng() * 0.1,
    driftX: (rng() - 0.5) * 60,
    driftY: -(80 + rng() * 120),
    delay: rng(),
  }));
}

export default function ProcessIntro({ eyebrow, title }: { eyebrow: string; title: { pre: string; em: string; post: string } }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emRef = useRef<HTMLElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[] | null>(null);
  const wordsRef = useRef<{ head: HTMLSpanElement[]; tail: HTMLSpanElement[] } | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const heading = headingRef.current;
      const em = emRef.current;
      if (!heading || !em) return;

      if (reducedMotion) {
        // Final state only — no particles, no motion.
        return;
      }

      // Generate particle data client-side after mount (no SSR mismatch risk
      // since this only ever runs in the browser).
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      setParticles(generateParticles(isDesktop ? PARTICLE_COUNT_DESKTOP : PARTICLE_COUNT_MOBILE));
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  // Second pass: once particle DOM exists, split words and build the
  // scrubbed timeline. Kept separate so word-splitting always runs after
  // the particle layer has laid out (doesn't affect it, just keeps effects
  // easy to reason about independently).
  useGSAP(
    () => {
      const heading = headingRef.current;
      const em = emRef.current;
      if (!heading || !em) return;

      if (reducedMotion) {
        gsap.set(heading, { opacity: 1 });
        return;
      }
      if (!particles) return; // wait for client-generated particle DOM

      // Split once; re-runs reuse the same spans rather than nesting.
      if (!wordsRef.current) {
        wordsRef.current = {
          head: splitWordsInline(heading, em),
          tail: splitWordsInline(em),
        };
      }
      const { head: headWords, tail: tailWords } = wordsRef.current;
      const particleEls = particleLayerRef.current
        ? Array.from(particleLayerRef.current.children)
        : [];

      // Final colours are read from the live styles, so the end state is
      // exactly the existing headline (ink + brand green), not a lookalike.
      const inkColor = getComputedStyle(heading).color;
      const greenColor = getComputedStyle(em).color;

      gsap.set(headWords, { opacity: 0.35 });
      gsap.set(tailWords, { color: TAIL_START_COLOR });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: START,
          endTrigger: heading,
          end: END,
          scrub: SCRUB,
        },
      });

      // 1. Particles drift up and fade, staggered.
      if (particleEls.length) {
        particleEls.forEach((el, i) => {
          const p = particles?.[i];
          if (!p) return;
          tl.to(
            el,
            { x: p.driftX, y: p.driftY, opacity: 0, duration: 1.2, ease: "power1.out" },
            p.delay * 0.5
          );
        });
      }

      // 2. "Heat, without oxygen." words fade in one by one; "Heat," tints
      //    briefly toward the heat colour and back.
      const wordStart = 0.9;
      headWords.forEach((word, i) => {
        tl.to(word, { opacity: 1, duration: 0.35, ease: "power1.out" }, wordStart + i * 0.2);
      });
      if (headWords[0]) {
        tl.fromTo(
          headWords[0],
          { color: inkColor },
          { color: HEAT_TINT, duration: 0.25, ease: "power1.inOut", immediateRender: false },
          wordStart
        ).to(headWords[0], { color: inkColor, duration: 0.35, ease: "power1.inOut" }, wordStart + 0.25);
      }

      // 3. "Nothing burns." words fill from light grey to the brand green,
      //    left to right, after the particles have cleared.
      const particlesDone = Math.max(1.7, wordStart + headWords.length * 0.2);
      tailWords.forEach((word, i) => {
        tl.to(word, { color: greenColor, duration: 0.35, ease: "power1.out" }, particlesDone + i * 0.2);
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion, particles] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-[1320px] overflow-x-clip px-5 pb-10 pt-[clamp(140px,18vh,200px)] sm:px-8"
    >
      <Eyebrow className="mb-7">{eyebrow}</Eyebrow>
      <div className="relative max-w-[1000px]">
        {/* Decorative "oxygen" particles, laid out across the headline's box.
            A sibling of the <h1> (not a child) so word-splitting never
            touches them and screen readers never see them. */}
        <div
          ref={particleLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {!reducedMotion && particles?.map((p) => (
          <div
            key={p.id}
            className="font-mono-label absolute"
            style={{
              left: `${p.xPct}%`,
              top: `${p.yPct}%`,
              color: PARTICLE_COLOR,
              opacity: p.opacity,
              fontSize: p.isLabel ? "10px" : undefined,
            }}
          >
            {p.isLabel ? (
              "O₂"
            ) : (
              <span
                style={{
                  display: "block",
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: PARTICLE_COLOR,
                }}
              />
            )}
          </div>
          ))}
        </div>

        <h1
          ref={headingRef}
          className="relative max-w-[1000px] font-display text-[clamp(52px,7.6vw,116px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink"
        >
          {title.pre}<em ref={emRef} className="not-italic text-leaf">{title.em}</em>{title.post}
        </h1>
      </div>
    </section>
  );
}
