import {
  company,
  fuelCharApplications,
  fuelCharSections,
  fuelCharSpecs,
  galleryImages,
  homeProducts,
  pyrolysisOilApplications,
  pyrolysisOilSections,
  pyrolysisOilSpecs,
  recoveredSteelSections,
  steelApplications,
  steelSpecs,
} from "@/lib/site-data";
import type { SiteContent } from "./types";

// Seed content, taken from the site's original hard-coded copy. Used until
// an admin first saves a section, and to fill any field missing from the
// saved data (e.g. after a new field is added in a future release).
export const DEFAULT_CONTENT: SiteContent = {
  company: {
    legalName: company.legalName,
    shortName: company.shortName,
    address: company.address,
    telephone: company.telephone,
    mobiles: company.mobiles.map((m) => m.label),
    email: company.email,
    website: company.website,
    chairman: {
      name: "Ajay Man Shrestha",
      title: "Chairman, Eco Nepal Energy Industries Pvt. Ltd.",
      quote:
        "We are proud to be a pioneer in Nepal’s pyrolysis industry, leading the production of pyrolysis oil from waste tires and rubber scraps.",
      paragraphs: [
        "Our journey thus far has been marked by dedication, innovation, and integrity. With a skilled team, experienced management, and state-of-the-art infrastructure, we have quickly gained the trust and appreciation of our clients.",
        "The promoters bring decades of experience across diverse industries — from large-scale noodle and biscuit production to GI pipe fittings, brick production, furnace oil, and automobile businesses — giving us a strong foundation to navigate challenges and seize opportunities.",
        "Together, we envision a cleaner and more sustainable Nepal, where innovation and responsibility go hand in hand.",
      ],
    },
  },
  products: [
    {
      slug: "pyrolysis-oil",
      num: "01",
      name: homeProducts[0].name,
      tag: homeProducts[0].tag,
      short: homeProducts[0].short,
      description:
        "A dark liquid fuel condensed from tyre pyrolysis vapour. Intended for use as an industrial furnace oil substitute in compatible boilers, kilns, and furnaces, subject to equipment suitability, product testing, and safe handling.",
      image: homeProducts[0].imageSrc,
      imageAlt: homeProducts[0].imageAlt,
      applications: [...pyrolysisOilApplications],
      specs: pyrolysisOilSpecs.map((s) => ({ ...s })),
      sections: pyrolysisOilSections.map((s) => ({ ...s, items: [...s.items] })),
    },
    {
      slug: "fuel-char",
      num: "02",
      name: homeProducts[1].name,
      tag: homeProducts[1].tag,
      short: homeProducts[1].short,
      description:
        "The carbon-rich solid left after tyre pyrolysis. Can be considered for selected industrial fuel applications and material uses, depending on its quality, composition, and the requirements of the end user.",
      image: homeProducts[1].imageSrc,
      imageAlt: homeProducts[1].imageAlt,
      applications: [...fuelCharApplications],
      specs: fuelCharSpecs.map((s) => ({ ...s })),
      sections: fuelCharSections.map((s) => ({ ...s, items: [...s.items] })),
    },
    {
      slug: "recovered-steel",
      num: "03",
      name: homeProducts[2].name,
      tag: homeProducts[2].tag,
      short: homeProducts[2].short,
      description:
        "Bead and belt wire separated from end-of-life tyres, prepared as scrap material for suitable industrial metal-recycling applications.",
      image: homeProducts[2].imageSrc,
      imageAlt: homeProducts[2].imageAlt,
      applications: [...steelApplications],
      specs: steelSpecs.map((s) => ({ ...s })),
      sections: recoveredSteelSections.map((s) => ({ ...s, items: [...s.items] })),
    },
  ],
  gallery: galleryImages.map((g) => ({ ...g, image: null })),
};
