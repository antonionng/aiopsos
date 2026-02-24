"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Crown,
  DollarSign,
  Lightbulb,
  Lock,
  MessageSquare,
  RefreshCw,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  MATURITY_TIERS,
  type Dimension,
} from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

interface ResultsData {
  scores: DimensionScores;
  overall: number;
  tier: { tier: number; label: string; color: string };
  risks: { dimension: Dimension; score: number; severity: string }[];
  recommendations: {
    dimension: Dimension;
    label: string;
    score: number;
    recommendation: string;
  }[];
  submitted_at: string;
  orgAverages: DimensionScores | null;
}

const INDUSTRY_BENCHMARKS: Record<Dimension, number> = {
  confidence: 3.8,
  practice: 3.5,
  tools: 4.1,
  responsible: 3.6,
  culture: 3.4,
};

const INDUSTRY_BENCHMARK_OVERALL = 3.7;

const DIMENSION_LEADER_INSIGHTS: Record<
  Dimension,
  { leaders: string; insight: string; benefit: string }
> = {
  confidence: {
    leaders: "Google, Microsoft, Stripe",
    insight:
      "invest in structured AI literacy programmes -- every employee gets hands-on training, not just engineers.",
    benefit:
      "Teams with high AI confidence ship 37% faster and produce higher-quality outputs.",
  },
  practice: {
    leaders: "Shopify, Klarna, Duolingo",
    insight:
      "have made AI a daily habit -- from auto-generated PR reviews to AI-drafted customer responses in every workflow.",
    benefit:
      "Daily AI users save an average of 6.2 hours per week on routine tasks.",
  },
  tools: {
    leaders: "Amazon, Netflix, Spotify",
    insight:
      "give every team access to the right AI tools for their role, not a one-size-fits-all solution.",
    benefit:
      "Proper AI tooling reduces context-switching by 45% and increases output quality.",
  },
  responsible: {
    leaders: "Anthropic, OpenAI, DeepMind",
    insight:
      "embed governance into the workflow itself -- guardrails, data policies, and review processes are automated, not optional.",
    benefit:
      "Organisations with strong AI governance see 60% fewer compliance incidents.",
  },
  culture: {
    leaders: "GitLab, Notion, Linear",
    insight:
      "celebrate AI experimentation openly -- they have dedicated channels, demo days, and no-blame policies for AI experiments.",
    benefit:
      "Teams with strong AI culture see 3x faster adoption rates across departments.",
  },
};

const TIER_IMPACT_STATS = [
  {
    tier: "Tier 0-1",
    label: "Getting Started",
    stat: "Baseline",
    description: "Sporadic usage, no measurable productivity impact yet.",
  },
  {
    tier: "Tier 2",
    label: "Repeatable",
    stat: "+15% efficiency",
    description:
      "Early adopters saving 2-4 hours/week. Foundation being built.",
  },
  {
    tier: "Tier 3",
    label: "Embedded",
    stat: "+35% efficiency",
    description:
      "AI in core workflows. Teams consistently saving 5-8 hours/week.",
  },
  {
    tier: "Tier 4-5",
    label: "Automated",
    stat: "+55% efficiency",
    description:
      "AI-native operations. Entire processes automated. Major competitive edge.",
  },
];

const AI_ADOPTION_STATS = [
  {
    icon: Clock,
    stat: "6.2 hrs",
    label: "saved per week",
    source: "by employees who use AI daily",
  },
  {
    icon: TrendingUp,
    stat: "40%",
    label: "productivity gain",
    source: "reported by Tier 4+ organisations",
  },
  {
    icon: DollarSign,
    stat: "£4,200",
    label: "annual value",
    source: "per employee at mature AI adoption",
  },
  {
    icon: Rocket,
    stat: "3x",
    label: "faster adoption",
    source: "with proper tools and culture in place",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function getGapLabel(
  myScore: number,
  benchmark: number
): { label: string; color: string; delta: number } {
  const delta = myScore - benchmark;
  if (delta >= 0.5) return { label: "Above benchmark", color: "text-green-500", delta };
  if (delta >= -0.2) return { label: "Near benchmark", color: "text-blue-400", delta };
  if (delta >= -1) return { label: "Below benchmark", color: "text-amber-500", delta };
  return { label: "Significant gap", color: "text-red-400", delta };
}

function getUpsellForDimension(dim: Dimension, score: number) {
  if (score >= 3.5) return null;
  const map: Partial<Record<Dimension, { title: string; cta: string; href: string; icon: typeof MessageSquare }>> = {
    practice: {
      title: "AI Chat helps build daily practice",
      cta: "Explore AI Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
    },
    tools: {
      title: "Get model recommendations for your role",
      cta: "View Stack Recommendations",
      href: "/dashboard/recommend",
      icon: Zap,
    },
    confidence: {
      title: "Practice with AI-powered conversations",
      cta: "Try AI Chat",
      href: "/dashboard/chat",
      icon: Sparkles,
    },
    culture: {
      title: "See how your org is progressing",
      cta: "View Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  };
  return map[dim] ?? null;
}

export default function MyResultsPage() {
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/user/results", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load results");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your results...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
            <BrainCircuit className="h-7 w-7 text-brand" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No results yet</h2>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Complete an AI readiness assessment to discover your maturity level,
            see how you compare to market leaders, and get personalised
            recommendations.
          </p>
          <Link href="/dashboard/assessment">
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Take Assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedRecs = [...results.recommendations].sort(
    (a, b) => a.score - b.score
  );
  const topStrength = [...results.recommendations].sort(
    (a, b) => b.score - a.score
  )[0];
  const overallGap = getGapLabel(results.overall, INDUSTRY_BENCHMARK_OVERALL);
  const currentTierIdx = TIER_IMPACT_STATS.findIndex((t) => {
    if (results.tier.tier <= 1) return t.tier === "Tier 0-1";
    if (results.tier.tier === 2) return t.tier === "Tier 2";
    if (results.tier.tier === 3) return t.tier === "Tier 3";
    return t.tier === "Tier 4-5";
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <h1 className="mb-1">Your AI Maturity Results</h1>
        <p className="text-sm text-muted-foreground">
          Assessment completed{" "}
          {new Date(results.submitted_at).toLocaleDateString()} -- compared
          against industry-leading benchmarks.
        </p>
      </motion.div>

      {/* ─── Score + Benchmark Hero ─── */}
      <motion.div
        variants={item}
        className="mb-8 grid gap-4 lg:grid-cols-[340px_1fr]"
      >
        {/* Overall score card */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Your Score
          </p>
          <p className="text-5xl font-bold tracking-tight">
            {results.overall.toFixed(1)}
            <span className="text-lg text-muted-foreground"> / 5</span>
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-semibold">
            Tier {results.tier.tier}: {results.tier.label}
          </div>

          {/* Benchmark comparison */}
          <div className="mt-4 rounded-lg bg-foreground/5 px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Industry benchmark
            </p>
            <p className="mt-0.5 text-lg font-bold">
              {INDUSTRY_BENCHMARK_OVERALL}
            </p>
            <p className={`mt-0.5 text-xs font-medium ${overallGap.color}`}>
              {overallGap.delta > 0 ? "+" : ""}
              {overallGap.delta.toFixed(1)} -- {overallGap.label}
            </p>
          </div>

          <div className="mt-4">
            <Link href="/dashboard/assessment">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
                Retake to track progress
              </Button>
            </Link>
          </div>
        </div>

        {/* Dimension scores vs benchmarks */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DIMENSIONS.map((dim: Dimension) => {
            const gap = getGapLabel(results.scores[dim], INDUSTRY_BENCHMARKS[dim]);
            const orgComparison =
              results.orgAverages && results.orgAverages[dim] !== undefined
                ? results.scores[dim] - results.orgAverages[dim]
                : null;

            return (
              <div
                key={dim}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                  {DIMENSION_LABELS[dim]}
                </p>
                <div className="flex items-end gap-1.5">
                  <p className="text-2xl font-bold">
                    {results.scores[dim].toFixed(1)}
                  </p>
                  <p className="mb-0.5 text-xs text-muted-foreground">/ 5</p>
                </div>
                <Progress
                  value={(results.scores[dim] / 5) * 100}
                  className="mt-2 h-1.5"
                />

                {/* Benchmark bar */}
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-400/40"
                      style={{
                        width: `${(INDUSTRY_BENCHMARKS[dim] / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {INDUSTRY_BENCHMARKS[dim]}
                  </span>
                </div>

                <p className={`mt-1.5 text-[10px] font-medium ${gap.color}`}>
                  {gap.label}
                </p>
                {orgComparison !== null && (
                  <p className="text-[9px] text-muted-foreground/70">
                    {orgComparison > 0 ? "+" : ""}
                    {orgComparison.toFixed(1)} vs org avg
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── AI Impact Stats Banner ─── */}
      <motion.div variants={item} className="mb-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {AI_ADOPTION_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                <s.icon className="h-4 w-4 text-brand" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{s.stat}</p>
              <p className="text-xs font-medium">{s.label}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {s.source}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Tier Progression Journey ─── */}
      <motion.div variants={item} className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Target className="h-4 w-4" />
          Your Growth Journey
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
                          isCurrent
                            ? "text-brand"
                            : isFuture
                              ? "text-muted-foreground"
                              : ""
                        }`}
                      >
                        {t.tier}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {t.label}
                      </p>
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

      {/* ─── What Market Leaders Do ─── */}
      <motion.div variants={item} className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          How You Compare to Market Leaders
        </h2>
        <div className="space-y-3">
          {DIMENSIONS.map((dim: Dimension) => {
            const gap = getGapLabel(
              results.scores[dim],
              INDUSTRY_BENCHMARKS[dim]
            );
            const info = DIMENSION_LEADER_INSIGHTS[dim];
            const upsell = getUpsellForDimension(dim, results.scores[dim]);

            return (
              <Card
                key={dim}
                className={`border-border bg-card transition-all ${
                  gap.delta < -0.5 ? "ring-1 ring-amber-500/20" : ""
                }`}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-4">
                    {/* Score comparison column */}
                    <div className="flex shrink-0 flex-col items-center gap-1 rounded-lg bg-foreground/5 px-3 py-2.5">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        You
                      </p>
                      <p className="text-xl font-bold">
                        {results.scores[dim].toFixed(1)}
                      </p>
                      <div className="h-px w-6 bg-border" />
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        Leaders
                      </p>
                      <p className="text-xl font-bold text-brand">
                        {INDUSTRY_BENCHMARKS[dim].toFixed(1)}
                      </p>
                    </div>

                    {/* Insight content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {DIMENSION_LABELS[dim]}
                        </p>
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
                        <span className="font-medium text-foreground">
                          {info.leaders}
                        </span>{" "}
                        {info.insight}
                      </p>

                      <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-foreground/5 px-3 py-2">
                        <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Why it matters:
                          </span>{" "}
                          {info.benefit}
                        </p>
                      </div>

                      {upsell && (
                        <div className="mt-2.5">
                          <Link href={upsell.href}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5 px-2 text-xs text-brand hover:text-brand"
                            >
                              <upsell.icon className="h-3 w-3" />
                              {upsell.cta}
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Top Strength Callout ─── */}
      {topStrength && topStrength.score >= 2.5 && (
        <motion.div variants={item} className="mb-8">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Your strongest area: {topStrength.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    At {topStrength.score.toFixed(1)}/5, you&apos;re
                    {topStrength.score >= INDUSTRY_BENCHMARKS[topStrength.dimension]
                      ? " performing at or above industry benchmark. This puts you in the top tier of AI readiness for this dimension."
                      : " building a solid foundation. With focused effort, you can reach the industry benchmark and beyond."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── Risk Areas ─── */}
      {results.risks.length > 0 && (
        <motion.div variants={item} className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Priority Gaps
          </h2>
          <div className="space-y-3">
            {results.risks.map((risk) => (
              <div
                key={risk.dimension}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    {DIMENSION_LABELS[risk.dimension]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Score: {risk.score.toFixed(1)} vs{" "}
                    {INDUSTRY_BENCHMARKS[risk.dimension]} benchmark --{" "}
                    {risk.severity === "critical"
                      ? "critical gap vs market leaders"
                      : "room for improvement"}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    risk.severity === "critical"
                      ? "border-destructive/30 text-destructive"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {risk.severity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Personalised Action Plan ─── */}
      <motion.div variants={item} className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="h-4 w-4" />
          Your Action Plan
        </h2>
        <div className="space-y-3">
          {sortedRecs.map((rec, i) => (
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
                      <Badge
                        variant="secondary"
                        className="bg-brand/10 text-brand text-[10px]"
                      >
                        Start here
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {rec.score.toFixed(1)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-xs font-medium text-brand">
                      {INDUSTRY_BENCHMARKS[rec.dimension]}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {rec.recommendation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ─── AI Chat Upsell ─── */}
      <motion.div variants={item} className="mb-8">
        <Card className="overflow-hidden border-brand/20">
          <CardContent className="p-0">
            <div className="grid sm:grid-cols-[1fr_auto]">
              <div className="p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                  <MessageSquare className="h-4 w-4 text-brand" />
                </div>
                <h3 className="mb-1 text-base font-semibold">
                  Accelerate your AI skills with AI Chat
                </h3>
                <p className="mb-1 text-sm text-muted-foreground">
                  The fastest way to move from Tier {results.tier.tier} to Tier{" "}
                  {Math.min(results.tier.tier + 1, 5)} is daily practice. AI
                  Chat gives you access to every leading model in one place --
                  with your company context built in.
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Companies that give employees AI access see{" "}
                  <span className="font-medium text-foreground">
                    40% faster skill development
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-foreground">
                    3x higher adoption rates
                  </span>
                  .
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/chat">
                    <Button
                      size="sm"
                      className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Try AI Chat
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden items-center border-l border-border bg-foreground/[0.02] px-8 sm:flex">
                <div className="space-y-2 text-center">
                  <p className="text-3xl font-bold tracking-tight">11+</p>
                  <p className="text-xs text-muted-foreground">AI models</p>
                  <div className="h-px w-12 mx-auto bg-border" />
                  <p className="text-3xl font-bold tracking-tight">1</p>
                  <p className="text-xs text-muted-foreground">platform</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Next Steps ─── */}
      <motion.div
        variants={item}
        className="rounded-xl border border-border bg-card p-8 text-center"
      >
        <Rocket className="mx-auto mb-4 h-8 w-8 text-brand" />
        <h2 className="mb-2 text-lg font-semibold">
          Ready to close the gap?
        </h2>
        <p className="mx-auto mb-2 max-w-lg text-sm text-muted-foreground">
          You&apos;re{" "}
          {(INDUSTRY_BENCHMARK_OVERALL - results.overall).toFixed(1)} points
          from the industry benchmark. Focus on your top action item this week,
          practice with AI daily, and retake in 30 days to track your growth.
        </p>
        <p className="mx-auto mb-6 max-w-lg text-xs text-muted-foreground/70">
          Employees who retake assessments monthly improve their scores 2x
          faster than those who don&apos;t.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/assessment">
            <Button variant="outline" className="gap-1.5">
              <RefreshCw className="h-4 w-4" />
              Retake Assessment
            </Button>
          </Link>
          <Link href="/dashboard/hub">
            <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
              Back to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
