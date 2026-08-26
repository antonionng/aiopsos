"use client";

interface TooltipEntry {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
}

/**
 * One skin for every recharts chart: token-driven colors, one tooltip, one
 * axis treatment. Recharts never renders in its default look - import from
 * here instead of styling per-chart.
 */

export const CHART_COLORS = {
  brand: "var(--brand)",
  ai: "var(--cat-ai)",
  technology: "var(--cat-technology)",
  robotics: "var(--cat-robotics)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  muted: "var(--muted-foreground)",
  grid: "var(--border)",
} as const;

export const AXIS_PROPS = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const GRID_PROPS = {
  stroke: "var(--border)",
  strokeDasharray: "3 3",
  vertical: false,
} as const;

const nf = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
export const formatNumber = (v: number) => nf.format(v);

export function ChartTooltip({
  active,
  payload,
  label,
  valueSuffix = "",
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  valueSuffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      {label !== undefined && (
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      {payload.map((entry: TooltipEntry) => (
        <p key={String(entry.dataKey)} className="flex items-center gap-2 text-xs text-popover-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color ?? "var(--brand)" }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">
            {typeof entry.value === "number" ? formatNumber(entry.value) : entry.value}
            {valueSuffix}
          </span>
        </p>
      ))}
    </div>
  );
}
