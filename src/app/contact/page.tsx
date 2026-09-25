import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import ImageBlock from "@/components/ImageBlock";
import RevealOnScroll from "@/components/RevealOnScroll";
import ContactForm from "@/components/ContactForm";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Eco Nepal Energy Industries Pvt. Ltd. at SEZ Bhairahawa, Rupandehi, Nepal, by phone, mobile, email, or enquiry form.",
};

export default function ContactPage() {
  const mapsQuery = encodeURIComponent(`${company.legalName}, ${company.address}`);
  const mobiles = company.mobiles.map((m) => m.label).join(" / ");

  return (
    <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 pb-[120px] pt-[clamp(140px,18vh,200px)] sm:px-8 md:grid-cols-2 md:gap-24">
      <RevealOnScroll>
        <Eyebrow className="mb-7">CONTACT</Eyebrow>
        <h1 className="mb-12 font-display text-[clamp(52px,6.6vw,100px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
          Let&rsquo;s talk <em className="not-italic text-leaf">tyres &amp; fuel.</em>
        </h1>
        <div className="flex flex-col">
          <div className="grid grid-cols-[120px_1fr] gap-4 border-t border-ink/[0.12] py-[18px]">
            <span className="font-mono-label text-xs text-muted-3">ADDRESS</span>
            <span className="leading-[1.55] text-ink">{company.address}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4 border-t border-ink/[0.12] py-[18px]">
            <span className="font-mono-label text-xs text-muted-3">PHONE</span>
            <span>
              <a href={company.telephoneHref} className="text-ink hover:text-forest">
                {company.telephone}
              </a>
              <br />
              <span className="text-ink">{mobiles}</span>
            </span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4 border-t border-ink/[0.12] py-[18px]">
            <span className="font-mono-label text-xs text-muted-3">EMAIL</span>
            <a href={`mailto:${company.email}`} className="text-ink hover:text-forest break-all">
              {company.email}
            </a>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4 border-y border-ink/[0.12] py-[18px]">
            <span className="font-mono-label text-xs text-muted-3">WEBSITE</span>
            <a
              href={company.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-forest"
            >
              {company.website}
            </a>
          </div>
        </div>

        <div className="mt-8">
          <ImageBlock
            alt="Map placeholder pending verified facility coordinates"
            placeholderLabel="[ map — factory location subject to confirmation ]"
            aspect="h-[220px]"
            rounded="rounded-2xl"
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-forest hover:text-leaf"
          >
            Search this address on Google Maps →
          </a>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={100} className="self-start rounded-[20px] border border-ink/[0.08] bg-stone p-7 sm:p-12">
        <ContactForm />
      </RevealOnScroll>
    </section>
  );
}
