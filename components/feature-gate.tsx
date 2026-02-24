"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Cpu,
  FileText,
  Layers,
  Lock,
  Route,
  ScrollText,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPlanFeatures,
  getTierForScore,
  DIMENSION_LABELS,
  SUBSCRIPTION_PLANS,
  type PlanType,
  type PlanFeatures,
  type Dimension,
} from "@/lib/constants";

interface AssessmentSummary {
  overallScore: number;
  dimensionScores: Record<Dimension, number>;
  departmentCount: number;
  responseCount: number;
  departmentScores: {
    department: string;
    type: string;
    maturityScore: number;
  }[];
}

interface FeatureConfig {
  headline: string;
  icon: React.ComponentType<{ className?: string }>;
  minimumPlan: "pro" | "enterprise";
  buildMessage: (data: AssessmentSummary | null) => string;
  fallbackMessage: string;
  blurredPreview: ReactNode;
}

const PREVIEW_MODEL_ROWS = [
  { dept: "Engineering", primary: "Claude Sonnet 4", secondary: "GPT-4o" },
  { dept: "Sales", primary: "GPT-4o", secondary: "Gemini 2.0 Flash" },
  { dept: "Operations", primary: "Mistral Large", secondary: "GPT-4o Mini" },
  { dept: "Leadership", primary: "Claude Sonnet 4", secondary: "GPT-4o" },
];

const PREVIEW_PHASES = [
  { phase: 1, title: "Foundation & Governance", days: "Days 1-30" },
  { phase: 2, title: "Workflow Embedding", days: "Days 30-60" },
  { phase: 3, title: "Automation & Scaling", days: "Days 60-90" },
];

const PHASE_COLORS = ["#ffffff", "#a0a0a0", "#666666"];

function getWeakest(scores: Record<Dimension, number>): {
  dimension: string;
  score: number;
} {
  let min = Infinity;
  let key: Dimension = "confidence";
  for (const d of Object.keys(scores) as Dimension[]) {
    if (scores[d] < min) {
      min = scores[d];
      key = d;
    }
  }
  return { dimension: DIMENSION_LABELS[key], score: min };
}

function getDeptRange(
  depts: { maturityScore: number }[],
): { low: number; high: number } | null {
  if (depts.length === 0) return null;
  const scores = depts.map((d) => d.maturityScore);
  return {
    low: Math.min(...scores),
    high: Math.max(...scores),
  };
}

const FEATURE_CONFIGS: Record<string, FeatureConfig> = {
  advancedAnalytics: {
    headline: "See how your team is actually using AI",
    icon: BarChart3,
    minimumPlan: "pro",
    buildMessage: (data) => {
      if (!data) return "";
      return `Your ${data.departmentCount} department${data.departmentCount !== 1 ? "s" : ""} completed ${data.responseCount} assessment${data.responseCount !== 1 ? "s" : ""} with an overall maturity of ${data.overallScore.toFixed(1)}/5. Upgrade to Pro to track model usage, cost per department, and measure adoption ROI across your organisation.`;
    },
    fallbackMessage:
      "Complete a readiness assessment to see how analytics can help you track model usage, cost breakdowns, and adoption ROI across your organisation.",
    blurredPreview: (
      <div className="bg-card p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {["Total Requests", "Active Users", "Total Cost", "Avg Daily"].map(
            (label) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-bold">--</p>
              </div>
            ),
          )}
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold">Usage Over Time</span>
          </div>
          <div className="h-32 flex items-end gap-1">
            {[40, 55, 35, 60, 75, 50, 65, 80, 45, 70, 90, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-muted-foreground/20"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3">
            <span className="text-xs font-semibold">Model Distribution</span>
            <div className="mt-2 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full border-8 border-muted-foreground/20 border-t-muted-foreground/50" />
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <span className="text-xs font-semibold">Cost by Department</span>
            <div className="mt-2 space-y-2">
              {["Engineering", "Sales", "Ops"].map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="text-[10px] w-16 text-muted-foreground">
                    {d}
                  </span>
                  <div className="flex-1 h-2 rounded bg-muted-foreground/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  knowledgeBase: {
    headline: "Ground AI in your company knowledge",
    icon: FileText,
    minimumPlan: "pro",
    buildMessage: (data) => {
      if (!data) return "";
      const toolsScore = data.dimensionScores.tools;
      return `Your team scored ${toolsScore.toFixed(1)}/5 on Tools & Access. Upload company documents so AI responses draw from your organisation's specific policies, processes, and data — not generic answers.`;
    },
    fallbackMessage:
      "Complete a readiness assessment to understand your Tools & Access score, then upgrade to upload company documents that ground AI in your organisation's knowledge.",
    blurredPreview: (
      <div className="bg-card p-4 space-y-4">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8">
          <FileText className="mb-3 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground/50">
            Drag & drop files here
          </p>
          <p className="text-xs text-muted-foreground/30">
            PDF, DOCX, TXT, MD
          </p>
        </div>
        <div className="space-y-2">
          {["Company Handbook.pdf", "AI Policy v2.docx", "Onboarding Guide.md"].map(
            (f) => (
              <div
                key={f}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <FileText className="h-4 w-4 text-muted-foreground/30" />
                <span className="text-sm text-muted-foreground/50">{f}</span>
              </div>
            ),
          )}
        </div>
      </div>
    ),
  },

  stackRecommendation: {
    headline: "Get AI model recommendations tailored to each department",
    icon: Layers,
    minimumPlan: "pro",
    buildMessage: (data) => {
      if (!data) return "";
      const range = getDeptRange(data.departmentScores);
      const rangeStr = range
        ? `maturity scores ranging from ${range.low.toFixed(1)} to ${range.high.toFixed(1)}`
        : "varying maturity levels";
      return `With ${data.departmentCount} department${data.departmentCount !== 1 ? "s" : ""} assessed and ${rangeStr}, we can recommend the right AI models and governance guardrails for each team — so you stop overspending on one-size-fits-all.`;
    },
    fallbackMessage:
      "Complete a readiness assessment so we can recommend the right AI models and governance guardrails for each of your departments.",
    blurredPreview: (
      <div className="bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-brand" />
          <span className="text-sm font-semibold">Model Routing Plan</span>
        </div>
        <div className="space-y-2">
          {PREVIEW_MODEL_ROWS.map((row) => (
            <div
              key={row.dept}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm font-medium">{row.dept}</span>
              <div className="flex gap-2">
                <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand">
                  {row.primary}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {row.secondary}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-foreground" />
            <span className="text-sm font-semibold">Governance Layer</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Prompt injection detection",
              "PII redaction",
              "Cost budgets",
            ].map((g) => (
              <span
                key={g}
                className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  aiPolicies: {
    headline: "AI Policy Centre",
    icon: ScrollText,
    minimumPlan: "pro",
    buildMessage: (data) => {
      if (!data) return "";
      const responsibleScore = data.dimensionScores.responsible;
      return `Your team scored ${responsibleScore.toFixed(1)}/5 on Responsible Use. A clear AI policy can help establish guidelines and close governance gaps across your ${data.departmentCount} department${data.departmentCount !== 1 ? "s" : ""}.`;
    },
    fallbackMessage:
      "Access enterprise-grade AI policies vetted and trusted by enterprises and AI professionals worldwide. Create, customise, and publish AI usage policies tailored to your organisation.",
    blurredPreview: (
      <div className="bg-card p-4 space-y-3">
        {[
          { title: "AI Acceptable Use Policy", cat: "Acceptable Use", status: "Published" },
          { title: "Data Privacy & AI Policy", cat: "Data Privacy", status: "Published" },
          { title: "Employee AI Guidelines", cat: "Employee Guidelines", status: "Draft" },
          { title: "AI Risk Management Framework", cat: "Risk Management", status: "Draft" },
        ].map((p) => (
          <div
            key={p.title}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <ScrollText className="h-4 w-4 text-muted-foreground/30" />
              <div>
                <p className="text-sm font-medium text-muted-foreground/50">{p.title}</p>
                <p className="text-[10px] text-muted-foreground/30">{p.cat}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                p.status === "Published"
                  ? "bg-green-500/10 text-green-500/50"
                  : "bg-muted text-muted-foreground/40"
              }`}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    ),
  },

  roadmapGenerator: {
    headline: "A phased adoption plan built from your scores",
    icon: Route,
    minimumPlan: "pro",
    buildMessage: (data) => {
      if (!data) return "";
      const tier = getTierForScore(data.overallScore);
      const weakest = getWeakest(data.dimensionScores);
      return `At Tier ${tier.tier} (${tier.label}) with an overall score of ${data.overallScore.toFixed(1)}/5, your roadmap would focus on closing gaps in ${weakest.dimension} (${weakest.score.toFixed(1)}/5) during Phase 1 and scaling what's working across ${data.departmentCount} department${data.departmentCount !== 1 ? "s" : ""}.`;
    },
    fallbackMessage:
      "Complete a readiness assessment so we can generate a phased 90-day adoption plan with milestones specific to your maturity level.",
    blurredPreview: (
      <div className="bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          {PREVIEW_PHASES.map((p, i) => (
            <div key={i} className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: PHASE_COLORS[i] }}
                >
                  Phase {p.phase}
                </span>
                <span className="text-xs text-muted-foreground">0%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted" />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {p.days}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {PREVIEW_PHASES.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: PHASE_COLORS[i] }}
              >
                {p.phase}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">{p.title}</span>
                <p className="text-xs text-muted-foreground">{p.days}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

interface FeatureGateProps {
  featureKey: keyof PlanFeatures;
  children: ReactNode;
}

export function FeatureGate({ featureKey, children }: FeatureGateProps) {
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => {
        if (d.plan) setPlan(d.plan);
        else setPlan("basic");
      })
      .catch(() => setPlan("basic"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (plan && getPlanFeatures(plan)[featureKey]) {
    return <>{children}</>;
  }

  return (
    <UpgradePreview
      featureKey={featureKey}
      currentPlan={plan ?? "basic"}
    />
  );
}

function UpgradePreview({
  featureKey,
  currentPlan,
}: {
  featureKey: keyof PlanFeatures;
  currentPlan: PlanType;
}) {
  const [assessmentData, setAssessmentData] =
    useState<AssessmentSummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [userRole, setUserRole] = useState<string>("user");

  const config = FEATURE_CONFIGS[featureKey as string];

  useEffect(() => {
    fetch("/api/org/assessment-summary", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setAssessmentData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.role) setUserRole(data.role);
      })
      .catch(() => {});
  }, []);

  const isEmployeeRole = userRole === "user";

  if (!config) return null;

  const Icon = config.icon;
  const targetPlan = config.minimumPlan;
  const targetPlanLabel =
    targetPlan === "enterprise" ? "Enterprise" : "Pro";
  const price = SUBSCRIPTION_PLANS[targetPlan].monthlyPricePerSeat;

  const contextualMessage =
    loaded && assessmentData
      ? config.buildMessage(assessmentData)
      : loaded
        ? config.fallbackMessage
        : "";

  const hasData = !!assessmentData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mb-6">
        <h1 className="mb-1">{config.headline}</h1>
        <p className="text-sm text-muted-foreground">
          This feature is available on the {targetPlanLabel} plan.
        </p>
      </div>

      {hasData && assessmentData && (
        <Card className="mb-6 border-brand/20 bg-brand/5">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                <Sparkles className="h-4 w-4 text-brand" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Based on your assessment data
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {contextualMessage}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-card px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Overall Score
                </p>
                <p className="mt-0.5 text-lg font-bold">
                  {assessmentData.overallScore.toFixed(1)}
                  <span className="text-xs font-normal text-muted-foreground">
                    /5
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Departments
                </p>
                <p className="mt-0.5 text-lg font-bold">
                  {assessmentData.departmentCount}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Responses
                </p>
                <p className="mt-0.5 text-lg font-bold">
                  {assessmentData.responseCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasData && loaded && (
        <Card className="mb-6 border-border">
          <CardContent className="pt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {config.fallbackMessage}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="pointer-events-none select-none blur-[3px]">
          {config.blurredPreview}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          {isEmployeeRole ? (
            <>
              <p className="mt-3 text-sm font-semibold">
                Available on the {targetPlanLabel} plan
              </p>
              <p className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
                Ask your organisation admin to upgrade so your whole team can access this feature.
              </p>
              <Link href="/dashboard/hub" className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  Back to Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm font-semibold">
                Unlock with {targetPlanLabel}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                From £{price}/user/month
              </p>
              <Link href="/dashboard/billing" className="mt-4">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Upgrade to {targetPlanLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
