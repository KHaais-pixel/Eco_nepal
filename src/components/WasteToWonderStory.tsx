"use client";

import { useEffect, useRef, useState } from "react";
import { storyScenes } from "@/lib/story-data";
import RevealOnScroll from "./RevealOnScroll";

const MOBILE_BREAKPOINT = 768;
// Scroll distance dedicated to each scene, in viewport-heights. Higher =
// slower, more deliberate pacing through the crossfade.
const VH_PER_SCENE = 0.9;

export default function WasteToWonderStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mode, setMode] = useState<"pending" | "scrub" | "static">("pending");
  const ready = mode !== "pending";
  const useScrub = mode === "scrub";

  useEffect(() => {
    // One-time client-only environment detection (matchMedia/window size are
    // unavailable during server render), intentionally set once on mount.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(!prefersReducedMotion && isDesktop ? "scrub" : "static");
  }, []);

  useEffect(() => {
    if (!useScrub || !containerRef.current) return;

    let triggerInstance: { kill: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!slides.length || !containerRef.current) return;

      gsap.set(slides, { opacity: 0, scale: 1.06 });
      gsap.set(slides[0], { opacity: 1, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${slides.length * VH_PER_SCENE * 100}%`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });
      triggerInstance = tl.scrollTrigger ?? undefined;

      slides.forEach((slide, i) => {
        if (i === 0) return;
        const prev = slides[i - 1];
        tl.to(prev, { opacity: 0, duration: 1, ease: "none" }, i - 1)
          .fromTo(
            slide,
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1, duration: 1, ease: "none" },
            i - 1
          );
      });

      ScrollTrigger.refresh();
    })();

    return () => {
      triggerInstance?.kill();
    };
  }, [useScrub]);

  if (!ready) {
    return <div className="h-[60vh] bg-primary-dark" aria-hidden="true" />;
  }

  if (!useScrub) {
    // Mobile / reduced-motion fallback: a simple accessible stacked sequence.
    return (
      <section
        aria-label="Waste to Wonder: how a waste tyre becomes recovered resources"
        className="space-y-3 bg-primary-dark py-3"
      >
        {storyScenes.map((scene, i) => (
          <RevealOnScroll key={scene.number}>
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.src}
                alt={scene.alt}
                loading={i < 2 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </div>
          </RevealOnScroll>
        ))}
      </section>
    );
  }

  return (
    <section aria-label="Waste to Wonder: how a waste tyre becomes recovered resources">
      {/* Screen-reader narrative, always available regardless of the visual scrub */}
      <ol className="sr-only">
        {storyScenes.map((scene) => (
          <li key={scene.number}>{scene.alt}</li>
        ))}
      </ol>

      <div ref={containerRef} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary-dark">
          {storyScenes.map((scene, i) => (
            <div
              key={scene.number}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="absolute inset-0"
            >
              {/* object-contain (not cover) so the baked-in headline and logo
                  in each frame are never cropped, regardless of viewport
                  aspect ratio; the dark backdrop makes any letterboxing
                  blend in seamlessly. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.src}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
