"use client";

import { useState, useMemo } from "react";
import { DIMENSION_LABELS, DIMENSIONS, INDUSTRY_BENCHMARKS, type Dimension } from "@/lib/constants";
import { calculateOverallScore } from "@/lib/scoring";
import type { DimensionScores } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown } from "lucide-react";

interface HeatmapData {
  department: string;
  scores: DimensionScores;
}

interface Props {
  data: HeatmapData[];
  showBenchmarks?: boolean;
  showOverall?: boolean;
}

type SortKey = "department" | "overall" | Dimension;
type SortDir = "asc" | "desc";

function getHeatColor(value: number): string {
  if (value >= 4) return "bg-emerald-500";
  if (value >= 3) return "bg-emerald-500/70";
  if (value >= 2) return "bg-amber-500";
  if (value >= 1) return "bg-orange-500";
  return "bg-red-500";
}

function getBenchmarkDelta(value: number, benchmark: number): { color: string; symbol: string } {
  const delta = value - benchmark;
  if (delta >= 0.3) return { color: "text-emerald-500", symbol: "+" };
  if (delta >= -0.3) return { color: "text-muted-foreground", symbol: "~" };
  return { color: "text-red-500", symbol: "-" };
}

const dimensions: Dimension[] = [...DIMENSIONS];

export function Heatmap({ data, showBenchmarks = true, showOverall = true }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("overall");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const enrichedData = useMemo(() => {
    return data.map((row) => ({
      ...row,
      overall: calculateOverallScore(row.scores),
    }));
  }, [data]);

  const sortedData = useMemo(() => {
    return [...enrichedData].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortKey === "department") {
        aVal = a.department.toLowerCase();
        bVal = b.department.toLowerCase();
        return sortDir === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      } else if (sortKey === "overall") {
        aVal = a.overall;
        bVal = b.overall;
      } else {
        aVal = a.scores[sortKey];
        bVal = b.scores[sortKey];
      }

      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [enrichedData, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3 w-3" />
    ) : (
      <ChevronDown className="inline h-3 w-3" />
    );
  };

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No data available.</p>;
  }

  const overallBenchmark =
    Object.values(INDUSTRY_BENCHMARKS).reduce((a, b) => a + b, 0) / Object.values(INDUSTRY_BENCHMARKS).length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("department")}
              className="cursor-pointer pb-3 pr-4 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Department <SortIcon columnKey="department" />
            </th>
            {showOverall && (
              <th
                onClick={() => handleSort("overall")}
                className="cursor-pointer pb-3 px-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Overall <SortIcon columnKey="overall" />
              </th>
            )}
            {dimensions.map((dim) => (
              <th
                key={dim}
                onClick={() => handleSort(dim)}
                className="cursor-pointer pb-3 px-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {DIMENSION_LABELS[dim].split(" ")[0]} <SortIcon columnKey={dim} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.department} className="border-t border-border/50">
              <td className="py-2.5 pr-4 text-sm font-medium">{row.department}</td>
              {showOverall && (
                <td className="px-2 py-2.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        <div
                          className={`flex h-9 w-14 items-center justify-center rounded-md text-xs font-semibold text-white ${getHeatColor(
                            row.overall
                          )}`}
                        >
                          {row.overall.toFixed(1)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {row.department} - Overall: {row.overall.toFixed(2)} / 5
                    </TooltipContent>
                  </Tooltip>
                </td>
              )}
              {dimensions.map((dim) => {
                const delta = showBenchmarks
                  ? getBenchmarkDelta(row.scores[dim], INDUSTRY_BENCHMARKS[dim])
                  : null;
                return (
                  <td key={dim} className="px-2 py-2.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-14 items-center justify-center rounded-md text-xs font-semibold text-white ${getHeatColor(
                              row.scores[dim]
                            )}`}
                          >
                            {row.scores[dim].toFixed(1)}
                          </div>
                          {delta && (
                            <span className={`mt-0.5 text-[9px] font-medium ${delta.color}`}>
                              {delta.symbol} {Math.abs(row.scores[dim] - INDUSTRY_BENCHMARKS[dim]).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <p>{row.department} - {DIMENSION_LABELS[dim]}: {row.scores[dim].toFixed(2)} / 5</p>
                          {showBenchmarks && (
                            <p className="text-muted-foreground">
                              Benchmark: {INDUSTRY_BENCHMARKS[dim]} (
                              {row.scores[dim] >= INDUSTRY_BENCHMARKS[dim] ? "+" : ""}
                              {(row.scores[dim] - INDUSTRY_BENCHMARKS[dim]).toFixed(1)})
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          ))}

          {showBenchmarks && (
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="py-2.5 pr-4 text-sm font-semibold text-muted-foreground">
                Industry Benchmark
              </td>
              {showOverall && (
                <td className="px-2 py-2.5">
                  <div className="flex justify-center">
                    <div className="flex h-9 w-14 items-center justify-center rounded-md border-2 border-dashed border-border bg-transparent text-xs font-semibold text-muted-foreground">
                      {overallBenchmark.toFixed(1)}
                    </div>
                  </div>
                </td>
              )}
              {dimensions.map((dim) => (
                <td key={dim} className="px-2 py-2.5">
                  <div className="flex justify-center">
                    <div className="flex h-9 w-14 items-center justify-center rounded-md border-2 border-dashed border-border bg-transparent text-xs font-semibold text-muted-foreground">
                      {INDUSTRY_BENCHMARKS[dim].toFixed(1)}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-500" /> 0-1
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-orange-500" /> 1-2
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-500" /> 2-3
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500/70" /> 3-4
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500" /> 4-5
        </span>
      </div>
    </div>
  );
}
