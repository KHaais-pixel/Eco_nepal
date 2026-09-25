"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Tracks 0–1 scroll progress through a tall container (typically several
 * viewport-heights, with a sticky inner panel), and the active index into
 * `count` evenly-sized steps. Used to drive sticky "story" sections where a
 * numbered list highlights as the user scrolls past each step.
 */
export function useScrollStoryProgress(
  ref: RefObject<HTMLElement | null>,
  count: number
) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const compute = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - vh)));
      setProgress(p);
      setActiveIndex(Math.min(count - 1, Math.floor(p * count)));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, count]);

  return { progress, activeIndex };
}
