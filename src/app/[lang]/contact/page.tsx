import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import RevealOnScroll from "@/components/RevealOnScroll";
import ContactForm from "@/components/ContactForm";
import { getCompany } from "@/lib/cms/content";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.contact.metaTitle, description: t.contact.metaDescription };
}

// The plant is inside the Bhairahawa Special Economic Zone (Rohini, Rupandehi).
const MAP_QUERY = "Bhairahawa Special Economic Zone, Rupandehi, Nepal";

export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const c = t.contact;
  const company = await getCompany(locale);
  const mapsQuery = encodeURIComponent(MAP_QUERY);
  const mobiles = company.mobiles.map((m) => m.label).join(" / ");
  const row = "grid grid-cols-[96px_minmax(0,1fr)] gap-4 [overflow-wrap:anywhere] sm:grid-cols-[120px_minmax(0,1fr)] border-t border-ink/[0.12] py-[18px]";
  const link = "-my-2.5 inline-block py-2.5 text-ink hover:text-forest";

  return (
    <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 pb-[120px] pt-[clamp(140px,18vh,200px)] sm:px-8 md:grid-cols-2 md:gap-24">
      <RevealOnScroll>
        <Eyebrow className="mb-7">{c.eyebrow}</Eyebrow>
        <h1 className="mb-12 font-display text-[clamp(52px,6.6vw,100px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
          {c.title.pre}
          <em className="not-italic text-leaf">{c.title.em}</em>
          {c.title.post}
        </h1>
        <div className="flex flex-col">
          <div className={row}>
            <span className="font-mono-label text-xs text-muted-3">{c.address}</span>
            <span className="leading-[1.55] text-ink">{company.address}</span>
          </div>
          <div className={row}>
            <span className="font-mono-label text-xs text-muted-3">{c.phone}</span>
            <span>
              <a href={company.telephoneHref} className={link}>{company.telephone}</a>
              <br />
              <span className="text-ink">{mobiles}</span>
            </span>
          </div>
          <div className={row}>
            <span className="font-mono-label text-xs text-muted-3">{c.email}</span>
            <a href={`mailto:${company.email}`} className={`${link} break-all`}>{company.email}</a>
          </div>
          <div className={`${row} border-b`}>
            <span className="font-mono-label text-xs text-muted-3">{c.website}</span>
            <a href={company.websiteHref} target="_blank" rel="noopener noreferrer" className={link}>
              {company.website}
            </a>
          </div>
        </div>

        <div className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-stone">
            <iframe
              title={c.mapTitle}
              src={`https://www.google.com/maps?q=${mapsQuery}&z=14&hl=${locale}&output=embed`}
              width="100%"
              height="300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[300px] w-full border-0"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex py-2.5 text-sm font-semibold text-forest hover:text-leaf"
          >
            {c.openMaps}
          </a>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={100} className="self-start rounded-[20px] border border-ink/[0.08] bg-stone p-7 sm:p-12">
        <ContactForm labels={c.form} />
      </RevealOnScroll>
    </section>
  );
}
