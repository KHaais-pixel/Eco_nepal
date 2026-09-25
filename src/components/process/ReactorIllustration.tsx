"use client";

// ---- Tunables -----------------------------------------------------------
export const STROKE_COLOR = "#1B2420";
export const STEP_ACCENTS = [
  "#2f7a4d", // 01 collection — brand green
  "#8A948D", // 02 preparation — neutral grey
  "#E07A2E", // 03 pyrolysis — orange
  "#D99A2B", // 04 oil recovery — amber
  "#3A3F3C", // 05 solid recovery — dark grey
  "#8A948D", // 06 steel recovery — grey
  "#2f7a4d", // 07 dispatch — brand green
];

export type PartKey =
  | "tyre-0"
  | "tyre-1"
  | "tyre-2"
  | `chip-${number}`
  | "chamber"
  | "chamber-glow"
  | "heat-0"
  | "heat-1"
  | "heat-2"
  | "droplet-0"
  | "droplet-1"
  | "droplet-2"
  | "container-fill"
  | `pile-${number}`
  | "wire-0"
  | "wire-1"
  | "wire-2"
  | "check-circle"
  | "check-mark";

export type ReactorIllustrationProps = {
  groupRef: (index: number, el: SVGGElement | null) => void;
  partRef: (index: number, key: PartKey, el: SVGElement | null) => void;
  className?: string;
};

/**
 * Flat-line illustration for the reactor stage inside the process circle.
 * One <g> per step so each stage's artwork can be swapped independently
 * later. Purely decorative — all motion is driven externally by
 * ProcessScrub via the refs handed back through `groupRef`/`partRef`.
 */
export default function ReactorIllustration({ groupRef, partRef, className = "" }: ReactorIllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      {/* 01 — Raw Material Collection: three stacked tyre outlines */}
      <g ref={(el) => groupRef(0, el)}>
        <circle ref={(el) => partRef(0, "tyre-0", el)} cx="100" cy="150" r="34" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <circle ref={(el) => partRef(0, "tyre-1", el)} cx="100" cy="118" r="34" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <circle ref={(el) => partRef(0, "tyre-2", el)} cx="100" cy="86" r="34" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
      </g>

      {/* 02 — Material Preparation: tyres broken into small chips */}
      <g ref={(el) => groupRef(1, el)}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 30 + (i % 3) * 12;
          // Rounded: Math.sin/cos can differ in the last float digit between
          // Node (server render) and the browser, causing a hydration mismatch.
          const cx = Math.round((100 + Math.cos(angle) * r) * 100) / 100;
          const cy = Math.round((100 + Math.sin(angle) * r) * 100) / 100;
          return (
            <rect
              key={i}
              ref={(el) => partRef(1, `chip-${i}`, el)}
              x={cx - 4}
              y={cy - 3}
              width="8"
              height="6"
              rx="1.5"
              fill="none"
              stroke={STROKE_COLOR}
              strokeWidth="1.5"
              transform={`rotate(${(i * 37) % 360} ${cx} ${cy})`}
            />
          );
        })}
      </g>

      {/* 03 — Pyrolysis Processing: chamber with glow + heat lines */}
      <g ref={(el) => groupRef(2, el)}>
        <rect
          ref={(el) => partRef(2, "chamber", el)}
          x="55"
          y="65"
          width="90"
          height="75"
          rx="18"
          fill="none"
          stroke={STROKE_COLOR}
          strokeWidth="1.5"
        />
        <rect
          ref={(el) => partRef(2, "chamber-glow", el)}
          x="59"
          y="69"
          width="82"
          height="67"
          rx="14"
          fill="#E07A2E"
          opacity="0"
        />
        <path ref={(el) => partRef(2, "heat-0", el)} d="M75 130 C 72 110, 82 110, 79 90 C 76 70, 86 70, 83 55" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(el) => partRef(2, "heat-1", el)} d="M100 130 C 97 110, 107 110, 104 90 C 101 70, 111 70, 108 55" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(el) => partRef(2, "heat-2", el)} d="M125 130 C 122 110, 132 110, 129 90 C 126 70, 136 70, 133 55" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 04 — Oil Recovery: droplets falling into a filling container */}
      <g ref={(el) => groupRef(3, el)}>
        <path ref={(el) => partRef(3, "droplet-0", el)} d="M88 60c0 4.5-3.5 8-7 8s-7-3.5-7-8c0-4.5 7-14 7-14s7 9.5 7 14Z" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <path ref={(el) => partRef(3, "droplet-1", el)} d="M107 78c0 4.5-3.5 8-7 8s-7-3.5-7-8c0-4.5 7-14 7-14s7 9.5 7 14Z" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <path ref={(el) => partRef(3, "droplet-2", el)} d="M122 60c0 4.5-3.5 8-7 8s-7-3.5-7-8c0-4.5 7-14 7-14s7 9.5 7 14Z" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <rect x="65" y="120" width="70" height="45" rx="4" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <rect ref={(el) => partRef(3, "container-fill", el)} x="67" y="163" width="66" height="0" fill="#D99A2B" opacity="0.85" />
      </g>

      {/* 05 — Solid Material Recovery: dark particles settling into a pile */}
      <g ref={(el) => groupRef(4, el)}>
        {Array.from({ length: 10 }).map((_, i) => {
          const cx = 62 + (i % 5) * 19 + (Math.floor(i / 5) % 2) * 9;
          return (
            <circle
              key={i}
              ref={(el) => partRef(4, `pile-${i}`, el)}
              cx={cx}
              cy={148 - Math.floor(i / 5) * 12}
              r="6"
              fill={STEP_ACCENTS[4]}
            />
          );
        })}
      </g>

      {/* 06 — Steel Recovery: curved wire strokes drawing out to the side */}
      <g ref={(el) => groupRef(5, el)}>
        <path ref={(el) => partRef(5, "wire-0", el)} d="M70 80c20-14 40-14 60 0" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(el) => partRef(5, "wire-1", el)} d="M66 104c22-16 46-16 68 0" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(el) => partRef(5, "wire-2", el)} d="M74 128c18-12 34-12 52 0" fill="none" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 07 — Quality Checks & Dispatch: brand-green check mark */}
      <g ref={(el) => groupRef(6, el)}>
        <circle ref={(el) => partRef(6, "check-circle", el)} cx="100" cy="100" r="40" fill="none" stroke={STEP_ACCENTS[6]} strokeWidth="1.5" />
        <path ref={(el) => partRef(6, "check-mark", el)} d="M82 101l13 13 24-27" fill="none" stroke={STEP_ACCENTS[6]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
