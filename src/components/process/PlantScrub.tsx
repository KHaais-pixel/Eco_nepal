"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { processSteps } from "@/lib/site-data";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ---- Tunables --------------------------------------------------------------
const VH_PER_STEP = 90; // scroll length per step while the plant is on screen
const SMOOTH = 0.35; // seconds the scene takes to catch up with the scroll
const N = processSteps.length; // 7

const SHORT = ["Collection", "Preparation", "Pyrolysis", "Oil Recovery", "Solid Recovery", "Steel Recovery", "Quality & Dispatch"];
// Camera [x, y, zoom] framing each step on the 960×560 plant drawing.
const CAM: [number, number, number][] = [
  [175, 205, 1.5],
  [245, 265, 1.45],
  [455, 290, 1.35],
  [655, 255, 1.32],
  [285, 395, 1.45],
  [755, 400, 1.4],
  [520, 290, 1.0],
];
const TEMP = [24, 62, 450, 430, 290, 140, 32]; // °C shown per step (illustrative)
const ACCENT = ["#2e7d4f", "#2e7d4f", "#e07a2e", "#d9892f", "#3b3b38", "#5f7485", "#2e7d4f"];
const PIPE: [number, number][] = [
  [520, 170],
  [520, 110],
  [700, 110],
  [700, 150],
];

// ---- Maths -----------------------------------------------------------------
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
/** smoothstep between a and b */
const ss = (a: number, b: number, x: number) => {
  const u = cl((x - a) / (b - a));
  return u * u * (3 - 2 * u);
};
/** fades in before `a`, out after `b` */
const env = (t: number, a: number, b: number, f = 0.3) => ss(a - f, a, t) * (1 - ss(b, b + f, t));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const fr = (x: number) => x - Math.floor(x);
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, u: number) => {
  const A = hex(a);
  const B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join("");
};
/** step index + eased progress towards the next step's camera/colour */
const key = (t: number): [number, number] => {
  const x = t - 0.5;
  if (x <= 0) return [0, 0];
  if (x >= N - 1) return [N - 1, 0];
  const i = Math.floor(x);
  return [i, ss(0.15, 0.85, x - i)];
};
const alongPipe = (d: number): [number, number] => {
  for (let i = 0; i < 3; i++) {
    const [a, b] = [PIPE[i], PIPE[i + 1]];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= L) return [lerp(a[0], b[0], d / L), lerp(a[1], b[1], d / L)];
    d -= L;
  }
  return PIPE[3];
};
const f2 = (n: number) => n.toFixed(2);

// Refs to a fixed-length list of SVG/HTML nodes.
function useList<T extends Element>(n: number) {
  const ref = useRef<(T | null)[]>(Array(n).fill(null));
  const set = (i: number) => (el: T | null) => {
    ref.current[i] = el;
  };
  return [ref, set] as const;
}

// Named refs for the one-off nodes the renderer writes to.
function useNamed() {
  const ref = useRef<Record<string, Element | null>>({});
  const set = (name: string) => (el: Element | null) => {
    ref.current[name] = el;
  };
  return [ref, set] as const;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const LABEL = { fontSize: 11, letterSpacing: 1.5, fill: "#8a8a84", textAnchor: "middle" as const };

/**
 * "Follow one tyre through the plant": a sticky, scroll-scrubbed plant
 * diagram. The camera glides between machines as the step changes, and each
 * stage animates its material (shreds, vapour, oil, carbon, steel).
 *
 * Performance: React renders the drawing once; afterwards every frame writes
 * attributes directly to the nodes (no re-renders), and scroll is smoothed
 * with a single GSAP quickTo. Only transforms, opacity, fills and a few
 * geometry attributes change.
 */
export default function PlantScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<SVGGElement>(null);
  const stepLabelRef = useRef<HTMLSpanElement>(null);
  const tempLabelRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  const [nodesRef, node] = useNamed();
  const [segRefs, setSeg] = useList<HTMLDivElement>(N);
  const [titleRefs, setTitle] = useList<HTMLDivElement>(N);
  const [itemRefs, setItem] = useList<HTMLLIElement>(N);
  const [barRefs, setBar] = useList<HTMLDivElement>(N);
  const [numRefs, setNum] = useList<HTMLSpanElement>(N);
  const [tyreRefs, setTyre] = useList<SVGGElement>(2);
  const [shredRefs, setShred] = useList<SVGRectElement>(16);
  const [chargeRefs, setCharge] = useList<SVGRectElement>(12);
  const [bubbleRefs, setBubble] = useList<SVGCircleElement>(8);
  const [flameRefs, setFlame] = useList<SVGRectElement>(6);
  const [vapourRefs, setVapour] = useList<SVGCircleElement>(10);
  const [dropRefs, setDrop] = useList<SVGCircleElement>(4);
  const [granuleRefs, setGranule] = useList<SVGCircleElement>(8);
  const [wireRefs, setWire] = useList<SVGCircleElement>(6);
  const [badgeRefs, setBadge] = useList<SVGGElement>(3);

  useEffect(() => {
    const section = sectionRef.current;
    const root = rootRef.current;
    if (!section || !root) return;

    const attr = (node: Element | null, name: string, value: string | number) => {
      node?.setAttribute(name, typeof value === "number" ? f2(value) : value);
    };
    const n = nodesRef.current;
    let lastStep = -1;
    let lastTemp = -1;

    const render = (t: number) => {
      const follow = !reducedMotion;
      const [ki, ku] = key(t);
      const kj = Math.min(N - 1, ki + 1);
      const c = follow ? CAM[ki].map((v, i) => lerp(v, CAM[kj][i], ku)) : [480, 280, 1];
      const accent = mix(ACCENT[ki], ACCENT[kj], ku);
      const temp = Math.round(lerp(TEMP[ki], TEMP[kj], ku));
      const step = Math.min(N - 1, Math.floor(t));
      const local = cl(t - step);
      const heat = ss(1.9, 2.6, t) * (1 - ss(4.6, 5.6, t));
      const all = ss(5.85, 6.3, t);
      const dim = (a: number, b: number) => 0.36 + 0.64 * Math.max(env(t, a, b, 0.3), all);

      root.style.setProperty("--accent", accent);
      attr(camRef.current, "transform", `translate(480 280) scale(${f2(c[2])}) translate(${f2(-c[0])} ${f2(-c[1])})`);

      // Header: step, per-step progress segments, temperature.
      if (step !== lastStep && stepLabelRef.current) {
        stepLabelRef.current.textContent = `STEP ${String(step + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      }
      if (temp !== lastTemp && tempLabelRef.current) tempLabelRef.current.textContent = `${temp}°C`;
      lastTemp = temp;
      segRefs.current.forEach((s, k) => s && (s.style.transform = `scaleX(${f2(cl(t - k))})`));

      // Rolling short titles under the drawing.
      titleRefs.current.forEach((node, k) => {
        if (!node) return;
        let d = t - (k + 0.5);
        // The first and last titles hold at the ends of the scene.
        if (k === 0) d = Math.max(d, 0);
        if (k === N - 1) d = Math.min(d, 0);
        const o = 1 - ss(0.28, 0.5, Math.abs(d));
        node.style.opacity = f2(o);
        node.style.visibility = o > 0.001 ? "visible" : "hidden";
        node.style.transform = `translateY(${(-d * 26).toFixed(1)}px)`;
      });

      // Step list: done / active / upcoming, with a progress underline.
      if (step !== lastStep) {
        itemRefs.current.forEach((li, k) => {
          if (!li) return;
          li.dataset.state = t >= k + 1 ? "done" : k === step ? "active" : "todo";
          const num = numRefs.current[k];
          if (num) num.textContent = t >= k + 1 ? "✓" : String(k + 1).padStart(2, "0");
        });
      }
      barRefs.current.forEach((b, k) => b && (b.style.transform = `scaleX(${k === step ? f2(local) : 0})`));
      lastStep = step;

      // Stage emphasis.
      attr(n.feedGroup, "opacity", dim(0, 2));
      attr(n.reactorGroup, "opacity", dim(2, 3));
      attr(n.oilGroup, "opacity", dim(3, 4));
      attr(n.carbonGroup, "opacity", dim(4, 5));
      attr(n.steelGroup, "opacity", dim(5, 6));

      // 01–02 · Tyres roll into the hopper, shreds ride the conveyor.
      tyreRefs.current.forEach((node, i) => {
        const d = i * 0.3;
        const roll = ss(d, 0.85 + d, t);
        const drop = ss(0.9 + d * 0.6, 1.45 + d * 0.6, t);
        const x = lerp(-60, 160, roll);
        const y = lerp(104, 212, drop);
        attr(node, "transform", `translate(${f2(x)} ${f2(y)}) rotate(${f2(x * 1.7 + drop * 90)}) scale(${f2(lerp(1, 0.35, drop))})`);
        attr(node, "opacity", 1 - ss(1.3 + d * 0.6, 1.5 + d * 0.6, t));
      });
      const feedStroke = mix("#2a2a2a", "#2e7d4f", env(t, 1, 2, 0.2));
      attr(n.rollerA, "stroke", feedStroke);
      attr(n.rollerA, "transform", `rotate(${f2(t * 360)} 148 262)`);
      attr(n.rollerB, "stroke", feedStroke);
      attr(n.rollerB, "transform", `rotate(${f2(-t * 360)} 172 262)`);
      attr(n.belt, "stroke", feedStroke);
      attr(n.belt, "stroke-dashoffset", -t * 160);
      shredRefs.current.forEach((node, i) => {
        const vis = env(t, 1.2, 2.55, 0.25);
        const f = fr(t * 1.3 + i / 16);
        let x: number;
        let y: number;
        if (f < 0.18) {
          const u = f / 0.18;
          x = lerp(160, 178, u);
          y = lerp(272, 290, u);
        } else if (f < 0.9) {
          x = lerp(178, 340, (f - 0.18) / 0.72);
          y = 290;
        } else {
          const u = (f - 0.9) / 0.1;
          x = lerp(340, 385, u);
          y = lerp(290, 284, u);
        }
        attr(node, "transform", `translate(${f2(x)} ${f2(y)}) rotate(${f2(i * 47 + f * 140)})`);
        attr(node, "opacity", vis * ss(0, 0.05, f) * (1 - ss(0.94, 1, f)));
      });

      // 03 · Sealed reactor heats up: charge tumbles, glows, gas bubbles.
      attr(n.glow, "opacity", heat * 0.55);
      attr(n.reactor, "fill", mix("#f8f7f3", "#f7dcc2", heat));
      attr(n.drum, "stroke", mix("#9a9a94", "#e07a2e", heat));
      attr(n.drum, "transform", `rotate(${f2(t * 120)} 455 278)`);
      chargeRefs.current.forEach((node, i) => {
        const a = ((i * 30 + t * 140) * Math.PI) / 180;
        const rad = 28 + (i % 3) * 15;
        const s = 1 - ss(2.3, 3.1, t) * 0.6;
        attr(node, "transform", `translate(${f2(455 + Math.cos(a) * rad)} ${f2(278 + Math.sin(a) * rad)}) rotate(${f2(i * 40 + t * 90)}) scale(${f2(s)})`);
        attr(node, "opacity", env(t, 1.95, 3.05, 0.25) * (1 - ss(2.4, 3.1, t) * 0.85));
        attr(node, "fill", mix("#2b2b2b", "#e07a2e", heat));
      });
      bubbleRefs.current.forEach((node, i) => {
        const f = fr(t * 1.5 + i / 8);
        attr(node, "cy", 350 - f * 150);
        attr(node, "r", 3 + f * 3);
        attr(node, "opacity", env(t, 2.3, 3.9, 0.25) * (1 - ss(0.7, 1, f)));
      });
      flameRefs.current.forEach((node, i) => {
        const h = Math.max(0, heat * (18 + 10 * Math.sin(t * 22 + i * 1.7)));
        attr(node, "y", 420 - h);
        attr(node, "height", h);
        attr(node, "opacity", heat);
      });

      // 04 · Vapour travels the line, condenses, oil fills the tank.
      attr(n.pipe, "stroke-dashoffset", -t * 220);
      attr(n.pipe, "opacity", env(t, 2.7, 4.1, 0.25));
      vapourRefs.current.forEach((node, i) => {
        const f = fr(t * 1.1 + i / 10);
        const [x, y] = alongPipe(f * 280);
        attr(node, "cx", x);
        attr(node, "cy", y);
        attr(node, "opacity", env(t, 2.7, 4.1, 0.25) * ss(0, 0.08, f) * (1 - ss(0.9, 1, f)));
      });
      attr(n.coil, "stroke", mix("#2a2a2a", "#d9892f", env(t, 3, 4, 0.2)));
      const oilH = ss(3.05, 3.95, t) * 96;
      attr(n.oil, "y", 418 - oilH);
      attr(n.oil, "height", oilH);
      dropRefs.current.forEach((node, i) => {
        const f = fr(t * 2 + i / 4);
        attr(node, "cy", lerp(270, 418 - oilH, f));
        attr(node, "opacity", env(t, 3.1, 4.15, 0.2) * (1 - ss(0.85, 1, f)));
      });

      // 05 · Carbon solids fall and pile up.
      const C = ss(4.05, 4.9, t);
      granuleRefs.current.forEach((node, i) => {
        const f = fr(t * 1.6 + i / 8);
        attr(node, "cx", lerp(312, 250 + ((i % 3) - 1) * 12, f));
        attr(node, "cy", lerp(400, 466 - 60 * C, f));
        attr(node, "opacity", env(t, 4.0, 4.95, 0.2) * (1 - ss(0.85, 1, f)));
      });
      attr(n.pile, "d", `M198 470 Q250 ${f2(470 - 120 * C)} 302 470 Z`);

      // 06 · Steel wire rides to the magnet and is baled.
      const S = ss(5.1, 5.9, t);
      wireRefs.current.forEach((node, i) => {
        const f = fr(t * 1.2 + i / 6);
        attr(node, "cx", lerp(590, 830, f));
        attr(node, "opacity", env(t, 5.0, 5.95, 0.2) * ss(0, 0.08, f) * (1 - ss(0.9, 1, f)));
      });
      attr(n.magnet, "fill", mix("#8a8a84", "#b8472e", cl(env(t, 5, 6, 0.2) + all)));
      attr(n.bale, "y", 466 - 58 * S);
      attr(n.bale, "height", 58 * S);

      // 07 · Quality scan sweeps the plant; each output gets a check.
      const scanX = lerp(150, 900, ss(6.0, 6.85, t));
      attr(n.scan, "x1", scanX);
      attr(n.scan, "x2", scanX);
      attr(n.scan, "opacity", env(t, 6.05, 6.8, 0.12));
      const badgeAt: [number, number][] = [
        [700, 286],
        [250, 366],
        [861, 392],
      ];
      badgeRefs.current.forEach((node, i) => {
        const q = ss(6.05 + i * 0.12, 6.3 + i * 0.12, t);
        attr(node, "transform", `translate(${badgeAt[i][0]} ${badgeAt[i][1]}) scale(${f2(q)})`);
      });
    };

    // Scroll → t (0…7). Smoothed so wheel steps glide instead of jumping.
    const target = () => {
      const r = section.getBoundingClientRect();
      const total = Math.max(1, section.offsetHeight - window.innerHeight);
      return Math.min(N - 0.001, cl(-r.top / total) * N);
    };
    const state = { t: target() };
    render(state.t);
    if (reducedMotion) {
      const onScroll = () => render(target());
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    const to = gsap.quickTo(state, "t", { duration: SMOOTH, ease: "power2.out", onUpdate: () => render(state.t) });
    const onScroll = () => to(target());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      gsap.killTweensOf(state);
    };
    // Refs are stable; only the motion preference changes the behaviour.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="How the process works, step by step"
      className="relative"
      style={{ height: `${N * VH_PER_STEP + 100}svh` }}
    >
      {/* Screen readers get the plain steps; the animated scene is decorative. */}
      <ol className="sr-only">
        {processSteps.map((s) => (
          <li key={s.number}>
            {s.title}: {s.description}
          </li>
        ))}
      </ol>

      <div ref={rootRef} aria-hidden="true" className="sticky top-0 h-svh overflow-hidden [--accent:#2e7d4f]">
        <div className="mx-auto flex h-full max-w-[1320px] flex-wrap content-center items-center gap-x-[clamp(24px,4vw,72px)] gap-y-5 px-5 pb-5 pt-[88px] sm:px-8">
          {/* Stage */}
          <div className="flex min-w-0 flex-[1.45_1_380px] flex-col gap-3 [--reserve:360px] lg:[--reserve:230px]">
            <div className="font-mono-label flex items-center justify-between gap-4 text-[12px] tracking-[0.15em] text-[var(--accent)]">
              <span ref={stepLabelRef}>STEP 01 / 07</span>
              <div className="flex max-w-[260px] flex-1 gap-1">
                {processSteps.map((s, k) => (
                  <div key={s.number} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
                    <div ref={setSeg(k)} className="h-full origin-left bg-[var(--accent)]" style={{ transform: "scaleX(0)" }} />
                  </div>
                ))}
              </div>
              <span ref={tempLabelRef} className="min-w-[64px] text-right">
                24°C
              </span>
            </div>

            <div
              className="relative mx-auto aspect-[960/560] w-full overflow-hidden rounded-[22px] border border-ink/[0.08] bg-[#f8f7f3]"
              style={{ maxWidth: "calc((100svh - var(--reserve)) * 1.714)" }}
            >
              <svg viewBox="0 0 960 560" className="absolute inset-0 h-full w-full">
                <defs>
                  <clipPath id="plant-tank">
                    <rect x="642" y="302" width="116" height="116" rx="10" />
                  </clipPath>
                  <radialGradient id="plant-glow">
                    <stop offset="0" stopColor="#e07a2e" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#e07a2e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g ref={camRef} className="font-mono-label">
                  <line x1="-400" y1="472" x2="1400" y2="472" stroke="#e2e0d8" strokeWidth="2" />

                  {/* Feed: hopper, shredder rollers, conveyor */}
                  <g ref={node("feedGroup")}>
                    {range(2).map((i) => (
                      <g key={i} ref={setTyre(i)}>
                        <circle r="30" fill="none" stroke="#262626" strokeWidth="15" />
                        <circle r="36" fill="none" stroke="#262626" strokeWidth="4" strokeDasharray="4 5" />
                        <circle r="14" fill="#d9d6cc" stroke="#444" strokeWidth="2" />
                        <circle r="4" fill="#444" />
                      </g>
                    ))}
                    <polygon points="88,150 232,150 188,244 132,244" fill="#f8f7f3" stroke="#2a2a2a" strokeWidth="3" strokeLinejoin="round" />
                    <circle ref={node("rollerA")} cx="148" cy="262" r="12" fill="#f8f7f3" stroke="#2a2a2a" strokeWidth="4" strokeDasharray="5 3" />
                    <circle ref={node("rollerB")} cx="172" cy="262" r="12" fill="#f8f7f3" stroke="#2a2a2a" strokeWidth="4" strokeDasharray="5 3" />
                    <rect x="170" y="296" width="175" height="12" rx="6" fill="none" stroke="#2a2a2a" strokeWidth="2.5" />
                    <line ref={node("belt")} x1="178" y1="302" x2="338" y2="302" stroke="#2a2a2a" strokeWidth="2" strokeDasharray="6 8" />
                    {range(16).map((i) => (
                      <rect key={i} ref={setShred(i)} x="-5" y="-3.5" width="10" height="7" rx="1.5" fill="#2b2b2b" opacity="0" />
                    ))}
                    <text x="160" y="136" {...LABEL}>HOPPER + SHREDDER</text>
                    <text x="258" y="330" {...LABEL}>FEED CONVEYOR</text>
                  </g>

                  {/* Sealed reactor */}
                  <g ref={node("reactorGroup")}>
                    <circle ref={node("glow")} cx="455" cy="285" r="175" fill="url(#plant-glow)" opacity="0" />
                    <rect ref={node("reactor")} x="330" y="170" width="250" height="215" rx="42" fill="#f8f7f3" stroke="#2a2a2a" strokeWidth="3" />
                    <circle ref={node("drum")} cx="455" cy="278" r="80" fill="none" stroke="#9a9a94" strokeWidth="3" strokeDasharray="14 8" />
                    {range(12).map((i) => (
                      <rect key={i} ref={setCharge(i)} x="-5" y="-3.5" width="10" height="7" rx="1.5" fill="#2b2b2b" opacity="0" />
                    ))}
                    {range(8).map((i) => (
                      <circle key={i} ref={setBubble(i)} cx={395 + ((i * 29) % 120)} cy="350" r="3" fill="#c9ccce" opacity="0" />
                    ))}
                    {range(6).map((i) => (
                      <rect key={i} ref={setFlame(i)} x={372 + i * 32} y="420" width="16" height="0" rx="8" fill="#e07a2e" opacity="0" />
                    ))}
                    <line x1="350" y1="424" x2="560" y2="424" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
                    <text x="455" y="160" {...LABEL}>SEALED REACTOR · NO O₂</text>
                  </g>

                  {/* Vapour line, condenser, oil tank */}
                  <g ref={node("oilGroup")}>
                    <path d="M520 170 V110 H700 V150" fill="none" stroke="#dcdad2" strokeWidth="12" strokeLinejoin="round" />
                    <path ref={node("pipe")} d="M520 170 V110 H700 V150" fill="none" strokeWidth="3" strokeDasharray="8 10" opacity="0" style={{ stroke: "var(--accent)" }} />
                    {range(10).map((i) => (
                      <circle key={i} ref={setVapour(i)} cx="520" cy="170" r="4.5" fill="#b9bdc0" opacity="0" />
                    ))}
                    <rect x="660" y="150" width="80" height="112" rx="12" fill="#f8f7f3" stroke="#2a2a2a" strokeWidth="3" />
                    <polyline ref={node("coil")} points="672,166 728,181 672,196 728,211 672,226 728,241" fill="none" stroke="#2a2a2a" strokeWidth="3" strokeLinejoin="round" />
                    <line x1="700" y1="262" x2="700" y2="276" stroke="#2a2a2a" strokeWidth="3" />
                    {range(4).map((i) => (
                      <circle key={i} ref={setDrop(i)} cx="700" cy="270" r="4" fill="#dfa84f" opacity="0" />
                    ))}
                    <g clipPath="url(#plant-tank)">
                      <rect ref={node("oil")} x="642" y="418" width="116" height="0" fill="#dfa84f" />
                    </g>
                    <rect x="640" y="300" width="120" height="120" rx="12" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                    <text x="700" y="96" {...LABEL}>VAPOUR LINE</text>
                    <text x="785" y="210" {...LABEL} textAnchor="start">CONDENSER</text>
                    <text x="785" y="365" {...LABEL} textAnchor="start">PYROLYSIS OIL</text>
                  </g>

                  {/* Carbon solids */}
                  <g ref={node("carbonGroup")}>
                    <path d="M348 372 L314 398" stroke="#2a2a2a" strokeWidth="10" strokeLinecap="round" />
                    {range(8).map((i) => (
                      <circle key={i} ref={setGranule(i)} cx="312" cy="400" r="3.5" fill="#2b2b2b" opacity="0" />
                    ))}
                    <path ref={node("pile")} d="M198 470 Q250 470 302 470 Z" fill="#2f2f2d" />
                    <path d="M195 384 V470 H305 V384" fill="none" stroke="#2a2a2a" strokeWidth="3" strokeLinejoin="round" />
                    <text x="250" y="498" {...LABEL}>CARBON SOLIDS</text>
                  </g>

                  {/* Steel: magnet + bale */}
                  <g ref={node("steelGroup")}>
                    <path d="M566 380 L586 456" stroke="#2a2a2a" strokeWidth="8" strokeLinecap="round" />
                    <rect x="572" y="456" width="268" height="10" rx="5" fill="none" stroke="#2a2a2a" strokeWidth="2.5" />
                    {range(6).map((i) => (
                      <circle key={i} ref={setWire(i)} cx="590" cy="449" r="7" fill="none" stroke="#6d7c88" strokeWidth="2.5" strokeDasharray="3 2" opacity="0" />
                    ))}
                    <path ref={node("magnet")} d="M836 330 h52 v36 h-15 v-20 h-22 v20 h-15 z" fill="#8a8a84" />
                    <rect ref={node("bale")} x="835" y="466" width="52" height="0" rx="3" fill="#7d8b96" />
                    <text x="861" y="318" {...LABEL}>MAGNET</text>
                    <text x="861" y="498" {...LABEL}>STEEL</text>
                  </g>

                  {/* Quality scan + checks */}
                  <line ref={node("scan")} x1="150" y1="80" x2="150" y2="480" stroke="#2e7d4f" strokeWidth="2" opacity="0" />
                  {range(3).map((i) => (
                    <g key={i} ref={setBadge(i)} transform="scale(0)">
                      <circle r="15" fill="#2e7d4f" />
                      <polyline points="-6,0 -2,5 7,-5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ))}
                </g>
              </svg>
            </div>

            {/* Rolling step titles */}
            <div className="relative h-[clamp(40px,4.4vw,68px)]">
              {SHORT.map((text, k) => (
                <div
                  key={text}
                  ref={setTitle(k)}
                  className="absolute inset-x-0 text-center font-display text-[clamp(28px,3.4vw,52px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink"
                  style={{ opacity: k === 0 ? 1 : 0 }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Step list: on narrow screens only the active step shows. */}
          <ol className="min-w-0 max-w-[560px] flex-[1_1_280px] border-b border-ink/10">
            {processSteps.map((s, k) => (
              <li
                key={s.number}
                ref={setItem(k)}
                data-state={k === 0 ? "active" : "todo"}
                className="group relative grid grid-cols-[48px_minmax(0,1fr)] border-t border-ink/10 py-[clamp(8px,1.1vw,16px)] max-lg:hidden max-lg:data-[state=active]:grid"
              >
                <span
                  ref={setNum(k)}
                  className="font-mono-label pt-[5px] text-[13px] text-[#9aa597] group-data-[state=active]:text-leaf group-data-[state=done]:text-leaf"
                >
                  {s.number}
                </span>
                <div>
                  <div className="text-[clamp(16px,1.4vw,22px)] font-medium text-[#b9b9b2] transition-colors duration-300 group-data-[state=active]:text-ink group-data-[state=done]:text-muted-2">
                    {s.title}
                  </div>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-data-[state=active]:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mb-0.5 mt-2.5 max-w-[44ch] text-[clamp(14px,1.05vw,17px)] leading-[1.55] text-muted-1 opacity-0 transition-opacity duration-400 group-data-[state=active]:opacity-100">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-[-1px] left-12 right-0 h-0.5 opacity-0 group-data-[state=active]:opacity-100">
                  <div ref={setBar(k)} className="h-full origin-left bg-[var(--accent)]" style={{ transform: "scaleX(0)" }} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
