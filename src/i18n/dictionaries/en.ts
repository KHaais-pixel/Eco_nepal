// English copy for every public page. `ne.ts` must provide the same shape
// (enforced by TypeScript), so no string can be left untranslated.
// Headline emphasis uses { pre, em, post }: `pre` is plain, `em` is green.

const en = {
  meta: {
    siteTitle: "Eco Nepal Energy Industries Pvt. Ltd. | Waste Tyre Recycling & Pyrolysis",
    titleTemplate: "%s | Eco Nepal Energy Industries Pvt. Ltd.",
    description:
      "Eco Nepal Energy Industries Pvt. Ltd. converts end-of-life tyres into pyrolysis oil, fuel char, and recovered steel at SEZ Bhairahawa, Rupandehi, Nepal.",
    ogTitle: "Eco Nepal Energy Industries Pvt. Ltd.",
    ogDescription: "Waste tyre recycling and pyrolysis in Nepal — pyrolysis oil, fuel char, and recovered steel.",
    ogLocale: "en_US",
  },
  common: {
    skipToContent: "Skip to main content",
    homeAria: "Eco Nepal Energy home",
    brandName: "Eco Nepal Energy",
    brandSub: "INDUSTRIES PVT. LTD.",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    requestQuote: "Request a quote",
    getInTouch: "Get in touch →",
    allProducts: "All products →",
    languageLabel: "Language",
    switchTo: "नेपाली", // shown on English pages: the language you switch to
    switchToAria: "नेपालीमा पढ्नुहोस्",
    imagePending: "[ {name} — image pending ]",
  },
  nav: {
    home: "Home",
    about: "About Us",
    products: "Products",
    process: "Our Process",
    sustainability: "Sustainability",
    faq: "FAQ",
    contact: "Contact",
    productLinks: [
      { href: "/products/pyrolysis-oil", label: "Pyrolysis Oil", blurb: "Liquid industrial fuel recovered from waste tyres" },
      { href: "/products/fuel-char", label: "Fuel Char / Carbon Product", blurb: "Carbon-rich solid material for selected fuel uses" },
      { href: "/products/recovered-steel", label: "Recovered Steel", blurb: "Steel wire scrap recovered from end-of-life tyres" },
      { href: "/lab-reports", label: "Lab Reports", blurb: "ASTM test results and fuel oil comparisons" },
    ],
  },
  footer: {
    tagline: "Waste tyre recycling & pyrolysis.",
    products: "PRODUCTS",
    company: "COMPANY",
    pyrolysisOil: "Pyrolysis oil",
    fuelChar: "Fuel char",
    recoveredSteel: "Recovered steel",
    about: "About",
    process: "Process",
    sustainability: "Sustainability",
    faq: "FAQ",
    contact: "Contact",
    logoAlt: "Econepal Energy Industries Pvt. Ltd. — Reduce, Recycle, Regenerate",
  },
  cta: {
    title: { pre: "Have tyres to dispose of, or need ", em: "industrial fuel?", post: "" },
    button: "Get in touch →",
  },
  home: {
    metaTitle: "Waste Tyre Recycling & Pyrolysis in Nepal",
    metaDescription:
      "Eco Nepal Energy Industries converts end-of-life tyres into pyrolysis oil, fuel char, and recovered steel at SEZ Bhairahawa, Nepal.",
    eyebrow: "SEZ BHAIRAHAWA · RUPANDEHI · NEPAL",
    heroTitle: { pre: "Old tyres,", em: "new energy.", post: "" },
    heroText:
      "Eco Nepal Energy Industries converts end-of-life tyres into pyrolysis oil, fuel char and recovered steel, keeping waste out of landfills and open fires and putting it back to work in Nepal’s industries.",
    exploreProducts: "Explore products",
    howItWorks: "How it works →",
    videoAria: "Waste tyre recovery at the Eco Nepal Energy facility",
    unmute: "Unmute video",
    mute: "Mute video",
    statement1: "A tyre takes centuries to break down. Burned in the open, it poisons the air. ",
    statement2: "We heat it without oxygen instead, and recover almost everything it was made of.",
    story: {
      eyebrow: "ONE TYRE · FOUR STAGES",
      videoAria: "Waste tyre recycling process, scrubbing through collection, pyrolysis oil, fuel char, and recovered steel",
      items: [
        { title: "End-of-life tyre", body: "Collected end-of-life tyres are inspected and shredded before entering the pyrolysis reactor.", pctLabel: "% INPUT BY WEIGHT" },
        { title: "Pyrolysis oil", body: "Vapour from the reactor is condensed into a liquid fuel for boilers, kilns, and furnaces.", pctLabel: "% TYPICAL YIELD" },
        { title: "Fuel char", body: "A carbon-rich solid residue recovered for use as a solid fuel and material input.", pctLabel: "% TYPICAL YIELD" },
        { title: "Recovered steel", body: "Bead and belt wire are separated from the tyre and returned to steel recyclers.", pctLabel: "% TYPICAL YIELD" },
      ],
      note: "Typical industry yields by weight. Plant-specific figures subject to confirmation.",
    },
    produce: {
      title: "What we produce",
      allProducts: "All products →",
      oil: "OIL",
      char: "CHAR",
      steel: "STEEL",
    },
    brochure: {
      eyebrow: "COMPANY BROCHURE",
      title: { pre: "Flip through ", em: "our story.", post: "" },
      note: "",
      download: "Download PDF",
      cover: "Cover",
      pages: "Pages {a}–{b}",
      backCover: "Back cover",
      page: "Page {n}",
      pageOf: "Page {n} of {total}",
      pageLabel: "PAGE {n}",
      prev: "Previous page",
      next: "Next page",
      aria: "Company brochure",
      pageAlts: [
        "Brochure cover: Econepal Energy Industries, “Join the journey to a greener future with tyre pyrolysis oil”, with photos of fuel being poured, an industrial plant and a filling station, and the company’s contact details.",
        "About us and products: an introduction to Econepal Energy Industries, a pioneer of Nepal’s pyrolysis industry, and its three products, Tyre Pyrolysis Oil (TPO), Black Carbon Powder and Burned Steel Wire.",
        "Photo collage of industrial users: boilers, machinery, control panels, brick production, pyrolysis oil and road paving.",
        "“Hope on the ride to a better world with tyre pyrolysis oil”, with photos of road paving, biscuit production and a filling station, and the company’s contact details.",
        "Tyre Pyrolysis Oil (TPO): what it is, the industries it fuels, from asphalt plants to power plants, and its advantages over furnace oil and light diesel oil.",
        "Comparison table of tyre pyrolysis oil, furnace oil and light diesel oil across eight ASTM test parameters, followed by the company’s contact details.",
        "Black Carbon Powder (Black Cat Carbon): description, benefits such as high calorific value and low moisture, and the industries that use carbon black.",
        "Back cover: fuel char (pyrolysis carbon powder) specification table and the company’s contact details.",
      ],
    },
    work: {
      title: "Work with us",
      audiences: [
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
      ],
    },
  },
  about: {
    metaTitle: "About Us",
    metaDescription:
      "Eco Nepal Energy Industries Pvt. Ltd. is a waste tyre recycling and pyrolysis company in the Special Economic Zone at Bhairahawa, Rupandehi.",
    eyebrow: "ABOUT US",
    title: { pre: "Built in Bhairahawa, ", em: "for Nepal’s industry.", post: "" },
    factoryAlt: "Eco Nepal Energy pyrolysis plant: two blue reactors under a steel-frame shed with a red roof",
    intro:
      "Eco Nepal Energy Industries Pvt. Ltd. is a waste tyre recycling and pyrolysis company in the Special Economic Zone at Bhairahawa, Rupandehi.",
    facts: { company: "COMPANY", location: "LOCATION", industry: "INDUSTRY", products: "PRODUCTS", capacity: "CAPACITY" },
    industryValue: "Waste tyre recycling & pyrolysis",
    productsValue: "Pyrolysis oil, fuel char, recovered steel",
    capacityValue: "Subject to confirmation",
    chairmanEyebrow: "MESSAGE FROM THE CHAIRMAN",
    chairmanAlt: "Portrait of {name}, Chairman of Eco Nepal Energy Industries Pvt. Ltd.",
  },
  products: {
    metaTitle: "Products",
    metaDescription: "Three products recovered from one tyre through pyrolysis: pyrolysis oil, fuel char, and recovered steel.",
    eyebrow: "PRODUCTS",
    title: { pre: "Three products.", em: "One tyre.", post: "" },
    intro:
      "Each product is recovered from the same pyrolysis cycle and supplied to industrial buyers across Nepal. Specifications are available on request.",
    applications: "APPLICATIONS",
    viewSpecs: "View specifications →",
  },
  product: {
    metaTitles: {
      "pyrolysis-oil": "Tyre Pyrolysis Oil (TPO)",
      "fuel-char": "Pyrolysis Fuel Char / Carbon Product",
      "recovered-steel": "Recovered Steel Wire",
    },
    metaDescriptions: {
      "pyrolysis-oil":
        "Tyre Pyrolysis Oil (TPO) — a dark liquid fuel condensed from tyre pyrolysis vapour, for compatible industrial heating applications.",
      "fuel-char":
        "Pyrolysis Fuel Char — the carbon-rich solid left after tyre pyrolysis, for selected industrial fuel and material applications.",
      "recovered-steel":
        "Recovered steel wire from end-of-life tyres, prepared as scrap material for suitable industrial metal-recycling applications.",
    },
    breadcrumb: "PRODUCTS",
    requestQuote: "Request a quote",
    requestDatasheet: "Request datasheet",
    requestSteelInfo: "Request steel information",
    specification: "Specification",
    specNote:
      "Company-reported figures — confirm against the latest laboratory report before publication as official product standards.",
    comparisonTitle: "Pyrolysis oil vs. furnace oil vs. light diesel oil",
    comparisonNote: "By specification, pyrolysis oil is close to light diesel oil, and cheaper.",
    fullData: "Full test data and advantages over furnace oil: ",
    labReportsLink: "Lab Reports →",
    productInfo: "Product information",
    productInfoNote:
      "Company claims and reported test information require confirmation before publication as official product standards.",
    whereUsed: "Where it’s used",
    tellUs: "Tell us what you need",
    steelPoints: [
      "Available quantity",
      "Wire diameter range",
      "Bale dimensions and weight tolerance",
      "Steel grade / chemical composition",
      "Contamination limits",
      "Loading and transport arrangements",
      "Delivery locations",
    ],
  },
  table: {
    sno: "S.NO",
    parameter: "TEST PARAMETER",
    method: "METHOD",
    unit: "UNIT",
    tpo: "PYROLYSIS FUEL OIL",
    fo: "FURNACE OIL",
    ldo: "LIGHT DIESEL OIL",
    swipe: "SWIPE TO COMPARE →",
    comparisonCaption: "Comparison of pyrolysis fuel oil, furnace oil and light diesel oil",
    // Test-method names that are words rather than standard codes.
    methodNames: {} as Record<string, string>,
    // Pyrolysis fuel oil vs. furnace oil vs. light diesel oil (econepalenergy.com.np/furnance).
    comparison: [
      { property: "Density at 15°C", method: "ASTM D 1298", unit: "g/cc", tpo: "0.87–0.93", fo: "0.88–0.98", ldo: "0.85–0.87" },
      { property: "API Gravity", method: "ASTM D 1298", unit: "–", tpo: "25.40", fo: "13.05", ldo: "27.54" },
      { property: "Viscosity at 100°C", method: "ASTM D 2161", unit: "SUS", tpo: "29", fo: "65", ldo: "42" },
      { property: "Sulphur Total", method: "ASTM D 129", unit: "% Wt", tpo: "Up to 1", fo: "Up to 4", ldo: "Up to 1.8" },
      { property: "Water Content", method: "ASTM D 95-05", unit: "% Vol", tpo: "Up to 0.25", fo: "Up to 1.0", ldo: "Up to 0.25" },
      { property: "Ash", method: "ASTM D 482", unit: "% Wt", tpo: "Up to 0.05", fo: "Up to 0.1", ldo: "Up to 0.02" },
      { property: "Calorific Value", method: "Bomb Calorimeter", unit: "Cal/g", tpo: "10400 ± 3%", fo: "10000+", ldo: "10600" },
      { property: "Color / Appearance", method: "ASTM D 1500", unit: "–", tpo: "Dark / Black", fo: "–", ldo: "–" },
    ],
  },
  labReports: {
    metaTitle: "Lab Reports",
    metaDescription:
      "ASTM test results for Tyre Pyrolysis Oil (TPO), a side-by-side comparison with furnace oil and light diesel oil, and the fuel char specification.",
    breadcrumb: "LAB REPORTS",
    title: { pre: "Tested, measured, ", em: "compared.", post: "" },
    intro:
      "Tyre Pyrolysis Oil (TPO) is a strong fuel for heavy industry, from construction, steel and cement plants to boilers and hotel heating. It compares with furnace oil (FO) and light diesel oil (LDO), and burns directly in boilers and furnaces. These are its test results under standard ASTM methods.",
    requestBatch: "Request a batch report",
    downloadBrochure: "Download brochure (PDF)",
    report: "REPORT {n}",
    r1Title: "Pyrolysis oil specification",
    r1ValueLabel: "Pyrolysis Fuel Oil",
    r1Caption: "Tyre pyrolysis oil test results",
    r2Title: "Pyrolysis oil vs. furnace oil vs. light diesel oil",
    r2Note: "By specification, pyrolysis oil is close to light diesel oil, and cheaper.",
    advantagesTitle: "Advantages over furnace oil",
    advantages: [
      "Low density and low viscosity, so it doesn’t need pre-heating like furnace oil before use, which saves energy costs.",
      "Calorific value of 10,400 Cal/g ± 3%, higher than furnace oil.",
      "Sulphur content up to 0.9%, against around 4% in furnace oil, so SOx pollution is lower.",
      "Considerably lower ash and water content than furnace oil.",
      "Needs no blending with furnace oil and can be burned directly, even with diesel burners.",
      "5–10% saving against furnace oil, and up to 25–30% compared with light diesel oil (LDO).",
    ],
    usesTitle: "Pyrolysis oil as a fuel in",
    uses: [
      "Road construction (asphalt plants)",
      "Biscuit factories",
      "Cement plants",
      "Steel factories",
      "Boilers",
      "Furnaces",
      "Ceramic factories",
      "Glass factories",
      "Brick factories",
      "Hot water generators",
      "Hot air generators",
      "Thermic fluid heaters",
      "Power plants",
    ],
    r3Title: "Fuel char specification",
    r3Intro: "Pyrolysis carbon powder: the carbon-rich solid left after pyrolysis. ",
    aboutFuelChar: "About fuel char →",
    r3ValueLabel: "Fuel Char",
    r3Caption: "Fuel char test results",
    footnote: "Typical values reported by Eco Nepal Energy Industries. Individual batches can vary. For the test report on a specific consignment, ",
    footnoteLink: "contact us",
    footnotePost: ".",
  },
  process: {
    metaTitle: "Our Process",
    metaDescription:
      "How Eco Nepal Energy processes waste tyres through pyrolysis to recover oil, fuel char, and steel — from collection to dispatch.",
    eyebrow: "THE PROCESS",
    title: { pre: "Heat, without oxygen. ", em: "Nothing burns.", post: "" },
    steps: [
      { title: "Raw Material Collection", description: "Waste tyres and rubber scraps are collected and received for processing." },
      { title: "Material Preparation", description: "Incoming materials are inspected and prepared according to the company's process requirements." },
      { title: "Pyrolysis Processing", description: "Rubber and tyre materials are processed in a pyrolysis system under controlled operating conditions." },
      { title: "Oil Recovery", description: "Vapours produced during processing are condensed into liquid pyrolysis oil." },
      { title: "Solid Material Recovery", description: "Carbon-rich solid material is separated and prepared for the intended application." },
      { title: "Steel Recovery", description: "Steel wire is separated and prepared as recovered metal scrap." },
      { title: "Quality Checks & Dispatch", description: "Recovered products are checked and prepared for storage, delivery, or customer collection." },
    ],
    short: ["Collection", "Preparation", "Pyrolysis", "Oil Recovery", "Solid Recovery", "Steel Recovery", "Quality & Dispatch"],
    stepLabel: "STEP {n} / {total}",
    sceneAria: "How the process works, step by step",
    diagram: {
      hopper: "HOPPER + SHREDDER",
      conveyor: "FEED CONVEYOR",
      reactor: "SEALED REACTOR · NO O₂",
      vapour: "VAPOUR LINE",
      condenser: "CONDENSER",
      oil: "PYROLYSIS OIL",
      carbon: "CARBON SOLIDS",
      magnet: "MAGNET",
      steel: "STEEL",
    },
    disclaimer:
      "Process details such as exact operating temperatures, reactor specifications, and processing times are proprietary and subject to confirmation. Please contact us for further technical discussion under appropriate arrangements.",
  },
  sustainability: {
    metaTitle: "Sustainability",
    metaDescription:
      "How Eco Nepal Energy supports resource recovery and the circular economy through waste tyre recycling and pyrolysis.",
    eyebrow: "SUSTAINABILITY",
    title: { pre: "Less waste in the ground. ", em: "Less smoke in the air.", post: "" },
    yields: [
      { k: "Pyrolysis oil", note: "Liquid fuel for industry" },
      { k: "Fuel char", note: "Carbon-rich solid" },
      { k: "Recovered steel", note: "Returned to steel recyclers" },
    ],
    note: "Typical industry yields by weight of tyre input. Plant-specific figures subject to confirmation.",
    benefits: [
      { title: "Keeps tyres out of landfills and open fires", body: "Tyres that would otherwise be dumped or burned in the open are processed in a sealed, oxygen-free system." },
      { title: "Replaces part of Nepal's imported fuel", body: "Pyrolysis oil and fuel char give local industries a domestically produced fuel option." },
      { title: "Returns steel to the supply chain", body: "Tyre bead and belt wire are separated and sold on to steel recyclers instead of being lost." },
      { title: "Supports responsible waste management", body: "A structured collection and processing route for end-of-life tyres across Nepal." },
    ],
  },
  faq: {
    metaTitle: "FAQ",
    metaDescription:
      "Frequently asked questions about Eco Nepal Energy's waste tyre recycling, pyrolysis oil, fuel char, and recovered steel products.",
    eyebrow: "FAQ",
    title: { pre: "Questions, ", em: "answered.", post: "" },
    intro: "Where information is not yet confirmed, we encourage you to contact us directly.",
    items: [
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
        answer: "Yes. Customers can contact our team to request the latest available product information and technical documentation for review.",
      },
      {
        question: "Where is the company located?",
        answer: "Eco Nepal Energy Industries Pvt. Ltd. is located at SEZ Bhairahawa, Rohini-1, Rupandehi, Nepal.",
      },
      {
        question: "How can I contact the company?",
        answer:
          "You can reach us by phone at +977 71 536039, by mobile, or by email at econepal2023@gmail.com. You can also use the enquiry form on our Contact page.",
      },
    ],
  },
  contact: {
    metaTitle: "Contact Us",
    metaDescription:
      "Contact Eco Nepal Energy Industries Pvt. Ltd. at SEZ Bhairahawa, Rupandehi, Nepal, by phone, mobile, email, or enquiry form.",
    eyebrow: "CONTACT",
    title: { pre: "Let’s talk ", em: "tyres & fuel.", post: "" },
    address: "ADDRESS",
    phone: "PHONE",
    email: "EMAIL",
    website: "WEBSITE",
    mapTitle: "Map of Eco Nepal Energy Industries at SEZ Bhairahawa",
    openMaps: "Open in Google Maps →",
    form: {
      iAmA: "I AM A",
      roles: [
        { key: "buyer", label: "Fuel buyer", msgLabel: "What fuel do you need?", msgPlaceholder: "Product, monthly quantity, delivery location" },
        { key: "supplier", label: "Tyre supplier", msgLabel: "What can you supply?", msgPlaceholder: "Tyre type, approximate quantity, location" },
        { key: "partner", label: "Partner / investor", msgLabel: "Tell us about your interest", msgPlaceholder: "Organisation and what you have in mind" },
      ],
      fullName: "Full name",
      namePlaceholder: "Your name",
      company: "Company",
      companyPlaceholder: "Company name",
      contact: "Email or phone",
      contactPlaceholder: "How we reach you",
      honeypot: "Leave this field empty",
      consent:
        "I consent to Eco Nepal Energy Industries Pvt. Ltd. handling the information I have submitted in order to respond to my enquiry.",
      send: "Send enquiry",
      sending: "Sending…",
      thanks: "Thank you.",
      thanksText: "Your enquiry has been received. Our team will get back to you shortly.",
      another: "Submit another enquiry",
      errors: {
        fullName: "Please enter your full name.",
        contact: "Please enter an email or phone number.",
        message: "Please enter your enquiry.",
        consent: "Please provide consent to continue.",
        rate: "You've sent several enquiries in a short time. Please try again in a few minutes, or call us directly.",
      },
    },
  },
  notFound: {
    metaTitle: "Page not found",
    eyebrow: "ERROR 404",
    title: { pre: "This page has been ", em: "recycled.", post: "" },
    text: "The page you’re looking for doesn’t exist or has moved. Try one of these instead.",
    home: "Back to home",
    products: "Our products",
    contact: "Contact us",
  },
};

export type Dictionary = typeof en;
export default en;
