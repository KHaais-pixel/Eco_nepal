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
          className="flex justify-between gap-6 border-t border-ink/[0.12] py-5 text-[16px]"
        >
          <span className="text-muted-1">{row.property}</span>
          <span className="font-mono-label text-right text-[15px] text-ink">{row.value}</span>
        </div>
      ))}
      {note && (
        <p className="mt-6 max-w-[420px] text-[13px] leading-[1.6] text-muted-3">{note}</p>
      )}
    </div>
  );
}
