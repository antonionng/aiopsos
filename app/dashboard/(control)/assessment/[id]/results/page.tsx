"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Loader2, User, Users, ChevronDown, ListChecks, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DataThresholdGate } from "@/components/data-threshold-gate";
import { DATA_THRESHOLDS, RESPONDENT_ROLE_LABELS } from "@/lib/constants";
import { RadarChart } from "@/components/charts/radar-chart";
import { Heatmap } from "@/components/charts/heatmap";
import { MaturityGauge } from "@/components/charts/maturity-gauge";
import {
  calculateOverallScore,
  getRiskAreas,
  getAutomationOpportunities,
} from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSIONS, getTierForScore, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";
import { getTemplate } from "@/lib/assessment-templates";
import { toast } from "sonner";

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

interface AggregatedData {
  org_scores: DimensionScores;
  department_scores: { department: string; scores: DimensionScores }[];
  response_count: number;
  department_count: number;
  my_scores: DimensionScores | null;
  template_id: string;
  respondents?: Respondent[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

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

  const { org_scores, department_scores, response_count, department_count, my_scores, template_id, respondents } = data;
  const template = getTemplate(template_id);
  const meetsThreshold = response_count >= DATA_THRESHOLDS.ASSESSMENT_MIN_RESPONSES;

  const overallScore = meetsThreshold ? calculateOverallScore(org_scores) : 0;
  const risks = meetsThreshold ? getRiskAreas(org_scores) : [];
  const opportunities = meetsThreshold ? getAutomationOpportunities(department_scores) : [];

  const myOverall = my_scores ? calculateOverallScore(my_scores) : null;
  const myTier = myOverall !== null ? getTierForScore(myOverall) : null;

  const roleLabels = RESPONDENT_ROLE_LABELS as Record<string, string>;

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
          {my_scores && myOverall !== null && myTier && (
            <motion.div variants={item} className="mt-8">
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

          <motion.div variants={item} className="mt-8">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Organisation Overview</h2>
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

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
                        <div key={r.dimension} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div>
                            <p className="text-sm font-medium">{DIMENSION_LABELS[r.dimension]}</p>
                            <p className="text-xs text-muted-foreground">
                              Score: {r.score.toFixed(1)} — {r.severity === "critical" ? "Critical gap" : "Needs attention"}
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
                        <div key={o.department} className="flex items-center justify-between rounded-lg border border-border p-3">
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
        </>
      )}

      {respondents && respondents.length > 0 && (
        <>
          <motion.div variants={item} className="mt-8">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Individual Responses</h2>
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
                    const tier = getTierForScore(r.overall_score);
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
                              style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
                            >
                              {r.overall_score.toFixed(1)} · Tier {tier.tier}
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
                                        <span className="text-xs font-semibold">
                                          {r.scores[dim].toFixed(1)}
                                        </span>
                                      </div>
                                      <Progress
                                        value={(r.scores[dim] / 5) * 100}
                                        className="h-1.5"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <p className="mt-3 text-xs text-muted-foreground sm:hidden">
                                  {roleLabels[r.respondent_role ?? ""] ?? r.department} · Submitted {new Date(r.submitted_at).toLocaleDateString()}
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
                                        if (!id || !window.confirm("Remove this response? It will be excluded from all readiness scores.")) return;
                                        setDeletingResponseId(r.id);
                                        try {
                                          const res = await fetch(`/api/assessment/${id}/responses/${r.id}`, { method: "DELETE" });
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
                                                (q) => q.dimension === dim,
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
                                                        (o) => o.value === answerValue,
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
