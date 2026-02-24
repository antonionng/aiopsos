"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Route,
  CheckCircle2,
  Circle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Loader2,
  BrainCircuit,
  ClipboardList,
  Users,
  Unlock,
  Lock,
  ArrowRight,
  BarChart3,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { FeatureGate } from "@/components/feature-gate";
import { DataThresholdGate } from "@/components/data-threshold-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DATA_THRESHOLDS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { isEmployee, type UserRole } from "@/lib/role-helpers";
import type { RoadmapPhase } from "@/lib/types";
import type { DimensionScores } from "@/lib/types";

interface OrgSummary {
  overallScore: number;
  dimensionScores: DimensionScores;
  departmentCount: number;
  responseCount: number;
}

const PHASE_COLORS = ["#ffffff", "#a0a0a0", "#666666"];

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
    title: "Get your personalised roadmap",
    description: "We build a phased 90-day plan from your real maturity scores, completely free.",
  },
];

const INSIGHT_CARDS = [
  {
    icon: Calendar,
    title: "What is a phased adoption programme?",
    body: "A 90-day plan split into three phases: Foundation (days 1-30), Workflow Embedding (days 30-60), and Automation & Scaling (days 60-90). Each phase builds on the last so your teams adopt AI at a sustainable pace.",
  },
  {
    icon: BarChart3,
    title: "Why maturity scores matter",
    body: "Your assessment scores determine which activities appear in each phase. Lower maturity means more foundational work like governance and training. Higher maturity unlocks advanced workflows and agentic automation.",
  },
  {
    icon: Rocket,
    title: "From foundation to automation",
    body: "Phase 1 standardises access and defines governance. Phase 2 embeds AI into 3-5 core workflows and measures impact. Phase 3 scales automation and creates your 12-month AI strategy.",
  },
];

const PREVIEW_PHASES = [
  { phase: 1, title: "Foundation & Governance", days: "Days 1-30", milestones: 5 },
  { phase: 2, title: "Workflow Embedding", days: "Days 30-60", milestones: 4 },
  { phase: 3, title: "Automation & Scaling", days: "Days 60-90", milestones: 4 },
];

export default function RoadmapPage() {
  return (
    <FeatureGate featureKey="roadmapGenerator">
      <RoadmapContent />
    </FeatureGate>
  );
}

function RoadmapContent() {
  const [phases, setPhases] = useState<RoadmapPhase[] | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true });
  const [summary, setSummary] = useState<OrgSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    async function loadRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) setUserRole(profile.role as UserRole);
    }
    loadRole();

    fetch("/api/org/assessment-summary", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          setSummary(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function generate() {
    if (!summary || generating) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: "Organisation",
          overallScore: summary.overallScore,
          dimensionScores: summary.dimensionScores,
          departmentCount: summary.departmentCount,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate roadmap");
      const data = await res.json();
      setPhases(data.phases);
    } catch {
      setGenerateError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function toggleMilestone(phaseIdx: number, milestoneId: string) {
    if (!phases) return;
    const updated = [...phases];
    const milestone = updated[phaseIdx].milestones.find((m) => m.id === milestoneId);
    if (milestone) milestone.completed = !milestone.completed;
    setPhases(updated);
  }

  function getPhaseProgress(phase: RoadmapPhase) {
    const completed = phase.milestones.filter((m) => m.completed).length;
    return phase.milestones.length > 0 ? (completed / phase.milestones.length) * 100 : 0;
  }

  if (loading || userRole === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEmployee(userRole)) {
    return <EmployeeRoadmapView />;
  }

  if (!summary) {
    return <EmptyState />;
  }

  if (summary.responseCount < DATA_THRESHOLDS.ROADMAP_MIN_RESPONSES) {
    return (
      <DataThresholdGate
        currentCount={summary.responseCount}
        requiredCount={DATA_THRESHOLDS.ROADMAP_MIN_RESPONSES}
        featureLabel="90-Day Roadmap"
        description="A phased adoption plan with milestones customised to your organisation's maturity level. We need a minimum number of responses to generate meaningful insights."
        educationalCards={INSIGHT_CARDS}
      >
        <></>
      </DataThresholdGate>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">90-Day Roadmap</h1>
          <p className="text-sm text-muted-foreground">
            A phased adoption programme tailored to your maturity profile.
          </p>
        </div>
        {!phases && (
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={generate} disabled={generating}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Generating..." : "Generate Roadmap"}
          </Button>
        )}
      </motion.div>

      <motion.div variants={item} className="mt-4">
        <div className="flex items-center gap-2 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
          <p className="text-sm text-foreground">
            Based on <span className="font-semibold">{summary.responseCount} responses</span> across{" "}
            <span className="font-semibold">{summary.departmentCount} departments</span>.
            Overall maturity: <span className="font-semibold">{summary.overallScore.toFixed(1)}/5</span>.
          </p>
        </div>
      </motion.div>

      {generateError && (
        <motion.div variants={item} className="mt-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {generateError}
          </div>
        </motion.div>
      )}

      {!phases && !generating && (
        <motion.div variants={item} className="mt-12 flex flex-col items-center justify-center">
          <Route className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-sm font-semibold">Ready to generate your roadmap</h3>
          <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
            Your assessment data is ready. Generate a tailored 90-day adoption plan with milestones and deliverables for each phase.
          </p>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={generate} disabled={generating}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Generating..." : "Generate Roadmap"}
          </Button>
        </motion.div>
      )}

      {generating && !phases && (
        <motion.div variants={item} className="mt-12 flex flex-col items-center justify-center">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Generating your tailored roadmap...</p>
        </motion.div>
      )}

      {phases && (
        <div className="mt-6 space-y-4">
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  {phases.map((phase, i) => {
                    const progress = getPhaseProgress(phase);
                    return (
                      <div key={i} className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: PHASE_COLORS[i] }}>
                            Phase {phase.phase}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: PHASE_COLORS[i] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground">{phase.days}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {phases.map((phase, i) => (
            <motion.div key={i} variants={item}>
              <Card className="border-border bg-card">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setExpanded({ ...expanded, [i]: !expanded[i] })}
                >
                  <CardTitle className="flex items-center justify-between text-sm font-semibold">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: PHASE_COLORS[i] }}
                      >
                        {phase.phase}
                      </div>
                      <div>
                        <span>{phase.title}</span>
                        <p className="text-xs font-normal text-muted-foreground">{phase.days}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {phase.milestones.filter((m) => m.completed).length}/{phase.milestones.length} milestones
                      </Badge>
                      {expanded[i] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </CardTitle>
                </CardHeader>

                {expanded[i] && (
                  <CardContent className="pt-0">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Objectives
                        </p>
                        <ul className="space-y-1.5">
                          {phase.objectives.map((obj, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                              {obj}
                            </li>
                          ))}
                        </ul>

                        <p className="mb-2 mt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Deliverables
                        </p>
                        <ul className="space-y-1.5">
                          {phase.deliverables.map((del, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                              {del}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Milestones
                        </p>
                        <div className="space-y-2">
                          {phase.milestones.map((ms) => (
                            <button
                              key={ms.id}
                              onClick={(e) => { e.stopPropagation(); toggleMilestone(i, ms.id); }}
                              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent"
                            >
                              {ms.completed ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <div className="flex-1">
                                <p className={`text-sm ${ms.completed ? "text-muted-foreground line-through" : ""}`}>
                                  {ms.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Day {ms.day}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function EmployeeRoadmapView() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-2">
        <h1 className="mb-1">90-Day Roadmap</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Your organisation&apos;s adoption roadmap is managed by your admin.
          They use assessment data to build a phased plan with milestones
          tailored to your team&apos;s maturity level.
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-6">
        <Card className="border-border bg-card">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-5">
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 sm:mb-0">
                <Route className="h-7 w-7 text-brand" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">Admin-managed feature</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The 90-Day Roadmap provides a phased adoption programme with milestones,
                  objectives, and deliverables customised to your organisation&apos;s AI
                  maturity scores. Your admin generates and tracks progress on this roadmap.
                </p>
                <p className="mt-3 text-xs text-muted-foreground/70">
                  Make sure you&apos;ve completed your readiness assessment to contribute to the data.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/dashboard/my-results">
                    <Button size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      View My Results
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/hub">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Hero */}
      <motion.div variants={item} className="mb-2">
        <h1 className="mb-1">90-Day Roadmap</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Get a phased adoption plan with milestones customised to your organisation&#39;s maturity level
          , from governance foundations to agentic automation.
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
              <div className="mb-4 flex items-center gap-2">
                {PREVIEW_PHASES.map((p, i) => (
                  <div key={i} className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: PHASE_COLORS[i] }}>
                        Phase {p.phase}
                      </span>
                      <span className="text-xs text-muted-foreground">0%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted" />
                    <p className="mt-1 text-[10px] text-muted-foreground">{p.days}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {PREVIEW_PHASES.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
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
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      0/{p.milestones} milestones
                    </span>
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
            <p className="mt-1 text-xs text-muted-foreground">Your personalised roadmap is just a few responses away</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
