import type { Metadata } from "next";
import { fontClasses } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Eco Nepal Energy" },
  robots: { index: false, follow: false },
};

// Root layout for the admin panel (the public site has its own under
// app/[lang]). The panel itself is English only.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        <div className="min-h-screen bg-stone text-ink">{children}</div>
      </body>
    </html>
  );
}
