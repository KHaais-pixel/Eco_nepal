export default function SpecList({
  rows,
  note,
}: {
  rows: { property: string; value: string }[];
  note?: string;
}) {
  return (
    <div>
      {rows.map((row) => (
        <div
          key={row.property}
          className="flex flex-col gap-1 border-t border-ink/[0.12] py-4 text-[16px] sm:flex-row sm:justify-between sm:gap-6 sm:py-5"
        >
          <span className="text-muted-1">{row.property}</span>
          <span className="font-mono-label text-[15px] text-ink sm:text-right">{row.value}</span>
        </div>
      ))}
      {note && (
        <p className="mt-6 max-w-[420px] text-[13px] leading-[1.6] text-muted-3">{note}</p>
      )}
    </div>
  );
}
