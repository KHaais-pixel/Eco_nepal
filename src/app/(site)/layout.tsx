import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Public pages are prerendered from the admin-editable content in DATA_DIR.
// Admin saves refresh them immediately (revalidatePath); this is a safety net
// so a build made without the live data catches up within 5 minutes.
export const revalidate = 300;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
