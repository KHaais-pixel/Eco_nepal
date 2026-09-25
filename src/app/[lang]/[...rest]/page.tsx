import { notFound } from "next/navigation";

// Any URL that matches no page renders the localized not-found.tsx inside
// the site layout (header, footer, ribbon) instead of the bare default 404.
export function generateStaticParams() {
  return [];
}

export default function CatchAllPage() {
  notFound();
}
