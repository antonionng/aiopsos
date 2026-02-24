"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  Loader2,
  User,
  Users,
  ChevronDown,
  ListChecks,
  Trash2,
  Target,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  Crown,
  Lock,
  Clock,
  DollarSign,
  Rocket,
  ArrowRight,
  BarChart3,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataThresholdGate } from "@/components/data-threshold-gate";
import {
  DATA_THRESHOLDS,
  RESPONDENT_ROLE_LABELS,
  INDUSTRY_BENCHMARKS,
  INDUSTRY_BENCHMARK_OVERALL,
  TIER_IMPACT_STATS,
  AI_ADOPTION_STATS,
  DIMENSION_LEADER_INSIGHTS,
  getGapLabel,
  getTierImpactIndex,
} from "@/lib/constants";
import { RadarChart } from "@/components/charts/radar-chart";
import { Heatmap } from "@/components/charts/heatmap";
import { MaturityGauge } from "@/components/charts/maturity-gauge";
import {
  calculateOverallScore,
  getRiskAreas,
  getAutomationOpportunities,
  getOrgRecommendations,
  getScoreDistribution,
} from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSIONS, getTierForScore, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";
import { getTemplate } from "@/lib/assessment-templates";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";

interface Respondent {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  respondent_role: string | null;
  department: string;
  submitted_at: string;
  scores: DimensionScores;
  overall_score: number;
  raw_answers: Record<string, number>;
}

interface RoleScores {
  role: string;
  roleLabel: string;
  scores: DimensionScores;
  overall: number;
  count: number;
}

interface HistoricalAssessment {
  assessment_id: string;
  completed_at: string;
  overall_score: number;
  dimension_scores: DimensionScores;
  response_count: number;
}

interface AggregatedData {
  org_scores: DimensionScores;
  department_scores: { department: string; scores: DimensionScores }[];
  response_count: number;
  department_count: number;
  my_scores: DimensionScores | null;
  template_id: string;
  respondents?: Respondent[];
  role_scores?: RoleScores[];
  historical_assessments?: HistoricalAssessment[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

const DISTRIBUTION_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

export default function AssessmentResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AggregatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [answersUserId, setAnswersUserId] = useState<string | null>(null);
  const [deletingResponseId, setDeletingResponseId] = useState<string | null>(null);

  async function loadData() {
    if (!id) return;
    const r = await fetch(`/api/assessment/${id}/aggregated`, { cache: "no-store" });
    const d = await r.json();
    if (d.error) setError(d.error);
    else setData(d);
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    loadData().finally(() => setLoading(false));
  }, [id]);

  const computedData = useMemo(() => {
    if (!data) return null;

    const { org_scores, department_scores, respondents } = data;
    const overallScore = calculateOverallScore(org_scores);
    const tier = getTierForScore(overallScore);
    const risks = getRiskAreas(org_scores);
    const opportunities = getAutomationOpportunities(department_scores);
    const recommendations = getOrgRecommendations(org_scores);
    const overallGap = getGapLabel(overallScore, INDUSTRY_BENCHMARK_OVERALL);
    const currentTierIdx = getTierImpactIndex(tier.tier);

    const roleScoresMap = new Map<string, { scores: DimensionScores[]; count: number }>();
    if (respondents) {
      for (const r of respondents) {
        const role = r.respondent_role ?? "unknown";
        if (!roleScoresMap.has(role)) {
          roleScoresMap.set(role, { scores: [], count: 0 });
        }
        const entry = roleScoresMap.get(role)!;
        entry.scores.push(r.scores);
        entry.count++;
      }
    }

    const roleScores: RoleScores[] = Array.from(roleScoresMap.entries()).map(([role, { scores, count }]) => {
      const avgScores: DimensionScores = {
        confidence: scores.reduce((a, s) => a + s.confidence, 0) / count,
        practice: scores.reduce((a, s) => a + s.practice, 0) / count,
        tools: scores.reduce((a, s) => a + s.tools, 0) / count,
        responsible: scores.reduce((a, s) => a + s.responsible, 0) / count,
        culture: scores.reduce((a, s) => a + s.culture, 0) / count,
      };
      return {
        role,
        roleLabel: (RESPONDENT_ROLE_LABELS as Record<string, string>)[role] ?? role,
        scores: avgScores,
        overall: calculateOverallScore(avgScores),
        count,
      };
    }).sort((a, b) => b.overall - a.overall);

    const distribution = respondents ? getScoreDistribution(respondents) : [];

    return {
      overallScore,
      tier,
      risks,
      opportunities,
      recommendations,
      overallGap,
      currentTierIdx,
      roleScores,
      distribution,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data || data.response_count === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
        <h3 className="text-sm font-semibold">No responses yet</h3>
        <p className="text-sm text-muted-foreground">
          Share this assessment to start collecting responses and see results here.
        </p>
      </div>
    );
  }

  const { org_scores, department_scores, response_count, department_count, my_scores, template_id, respondents, historical_assessments } = data;
  const template = getTemplate(template_id);
  const meetsThreshold = response_count >= DATA_THRESHOLDS.ASSESSMENT_MIN_RESPONSES;

  if (!computedData) return null;

  const {
    overallScore,
    tier,
    risks,
    opportunities,
    recommendations,
    overallGap,
    currentTierIdx,
    roleScores,
    distribution,
  } = computedData;

  const myOverall = my_scores ? calculateOverallScore(my_scores) : null;
  const myTier = myOverall !== null ? getTierForScore(myOverall) : null;

  const roleLabels = RESPONDENT_ROLE_LABELS as Record<string, string>;
  const topPriorityRecs = recommendations.filter((r) => r.priority === "critical" || r.priority === "high");

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Assessment Results</h1>
        <p className="text-sm text-muted-foreground">
          {response_count} response{response_count !== 1 ? "s" : ""} across {department_count} group{department_count !== 1 ? "s" : ""}.
        </p>
      </motion.div>

      {!meetsThreshold && (
        <motion.div variants={item} className="mt-6">
          <DataThresholdGate
            currentCount={response_count}
            requiredCount={DATA_THRESHOLDS.ASSESSMENT_MIN_RESPONSES}
            featureLabel="Assessment Results"
            description="Aggregated results become meaningful with enough responses. Keep sharing the assessment to build a clearer picture of your organisation's AI maturity."
          >
            <></>
          </DataThresholdGate>
        </motion.div>
      )}

      {meetsThreshold && (
        <>
          {/* Executive Summary with Benchmarks */}
          <motion.div variants={item} className="mt-8 grid gap-4 lg:grid-cols-[340px_1fr]">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 text-center">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Organisation Score
              </p>
              <p className="text-5xl font-bold tracking-tight">
                {overallScore.toFixed(1)}
                <span className="text-lg text-muted-foreground"> / 5</span>
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-semibold">
                Tier {tier.tier}: {tier.label}
              </div>

              <div className="mt-4 rounded-lg bg-foreground/5 px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Industry benchmark
                </p>
                <p className="mt-0.5 text-lg font-bold">{INDUSTRY_BENCHMARK_OVERALL}</p>
                <p className={`mt-0.5 text-xs font-medium ${overallGap.color}`}>
                  {overallGap.delta > 0 ? "+" : ""}
                  {overallGap.delta.toFixed(1)} — {overallGap.label}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {DIMENSIONS.map((dim: Dimension) => {
                const gap = getGapLabel(org_scores[dim], INDUSTRY_BENCHMARKS[dim]);
                return (
                  <div key={dim} className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                      {DIMENSION_LABELS[dim]}
                    </p>
                    <div className="flex items-end gap-1.5">
                      <p className="text-2xl font-bold">{org_scores[dim].toFixed(1)}</p>
                      <p className="mb-0.5 text-xs text-muted-foreground">/ 5</p>
                    </div>
                    <Progress value={(org_scores[dim] / 5) * 100} className="mt-2 h-1.5" />
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-400/40"
                          style={{ width: `${(INDUSTRY_BENCHMARKS[dim] / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {INDUSTRY_BENCHMARKS[dim]}
                      </span>
                    </div>
                    <p className={`mt-1.5 text-[10px] font-medium ${gap.color}`}>{gap.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Impact Stats Banner */}
          <motion.div variants={item} className="mt-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {AI_ADOPTION_STATS.map((s, i) => {
                const icons = [Clock, TrendingUp, DollarSign, Rocket];
                const Icon = icons[i];
                return (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                      <Icon className="h-4 w-4 text-brand" />
                    </div>
                    <p className="text-2xl font-bold tracking-tight">{s.stat}</p>
                    <p className="text-xs font-medium">{s.label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{s.source}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Tier Progression Journey */}
          <motion.div variants={item} className="mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4" />
              Growth Journey
            </h2>
            <Card className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="grid gap-0 sm:grid-cols-4">
                  {TIER_IMPACT_STATS.map((t, i) => {
                    const isCurrent = i === currentTierIdx;
                    const isPast = i < currentTierIdx;
                    const isFuture = i > currentTierIdx;

                    return (
                      <div key={t.tier} className="relative">
                        {i < TIER_IMPACT_STATS.length - 1 && (
                          <div
                            className={`absolute left-[calc(50%+20px)] top-4 hidden h-px w-[calc(100%-40px)] sm:block ${
                              isPast ? "bg-brand" : "bg-border"
                            }`}
                          />
                        )}
                        <div className="flex flex-col items-center text-center px-2 py-3">
                          <div
                            className={`relative z-10 mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                              isCurrent
                                ? "border-brand bg-brand text-brand-foreground"
                                : isPast
                                  ? "border-brand bg-brand/10 text-brand"
                                  : "border-border bg-card text-muted-foreground"
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : isCurrent ? (
                              <Crown className="h-3.5 w-3.5" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                          </div>
                          <p
                            className={`text-xs font-semibold ${
                              isCurrent ? "text-brand" : isFuture ? "text-muted-foreground" : ""
                            }`}
                          >
                            {t.tier}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{t.label}</p>
                          <p
                            className={`mt-1 text-xs font-bold ${
                              isCurrent ? "text-brand" : isFuture ? "text-muted-foreground/60" : ""
                            }`}
                          >
                            {t.stat}
                          </p>
                          <p className="mt-0.5 text-[9px] leading-tight text-muted-foreground/60">
                            {t.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Results (Personal) */}
          {my_scores && myOverall !== null && myTier && (
            <motion.div variants={item} className="mt-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4 text-brand" />
                    Your Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
                    <div className="text-center sm:text-left">
                      <p className="text-4xl font-bold tracking-tight">
                        {myOverall.toFixed(1)}
                        <span className="text-base text-muted-foreground"> / 5</span>
                      </p>
                      <div
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: `${myTier.color}15`, color: myTier.color }}
                      >
                        Tier {myTier.tier}: {myTier.label}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
                      {DIMENSIONS.map((dim: Dimension) => (
                        <div key={dim}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{DIMENSION_LABELS[dim]}</span>
                            <span className="text-xs font-semibold">{my_scores[dim].toFixed(1)}</span>
                          </div>
                          <Progress value={(my_scores[dim] / 5) * 100} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Organisation Overview Section */}
          <motion.div variants={item} className="mt-8">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Organisation Overview
            </h2>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Organisation Maturity</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <MaturityGauge score={overallScore} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Dimension Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadarChart scores={org_scores} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Score Distribution */}
          {distribution.length > 0 && (
            <motion.div variants={item} className="mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <BarChart3 className="h-4 w-4" />
                    Score Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="range"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value, name) => [
                          name === "count" ? `${value} respondents` : `${value}%`,
                          name === "count" ? "Count" : "Percentage",
                        ]}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {distribution.map((_, idx) => (
                          <Cell key={idx} fill={DISTRIBUTION_COLORS[idx]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 flex justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Low (0-2)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" /> Medium (2-3)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500" /> High (3-5)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Historical Trend Tracking */}
          {historical_assessments && historical_assessments.length > 1 && (
            <motion.div variants={item} className="mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <TrendingUp className="h-4 w-4 text-brand" />
                    Progress Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={historical_assessments.map((h) => ({
                        date: new Date(h.completed_at).toLocaleDateString("en-GB", {
                          month: "short",
                          year: "2-digit",
                        }),
                        overall: h.overall_score,
                        confidence: h.dimension_scores.confidence,
                        practice: h.dimension_scores.practice,
                        tools: h.dimension_scores.tools,
                        responsible: h.dimension_scores.responsible,
                        culture: h.dimension_scores.culture,
                        responses: h.response_count,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value, name) => [
                          typeof value === "number" ? value.toFixed(2) : value,
                          name === "overall" ? "Overall Score" : DIMENSION_LABELS[name as Dimension] ?? name,
                        ]}
                      />
                      <ReferenceLine
                        y={INDUSTRY_BENCHMARK_OVERALL}
                        stroke="var(--muted-foreground)"
                        strokeDasharray="5 5"
                        label={{
                          value: "Benchmark",
                          position: "right",
                          fill: "var(--muted-foreground)",
                          fontSize: 10,
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 10, color: "var(--muted-foreground)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="overall"
                        name="Overall"
                        stroke="var(--brand)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "var(--brand)" }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="confidence"
                        name="Confidence"
                        stroke="#8884d8"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="practice"
                        name="Practice"
                        stroke="#82ca9d"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="tools"
                        name="Tools"
                        stroke="#ffc658"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-3 text-center text-xs text-muted-foreground">
                    Tracking {historical_assessments.length} assessments over time
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Department Heatmap */}
          {department_scores.length > 0 && (
            <motion.div variants={item} className="mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Department Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <Heatmap data={department_scores} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Role-Based Analysis */}
          {roleScores.length > 0 && (
            <motion.div variants={item} className="mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="h-4 w-4" />
                    Role-Based Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roleScores.map((rs) => {
                      const roleTier = getTierForScore(rs.overall);
                      return (
                        <div
                          key={rs.role}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{rs.roleLabel}</p>
                              <Badge variant="secondary" className="text-[10px]">
                                {rs.count} respondent{rs.count !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                            <div className="mt-2 grid grid-cols-5 gap-2">
                              {DIMENSIONS.map((dim: Dimension) => (
                                <div key={dim}>
                                  <p className="text-[9px] text-muted-foreground">
                                    {DIMENSION_LABELS[dim].split(" ")[0]}
                                  </p>
                                  <p className="text-xs font-semibold">{rs.scores[dim].toFixed(1)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-2xl font-bold">{rs.overall.toFixed(1)}</p>
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{ backgroundColor: `${roleTier.color}15`, color: roleTier.color }}
                            >
                              Tier {roleTier.tier}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Market Leader Comparison */}
          <motion.div variants={item} className="mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              How You Compare to Market Leaders
            </h2>
            <div className="space-y-3">
              {DIMENSIONS.map((dim: Dimension) => {
                const gap = getGapLabel(org_scores[dim], INDUSTRY_BENCHMARKS[dim]);
                const info = DIMENSION_LEADER_INSIGHTS[dim];

                return (
                  <Card
                    key={dim}
                    className={`border-border bg-card transition-all ${
                      gap.delta < -0.5 ? "ring-1 ring-amber-500/20" : ""
                    }`}
                  >
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-4">
                        <div className="flex shrink-0 flex-col items-center gap-1 rounded-lg bg-foreground/5 px-3 py-2.5">
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">You</p>
                          <p className="text-xl font-bold">{org_scores[dim].toFixed(1)}</p>
                          <div className="h-px w-6 bg-border" />
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Leaders</p>
                          <p className="text-xl font-bold text-brand">{INDUSTRY_BENCHMARKS[dim].toFixed(1)}</p>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5 flex items-center gap-2">
                            <p className="text-sm font-semibold">{DIMENSION_LABELS[dim]}</p>
                            <Badge
                              variant="secondary"
                              className={`text-[9px] ${
                                gap.delta >= 0
                                  ? "bg-green-500/10 text-green-500"
                                  : gap.delta >= -0.5
                                    ? "bg-blue-400/10 text-blue-400"
                                    : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {gap.delta > 0 ? "+" : ""}
                              {gap.delta.toFixed(1)}
                            </Badge>
                          </div>

                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Companies like{" "}
                            <span className="font-medium text-foreground">{info.leaders}</span>{" "}
                            {info.insight}
                          </p>

                          <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-foreground/5 px-3 py-2">
                            <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Why it matters:</span>{" "}
                              {info.benefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Risk & Opportunities */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4 text-foreground" />
                    Risk Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {risks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No critical risk areas detected.</p>
                  ) : (
                    <div className="space-y-3">
                      {risks.map((r) => (
                        <div
                          key={r.dimension}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{DIMENSION_LABELS[r.dimension]}</p>
                            <p className="text-xs text-muted-foreground">
                              Score: {r.score.toFixed(1)} vs {INDUSTRY_BENCHMARKS[r.dimension]} benchmark —{" "}
                              {r.severity === "critical" ? "Critical gap" : "Needs attention"}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              r.severity === "critical"
                                ? "border border-destructive/30 text-destructive"
                                : "border border-border text-muted-foreground"
                            }`}
                          >
                            {r.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <TrendingUp className="h-4 w-4 text-brand" />
                    Automation Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No department data available.</p>
                  ) : (
                    <div className="space-y-3">
                      {opportunities.map((o) => (
                        <div
                          key={o.department}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{o.department}</p>
                            <p className="text-xs text-muted-foreground">
                              Tools: {o.toolsReadiness.toFixed(1)} · Practice: {o.practiceLevel.toFixed(1)}
                            </p>
                          </div>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ backgroundColor: `${o.tier.color}15`, color: o.tier.color }}
                          >
                            Tier {o.tier.tier}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actionable Recommendations */}
          <motion.div variants={item} className="mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4" />
              Action Plan
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <Card
                  key={rec.dimension}
                  className={`border-border bg-card ${
                    i === 0 ? "ring-1 ring-brand/20" : ""
                  }`}
                >
                  <CardContent className="pt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{rec.label}</p>
                        {i === 0 && (
                          <Badge variant="secondary" className="bg-brand/10 text-brand text-[10px]">
                            Start here
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={`text-[9px] ${
                            rec.priority === "critical"
                              ? "bg-red-500/10 text-red-500"
                              : rec.priority === "high"
                                ? "bg-amber-500/10 text-amber-500"
                                : rec.priority === "medium"
                                  ? "bg-blue-400/10 text-blue-400"
                                  : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{rec.score.toFixed(1)}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                        <span className="text-xs font-medium text-brand">{rec.benchmark}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{rec.recommendation}</p>
                    <div className="mt-3 rounded-lg bg-brand/5 px-3 py-2">
                      <div className="flex items-start gap-2">
                        <Zap className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                        <p className="text-xs">
                          <span className="font-medium text-foreground">Quick win:</span>{" "}
                          <span className="text-muted-foreground">{rec.quickWin}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Individual Responses */}
      {respondents && respondents.length > 0 && (
        <>
          <motion.div variants={item} className="mt-8">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Individual Responses
            </h2>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4 text-brand" />
                  Respondents ({respondents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {respondents.map((r) => {
                    const respondentTier = getTierForScore(r.overall_score);
                    const respondentKey = `${r.user_id}_${r.submitted_at}`;
                    const isExpanded = expandedUserId === respondentKey;
                    const initials = r.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div key={respondentKey}>
                        <button
                          onClick={() => setExpandedUserId(isExpanded ? null : respondentKey)}
                          className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/50"
                        >
                          <Avatar size="sm">
                            {r.avatar_url && <AvatarImage src={r.avatar_url} alt={r.name} />}
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{r.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{r.email}</p>
                          </div>

                          <div className="hidden text-xs text-muted-foreground sm:block">
                            {roleLabels[r.respondent_role ?? ""] ?? r.department}
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                              style={{ backgroundColor: `${respondentTier.color}15`, color: respondentTier.color }}
                            >
                              {r.overall_score.toFixed(1)} · Tier {respondentTier.tier}
                            </span>
                          </div>

                          <div className="hidden text-xs text-muted-foreground sm:block">
                            {new Date(r.submitted_at).toLocaleDateString()}
                          </div>

                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border bg-muted/30 px-6 py-4">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
                                  {DIMENSIONS.map((dim: Dimension) => (
                                    <div key={dim}>
                                      <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                          {DIMENSION_LABELS[dim]}
                                        </span>
                                        <span className="text-xs font-semibold">{r.scores[dim].toFixed(1)}</span>
                                      </div>
                                      <Progress value={(r.scores[dim] / 5) * 100} className="h-1.5" />
                                    </div>
                                  ))}
                                </div>

                                <p className="mt-3 text-xs text-muted-foreground sm:hidden">
                                  {roleLabels[r.respondent_role ?? ""] ?? r.department} · Submitted{" "}
                                  {new Date(r.submitted_at).toLocaleDateString()}
                                </p>

                                <div className="mt-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {r.raw_answers && Object.keys(r.raw_answers).length > 0 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setAnswersUserId(answersUserId === respondentKey ? null : respondentKey);
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                                      >
                                        <ListChecks className="h-3.5 w-3.5" />
                                        {answersUserId === respondentKey ? "Hide Answers" : "View Answers"}
                                        <ChevronDown
                                          className={`h-3 w-3 transition-transform duration-200 ${
                                            answersUserId === respondentKey ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>
                                    )}
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        if (
                                          !id ||
                                          !window.confirm(
                                            "Remove this response? It will be excluded from all readiness scores."
                                          )
                                        )
                                          return;
                                        setDeletingResponseId(r.id);
                                        try {
                                          const res = await fetch(`/api/assessment/${id}/responses/${r.id}`, {
                                            method: "DELETE",
                                          });
                                          if (!res.ok) {
                                            const err = await res.json().catch(() => ({}));
                                            toast.error(err.error || "Failed to delete response");
                                            return;
                                          }
                                          toast.success("Response removed");
                                          await loadData();
                                          setExpandedUserId(null);
                                          setAnswersUserId(null);
                                        } catch {
                                          toast.error("Failed to delete response");
                                        } finally {
                                          setDeletingResponseId(null);
                                        }
                                      }}
                                      disabled={deletingResponseId === r.id}
                                      className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                                    >
                                      {deletingResponseId === r.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                      )}
                                      {deletingResponseId === r.id ? "Removing…" : "Delete response"}
                                    </button>
                                  </div>

                                  {r.raw_answers && Object.keys(r.raw_answers).length > 0 && (
                                    <AnimatePresence>
                                      {answersUserId === respondentKey && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="mt-4 space-y-6">
                                            {DIMENSIONS.map((dim: Dimension) => {
                                              const dimQuestions = template.questions.filter(
                                                (q) => q.dimension === dim
                                              );
                                              if (dimQuestions.length === 0) return null;

                                              return (
                                                <div key={dim}>
                                                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {DIMENSION_LABELS[dim]}
                                                  </h4>
                                                  <div className="space-y-3">
                                                    {dimQuestions.map((q) => {
                                                      const answerValue = r.raw_answers[q.id];
                                                      const selectedOption = q.options.find(
                                                        (o) => o.value === answerValue
                                                      );
                                                      const level =
                                                        answerValue == null
                                                          ? "none"
                                                          : answerValue <= 1
                                                            ? "low"
                                                            : answerValue <= 3
                                                              ? "mid"
                                                              : "high";

                                                      return (
                                                        <div
                                                          key={q.id}
                                                          className="rounded-lg border border-border p-3"
                                                        >
                                                          <p className="text-sm font-medium leading-snug">
                                                            {q.text}
                                                          </p>
                                                          <div className="mt-1.5 flex items-center gap-2">
                                                            <span
                                                              className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                                                                level === "high"
                                                                  ? "bg-emerald-500"
                                                                  : level === "mid"
                                                                    ? "bg-amber-500"
                                                                    : level === "low"
                                                                      ? "bg-red-500"
                                                                      : "bg-muted-foreground/30"
                                                              }`}
                                                            />
                                                            <span className="text-xs text-muted-foreground">
                                                              {selectedOption
                                                                ? `${selectedOption.label} (${answerValue}/5)`
                                                                : "Not answered"}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
