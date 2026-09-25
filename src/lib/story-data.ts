export type StoryScene = {
  number: string;
  src: string;
  alt: string;
};

// "Waste to Wonder" cinematic scroll sequence.
// Each frame is a fully composed illustrative concept visual (not verified
// facility photography) used to narrate the waste-tyre-to-recovered-resource
// story. Swap these for the company's own verified photography when available.
export const storyScenes: StoryScene[] = [
  {
    number: "01",
    src: "/story/scene-01.webp",
    alt: "Concept illustration: a field of discarded waste tyres at dawn, representing the scale of the waste tyre challenge",
  },
  {
    number: "02",
    src: "/story/scene-02.webp",
    alt: "Concept illustration: a close-up of a single waste tyre, representing recoverable material value",
  },
  {
    number: "03",
    src: "/story/scene-03.webp",
    alt: "Concept illustration: a stylized depiction of a tyre beginning processing",
  },
  {
    number: "04",
    src: "/story/scene-04.webp",
    alt: "Concept illustration: shredded tyre material prepared for further processing",
  },
  {
    number: "05",
    src: "/story/scene-05.webp",
    alt: "Concept illustration: a stylized pyrolysis reactor vessel in an industrial setting",
  },
  {
    number: "06",
    src: "/story/scene-06.webp",
    alt: "Concept illustration: industrial piping representing controlled thermal processing",
  },
  {
    number: "07",
    src: "/story/scene-07.webp",
    alt: "Concept illustration: dark liquid pyrolysis oil being poured, representing recovered fuel oil",
  },
  {
    number: "08",
    src: "/story/scene-08.webp",
    alt: "Concept illustration: a pile of recovered carbon-rich fuel char material",
  },
  {
    number: "09",
    src: "/story/scene-09.webp",
    alt: "Concept illustration: coiled recovered steel wire in an industrial setting",
  },
  {
    number: "10",
    src: "/story/scene-10.webp",
    alt: "Concept illustration: baled processed tyre material ready for dispatch",
  },
  {
    number: "11",
    src: "/story/scene-11.webp",
    alt: "Concept illustration: a stylized recycling facility set against a mountain landscape",
  },
  {
    number: "12",
    src: "/story/scene-12.webp",
    alt: "Concept illustration: a delivery truck on a mountain road at sunrise, closing the recovery story",
  },
];
