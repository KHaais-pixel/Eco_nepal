export default function Eyebrow({
  children,
  tone = "leaf",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "leaf" | "lime" | "muted";
  className?: string;
}) {
  const tones = {
    leaf: "text-leaf",
    lime: "text-lime",
    muted: "text-muted-3",
  };
  return (
    <div className={`font-mono-label text-xs ${tones[tone]} ${className}`}>{children}</div>
  );
}
