export const company = {
  legalName: "Eco Nepal Energy Industries Pvt. Ltd.",
  shortName: "Eco Nepal Energy",
  address: "SEZ Bhairahawa, Rohini-1, Rupandehi, Nepal",
  telephone: "+977 71 536039",
  telephoneHref: "tel:+97771536039",
  mobiles: [
    { label: "9857070599", href: "tel:+9779857070599" },
    { label: "9866157800", href: "tel:+9779866157800" },
  ],
  email: "econepal2023@gmail.com",
  website: "www.econepalenergy.com.np",
  websiteHref: "https://www.econepalenergy.com.np",
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; blurb: string }[];
};

export const productLinks = [
  {
    label: "Pyrolysis Oil",
    href: "/products/pyrolysis-oil",
    blurb: "Liquid industrial fuel recovered from waste tyres",
  },
  {
    label: "Fuel Char / Carbon Product",
    href: "/products/fuel-char",
    blurb: "Carbon-rich solid material for selected fuel uses",
  },
  {
    label: "Recovered Steel",
    href: "/products/recovered-steel",
    blurb: "Steel wire scrap recovered from end-of-life tyres",
  },
  {
    label: "Lab Reports",
    href: "/lab-reports",
    blurb: "ASTM test results and fuel oil comparisons",
  },
];

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products", children: productLinks },
  { label: "Our Process", href: "/process" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
];

export const processSteps = [
  {
    number: "01",
    title: "Raw Material Collection",
    description:
      "Waste tyres and rubber scraps are collected and received for processing.",
  },
  {
    number: "02",
    title: "Material Preparation",
    description:
      "Incoming materials are inspected and prepared according to the company's process requirements.",
  },
  {
    number: "03",
    title: "Pyrolysis Processing",
    description:
      "Rubber and tyre materials are processed in a pyrolysis system under controlled operating conditions.",
  },
  {
    number: "04",
    title: "Oil Recovery",
    description:
      "Vapours produced during processing are condensed into liquid pyrolysis oil.",
  },
  {
    number: "05",
    title: "Solid Material Recovery",
    description:
      "Carbon-rich solid material is separated and prepared for the intended application.",
  },
  {
    number: "06",
    title: "Steel Recovery",
    description:
      "Steel wire is separated and prepared as recovered metal scrap.",
  },
  {
    number: "07",
    title: "Quality Checks & Dispatch",
    description:
      "Recovered products are checked and prepared for storage, delivery, or customer collection.",
  },
];

export const faqs = [
  {
    question: "What does Eco Nepal Energy do?",
    answer:
      "Eco Nepal Energy Industries Pvt. Ltd. is a Nepal-based company operating in the waste tyre recycling and pyrolysis sector. We process waste tyres and rubber scraps to recover useful products, including pyrolysis oil, carbon-rich fuel char, and steel.",
  },
  {
    question: "What is tyre pyrolysis oil?",
    answer:
      "Tyre pyrolysis oil (TPO) is a liquid product obtained by processing waste tyres and rubber materials through pyrolysis. It is intended for use as an industrial fuel in compatible systems, subject to equipment suitability and applicable requirements.",
  },
  {
    question: "Is pyrolysis oil used for industrial heating?",
    answer:
      "It can be considered for compatible industrial heating applications such as boilers and thermic-fluid heaters, subject to equipment suitability, product testing, safe handling, and applicable requirements. Please contact us to discuss your specific application.",
  },
  {
    question: "What is fuel char?",
    answer:
      "Fuel char is a carbon-rich solid material recovered during the processing of waste tyres. It can be considered for selected industrial fuel and material applications, depending on its quality and end-user requirements.",
  },
  {
    question: "Is fuel char the same as commercial carbon black?",
    answer:
      "No. Fuel char is a recovered material from tyre pyrolysis and differs from manufactured commercial carbon black. Its suitability for any specific application should be evaluated against the end user's technical requirements.",
  },
  {
    question: "What is recovered steel used for?",
    answer:
      "Steel wire recovered during tyre processing is separated and prepared as scrap material for suitable industrial metal-recycling applications, such as furnace charging.",
  },
  {
    question: "Can customers request product specifications?",
    answer:
      "Yes. Customers can contact our team to request the latest available product information and technical documentation for review.",
  },
  {
    question: "Where is the company located?",
    answer:
      "Eco Nepal Energy Industries Pvt. Ltd. is located at SEZ Bhairahawa, Rohini-1, Rupandehi, Nepal.",
  },
  {
    question: "How can I contact the company?",
    answer:
      "You can reach us by phone at +977 71 536039, by mobile, or by email at econepal2023@gmail.com. You can also use the enquiry form on our Contact page.",
  },
];

export const galleryCategories = [
  "All",
  "Factory",
  "Machinery",
  "Production Process",
  "Products",
  "Recovered Steel",
  "Team & Workers",
  "Packaging & Dispatch",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export const galleryImages: {
  id: string;
  category: Exclude<GalleryCategory, "All">;
  title: string;
  alt: string;
}[] = [
  { id: "g1", category: "Factory", title: "Facility Overview", alt: "Placeholder image of the Eco Nepal Energy facility exterior, pending official photography" },
  { id: "g2", category: "Factory", title: "Plant Entrance", alt: "Placeholder image of the plant entrance, pending official photography" },
  { id: "g3", category: "Machinery", title: "Pyrolysis Unit", alt: "Placeholder image of pyrolysis processing machinery, pending official photography" },
  { id: "g4", category: "Machinery", title: "Processing Equipment", alt: "Placeholder image of industrial processing equipment, pending official photography" },
  { id: "g5", category: "Production Process", title: "Material Preparation", alt: "Placeholder image of material preparation stage, pending official photography" },
  { id: "g6", category: "Production Process", title: "Processing Line", alt: "Placeholder image of the processing line in operation, pending official photography" },
  { id: "g7", category: "Products", title: "Pyrolysis Oil Storage", alt: "Placeholder image of pyrolysis oil storage containers, pending official photography" },
  { id: "g8", category: "Products", title: "Fuel Char Output", alt: "Placeholder image of recovered fuel char material, pending official photography" },
  { id: "g9", category: "Recovered Steel", title: "Steel Wire Bales", alt: "Placeholder image of recovered steel wire bales, pending official photography" },
  { id: "g10", category: "Recovered Steel", title: "Steel Recovery Area", alt: "Placeholder image of the steel recovery area, pending official photography" },
  { id: "g11", category: "Team & Workers", title: "Operations Team", alt: "Placeholder image of the operations team at work, pending official photography" },
  { id: "g12", category: "Team & Workers", title: "Plant Personnel", alt: "Placeholder image of plant personnel, pending official photography" },
  { id: "g13", category: "Packaging & Dispatch", title: "Loading Bay", alt: "Placeholder image of the loading and dispatch bay, pending official photography" },
  { id: "g14", category: "Packaging & Dispatch", title: "Dispatch Preparation", alt: "Placeholder image of products prepared for dispatch, pending official photography" },
];

export const coreValues = [
  { title: "Commitment", description: "A steady focus on reliable operations and consistent product quality." },
  { title: "Mobility", description: "Adapting operations and resources to meet changing customer and market needs." },
  { title: "Customer Service", description: "Responsive, transparent communication with customers and partners." },
  { title: "Quick Action", description: "Acting promptly on operational needs and stakeholder requests." },
  { title: "Responsiveness to Stakeholders", description: "Maintaining constructive relationships with employees, partners, and the community." },
];

export const strengths = [
  "Experienced Management Team",
  "Processing and Product-Handling Equipment",
  "Storage Facilities",
  "Skilled Workforce",
  "Product Recovery from Waste Tyres",
  "Focus on Quality and Customer Service",
];

// Illustrative example figures only — NOT verified company production or
// recovery data. Replace with actual confirmed figures before publishing
// as official statistics. Kept in one place so the metrics section never
// has numbers hardcoded into its animation logic.
export const sustainabilityMetrics = [
  { label: "Waste Tyres Processed", value: 1200, suffix: " MT/yr", note: "Illustrative example figure" },
  { label: "Pyrolysis Oil Recovered", value: 450, suffix: " KL/yr", note: "Illustrative example figure" },
  { label: "Fuel Char Recovered", value: 300, suffix: " MT/yr", note: "Illustrative example figure" },
  { label: "Steel Recovered", value: 120, suffix: " MT/yr", note: "Illustrative example figure" },
];

export const sustainabilityThemes = [
  { title: "Waste Recovery", description: "Processing waste tyres and rubber materials to recover useful resources rather than sending them to disposal." },
  { title: "Resource Efficiency", description: "Working to make practical use of materials recovered from waste streams." },
  { title: "Material Recovery", description: "Recovering pyrolysis oil, carbon-rich fuel char, and steel from end-of-life tyres." },
  { title: "Industrial Applications", description: "Supplying recovered products for evaluation against compatible industrial uses." },
  { title: "Responsible Operations", description: "Operating the facility with attention to safe handling and applicable requirements." },
];

export const pyrolysisOilApplications = [
  "Cement Manufacturing",
  "Steel Manufacturing",
  "Brick Manufacturing",
  "Ceramic Industry",
  "Glass Industry",
  "Asphalt Plants",
  "Industrial Boilers",
  "Thermic-Fluid Heaters",
  "Hot-Water Generators",
  "Industrial Ovens",
];

// Test results as published at econepalenergy.com.np/furnance.
export const pyrolysisOilSpecs = [
  { property: "Density at 15°C", method: "ASTM D 1298", unit: "g/cc", value: "0.87–0.93" },
  { property: "API Gravity", method: "ASTM D 1298", unit: "–", value: "25.40" },
  { property: "Viscosity at 100°C", method: "ASTM D 2161", unit: "SUS", value: "29" },
  { property: "Sulphur Total", method: "ASTM D 129", unit: "% Wt", value: "Up to 1" },
  { property: "Water Content", method: "ASTM D 95-05", unit: "% Vol", value: "Up to 0.25" },
  { property: "Ash", method: "ASTM D 482", unit: "% Wt", value: "Up to 0.05" },
  { property: "Calorific Value", method: "Bomb Calorimeter", unit: "Cal/g", value: "10400 ± 3%" },
  { property: "Color / Appearance", method: "ASTM D 1500", unit: "–", value: "Dark / Black" },
];

// Pyrolysis fuel oil vs. furnace oil vs. light diesel oil
// (econepalenergy.com.np/furnance).
export const fuelComparison = [
  { property: "Density at 15°C", method: "ASTM D 1298", unit: "g/cc", tpo: "0.87–0.93", fo: "0.88–0.98", ldo: "0.85–0.87" },
  { property: "API Gravity", method: "ASTM D 1298", unit: "–", tpo: "25.40", fo: "13.05", ldo: "27.54" },
  { property: "Viscosity at 100°C", method: "ASTM D 2161", unit: "SUS", tpo: "29", fo: "65", ldo: "42" },
  { property: "Sulphur Total", method: "ASTM D 129", unit: "% Wt", tpo: "Up to 1", fo: "Up to 4", ldo: "Up to 1.8" },
  { property: "Water Content", method: "ASTM D 95-05", unit: "% Vol", tpo: "Up to 0.25", fo: "Up to 1.0", ldo: "Up to 0.25" },
  { property: "Ash", method: "ASTM D 482", unit: "% Wt", tpo: "Up to 0.05", fo: "Up to 0.1", ldo: "Up to 0.02" },
  { property: "Calorific Value", method: "Bomb Calorimeter", unit: "Cal/g", tpo: "10400 ± 3%", fo: "10000+", ldo: "10600" },
  { property: "Color / Appearance", method: "ASTM D 1500", unit: "–", tpo: "Dark / Black", fo: "–", ldo: "–" },
];

export const fuelCharApplications = [
  "Cement Industries",
  "Steel Industries",
  "Low-Cost Rubber Products",
  "Hot-Air Generators",
  "Pet Coke Substitution",
  "Coal Substitution",
];

// Fuel char (pyrolysis carbon powder) specification, as published at
// econepalenergy.com.np/carbon.
export const fuelCharSpecs = [
  { property: "Calorific Value", unit: "Cal/g", value: "6250 ± 2%" },
  { property: "Moisture % (Max)", unit: "%", value: "Up to 3%" },
  { property: "Ash % (Max)", unit: "%", value: "Up to 20%" },
  { property: "Volatile Matter % (Max)", unit: "%", value: "Up to 3%" },
  { property: "Fixed Carbon %", unit: "%", value: "75–85%" },
  { property: "Particle Size", unit: "Mesh", value: "Less than 30" },
  { property: "Color / Appearance", unit: "–", value: "Black" },
];

export const steelSpecs = [
  { property: "Scrap Category", value: "HMS 1 under stated ISS codes 200 and 252 (subject to verification)" },
  { property: "Maximum Bale Size", value: "30 × 24 inches" },
  { property: "Maximum Bale Weight", value: "60 kg" },
  { property: "Bale Density", value: "Prepared for economical furnace charging" },
  { property: "Reported Test Yield", value: "Minimum 84% in the stated test" },
];

export const steelEnquiryPoints = [
  "Available quantity",
  "Wire diameter range",
  "Bale dimensions and weight tolerance",
  "Steel grade / chemical composition",
  "Contamination limits",
  "Loading and transport arrangements",
  "Delivery locations",
];

export const productInterestOptions = [
  "Pyrolysis Oil",
  "Fuel Char / Carbon Product",
  "Recovered Steel",
  "Waste Tyre Recycling",
  "Partnership / Business Enquiry",
  "Other",
];

// "One tyre, three products" scroll story on the homepage.
// Yield percentages are commonly cited general industry ranges for tyre
// pyrolysis by weight of input, not a specific measured figure for this
// plant. Always shown with a "subject to confirmation" disclaimer.
export const storyItems = [
  {
    n: "01",
    title: "End-of-life tyre",
    body: "Collected end-of-life tyres are inspected and shredded before entering the pyrolysis reactor.",
    imageLabel: "Stacked waste tyres — image pending",
    pct: "100",
    pctLabel: "% INPUT BY WEIGHT",
  },
  {
    n: "02",
    title: "Pyrolysis oil",
    body: "Vapour from the reactor is condensed into a liquid fuel for boilers, kilns, and furnaces.",
    imageLabel: "Pyrolysis oil — image pending",
    pct: "~45",
    pctLabel: "% TYPICAL YIELD",
  },
  {
    n: "03",
    title: "Fuel char",
    body: "A carbon-rich solid residue recovered for use as a solid fuel and material input.",
    imageLabel: "Fuel char powder — image pending",
    pct: "~35",
    pctLabel: "% TYPICAL YIELD",
  },
  {
    n: "04",
    title: "Recovered steel",
    body: "Bead and belt wire are separated from the tyre and returned to steel recyclers.",
    imageLabel: "Recovered steel wire — image pending",
    pct: "~12",
    pctLabel: "% TYPICAL YIELD",
  },
];

export const homeProducts = [
  {
    num: "01",
    name: "Pyrolysis oil",
    tag: "LIQUID FUEL",
    short: "Industrial furnace oil substitute for boilers and kilns.",
    href: "/products/pyrolysis-oil",
    imageSrc: "/brand/pyrolysis-oil-product.jpg",
    imageAlt: "Eco Furnace Oil (TPO) product graphic",
  },
  {
    num: "02",
    name: "Fuel char",
    tag: "SOLID FUEL",
    short: "Carbon-rich solid for fuel and material applications.",
    href: "/products/fuel-char",
    imageSrc: "/brand/fuel-char-photo.jpg",
    imageAlt: "Bowl of recovered pyrolysis fuel char",
  },
  {
    num: "03",
    name: "Recovered steel",
    tag: "SCRAP METAL",
    short: "Tyre wire returned to steel recyclers as scrap.",
    href: "/products/recovered-steel",
    imageSrc: "/brand/recovered-steel-photo.jpg" as string | null,
    imageAlt: "Coils of recovered steel wire baled for industrial recycling",
  },
];

export const audiences = [
  {
    who: "FUEL BUYERS",
    title: "A local alternative to imported furnace oil.",
    body: "Pyrolysis oil and fuel char for boilers, kilns, and furnaces, supplied to industrial buyers across Nepal.",
    cta: "Request a quote",
  },
  {
    who: "TYRE SUPPLIERS",
    title: "Hand over your waste tyres responsibly.",
    body: "Dealers, fleets, and municipalities: we collect and process end-of-life tyres at SEZ Bhairahawa.",
    cta: "Arrange collection",
  },
  {
    who: "PARTNERS & GOVERNMENT",
    title: "Circular industry in Lumbini Province.",
    body: "Operating within SEZ Bhairahawa, open to partnership, government, and investment enquiries.",
    cta: "Start a conversation",
  },
];

export const aboutFacts = [
  { k: "COMPANY", v: company.legalName },
  { k: "LOCATION", v: company.address },
  { k: "INDUSTRY", v: "Waste tyre recycling & pyrolysis" },
  { k: "PRODUCTS", v: "Pyrolysis oil, fuel char, recovered steel" },
  { k: "CAPACITY", v: "Subject to confirmation" },
];

// General, commonly cited industry-typical yields for tyre pyrolysis by
// weight of input — not a measured figure specific to this plant.
export const yields = [
  { v: 45, k: "Pyrolysis oil", note: "Liquid fuel for industry" },
  { v: 35, k: "Fuel char", note: "Carbon-rich solid" },
  { v: 12, k: "Recovered steel", note: "Returned to steel recyclers" },
];

export const sustainabilityBenefits = [
  {
    n: "01",
    title: "Keeps tyres out of landfills and open fires",
    body: "Tyres that would otherwise be dumped or burned in the open are processed in a sealed, oxygen-free system.",
  },
  {
    n: "02",
    title: "Replaces part of Nepal's imported fuel",
    body: "Pyrolysis oil and fuel char give local industries a domestically produced fuel option.",
  },
  {
    n: "03",
    title: "Returns steel to the supply chain",
    body: "Tyre bead and belt wire are separated and sold on to steel recyclers instead of being lost.",
  },
  {
    n: "04",
    title: "Supports responsible waste management",
    body: "A structured collection and processing route for end-of-life tyres across Nepal.",
  },
];

export const enquiryRoles = [
  {
    label: "Fuel buyer",
    msgLabel: "What fuel do you need?",
    msgPlaceholder: "Product, monthly quantity, delivery location",
  },
  {
    label: "Tyre supplier",
    msgLabel: "What can you supply?",
    msgPlaceholder: "Tyre type, approximate quantity, location",
  },
  {
    label: "Partner / investor",
    msgLabel: "Tell us about your interest",
    msgPlaceholder: "Organisation and what you have in mind",
  },
];

export const steelApplications = [
  "Steel re-rolling mills",
  "Scrap metal recycling",
  "Furnace charging",
];

// Company brochure, rendered page-by-page from the Illustrator PDF
// (public/brochure). Alt text summarises each page for screen readers.
export const brochure = {
  pdf: "/brochure/econepal-brochure.pdf",
  pages: [
    {
      src: "/brochure/page-1.jpg",
      alt: "Brochure cover: Econepal Energy Industries, “Join the journey to a greener future with tyre pyrolysis oil”, with photos of fuel being poured, an industrial plant and a filling station, and the company’s contact details.",
    },
    {
      src: "/brochure/page-2.jpg",
      alt: "About us and products: an introduction to Econepal Energy Industries, a pioneer of Nepal’s pyrolysis industry, and its three products, Tyre Pyrolysis Oil (TPO), Black Carbon Powder and Burned Steel Wire.",
    },
    {
      src: "/brochure/page-3.jpg",
      alt: "Photo collage of industrial users: boilers, machinery, control panels, brick production, pyrolysis oil and road paving.",
    },
    {
      src: "/brochure/page-4.jpg",
      alt: "“Hope on the ride to a better world with tyre pyrolysis oil”, with photos of road paving, biscuit production and a filling station, and the company’s contact details.",
    },
    {
      src: "/brochure/page-5.jpg",
      alt: "Tyre Pyrolysis Oil (TPO): what it is, the industries it fuels, from asphalt plants to power plants, and its advantages over furnace oil and light diesel oil.",
    },
    {
      src: "/brochure/page-6.jpg",
      alt: "Comparison table of tyre pyrolysis oil, furnace oil and light diesel oil across eight ASTM test parameters, followed by the company’s contact details.",
    },
    {
      src: "/brochure/page-7.jpg",
      alt: "Black Carbon Powder (Black Cat Carbon): description, benefits such as high calorific value and low moisture, and the industries that use carbon black.",
    },
    {
      src: "/brochure/page-8.jpg",
      alt: "Back cover: fuel char (pyrolysis carbon powder) specification table and the company’s contact details.",
    },
  ],
};
