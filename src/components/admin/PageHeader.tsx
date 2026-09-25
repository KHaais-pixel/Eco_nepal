export default function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">{title}</h1>
        {description && <p className="mt-1.5 max-w-[640px] text-sm text-muted-2">{description}</p>}
      </div>
      {children}
    </div>
  );
}
