import ImageBlock from "./ImageBlock";
import RevealOnScroll from "./RevealOnScroll";

export default function ApplicationGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, i) => (
        <RevealOnScroll key={item} delay={i * 50} className="flex flex-col gap-3.5">
          <ImageBlock
            alt={item}
            placeholderLabel={`[ ${item} ]`}
            aspect="aspect-square"
            rounded="rounded-[14px]"
          />
          <span className="text-[16px] font-semibold text-ink">{item}</span>
        </RevealOnScroll>
      ))}
    </div>
  );
}
