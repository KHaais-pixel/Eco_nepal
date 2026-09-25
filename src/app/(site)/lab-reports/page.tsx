import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import CTABanner from "@/components/CTABanner";
import { SpecTable, FuelComparisonTable } from "@/components/SpecTable";
import { brochure } from "@/lib/site-data";
import { getProduct } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Lab Reports",
  description:
    "ASTM test results for Tyre Pyrolysis Oil (TPO), a side-by-side comparison with furnace oil and light diesel oil, and the fuel char specification.",
};

// Specification tables come from the admin-editable product specs (seeded
// from econepalenergy.com.np/furnance and /carbon); the comparison is shared.
const advantages = [
  "Low density and low viscosity, so it doesn’t need pre-heating like furnace oil before use, which saves energy costs.",
  "Calorific value of 10,400 Cal/g ± 3%, higher than furnace oil.",
  "Sulphur content up to 0.9%, against around 4% in furnace oil, so SOx pollution is lower.",
  "Considerably lower ash and water content than furnace oil.",
  "Needs no blending with furnace oil and can be burned directly, even with diesel burners.",
  "5–10% saving against furnace oil, and up to 25–30% compared with light diesel oil (LDO).",
];

const uses = [
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
];

function ReportHeading({ num, title, children }: { num: string; title: string; children?: React.ReactNode }) {
  return (
    <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="font-mono-label mb-4 text-xs text-leaf">REPORT {num}</div>
        <h2 className="max-w-[760px] font-display text-[clamp(34px,4vw,56px)] font-semibold leading-none tracking-[-0.02em] text-ink">
          {title}
        </h2>
      </div>
      {children}
    </RevealOnScroll>
  );
}

export default async function LabReportsPage() {
  const [oil, fuelChar] = await Promise.all([getProduct("pyrolysis-oil"), getProduct("fuel-char")]);
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-[clamp(64px,8vw,110px)] pt-[clamp(120px,16vh,170px)] sm:px-8">
        <RevealOnScroll>
          <div className="font-mono-label mb-7 flex gap-2 text-xs text-muted-3">
            <Link href="/products" className="text-leaf">PRODUCTS</Link>
            <span>/</span>
            <span>LAB REPORTS</span>
          </div>
          <h1 className="mb-8 max-w-[980px] font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">
            Tested, measured, <em className="not-italic text-leaf">compared.</em>
          </h1>
          <p className="mb-8 max-w-[620px] text-lg leading-[1.6] text-muted-1">
            Tyre Pyrolysis Oil (TPO) is a strong fuel for heavy industry, from construction,
            steel and cement plants to boilers and hotel heating. It compares with furnace oil
            (FO) and light diesel oil (LDO), and burns directly in boilers and furnaces. These
            are its test results under standard ASTM methods.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" variant="dark">Request a batch report</Button>
            <Button href={brochure.pdf} variant="outline" external>Download brochure (PDF)</Button>
          </div>
        </RevealOnScroll>
      </section>

      {/* Report 01 — TPO specification */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="py-[clamp(80px,10vw,130px)]">
          <ReportHeading num="01" title="Pyrolysis oil specification" />
          <RevealOnScroll delay={80}>
            <SpecTable rows={oil.specs} valueLabel="Pyrolysis Fuel Oil" caption="Tyre pyrolysis oil test results" />
          </RevealOnScroll>
        </Container>
      </section>

      {/* Report 02 — comparison */}
      <Container className="py-[clamp(80px,10vw,130px)]">
        <ReportHeading num="02" title="Pyrolysis oil vs. furnace oil vs. light diesel oil">
          <p className="max-w-[360px] text-[15px] leading-[1.6] text-muted-2">
            By specification, pyrolysis oil is close to light diesel oil, and cheaper.
          </p>
        </ReportHeading>
        <RevealOnScroll delay={80}>
          <FuelComparisonTable />
        </RevealOnScroll>

        <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-24">
          <RevealOnScroll>
            <h3 className="mb-7 font-display text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.1] text-ink">
              Advantages over furnace oil
            </h3>
            <ul className="flex flex-col">
              {advantages.map((a) => (
                <li key={a} className="flex gap-4 border-t border-ink/[0.1] py-4 text-[16px] leading-[1.55] text-muted-1">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <h3 className="mb-7 font-display text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.1] text-ink">
              Pyrolysis oil as a fuel in
            </h3>
            <ul className="flex flex-wrap gap-2">
              {uses.map((u) => (
                <li key={u} className="rounded-full border border-ink/15 px-4 py-2 text-[14px] text-ink">
                  {u}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </Container>

      {/* Report 03 — fuel char */}
      <section className="border-y border-ink/[0.08] bg-stone">
        <Container className="grid grid-cols-1 gap-10 py-[clamp(80px,10vw,130px)] md:grid-cols-[1fr_1.3fr] md:gap-24">
          <div>
            <ReportHeading num="03" title="Fuel char specification" />
            <RevealOnScroll>
              <p className="max-w-[380px] text-[16px] leading-[1.6] text-muted-1">
                Pyrolysis carbon powder: the carbon-rich solid left after pyrolysis.{" "}
                <Link href="/products/fuel-char" className="font-semibold text-forest hover:text-leaf">
                  About fuel char →
                </Link>
              </p>
            </RevealOnScroll>
          </div>
          <RevealOnScroll delay={80}>
            <SpecTable rows={fuelChar.specs} valueLabel="Fuel Char" caption="Fuel char test results" />
          </RevealOnScroll>
        </Container>
      </section>

      <Container className="pt-[clamp(48px,6vw,72px)]">
        <p className="max-w-[640px] text-sm leading-[1.6] text-muted-3">
          Typical values reported by Eco Nepal Energy Industries. Individual batches can
          vary. For the test report on a specific consignment,{" "}
          <Link href="/contact" className="font-semibold text-forest hover:text-leaf">contact us</Link>.
        </p>
      </Container>

      <CTABanner />
    </>
  );
}
