import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "forest" | "lime" | "outline" | "outlineOnDark" | "ghost";
  className?: string;
  external?: boolean;
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-leaf";

const variants: Record<string, string> = {
  dark: "bg-ink text-cream hover:bg-forest",
  forest: "bg-forest text-cream hover:bg-leaf",
  lime: "bg-lime text-deep hover:bg-lime/90",
  outline: "border border-ink/25 text-ink hover:border-ink",
  outlineOnDark: "border border-cream/30 text-cream hover:border-cream",
  ghost: "text-forest hover:text-leaf",
};

export default function Button({
  href,
  children,
  variant = "dark",
  className = "",
  external = false,
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
