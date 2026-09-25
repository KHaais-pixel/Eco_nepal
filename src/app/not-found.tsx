import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex min-h-[70svh] max-w-[1320px] flex-col justify-center px-5 py-24 sm:px-8"
      >
        <div className="font-mono-label mb-6 text-xs text-leaf">ERROR 404</div>
        <h1 className="mb-6 max-w-[900px] font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.98] tracking-[-0.025em] text-ink">
          This page has been <em className="not-italic text-leaf">recycled.</em>
        </h1>
        <p className="mb-10 max-w-[520px] text-lg leading-[1.6] text-muted-1">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Try one of these instead.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/" variant="dark">Back to home</Button>
          <Button href="/products" variant="outline">Our products</Button>
          <Button href="/contact" variant="outline">Contact us</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
