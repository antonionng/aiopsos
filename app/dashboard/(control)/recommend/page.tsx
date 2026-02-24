"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Shield,
  Cpu,
  Sparkles,
  Loader2,
  ClipboardList,
  Users,
  Unlock,
  Lock,
  ArrowRight,
  BrainCircuit,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { FeatureGate } from "@/components/feature-gate";
import { DataThresholdGate } from "@/components/data-threshold-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRecommendationSummary } from "@/lib/recommendation-engine";
import { DEPARTMENT_TYPES, DEPARTMENT_LABELS, ALL_MODELS, DATA_THRESHOLDS } from "@/lib/constants";
import type { ModelRouting, ControlLayer } from "@/lib/types";
import type { DepartmentType } from "@/lib/constants";

interface DeptInput {
  type: DepartmentType;
  dataSensitivity: "low" | "medium" | "high" | "critical";
  maturityScore: number;
}

interface AssessmentSummary {
  responseCount: number;
  departmentCount: number;
  overallScore: number;
  departmentScores: { department: string; type: string; maturityScore: number }[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const UNLOCK_STEPS = [
  {
    icon: ClipboardList,
    title: "Create a readiness assessment",
    description: "Set up an assessment for your organisation in under a minute.",
  },
  {
    icon: Users,
    title: "Share it with your team",
    description: "It takes ~5 minutes per person. More responses means better insights.",
  },
  {
    icon: Unlock,
    title: "Get your personalised recommendation",
    description: "We analyse your results and generate a tailored AI model routing plan -- free.",
  },
];

const INSIGHT_CARDS = [
  {
    icon: Layers,
    title: "Why different teams need different AI models",
    body: "Engineering teams need models strong at code reasoning. Sales teams need natural conversational drafting. Legal needs long-context document analysis. A one-size-fits-all approach wastes budget and delivers poor results.",
  },
  {
    icon: Shield,
    title: "What is a governance control layer?",
    body: "It is a set of guardrails, logging policies, and access controls that sit between your teams and the AI models they use. It ensures data stays safe, costs stay predictable, and usage stays compliant.",
  },
  {
    icon: DollarSign,
    title: "How maturity scores shape your budget",
    body: "Teams early in their AI journey need lower budgets with simpler tools. As maturity grows, budgets scale to match more advanced use cases. Your assessment scores drive this calibration automatically.",
  },
];

const PREVIEW_ROWS = [
  { dept: "Engineering", primary: "Claude Sonnet 4", secondary: "GPT-4o" },
  { dept: "Sales", primary: "GPT-4o", secondary: "Gemini 2.0 Flash" },
  { dept: "Operations", primary: "Mistral Large", secondary: "GPT-4o Mini" },
  { dept: "Leadership", primary: "Claude Sonnet 4", secondary: "GPT-4o" },
];

export default function RecommendPage() {
  return (
    <FeatureGate featureKey="stackRecommendation">
      <RecommendContent />
    </FeatureGate>
  );
}

function RecommendContent() {
  const [departments, setDepartments] = useState<DeptInput[]>([]);
  const [routing, setRouting] = useState<ModelRouting[] | null>(null);
  const [control, setControl] = useState<ControlLayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);

  useEffect(() => {
    fetch("/api/org/assessment-summary")
      .then((r) => r.json())
      .then((res) => {
        if (res.data?.departmentScores?.length > 0) {
          setSummary(res.data);
          const mapped: DeptInput[] = res.data.departmentScores.map(
            (d: { department: string; type: string; maturityScore: number }) => ({
              type: (DEPARTMENT_TYPES.includes(d.type as DepartmentType) ? d.type : "operations") as DepartmentType,
              dataSensitivity: "medium" as const,
              maturityScore: d.maturityScore,
            }),
          );
          setDepartments(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateDept(index: number, field: keyof DeptInput, value: string | number) {
    const updated = [...departments];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setDepartments(updated);
  }

  async function generate() {
    if (generating) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departments: departments.map((d) => ({ ...d, primaryTasks: [] })),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate recommendations");
      const data = await res.json();
      setRouting(data.routing);
      setControl(data.controlLayer);
    } catch {
      setGenerateError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function getModelLabel(id: string) {
    return ALL_MODELS.find((m) => m.id === id)?.label ?? id;
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!summary) {
    return <EmptyState />;
  }

  if (summary.responseCount < DATA_THRESHOLDS.RECOMMENDATION_MIN_RESPONSES) {
    return (
      <DataThresholdGate
        currentCount={summary.responseCount}
        requiredCount={DATA_THRESHOLDS.RECOMMENDATION_MIN_RESPONSES}
        featureLabel="Stack Recommendation"
        description="See which AI models each department should use, with governance guardrails. We need a minimum number of responses to tailor recommendations to your organisation."
        educationalCards={INSIGHT_CARDS}
      >
        <></>
      </DataThresholdGate>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Stack Recommendation</h1>
        <p className="text-sm text-muted-foreground">
          See exactly which AI models each department should use, with governance guardrails tailored to your data sensitivity.
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-4">
        <div className="flex items-center gap-2 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
          <p className="text-sm text-foreground">
            Based on <span className="font-semibold">{summary.responseCount} responses</span> across{" "}
            <span className="font-semibold">{summary.departmentCount} departments</span> from your latest assessment.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Department Profiles
              <Badge variant="secondary" className="ml-2 text-[10px] font-normal">
                From assessment
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 rounded-lg border border-border p-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <Select value={dept.type} onValueChange={(v) => updateDept(i, "type", v)}>
                      <SelectTrigger className="bg-surface"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{DEPARTMENT_LABELS[t]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Data Sensitivity</Label>
                    <Select value={dept.dataSensitivity} onValueChange={(v) => updateDept(i, "dataSensitivity", v)}>
                      <SelectTrigger className="bg-surface"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Maturity (0-5)</Label>
                    <Select value={String(dept.maturityScore)} onValueChange={(v) => updateDept(i, "maturityScore", Number(v))}>
                      <SelectTrigger className="bg-surface"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
                          <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            {generateError && (
              <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {generateError}
              </div>
            )}
            <div className="mt-4">
              <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={generate} disabled={generating}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {generating ? "Generating..." : "Generate Recommendations"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {routing && control && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          {(() => {
            const s = getRecommendationSummary(routing, control);
            return (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Departments", value: s.totalDepartments },
                  { label: "Unique Models", value: s.uniqueModels },
                  { label: "Monthly Budget", value: `$${s.monthlyBudget}` },
                  { label: "Guardrails", value: s.guardrailCount },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border bg-card">
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Cpu className="h-4 w-4 text-brand" />
                Model Routing Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {routing.map((r) => (
                  <div key={r.department_type} className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{DEPARTMENT_LABELS[r.department_type]}</h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-brand/10 text-brand">
                          {getModelLabel(r.primary_model)}
                        </Badge>
                        <Badge variant="secondary">
                          {getModelLabel(r.secondary_model)}
                        </Badge>
                      </div>
                    </div>
                    <p className="mb-1 text-xs text-muted-foreground">{r.use_case}</p>
                    <p className="text-xs text-muted-foreground/70">{r.reasoning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4 text-foreground" />
                Governance & Control Layer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Logging Level</p>
                  <p className="mt-1 text-sm font-semibold capitalize">{control.logging_level}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Budget</p>
                  <p className="mt-1 text-sm font-semibold">${control.cost_budget_monthly}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs text-muted-foreground">Active Guardrails</p>
                <div className="flex flex-wrap gap-2">
                  {control.guardrails.map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Hero */}
      <motion.div variants={item} className="mb-2">
        <h1 className="mb-1">Stack Recommendation</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          See exactly which AI models each department should use, with governance guardrails tailored
          to your data sensitivity and maturity level.
        </p>
        <p className="mt-1 text-sm font-medium text-brand">
          Included free with your account. Just get your team to complete an assessment.
        </p>
      </motion.div>

      {/* 3-Step Unlock Tracker */}
      <motion.div variants={item} className="mt-8">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {UNLOCK_STEPS.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  {i < UNLOCK_STEPS.length - 1 && (
                    <div className="absolute left-[calc(50%+28px)] top-5 hidden h-px w-[calc(100%-56px)] bg-border sm:block" />
                  )}
                  <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card">
                    <step.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Step {i + 1}</p>
                  <h3 className="mb-1 text-sm font-semibold">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link href="/dashboard/assessment">
                <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Go to Assessments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Educational Insight Cards */}
      <motion.div variants={item} className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Why this matters</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {INSIGHT_CARDS.map((card) => (
            <Card key={card.title} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <card.icon className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="mb-2 text-sm font-semibold">{card.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Blurred Preview Teaser */}
      <motion.div variants={item} className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">What you will get</h2>
        <div className="relative overflow-hidden rounded-xl border border-border">
          <div className="pointer-events-none select-none blur-[3px]">
            <div className="bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-brand" />
                <span className="text-sm font-semibold">Model Routing Plan</span>
              </div>
              <div className="space-y-2">
                {PREVIEW_ROWS.map((row) => (
                  <div key={row.dept} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm font-medium">{row.dept}</span>
                    <div className="flex gap-2">
                      <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand">{row.primary}</span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{row.secondary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-semibold">Complete an assessment to unlock</p>
            <p className="mt-1 text-xs text-muted-foreground">Your personalised recommendation is just a few responses away</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
