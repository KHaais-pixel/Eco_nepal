"use client";

import { useRef } from "react";
import { useScrollStoryProgress } from "@/hooks/useScrollStoryProgress";
import ScrollScrubVideo from "./ScrollScrubVideo";
import Eyebrow from "./Eyebrow";

export type StoryLabels = {
  eyebrow: string;
  videoAria: string;
  note: string;
  items: { n: string; title: string; body: string; pct: string; pctLabel: string }[];
};

export default function HomeStoryScroll({ labels }: { labels: StoryLabels }) {
  const ref = useRef<HTMLElement>(null);
  const { progressRef, activeIndex } = useScrollStoryProgress(ref, labels.items.length);
  const active = labels.items[activeIndex];

  return (
    <section
      ref={ref}
      className="relative border-y border-ink/[0.08] bg-stone"
      style={{ height: "340vh" }}
    >
      <div className="sticky top-[72px] mx-auto grid h-[calc(100svh-72px)] max-w-[1320px] grid-cols-1 content-center items-center gap-4 overflow-hidden px-5 py-4 sm:px-8 md:grid-cols-2 md:gap-16 md:py-6">
        <div className="relative h-[min(34svh,300px)] overflow-hidden rounded-[20px] bg-stone md:h-[min(64vh,560px)]">
          <ScrollScrubVideo
            src="/story-scrub/tyre-scrub.mp4"
            poster="/story-scrub/tyre-scrub-poster.jpg"
            alt={labels.videoAria}
            progressRef={progressRef}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
            <div className="font-display text-[clamp(64px,11vw,160px)] leading-[0.8] tracking-[-0.03em] text-lime">
              {active.pct}
            </div>
            <div className="font-mono-label text-right text-[11px] text-cream/80">{active.pctLabel}</div>
          </div>
        </div>

        <div>
          <Eyebrow className="mb-3 md:mb-5">{labels.eyebrow}</Eyebrow>
          <div className="flex flex-col md:gap-1.5">
            {labels.items.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={item.n}
                  className="border-t border-ink/10 py-2 sm:py-3"
                  style={{ opacity: isActive ? 1 : 0.28, transition: "opacity 0.4s" }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono-label text-xs text-leaf">{item.n}</span>
                    <span className="font-display text-[clamp(20px,3vw,34px)] leading-[1.05]">{item.title}</span>
                  </div>
                  {isActive && (
                    <p className="ml-9 mt-1.5 max-w-[420px] text-[14px] leading-[1.5] text-muted-2 md:mt-2 md:text-[15px] md:leading-[1.55]">
                      {item.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="font-mono-label mt-3 text-[11px] leading-[1.5] text-muted-4 md:mt-6">{labels.note}</p>
        </div>
      </div>
    </section>
  );
}
