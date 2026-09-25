import type { Spec } from "@/lib/cms/types";
import { fuelComparison } from "@/lib/site-data";

const th = "font-mono-label whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-normal text-cream/80";
const td = "px-4 py-4 align-top";
const frame = "overflow-x-auto rounded-2xl border border-ink/[0.08] bg-white";
const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Lab-style specification table. The Method and Unit columns appear only
 * when at least one row has them, so simple property/value specs still work.
 */
export function SpecTable({ rows, valueLabel, caption }: { rows: Spec[]; valueLabel: string; caption: string }) {
  const hasMethod = rows.some((r) => r.method);
  const hasUnit = rows.some((r) => r.unit);
  return (
    <div className={frame}>
      <table className={`w-full border-collapse text-[15px] ${hasMethod ? "sm:min-w-[640px]" : "sm:min-w-[440px]"}`}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-forest">
          <tr>
            <th scope="col" className={`${th} max-sm:hidden`}>S.NO</th>
            <th scope="col" className={th}>TEST PARAMETER</th>
            {hasMethod && <th scope="col" className={`${th} max-sm:hidden`}>METHOD</th>}
            {hasUnit && <th scope="col" className={th}>UNIT</th>}
            <th scope="col" className={`${th} text-lime`}>{valueLabel.toUpperCase()}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.property}-${i}`} className="border-t border-ink/[0.08]">
              <td className={`${td} font-mono-label text-xs text-muted-3 max-sm:hidden`}>{num(i)}</td>
              <th scope="row" className={`${td} text-left font-semibold text-ink`}>{row.property}</th>
              {hasMethod && <td className={`${td} text-muted-2 max-sm:hidden`}>{row.method || "–"}</td>}
              {hasUnit && <td className={`${td} text-muted-2`}>{row.unit || "–"}</td>}
              <td className={`${td} font-mono-label text-[15px] text-forest`}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Pyrolysis fuel oil vs. furnace oil vs. light diesel oil. */
export function FuelComparisonTable() {
  return (
    <div>
      <p aria-hidden="true" className="font-mono-label mb-3 text-[11px] text-muted-3 sm:hidden">SWIPE TO COMPARE →</p>
      <div className={frame}>
        <table className="w-full min-w-[560px] border-collapse text-[15px] sm:min-w-[820px]">
          <caption className="sr-only">Comparison of pyrolysis fuel oil, furnace oil and light diesel oil</caption>
          <thead className="bg-deep">
            <tr>
              <th scope="col" className={`${th} max-sm:hidden`}>S.NO</th>
              <th scope="col" className={`${th} max-sm:sticky max-sm:left-0 max-sm:z-[1] bg-deep`}>TEST PARAMETER</th>
              <th scope="col" className={`${th} max-sm:hidden`}>METHOD</th>
              <th scope="col" className={th}>UNIT</th>
              <th scope="col" className={`${th} bg-forest text-lime`}>PYROLYSIS FUEL OIL</th>
              <th scope="col" className={th}>FURNACE OIL</th>
              <th scope="col" className={th}>LIGHT DIESEL OIL</th>
            </tr>
          </thead>
          <tbody>
            {fuelComparison.map((row, i) => (
              <tr key={row.property} className="border-t border-ink/[0.08]">
                <td className={`${td} font-mono-label text-xs text-muted-3 max-sm:hidden`}>{num(i)}</td>
                <th scope="row" className={`${td} max-sm:sticky max-sm:left-0 max-sm:z-[1] bg-white text-left font-semibold text-ink max-sm:max-w-[140px]`}>{row.property}</th>
                <td className={`${td} text-muted-2 max-sm:hidden`}>{row.method}</td>
                <td className={`${td} text-muted-2`}>{row.unit}</td>
                <td className={`${td} whitespace-nowrap bg-leaf/[0.07] font-mono-label text-[15px] text-forest`}>{row.tpo}</td>
                <td className={`${td} whitespace-nowrap font-mono-label text-[15px] text-muted-1`}>{row.fo}</td>
                <td className={`${td} whitespace-nowrap font-mono-label text-[15px] text-muted-1`}>{row.ldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
