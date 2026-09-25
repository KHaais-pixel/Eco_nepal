"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function HeroVideo({ labels }: { labels: { aria: string; mute: string; unmute: string } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Set `muted` imperatively on the element itself, and explicitly call
  // play(). Relying on the JSX `muted` attribute alone is unreliable for
  // autoplay: browsers check the live DOM property at the moment autoplay
  // is attempted, and React doesn't always sync that property in time.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const tryPlay = () => {
      video.muted = muted;
      video.play().catch(() => {
        // Autoplay was blocked (e.g. low-power mode); the poster stays
        // visible and the viewer can press play via the native fallback.
      });
    };

    tryPlay();

    // Defensive resume: browsers commonly pause background/inactive-tab
    // video for power saving, and some also pause an autoplaying element
    // that briefly loses visibility for other reasons. Resume automatically
    // once the tab (and the video itself) is visible again.
    const onVisibility = () => {
      if (document.visibilityState === "visible" && video.paused) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    video.addEventListener("pause", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("pause", onVisibility);
    };
  }, [muted, reducedMotion, visible]);

  return (
    <div
      ref={wrapRef}
      className={`relative h-[clamp(360px,62vh,680px)] overflow-hidden rounded-[20px] bg-ink ${
        reducedMotion ? "" : `clip-reveal ${visible ? "clip-reveal-visible" : ""}`
      }`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/video/hero.mp4"
        poster="/video/hero-poster.jpg"
        muted
        loop
        playsInline
        autoPlay={!reducedMotion}
        controls={reducedMotion}
        aria-label={labels.aria}
      />
      {!reducedMotion && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? labels.unmute : labels.mute}
          className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-cream backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
