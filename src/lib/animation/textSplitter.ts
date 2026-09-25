/**
 * Minimal, dependency-free text-splitting helpers used to build scrub-safe
 * word/line reveal and roll animations without a paid GSAP text plugin.
 *
 * These mutate the DOM in place (wrapping words/lines in spans), so callers
 * should only run them client-side, after mount, and should treat the
 * original text content as the source of truth for SSR/no-JS fallback.
 */

/**
 * Wraps every word inside `root` in its own inline-block <span>, preserving
 * whitespace as plain text nodes so normal line-wrapping still happens.
 * Descends into child elements (e.g. an inner <em>) so their words are
 * split too, unless that element is passed as `exclude` — useful when a
 * caller wants to split an excluded child separately (e.g. to treat it as
 * a distinct animation group).
 */
export function splitWordsInline(root: HTMLElement, exclude?: Element | null): HTMLSpanElement[] {
  const words: HTMLSpanElement[] = [];

  const walk = (node: ChildNode) => {
    if (exclude && node === exclude) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text) return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      parts.forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "inline-block";
          span.textContent = part;
          frag.appendChild(span);
          words.push(span);
        }
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  };

  Array.from(root.childNodes).forEach(walk);
  return words;
}

/** Groups already-split word spans into visual lines using their offsetTop. */
export function groupIntoLines(words: HTMLSpanElement[]): HTMLSpanElement[][] {
  const lines: HTMLSpanElement[][] = [];
  let lastTop: number | null = null;
  words.forEach((word) => {
    const top = word.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1].push(word);
  });
  return lines;
}

/**
 * Re-parents each line's words into its own `overflow-hidden` wrapper div
 * (in document order), so each line can be masked/rolled independently.
 * Returns the wrapper elements, one per line.
 */
export function wrapLines(lines: HTMLSpanElement[][]): HTMLDivElement[] {
  const wrappers: HTMLDivElement[] = [];
  lines.forEach((line) => {
    if (!line.length) return;
    const first = line[0];
    const parent = first.parentElement;
    if (!parent) return;
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    wrapper.style.display = "block";
    parent.insertBefore(wrapper, first);
    line.forEach((word) => {
      // Pull along any trailing whitespace text node so word-spacing survives.
      const next = word.nextSibling;
      wrapper.appendChild(word);
      if (next && next.nodeType === Node.TEXT_NODE && /^\s+$/.test(next.textContent ?? "")) {
        wrapper.appendChild(next);
      }
    });
    wrappers.push(wrapper);
  });
  return wrappers;
}
