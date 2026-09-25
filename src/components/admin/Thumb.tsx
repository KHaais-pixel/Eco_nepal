import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function Thumb({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-ink/[0.05] ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="320px" unoptimized={src.startsWith("/uploads/")} className="object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-4">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
          <span className="text-[11px]">No image yet</span>
        </div>
      )}
    </div>
  );
}
