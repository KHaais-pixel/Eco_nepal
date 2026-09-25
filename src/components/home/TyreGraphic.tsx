import { forwardRef } from "react";

/**
 * Inline SVG placeholder for the "Old tyre" hero graphic used in the
 * ProductsScrub animation. Deliberately isolated in its own component so
 * it can be swapped for a real product photo/PNG later without touching
 * the animation logic in ProductsScrub.tsx.
 */
const TyreGraphic = forwardRef<SVGSVGElement, { className?: string }>(
  function TyreGraphic({ className = "" }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {/* Tread — a thick dashed stroke reads as traction blocks */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#1c2023"
          strokeWidth="22"
          strokeDasharray="9 7"
          strokeLinecap="round"
        />
        {/* Sidewall */}
        <circle cx="100" cy="100" r="63" fill="#2a2e31" />
        {/* Rim */}
        <circle cx="100" cy="100" r="44" fill="#454b50" />
        <circle cx="100" cy="100" r="44" fill="none" stroke="#33383c" strokeWidth="2" />
        {/* Spokes */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <rect
            key={deg}
            x="97"
            y="60"
            width="6"
            height="30"
            rx="3"
            fill="#2a2e31"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        {/* Hub */}
        <circle cx="100" cy="100" r="13" fill="#15201a" />
      </svg>
    );
  }
);

export default TyreGraphic;
