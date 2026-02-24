"use client";

import { DIMENSION_LABELS, DIMENSIONS, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapData {
  department: string;
  scores: DimensionScores;
}

interface Props {
  data: HeatmapData[];
}

function getHeatColor(value: number): string {
  if (value >= 4) return "bg-foreground";
  if (value >= 3) return "bg-foreground/70";
  if (value >= 2) return "bg-foreground/40";
  if (value >= 1) return "bg-foreground/20";
  return "bg-foreground/10";
}

const dimensions: Dimension[] = [...DIMENSIONS];

export function Heatmap({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="pb-3 pr-4 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Department
            </th>
            {dimensions.map((dim) => (
              <th
                key={dim}
                className="pb-3 px-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {DIMENSION_LABELS[dim].split(" ")[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.department} className="border-t border-border/50">
              <td className="py-2.5 pr-4 text-sm font-medium">{row.department}</td>
              {dimensions.map((dim) => (
                <td key={dim} className="px-2 py-2.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        <div
                          className={`flex h-9 w-14 items-center justify-center rounded-md text-xs font-semibold text-white ${getHeatColor(
                            row.scores[dim]
                          )}`}
                        >
                          {row.scores[dim].toFixed(1)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {row.department} - {DIMENSION_LABELS[dim]}: {row.scores[dim].toFixed(2)} / 5
                    </TooltipContent>
                  </Tooltip>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
