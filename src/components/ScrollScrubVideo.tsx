"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ScrollScrubVideoProps = {
  src: string;
  poster: string;
  alt: string;
  /** 0–1 scroll progress through the section this video should scrub across. */
  progress: number;
  className?: string;
};

/**
 * A video whose playback position is driven entirely by scroll progress
 * (like Apple-style product pages) rather than played over time. The
 * `currentTime` is updated on every animation frame from a ref — not from
 * React state/render — so the scrub stays smooth even while scrolling
 * fast, independent of React's render cadence.
 */
export default function ScrollScrubVideo({
  src,
  poster,
  alt,
  progress,
  className = "",
}: ScrollScrubVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(progress);
  const durationRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  // Mirror the latest progress into a ref (outside of render) so the rAF
  // loop below can read it without depending on React's render cycle.
  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      durationRef.current = video.duration || 0;
      setReady(true);
    };
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  useEffect(() => {
    if (!ready || reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    let lastTime = -1;

    const tick = () => {
      const duration = durationRef.current;
      if (duration > 0) {
        const target = Math.min(duration, Math.max(0, progressRef.current * duration));
        // Only assign when the change is meaningful — repeatedly setting
        // currentTime to the same value still triggers a (discarded) seek
        // in some browsers, which is wasted work every single frame.
        if (Math.abs(target - lastTime) > 1 / 60) {
          video.currentTime = target;
          lastTime = target;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, reducedMotion]);

  // Reduced-motion fallback: land on a single representative frame instead
  // of scrubbing, and never autoplay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reducedMotion || !ready) return;
    video.currentTime = Math.min(durationRef.current, durationRef.current * 0.4);
  }, [reducedMotion, ready]);

  return (
    <video
      ref={videoRef}
      className={`h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-label={alt}
    />
  );
}
