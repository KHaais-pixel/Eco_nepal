import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Button from "@/components/Button";
import CTABanner from "@/components/CTABanner";
import { brochure } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Lab Reports",
  description:
    "ASTM test results for Tyre Pyrolysis Oil (TPO), a side-by-side comparison with furnace oil and light diesel oil, and the fuel char specification.",
};

// Source: econepalenergy.com.np/furnance (TPO specification and comparison)
// and the company brochure (fuel char specification).
const tpoSpec = [
  { param: "Density at 15°C", method: "ASTM D 1298", unit: "g/cc", tpo: "0.87–0.93", fo: "0.88–0.98", ldo: "0.85–0.87" },
  { param: "API Gravity", method: "ASTM D 1298", unit: "–", tpo: "25.40", fo: "13.05", ldo: "27.54" },
  { param: "Viscosity at 100°C", method: "ASTM D 2161", unit: "SUS", tpo: "29", fo: "65", ldo: "42" },
  { param: "Sulphur Total", method: "ASTM D 129", unit: "% Wt", tpo: "Up to 1", fo: "Up to 4", ldo: "Up to 1.8" },
  { param: "Water Content", method: "ASTM D 95-05", unit: "% Vol", tpo: "Up to 0.25", fo: "Up to 1.0", ldo: "Up to 0.25" },
  { param: "Ash", method: "ASTM D 482", unit: "% Wt", tpo: "Up to 0.05", fo: "Up to 0.1", ldo: "Up to 0.02" },
  { param: "Calorific Value", method: "Bomb Calorimeter", unit: "Cal/g", tpo: "10400 ± 3%", fo: "10000+", ldo: "10600" },
  { param: "Color / Appearance", method: "ASTM D 1500", unit: "–", tpo: "Dark / Black", fo: "–", ldo: "–" },
];

const fuelCharSpec = [
  { param: "Calorific Value", unit: "Cal/g", value: "6250 ± 2%" },
  { param: "Moisture (Max)", unit: "%", value: "Up to 3%" },
  { param: "Ash (Max)", unit: "%", value: "Up to 20%" },
  { param: "Volatile Matter (Max)", unit: "%", value: "Up to 3%" },
  { param: "Fixed Carbon", unit: "%", value: "75–85%" },
  { param: "Particle Size", unit: "Mesh", value: "Less than 30" },
  { param: "Color / Appearance", unit: "–", value: "Black" },
];

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

const th = "font-mono-label whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-normal text-cream/80";
const td = "px-4 py-4 align-top";

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

export default function LabReportsPage() {
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
            <div className="overflow-x-auto rounded-2xl border border-ink/[0.08] bg-white">
              <table className="w-full min-w-[640px] border-collapse text-[15px]">
                <caption className="sr-only">Tyre pyrolysis oil test results</caption>
                <thead className="bg-forest">
                  <tr>
                    <th scope="col" className={th}>S.NO</th>
                    <th scope="col" className={th}>TEST PARAMETER</th>
                    <th scope="col" className={th}>METHOD</th>
                    <th scope="col" className={th}>UNIT</th>
                    <th scope="col" className={`${th} text-lime`}>PYROLYSIS FUEL OIL</th>
                  </tr>
                </thead>
                <tbody>
                  {tpoSpec.map((row, i) => (
                    <tr key={row.param} className="border-t border-ink/[0.08]">
                      <td className={`${td} font-mono-label text-xs text-muted-3`}>{String(i + 1).padStart(2, "0")}</td>
                      <th scope="row" className={`${td} text-left font-semibold text-ink`}>{row.param}</th>
                      <td className={`${td} text-muted-2`}>{row.method}</td>
                      <td className={`${td} text-muted-2`}>{row.unit}</td>
                      <td className={`${td} font-mono-label text-[15px] text-forest`}>{row.tpo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          <div className="overflow-x-auto rounded-2xl border border-ink/[0.08] bg-white">
            <table className="w-full min-w-[820px] border-collapse text-[15px]">
              <caption className="sr-only">
                Comparison of pyrolysis fuel oil, furnace oil and light diesel oil
              </caption>
              <thead className="bg-deep">
                <tr>
                  <th scope="col" className={th}>S.NO</th>
                  <th scope="col" className={th}>TEST PARAMETER</th>
                  <th scope="col" className={th}>METHOD</th>
                  <th scope="col" className={th}>UNIT</th>
                  <th scope="col" className={`${th} bg-forest text-lime`}>PYROLYSIS FUEL OIL</th>
                  <th scope="col" className={th}>FURNACE OIL</th>
                  <th scope="col" className={th}>LIGHT DIESEL OIL</th>
                </tr>
              </thead>
              <tbody>
                {tpoSpec.map((row, i) => (
                  <tr key={row.param} className="border-t border-ink/[0.08]">
                    <td className={`${td} font-mono-label text-xs text-muted-3`}>{String(i + 1).padStart(2, "0")}</td>
                    <th scope="row" className={`${td} text-left font-semibold text-ink`}>{row.param}</th>
                    <td className={`${td} text-muted-2`}>{row.method}</td>
                    <td className={`${td} text-muted-2`}>{row.unit}</td>
                    <td className={`${td} bg-leaf/[0.07] font-mono-label text-[15px] text-forest`}>{row.tpo}</td>
                    <td className={`${td} font-mono-label text-[15px] text-muted-1`}>{row.fo}</td>
                    <td className={`${td} font-mono-label text-[15px] text-muted-1`}>{row.ldo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <div className="overflow-x-auto rounded-2xl border border-ink/[0.08] bg-white">
              <table className="w-full min-w-[440px] border-collapse text-[15px]">
                <caption className="sr-only">Fuel char test results</caption>
                <thead className="bg-forest">
                  <tr>
                    <th scope="col" className={th}>TEST PARAMETER</th>
                    <th scope="col" className={th}>UNIT</th>
                    <th scope="col" className={`${th} text-lime`}>FUEL CHAR</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelCharSpec.map((row) => (
                    <tr key={row.param} className="border-t border-ink/[0.08]">
                      <th scope="row" className={`${td} text-left font-semibold text-ink`}>{row.param}</th>
                      <td className={`${td} text-muted-2`}>{row.unit}</td>
                      <td className={`${td} font-mono-label text-[15px] text-forest`}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
