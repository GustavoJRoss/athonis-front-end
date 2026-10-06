"use client";

export type ChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
};

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 shadow-float">
      {label !== undefined && (
        <p className="text-caption font-medium text-foreground">{label}</p>
      )}
      {payload.map((entry, index) => (
        <p key={index} className="flex items-center gap-1.5 text-caption text-muted">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}
