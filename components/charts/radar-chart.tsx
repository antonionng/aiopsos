"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DIMENSION_LABELS, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

interface Props {
  scores: DimensionScores;
  maxValue?: number;
}

export function RadarChart({ scores, maxValue = 5 }: Props) {
  const data = (Object.entries(scores) as [Dimension, number][]).map(([key, value]) => ({
    dimension: DIMENSION_LABELS[key],
    value,
    fullMark: maxValue,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxValue]}
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
        />
        <Radar
          dataKey="value"
          stroke="var(--foreground)"
          fill="var(--foreground)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--foreground)",
          }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
