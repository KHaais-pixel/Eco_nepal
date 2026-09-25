import { gsap } from "gsap";

/**
 * A tiny continuous "odometer" digit column: a vertical strip of glyphs
 * translated by a fractional index, so a value can be driven smoothly by
 * scroll progress (rather than discrete text swaps) and stays trivially
 * reversible under scrub.
 */
export type OdometerColumn = {
  el: HTMLDivElement;
  /** Set the column to a (possibly fractional) index into `glyphs`. */
  setIndex: (index: number) => void;
};

export function buildOdometerColumn(
  container: HTMLElement,
  glyphs: string[],
  glyphHeightPx: number,
  className = ""
): OdometerColumn {
  // Hide (never remove) any server-rendered fallback glyph, so a
  // React-owned node isn't pulled out from under React.
  container.querySelectorAll<HTMLElement>("[data-odometer-fallback]").forEach((n) => {
    n.style.display = "none";
  });

  const el = document.createElement("div");
  el.className = className;
  el.style.position = "relative";
  el.style.overflow = "hidden";
  el.style.height = `${glyphHeightPx}px`;

  const strip = document.createElement("div");
  strip.style.display = "flex";
  strip.style.flexDirection = "column";
  glyphs.forEach((g) => {
    const glyphEl = document.createElement("div");
    glyphEl.style.height = `${glyphHeightPx}px`;
    glyphEl.style.display = "flex";
    glyphEl.style.alignItems = "center";
    glyphEl.style.justifyContent = "center";
    glyphEl.textContent = g;
    strip.appendChild(glyphEl);
  });
  el.appendChild(strip);
  container.appendChild(el);

  const setIndex = gsap.quickSetter(strip, "y", "px") as (v: number) => void;

  return {
    el,
    setIndex: (index: number) => {
      const clamped = Math.max(0, Math.min(glyphs.length - 1, index));
      setIndex(-clamped * glyphHeightPx);
    },
  };
}
