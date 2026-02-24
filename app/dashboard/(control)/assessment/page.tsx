"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Crown,
  DollarSign,
  FileText,
  Layers,
  Loader2,
  Lock,
  Megaphone,
  MessageSquare,
  Plus,
  Rocket,
  Route,
  Send,
  Share2,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { isEmployee, type UserRole } from "@/lib/role-helpers";
import { ASSESSMENT_TEMPLATES, TEMPLATE_IDS } from "@/lib/assessment-templates";
import { DIMENSION_LABELS, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  "org-wide": <Building2 className="h-6 w-6" />,
  engineering: <Code2 className="h-6 w-6" />,
  sales: <TrendingUp className="h-6 w-6" />,
  marketing: <Megaphone className="h-6 w-6" />,
  leadership: <Crown className="h-6 w-6" />,
  governance: <Shield className="h-6 w-6" />,
};

interface Assessment {
  id: string;
  title: string;
  status: "draft" | "active" | "completed";
  template_id?: string;
  created_at: string;
  assessment_responses: { count: number }[];
}

interface PersonalResults {
  scores: DimensionScores;
  overall: number;
  tier: { tier: number; label: string; color: string };
  submitted_at: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-brand/10 text-brand",
  completed: "bg-foreground/10 text-foreground",
};

export default function AssessmentListPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [personalResults, setPersonalResults] = useState<PersonalResults | null>(null);

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

    fetch("/api/user/results")
      .then((r) => r.json())
      .then((data) => { if (!data.error) setPersonalResults(data); })
      .catch(() => {});
  }, []);

  const fetchAssessments = useCallback(async () => {
    try {
      const res = await fetch("/api/assessment");
      const data = await res.json();
      setAssessments(data.assessments ?? []);
    } catch {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  async function handleCreate(templateId: string) {
    setCreating(templateId);
    try {
      const template = ASSESSMENT_TEMPLATES[templateId];
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: template.title,
          template_id: templateId,
        }),
      });
      const data = await res.json();
      if (data.assessment) {
        setPickerOpen(false);
        router.push(`/dashboard/assessment/${data.assessment.id}/distribute`);
      }
    } finally {
      setCreating(null);
    }
  }

  function copyShareLink(id: string) {
    const url = `${window.location.origin}/assessment/${id}/take`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading || userRole === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEmployee(userRole)) {
    return (
      <EmployeeAssessmentView
        assessments={assessments}
        personalResults={personalResults}
      />
    );
  }

  return (
    <AdminAssessmentView
      assessments={assessments}
      pickerOpen={pickerOpen}
      setPickerOpen={setPickerOpen}
      creating={creating}
      handleCreate={handleCreate}
      copiedId={copiedId}
      copyShareLink={copyShareLink}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN / MANAGER VIEW -- unchanged original UI
   ═══════════════════════════════════════════════════════════════════ */

function AdminAssessmentView({
  assessments,
  pickerOpen,
  setPickerOpen,
  creating,
  handleCreate,
  copiedId,
  copyShareLink,
}: {
  assessments: Assessment[];
  pickerOpen: boolean;
  setPickerOpen: (v: boolean) => void;
  creating: string | null;
  handleCreate: (tid: string) => void;
  copiedId: string | null;
  copyShareLink: (id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Readiness Assessment</h1>
          <p className="text-sm text-muted-foreground">
            Diagnose AI maturity across your organisation.
          </p>
        </div>
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => setPickerOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setPickerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative mx-4 w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPickerOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-6">
                <h2 className="text-lg font-semibold tracking-[-0.01em]">
                  Choose Assessment Type
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Each assessment is tailored with domain-specific questions while measuring the same 5 AI readiness dimensions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATE_IDS.map((tid) => {
                  const t = ASSESSMENT_TEMPLATES[tid];
                  const isCreating = creating === tid;
                  return (
                    <button
                      key={tid}
                      onClick={() => handleCreate(tid)}
                      disabled={creating !== null}
                      className="group flex flex-col rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-brand/30 hover:bg-brand/5 disabled:opacity-50"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                        {TEMPLATE_ICONS[tid]}
                      </div>
                      <h3 className="text-sm font-semibold">{t.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.subtitle}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/70">{t.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {t.questions.length} questions
                        </Badge>
                        {isCreating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-brand" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 space-y-3">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                {TEMPLATE_ICONS[a.template_id ?? "org-wide"] ?? <BrainCircuit className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{a.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {a.assessment_responses[0]?.count ?? 0} responses ·{" "}
                  {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={statusColors[a.status]}>{a.status}</Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/assessment/${a.id}/distribute`}>
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Distribute
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copyShareLink(a.id)}>
                  {copiedId === a.id ? <Check className="mr-1.5 h-3.5 w-3.5 text-brand" /> : <Share2 className="mr-1.5 h-3.5 w-3.5" />}
                  {copiedId === a.id ? "Copied!" : "Share"}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/assessment/${a.id}/take`}>
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Take
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/assessment/${a.id}/results`}>
                    Results
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {assessments.length === 0 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                <BrainCircuit className="h-7 w-7 text-brand" />
              </div>
              <h3 className="mb-1 text-base font-semibold">Diagnose your organisation&apos;s AI maturity</h3>
              <p className="mb-2 max-w-md text-sm text-muted-foreground">
                Create a readiness assessment to measure AI adoption across 5 key dimensions. Share it with your team and get actionable insights in minutes.
              </p>
              <div className="mb-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~5 min per person</span>
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Anonymous responses</span>
                <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Instant scoring</span>
              </div>
              <Button
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => setPickerOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold">What you&apos;ll unlock</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: BarChart3, title: "Maturity scores", desc: "See how each department scores across confidence, practice, tools, governance, and culture." },
                  { icon: Users, title: "Team benchmarks", desc: "Compare departments against each other and against industry-leading organisations." },
                  { icon: Rocket, title: "Action plans", desc: "Get personalised recommendations and a 90-day roadmap based on your real scores." },
                ].map((c) => (
                  <Card key={c.title} className="border-border bg-card">
                    <CardContent className="pt-5">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                        <c.icon className="h-4 w-4 text-brand" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold">{c.title}</h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EMPLOYEE VIEW -- personal status, blurred org preview, upsell
   ═══════════════════════════════════════════════════════════════════ */

const INDUSTRY_BENCHMARKS: Record<Dimension, number> = {
  confidence: 3.8, practice: 3.5, tools: 4.1, responsible: 3.6, culture: 3.4,
};

const AI_IMPACT_STATS = [
  { icon: Clock,       stat: "6.2 hrs/week", label: "saved by daily AI users", source: "McKinsey 2025" },
  { icon: TrendingUp,  stat: "40%",          label: "productivity gain at Tier 4+", source: "BCG Research" },
  { icon: DollarSign,  stat: "£4,200",       label: "annual value per employee", source: "Deloitte AI Report" },
  { icon: Rocket,      stat: "3x faster",    label: "adoption with proper culture", source: "Harvard Business Review" },
];

const MOCK_RADAR_DIMS = [
  { dim: "Confidence", you: 65, org: 72 },
  { dim: "Practice",   you: 55, org: 68 },
  { dim: "Tools",      you: 70, org: 78 },
  { dim: "Responsible", you: 48, org: 62 },
  { dim: "Culture",    you: 42, org: 58 },
];

const MOCK_HEATMAP_DEPTS = [
  { dept: "Engineering", scores: [3.8, 3.2, 4.1, 3.5, 3.0] },
  { dept: "Sales",       scores: [2.9, 3.5, 3.0, 2.8, 3.2] },
  { dept: "Marketing",   scores: [3.2, 2.8, 3.5, 3.0, 2.9] },
  { dept: "Operations",  scores: [2.5, 2.2, 2.8, 3.0, 2.4] },
  { dept: "Leadership",  scores: [3.5, 3.8, 3.2, 3.8, 3.5] },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function EmployeeAssessmentView({
  assessments,
  personalResults,
}: {
  assessments: Assessment[];
  personalResults: PersonalResults | null;
}) {
  const activeAssessment = assessments.find((a) => a.status === "active") ?? assessments[0];
  const totalResponses = activeAssessment?.assessment_responses[0]?.count ?? 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <h1 className="mb-1">Readiness Assessment</h1>
        <p className="text-sm text-muted-foreground">
          Discover your AI maturity level and see how your organisation compares to market leaders.
        </p>
      </motion.div>

      {/* ─── Section A: Personal Status ─── */}
      {personalResults ? (
        <motion.div variants={item} className="mb-8">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Assessment Complete</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Submitted {new Date(personalResults.submitted_at).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex items-center gap-6">
                    <div>
                      <p className="text-3xl font-bold tracking-tight">
                        {personalResults.overall.toFixed(1)}
                        <span className="text-sm font-normal text-muted-foreground"> / 5</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tier {personalResults.tier.tier}: {personalResults.tier.label}
                      </p>
                    </div>
                    <div className="hidden sm:grid grid-cols-5 gap-3">
                      {(Object.keys(personalResults.scores) as Dimension[]).map((dim) => (
                        <div key={dim} className="text-center">
                          <p className="text-lg font-bold">{personalResults.scores[dim].toFixed(1)}</p>
                          <p className="text-[9px] text-muted-foreground">{DIMENSION_LABELS[dim]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/dashboard/my-results">
                      <Button size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
                        <Sparkles className="h-3.5 w-3.5" />
                        View Full Results & Insights
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {activeAssessment && (
                      <Link href={`/dashboard/assessment/${activeAssessment.id}/take`}>
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <BrainCircuit className="h-3.5 w-3.5" />
                          Retake Assessment
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : activeAssessment ? (
        <motion.div variants={item} className="mb-8">
          <Card className="border-brand/20 bg-brand/5">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-5">
                <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 sm:mb-0">
                  <BrainCircuit className="h-7 w-7 text-brand" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Take your AI readiness assessment</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Answer questions across 5 key dimensions to discover your personal AI maturity score.
                    Compare yourself to industry leaders and get personalised recommendations.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:justify-start">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~5 minutes</span>
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 100% anonymous</span>
                    <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Instant results</span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/dashboard/assessment/${activeAssessment.id}/take`}>
                      <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
                        <BrainCircuit className="h-4 w-4" />
                        Start Assessment
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="mb-8">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
            <BrainCircuit className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-sm font-semibold">No assessment available yet</h3>
            <p className="text-sm text-muted-foreground">
              Your admin hasn&apos;t created an assessment yet. Check back soon.
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── Section B: Response Progress ─── */}
      {activeAssessment && totalResponses > 0 && (
        <motion.div variants={item} className="mb-8">
          <Card className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Team Progress</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={Math.min((totalResponses / 10) * 100, 100)} className="h-2" />
                </div>
                <span className="text-sm font-medium">{totalResponses}</span>
                <span className="text-xs text-muted-foreground">responses</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {totalResponses < 5
                  ? `${5 - totalResponses} more responses needed to unlock basic org-wide insights. Encourage your team to participate.`
                  : totalResponses < 10
                    ? `Great progress! ${10 - totalResponses} more responses will unlock full department-level breakdowns.`
                    : "Enough data for detailed org-wide insights. Your admin can view the full results."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── Section C: Org-Wide Insights Preview (Blurred) ─── */}
      <motion.div variants={item} className="mb-8">
        <div className="mb-4">
          <h2 className="text-sm font-semibold">What your organisation unlocks</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            As more colleagues complete the assessment, your admin gains access to these powerful insights.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Blurred Radar Chart */}
          <div className="relative overflow-hidden rounded-xl border border-border">
            <div className="pointer-events-none select-none blur-[4px]">
              <div className="bg-card p-5">
                <p className="mb-3 text-sm font-semibold">Dimension Breakdown</p>
                <div className="flex items-center justify-center py-4">
                  <svg viewBox="0 0 200 200" className="h-40 w-40">
                    {/* Pentagon grid */}
                    {[1, 0.75, 0.5, 0.25].map((scale) => (
                      <polygon
                        key={scale}
                        points={MOCK_RADAR_DIMS.map((_, i) => {
                          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                          return `${100 + 80 * scale * Math.cos(angle)},${100 + 80 * scale * Math.sin(angle)}`;
                        }).join(" ")}
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {/* Org area */}
                    <polygon
                      points={MOCK_RADAR_DIMS.map((d, i) => {
                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                        const r = (d.org / 100) * 80;
                        return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                      }).join(" ")}
                      fill="hsl(var(--brand) / 0.15)"
                      stroke="hsl(var(--brand))"
                      strokeWidth="1.5"
                    />
                    {/* Labels */}
                    {MOCK_RADAR_DIMS.map((d, i) => {
                      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                      return (
                        <text
                          key={d.dim}
                          x={100 + 95 * Math.cos(angle)}
                          y={100 + 95 * Math.sin(angle)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground"
                          fontSize="7"
                        >
                          {d.dim}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-semibold">Dimension Radar</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Unlocks with 5+ responses</p>
            </div>
          </div>

          {/* Blurred Department Heatmap */}
          <div className="relative overflow-hidden rounded-xl border border-border">
            <div className="pointer-events-none select-none blur-[4px]">
              <div className="bg-card p-5">
                <p className="mb-3 text-sm font-semibold">Department Heatmap</p>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-6 gap-1">
                    <div />
                    {["Conf", "Pract", "Tools", "Resp", "Cult"].map((h) => (
                      <div key={h} className="text-center text-[8px] text-muted-foreground">{h}</div>
                    ))}
                  </div>
                  {MOCK_HEATMAP_DEPTS.map((d) => (
                    <div key={d.dept} className="grid grid-cols-6 gap-1">
                      <div className="text-[9px] text-muted-foreground truncate pr-1">{d.dept}</div>
                      {d.scores.map((s, i) => {
                        const intensity = s / 5;
                        return (
                          <div
                            key={i}
                            className="h-6 rounded"
                            style={{ backgroundColor: `hsl(var(--brand) / ${0.1 + intensity * 0.5})` }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-semibold">Department Heatmap</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Unlocks with 10+ responses</p>
            </div>
          </div>

          {/* Blurred Maturity Gauge */}
          <div className="relative overflow-hidden rounded-xl border border-border">
            <div className="pointer-events-none select-none blur-[4px]">
              <div className="bg-card p-5">
                <p className="mb-3 text-sm font-semibold">Organisation Maturity</p>
                <div className="flex flex-col items-center py-4">
                  <svg viewBox="0 0 160 90" className="h-24 w-40">
                    <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 10 80 A 70 70 0 0 1 100 15" fill="none" stroke="var(--foreground)" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
                    <text x="80" y="75" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="700">3.2</text>
                    <text x="80" y="88" textAnchor="middle" className="fill-muted-foreground" fontSize="8">/ 5.0</text>
                  </svg>
                  <p className="mt-1 text-xs font-semibold">Tier 3: Workflow Embedded</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-semibold">Maturity Gauge</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Unlocks with 5+ responses</p>
            </div>
          </div>

          {/* Blurred Benchmark Grid */}
          <div className="relative overflow-hidden rounded-xl border border-border">
            <div className="pointer-events-none select-none blur-[4px]">
              <div className="bg-card p-5">
                <p className="mb-3 text-sm font-semibold">Industry Benchmarks</p>
                <div className="space-y-2">
                  {(Object.keys(INDUSTRY_BENCHMARKS) as Dimension[]).map((dim) => (
                    <div key={dim} className="flex items-center gap-3">
                      <span className="w-24 text-[10px] text-muted-foreground truncate">{DIMENSION_LABELS[dim]}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-foreground/30" style={{ width: `${(INDUSTRY_BENCHMARKS[dim] / 5) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-medium w-6 text-right">{INDUSTRY_BENCHMARKS[dim]}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">vs leaders</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-semibold">vs Industry Leaders</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Unlocks with 5+ responses</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Section D: Impact Stats (real value, not blurred) ─── */}
      <motion.div variants={item} className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Why AI maturity matters</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {AI_IMPACT_STATS.map((s) => (
            <Card key={s.label} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                  <s.icon className="h-4 w-4 text-brand" />
                </div>
                <p className="text-xl font-bold tracking-tight">{s.stat}</p>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">{s.source}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ─── Section E: Upsell Cards ─── */}
      <motion.div variants={item} className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* AI Chat */}
        <Card className="border-brand/20 bg-gradient-to-br from-brand/5 to-transparent">
          <CardContent className="pt-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
              <MessageSquare className="h-4 w-4 text-brand" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">Build your AI skills daily</h3>
            <p className="mb-1 text-xs leading-relaxed text-muted-foreground">
              Access ChatGPT, Claude, Gemini and more in one platform. Daily practice is the fastest way to improve your maturity score.
            </p>
            <p className="mb-3 text-[10px] text-muted-foreground/70">
              Companies with AI Chat access see 40% faster skill development.
            </p>
            <Link href="/dashboard/chat">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Sparkles className="h-3 w-3" />
                Explore AI Chat
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pro Features */}
        <Card className="border-border bg-card">
          <CardContent className="pt-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">Unlock the full platform</h3>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              With a Pro plan, your admin can unlock powerful tools for the whole team:
            </p>
            <div className="space-y-1.5 mb-3">
              {[
                { icon: Layers, label: "AI model recommendations per department" },
                { icon: Route, label: "90-day adoption roadmap with milestones" },
                { icon: BarChart3, label: "Usage analytics and ROI tracking" },
                { icon: FileText, label: "Company knowledge base for AI grounding" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <f.icon className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="bg-brand/10 text-brand text-[10px]">
              Pro Plan
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
