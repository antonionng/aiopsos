"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { GraduationCap } from "lucide-react";
import {
  CHART_COLORS,
  AXIS_PROPS,
  GRID_PROPS,
  ChartTooltip,
  formatNumber,
} from "@/components/charts/chart-theme";

interface OverviewData {
  headcount: number;
  people_in_training: number;
  funnel: { stage: string; count: number }[];
  activity: { week: string; enrolments: number; sessions_attended: number; certificates: number }[];
  needsByDepartment: { department: string; respondents: number; ai: number; technology: number; robotics: number }[];
}

const FUNNEL_COLORS = [
  CHART_COLORS.brand,
  CHART_COLORS.technology,
  CHART_COLORS.ai,
  CHART_COLORS.success,
  CHART_COLORS.robotics,
];

function Skeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="h-64 rounded-2xl border border-border skeleton-shimmer" />
      ))}
    </div>
  );
}

/**
 * The learner-lifecycle charts on the staff Overview: how far people travel
 * through training, how activity trends, and where measured need sits.
 */
export function LearningOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "forbidden">("loading");

  useEffect(() => {
    fetch("/api/org/learning-overview", { cache: "no-store" })
      .then((r) => {
        if (r.status === 403) { setState("forbidden"); return null; }
        return r.ok ? r.json() : Promise.reject();
      })
      .then((d) => {
        if (d) { setData(d); setState("ready"); }
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "forbidden") return null;
  if (state === "loading") return <Skeleton />;
  if (state === "error" || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        The learning overview could not load. Refresh to try again.
      </div>
    );
  }

  const hasTraining = data.funnel[0].count > 0;
  const hasNeeds = data.needsByDepartment.length > 0;

  if (!hasTraining && !hasNeeds) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
          <GraduationCap className="h-6 w-6 text-brand" />
        </div>
        <h3 className="mb-1 text-base font-semibold">The learning picture starts here</h3>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Once people are enrolled in cohorts and taking assessments, this
          section shows the enrolment funnel, weekly training activity, and
          measured need by department. Book a cohort or share an assessment
          link to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Enrolment funnel */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold">Enrolment funnel</h3>
            <span className="text-xs text-muted-foreground">
              {formatNumber(data.people_in_training)} of {formatNumber(data.headcount)} people in training
            </span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            How far enrolments travel: enrolled through to certified.
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={data.funnel} layout="vertical" margin={{ left: 8, right: 24 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="stage" width={104} {...AXIS_PROPS} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="count" name="People" radius={[0, 6, 6, 0]} barSize={20}>
                {data.funnel.map((_, i) => (
                  <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity over time */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Training activity</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Last twelve weeks: enrolments, attended sessions, certificates.
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data.activity} margin={{ left: -18, right: 8 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="week" {...AXIS_PROPS} />
              <YAxis allowDecimals={false} {...AXIS_PROPS} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="sessions_attended" name="Sessions attended" stroke={CHART_COLORS.brand} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="enrolments" name="Enrolments" stroke={CHART_COLORS.ai} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="certificates" name="Certificates" stroke={CHART_COLORS.success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Needs by department */}
      {hasNeeds && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-semibold">Training need by department</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Average measured need (0&ndash;5, higher = more need) from the
            training needs analysis. Book the tall bars first.
          </p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data.needsByDepartment} margin={{ left: -18, right: 8 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="department" {...AXIS_PROPS} />
              <YAxis domain={[0, 5]} {...AXIS_PROPS} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="ai" name="Applied AI" fill={CHART_COLORS.ai} radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="technology" name="Technology" fill={CHART_COLORS.technology} radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="robotics" name="Robotics" fill={CHART_COLORS.robotics} radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
