"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ---- Tunables ----------------------------------------------------------
const STEP = 12; // px between sampled points along the ribbon
const WAVE = 460; // px wavelength of the gentle sway in the margins
const MAX_CROSS_H = 300; // max vertical span of a side-to-side crossing
const MIN_GAP = 96; // only cross where sections leave this much empty space
const MIN_CROSS_GAP = 760; // min px between crossings
const LEAF_EVERY = 480; // px of ribbon length between leaves
const CHUNK_PTS = 100; // points per piece (~1.2k px); pieces are painted once, so bigger = fewer layers
const TIP_AT = 0.62; // the growing tip sits this far down the viewport
const GROW = 0.55; // seconds the tip takes to catch up with the scroll (mouse)
const GROW_TOUCH = 0.25; // touch scrolling is already smooth: follow the finger closely
const CONTENT_MAX = 1320; // matches the site's max-w-[1320px] containers

type Pt = { x: number; y: number };
type Leaf = { len: number; x: number; y: number; angle: number; size: number; fill: string };
/** A cropped piece of the ribbon, painted once in its own small SVG at (x, y). */
type Chunk = { d: string; start: number; length: number; x: number; y: number; w: number; h: number };
type Geometry = { w: number; h: number; chunks: Chunk[]; sw: number; leaves: Leaf[] };

const LEAF_FILLS = ["#2f7a4d", "#6fae45", "#1f4d33", "#8cc152"];
const LEAF_PATH = "M0 0C3.5-6 10-8.5 18-6.5C21-5.5 23.5-2.5 24 0C23.5 2.5 21 5.5 18 6.5C10 8.5 3.5 6 0 0Z";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Anything a crossing must not pass over.
const CONTENT =
  "h1,h2,h3,h4,h5,h6,p,span,img,video,canvas,svg,table,li,a,button,input,textarea,select,figure,blockquote";

/**
 * Page-y extent of a block's visible content. For a GSAP pin-spacer the
 * pinned section starts at the spacer's top and ends at its bottom, so the
 * content is measured relative to the section and mapped onto both ends.
 */
function contentExtent(block: HTMLElement, wrapperTop: number) {
  // A sticky scroll-scene keeps its content on screen for the block's whole
  // height, even though at rest it looks mostly empty: never cross inside it.
  const sticky = [...block.querySelectorAll<HTMLElement>('[class*="sticky"],[style*="sticky"]')].some(
    (el) => getComputedStyle(el).position === "sticky"
  );
  if (sticky) {
    const r = block.getBoundingClientRect();
    const top = r.top + window.scrollY - wrapperTop;
    return { top, bottom: top + r.height };
  }
  const pinned = block.classList.contains("pin-spacer") ? (block.firstElementChild as HTMLElement | null) : null;
  const ref = pinned ?? block;
  const refRect = ref.getBoundingClientRect();
  let top = Infinity;
  let bottom = -Infinity;
  ref.querySelectorAll(CONTENT).forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    top = Math.min(top, r.top - refRect.top);
    bottom = Math.max(bottom, r.bottom - refRect.top);
  });
  const blockRect = block.getBoundingClientRect();
  const blockTop = blockRect.top + window.scrollY - wrapperTop;
  if (top === Infinity) return { top: blockTop, bottom: blockTop + blockRect.height };
  return {
    top: blockTop + top,
    bottom: pinned ? blockTop + blockRect.height - (refRect.height - bottom) : blockTop + bottom,
  };
}

/**
 * Lays the ribbon out against the real page: it sways inside the side
 * margins (never over body text) and swaps sides only across the gaps
 * between top-level sections, where there is padding rather than content.
 */
function layout(wrapper: HTMLElement) {
  const w = wrapper.clientWidth;
  const h = wrapper.offsetHeight;
  const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
  const pad = w >= 640 ? 32 : 20; // container px-8 / px-5
  const gutter = Math.max(pad, (w - CONTENT_MAX) / 2 + pad);
  const sw = clamp(gutter * 0.28, 5, 13);
  const amp = clamp(gutter / 2 - sw / 2 - 3, 0, 26);
  const sideX = (side: 0 | 1) => (side === 0 ? gutter / 2 : w - gutter / 2);
  const xAt = (side: 0 | 1, y: number) => sideX(side) + amp * Math.sin((y / WAVE) * Math.PI * 2);

  // Crossings go only through real empty space between consecutive
  // sections (pin-spacers count as one block; the footer is the last).
  const blocks = [...wrapper.querySelectorAll("main > *"), wrapper.querySelector("footer")].filter(
    Boolean
  ) as HTMLElement[];
  const extents = blocks.map((b) => contentExtent(b, wrapperTop));
  const crossings: { mid: number; span: number }[] = [];
  for (let i = 1; i < extents.length; i++) {
    const gapTop = extents[i - 1].bottom;
    const gapBottom = extents[i].top;
    const mid = (gapTop + gapBottom) / 2;
    const last = crossings.at(-1)?.mid ?? 0;
    if (gapBottom - gapTop >= MIN_GAP && mid > 420 && mid < h - 200 && mid - last >= MIN_CROSS_GAP) {
      crossings.push({ mid, span: Math.min(MAX_CROSS_H, gapBottom - gapTop - 24) });
    }
  }

  const pts: Pt[] = [];
  let side: 0 | 1 = 0;
  let y = 0;
  const run = (toY: number) => {
    for (; y < toY; y += STEP) pts.push({ x: xAt(side, y), y });
  };
  crossings.forEach(({ mid, span }) => {
    run(mid - span / 2);
    // Smooth S-curve to the other margin (cubic Bézier).
    const a = { x: xAt(side, mid - span / 2), y: mid - span / 2 };
    const next: 0 | 1 = side === 0 ? 1 : 0;
    const b = { x: xAt(next, mid + span / 2), y: mid + span / 2 };
    const c1 = { x: a.x, y: a.y + span * 0.55 };
    const c2 = { x: b.x, y: b.y - span * 0.55 };
    const n = Math.ceil(Math.hypot(b.x - a.x, span) / STEP);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const u = 1 - t;
      pts.push({
        x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
        y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
      });
    }
    side = next;
    y = b.y + STEP;
  });
  run(h - 24);

  const lens = [0];
  for (let i = 1; i < pts.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }

  // Leaves sprout alternately to either side, like a vine. In narrow
  // margins they all point toward the page edge, away from the text.
  const leafSize = clamp(gutter * 0.45, 9, 22) / 24;
  const narrow = gutter < 60;
  const leaves: Leaf[] = [];
  for (let len = LEAF_EVERY * 0.6, k = 0; len < lens.at(-1)! - 80; len += LEAF_EVERY, k++) {
    const { x, y: ly, angle } = pointAt(pts, lens, len);
    // Heading down (≈90°): +58° points left, −58° points right.
    const towardEdge = x < w / 2 ? 58 : -58;
    const turn = narrow ? towardEdge : k % 2 ? 58 : -58;
    leaves.push({ len, x, y: ly, angle: angle + turn, size: leafSize, fill: LEAF_FILLS[k % 4] });
  }

  // Split into short pieces, each painted once in its own tightly cropped
  // SVG. Growth is a reveal from the top done purely with GPU transforms
  // (see render), so scrolling never repaints the ribbon. Neighbours overlap
  // by one point with flat ends, so joins are invisible.
  const bleed = sw + 4;
  const chunks: Chunk[] = [];
  for (let i = 0; i < pts.length - 1; i += CHUNK_PTS) {
    const end = Math.min(i + CHUNK_PTS + 1, pts.length - 1);
    const seg = pts.slice(i, end + 1);
    const x0 = Math.floor(Math.min(...seg.map((p) => p.x)) - bleed);
    const y0 = Math.floor(Math.min(...seg.map((p) => p.y)) - bleed);
    const x1 = Math.ceil(Math.max(...seg.map((p) => p.x)) + bleed);
    const y1 = Math.ceil(Math.max(...seg.map((p) => p.y)) + bleed);
    const d = seg.map((p, k) => `${k ? "L" : "M"}${(p.x - x0).toFixed(1)} ${(p.y - y0).toFixed(1)}`).join("");
    const start = lens[i];
    const length = lens[end] - lens[i];
    chunks.push({ d, start, length, x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
  }
  return { geometry: { w, h, chunks, sw, leaves }, pts, lens };
}

function pointAt(pts: Pt[], lens: number[], len: number) {
  let lo = 0;
  let hi = lens.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lens[mid] < len) lo = mid + 1;
    else hi = mid;
  }
  const i = clamp(lo, 1, pts.length - 1);
  const a = pts[i - 1];
  const b = pts[i];
  const t = clamp((len - lens[i - 1]) / (lens[i] - lens[i - 1] || 1), 0, 1);
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

/** Ribbon length whose tip sits at page-y `targetY` (the ribbon only descends). */
function lengthAtY(pts: Pt[], lens: number[], targetY: number) {
  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pts[mid].y < targetY) lo = mid + 1;
    else hi = mid;
  }
  return lens[lo];
}

/**
 * Decorative eco ribbon that grows down the page with the scroll, sprouting
 * leaves as it goes. Purely visual: aria-hidden and pointer-events: none.
 * Rendered inside the site wrapper, so it spans exactly the page height.
 */
export default function EcoRibbon() {
  const rootRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tipRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dataRef = useRef<{ pts: Pt[]; lens: number[] }>({ pts: [], lens: [] });
  // Drawn length survives re-layouts (late images, resizes) so the ribbon
  // doesn't regrow from the top; a new page starts it from zero again.
  const lenRef = useRef(0);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const rebuild = useCallback(() => {
    const wrapper = rootRef.current?.parentElement;
    if (!wrapper) return;
    const { geometry, pts, lens } = layout(wrapper);
    dataRef.current = { pts, lens };
    setGeo(geometry);
  }, []);

  // Re-lay the ribbon whenever the page's size changes (content loads,
  // pinned sections add scroll space, window resizes) or the route changes.
  useLayoutEffect(() => {
    const wrapper = rootRef.current?.parentElement;
    if (!wrapper) return;
    let frame = 0;
    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      timer = window.setTimeout(() => (frame = requestAnimationFrame(rebuild)), 120);
    };
    lenRef.current = 0;
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(wrapper);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [rebuild, pathname]);

  // Scroll → drawn length. Only stroke-dashoffset and transforms change.
  useEffect(() => {
    if (!geo) return;
    const { pts, lens } = dataRef.current;
    const total = lens.at(-1) ?? 0;
    const chunks = geo.chunks;
    const clips = clipRefs.current.slice(0, chunks.length);
    const inners = innerRefs.current.slice(0, chunks.length);
    const shownPx = chunks.map(() => -1);
    const leaves = leafRefs.current.slice(0, geo.leaves.length);
    const shown = geo.leaves.map(() => false);
    const state = { len: Math.min(lenRef.current, total) };

    // Reveal a piece down to page-y `tipY`: the clip box slides up by the
    // hidden amount while its content slides back down by the same amount,
    // so the drawing stays put and only the visible window moves. Both are
    // transforms on composited layers: no layout, no paint.
    const reveal = (c: number, tipY: number) => {
      const chunk = chunks[c];
      const px = Math.round(clamp(tipY - chunk.y, 0, chunk.h));
      if (px === shownPx[c]) return; // untouched pieces cost nothing
      shownPx[c] = px;
      const clip = clips[c];
      const inner = inners[c];
      if (!clip || !inner) return;
      const hidden = chunk.h - px;
      const active = px > 0 && px < chunk.h;
      clip.style.visibility = px > 0 ? "visible" : "hidden";
      clip.style.transform = hidden ? `translate3d(0, ${-hidden}px, 0)` : "";
      inner.style.transform = hidden ? `translate3d(0, ${hidden}px, 0)` : "";
      // Only the growing piece is kept on its own GPU layers.
      clip.style.willChange = inner.style.willChange = active ? "transform" : "auto";
    };

    const render = () => {
      const len = state.len;
      lenRef.current = len;
      const { x, y, angle } = pointAt(pts, lens, Math.max(len, 1));
      const tipY = len >= total - 0.5 ? Infinity : y;
      for (let c = 0; c < chunks.length; c++) reveal(c, tipY);
      const tip = tipRef.current;
      if (tip) {
        tip.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${angle.toFixed(1)}deg)`;
        tip.style.opacity = len > 2 && len < total - 2 ? "1" : "0";
      }
      geo.leaves.forEach((leaf, i) => {
        const on = len >= leaf.len;
        if (on === shown[i] || !leaves[i]) return;
        shown[i] = on;
        gsap.to(leaves[i], {
          scale: on ? 1 : 0,
          duration: on ? 0.55 : 0.25,
          ease: on ? "back.out(2.6)" : "power2.in",
          overwrite: true,
        });
      });
    };

    gsap.set(leaves, { scale: 0, transformOrigin: "0% 50%", force3D: true });

    if (reducedMotion) {
      state.len = total;
      render();
      return;
    }

    const target = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / max, 0, 1);
      const tipY = window.scrollY + window.innerHeight * (TIP_AT + (1 - TIP_AT) * p);
      return p >= 0.999 ? total : lengthAtY(pts, lens, tipY);
    };

    // Start the ribbon from the top of the page and grow it into place.
    render();
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const tween = gsap.quickTo(state, "len", { duration: touch ? GROW_TOUCH : GROW, ease: "power3.out", onUpdate: render });
    tween(target());
    const onScroll = () => tween(target());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(state);
      gsap.killTweensOf(leaves);
    };
  }, [geo, reducedMotion]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {geo &&
        geo.chunks.map((chunk, c) => (
          <div
            key={c}
            ref={(el) => {
              clipRefs.current[c] = el;
            }}
            className="absolute overflow-hidden"
            style={{ left: chunk.x, top: chunk.y, width: chunk.w, height: chunk.h, visibility: "hidden" }}
          >
            <div
              ref={(el) => {
                innerRefs.current[c] = el;
              }}
            >
              <svg width={chunk.w} height={chunk.h} viewBox={`0 0 ${chunk.w} ${chunk.h}`} className="block" fill="none">
                <defs>
                  {/* Page-anchored gradient, so colour flows continuously across pieces. */}
                  <linearGradient
                    id={`eco-ribbon-${c}`}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1={-chunk.y}
                    x2="0"
                    y2={1600 - chunk.y}
                    spreadMethod="reflect"
                  >
                    <stop offset="0" stopColor="#1f4d33" />
                    <stop offset="0.4" stopColor="#2f7a4d" />
                    <stop offset="0.75" stopColor="#6fae45" />
                    <stop offset="1" stopColor="#9ccf5a" />
                  </linearGradient>
                </defs>
                {/* Dark edge, ribbon body, and a thin highlight for a satin sheen. */}
                <path d={chunk.d} stroke="#1f4d33" strokeWidth={geo.sw + 3} strokeLinejoin="round" />
                <path d={chunk.d} stroke={`url(#eco-ribbon-${c})`} strokeWidth={geo.sw} strokeLinejoin="round" />
                <path d={chunk.d} stroke="#d9ecb4" strokeWidth={Math.max(1.2, geo.sw * 0.18)} strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}

      {/* Leaves: tiny GPU layers that pop in with a transform (no repaint). */}
      {geo &&
        geo.leaves.map((leaf, i) => (
          <div
            key={i}
            className="absolute left-0 top-0 h-0 w-0"
            style={{ transform: `translate3d(${leaf.x.toFixed(1)}px, ${leaf.y.toFixed(1)}px, 0) rotate(${leaf.angle.toFixed(1)}deg)` }}
          >
            <div
              ref={(el) => {
                leafRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
              style={{ transform: "scale(0)" }}
            >
              <svg
                width={24 * leaf.size}
                height={20 * leaf.size}
                viewBox="0 -10 24 20"
                className="absolute left-0 block"
                style={{ top: -10 * leaf.size }}
              >
                <path d={LEAF_PATH} fill={leaf.fill} />
                <path d="M2 0H20" stroke="rgba(245,244,238,0.55)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ))}

      {/* Growing tip: a small sprout on its own GPU layer, moved by transform. */}
      {geo && (
        <div ref={tipRef} className="absolute left-0 top-0 h-0 w-0 opacity-0 will-change-transform">
          <svg width="40" height="40" viewBox="-20 -20 40 40" className="absolute -left-5 -top-5 overflow-visible" fill="none">
            <g transform={`scale(${clamp(geo.sw / 11, 0.55, 1.15)})`}>
              <path d={LEAF_PATH} transform="rotate(-38) scale(0.8)" fill="#6fae45" />
              <path d={LEAF_PATH} transform="rotate(38) scale(0.8)" fill="#2f7a4d" />
              <circle r="5" fill="#c9e27a" stroke="#1f4d33" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
