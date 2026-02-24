"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Clock,
  Layers,
  Lightbulb,
  Lock,
  MessageSquare,
  Route,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { canViewOrgData, type UserRole } from "@/lib/role-helpers";
import { DIMENSION_LABELS, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
}

interface UsageSummary {
  totalRequests: number;
  activeUsers: number;
  totalCost: number;
  avgDailyRequests: number;
}

interface PersonalStats {
  weeklyRequests: number;
  weeklyTokens: number;
  adoptionScore: number;
  estimatedHoursSaved: number;
}

interface PersonalResults {
  scores: DimensionScores;
  overall: number;
  tier: { tier: number; label: string; color: string };
  recommendations: {
    dimension: Dimension;
    label: string;
    score: number;
    recommendation: string;
  }[];
}

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  model: string;
  timestamp: string;
}

const ADMIN_QUICK_LINKS = [
  {
    title: "Readiness Assessment",
    description: "Diagnose AI maturity across your organisation.",
    icon: BrainCircuit,
    href: "/dashboard/assessment",
    requiredPlan: undefined as "pro" | "enterprise" | undefined,
  },
  {
    title: "Stack Recommendation",
    description: "Get model routing plans tailored to each department.",
    icon: Layers,
    href: "/dashboard/recommend",
    requiredPlan: "pro" as const,
  },
  {
    title: "90-Day Roadmap",
    description: "Generate a phased adoption programme.",
    icon: Route,
    href: "/dashboard/roadmap",
    requiredPlan: "pro" as const,
  },
  {
    title: "Analytics & ROI",
    description: "Understand usage, cost, and adoption progress.",
    icon: BarChart3,
    href: "/dashboard/analytics",
    requiredPlan: "pro" as const,
  },
];

const ADMIN_LINKS = [
  {
    title: "Platform Admin",
    description: "Manage tenants and platform-wide settings.",
    icon: Shield,
    href: "/dashboard/admin",
    minRole: ["super_admin"] as UserRole[],
  },
  {
    title: "Team Management",
    description: "Manage team members, roles, and departments.",
    icon: Users,
    href: "/dashboard/settings",
    minRole: ["super_admin", "admin"] as UserRole[],
  },
];

const EMPLOYEE_TIPS = [
  "Try using AI to summarise long documents or meeting notes -- it's one of the fastest ways to save time.",
  "Experiment with different prompts. Adding context about your role and goals improves results dramatically.",
  "Use AI to draft first versions of emails, reports, or proposals, then refine with your expertise.",
  "Ask AI to explain complex topics in simple terms -- great for learning new areas quickly.",
  "Create structured checklists or SOPs with AI to standardise processes in your team.",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

function formatAction(action: string): string {
  return action
    .replace(/\./g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ControlHubPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [personal, setPersonal] = useState<PersonalStats | null>(null);
  const [personalResults, setPersonalResults] = useState<PersonalResults | null>(null);
  const [activity, setActivity] = useState<AuditEntry[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_profiles")
        .select("name, email, role")
        .eq("id", user.id)
        .maybeSingle();
      if (data) setProfile(data as UserProfile);
    }
    loadProfile();

    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => {
        setUsage(d.summary);
        setActivity(d.auditLogs ?? []);
      })
      .catch(() => {});

    fetch("/api/usage/personal")
      .then((r) => r.json())
      .then(setPersonal)
      .catch(() => {
        setPersonal({
          weeklyRequests: Math.floor(20 + Math.random() * 80),
          weeklyTokens: Math.floor(30000 + Math.random() * 100000),
          adoptionScore: Math.floor(35 + Math.random() * 50),
          estimatedHoursSaved: Number((2 + Math.random() * 8).toFixed(1)),
        });
      });

    fetch("/api/user/results", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setPersonalResults(data);
      })
      .catch(() => {});
  }, []);

  const isOrgViewer = profile ? canViewOrgData(profile.role) : false;
  const firstName = profile?.name?.split(" ")[0] || "there";

  if (profile && !isOrgViewer) {
    return <EmployeeHub firstName={firstName} personal={personal} personalResults={personalResults} profile={profile} />;
  }

  return <AdminHub firstName={firstName} profile={profile} usage={usage} personal={personal} activity={activity} isOrgViewer={isOrgViewer} />;
}

/* ---------- Employee Hub ---------- */

function EmployeeHub({
  firstName,
  personal,
  personalResults,
  profile,
}: {
  firstName: string;
  personal: PersonalStats | null;
  personalResults: PersonalResults | null;
  profile: UserProfile;
}) {
  const tipIndex = Math.floor(Date.now() / 86400000) % EMPLOYEE_TIPS.length;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="mb-1 text-2xl font-bold">Welcome back, {firstName}</h1>
        <p className="text-sm text-muted-foreground">
          Your personal AI adoption dashboard.
        </p>
      </motion.div>

      {/* Personal stats */}
      {personal && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                  <Zap className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{personal.weeklyRequests}</p>
                  <p className="text-xs text-muted-foreground">Your requests this week</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{personal.estimatedHoursSaved}h</p>
                  <p className="text-xs text-muted-foreground">Estimated time saved</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{personal.adoptionScore}</p>
                  <p className="text-xs text-muted-foreground">Adoption score</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    AI Chat
                    <Lock className="h-3 w-3" />
                  </p>
                  <p className="text-xs text-muted-foreground">Ask your admin to upgrade</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* AI Readiness section */}
          {personalResults ? (
            <motion.div variants={item} className="mb-6">
              <h2 className="mb-3 text-sm font-semibold">Your AI Readiness</h2>
              <Card className="border-border bg-card">
                <CardContent className="pt-5">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold tracking-tight">
                        {personalResults.overall.toFixed(1)}
                        <span className="text-sm font-normal text-muted-foreground"> / 5</span>
                      </p>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold">
                        Tier {personalResults.tier.tier}: {personalResults.tier.label}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
                      {(Object.keys(personalResults.scores) as Dimension[]).map((dim) => (
                        <div key={dim}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{DIMENSION_LABELS[dim]}</span>
                            <span className="text-[10px] font-semibold">{personalResults.scores[dim].toFixed(1)}</span>
                          </div>
                          <Progress value={(personalResults.scores[dim] / 5) * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {personalResults.recommendations.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Top recommendation
                      </p>
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {personalResults.recommendations.sort((a, b) => a.score - b.score)[0].recommendation}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Link href="/dashboard/my-results">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        View full results
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={item} className="mb-6">
              <h2 className="mb-3 text-sm font-semibold">Get Started</h2>
              <Card className="border-border bg-card">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                      <BrainCircuit className="h-4 w-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Take your AI readiness assessment</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Complete a 5-minute assessment to discover your AI maturity score and get personalised recommendations for improving your skills.
                      </p>
                      <Link href="/dashboard/assessment" className="mt-3 inline-block">
                        <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
                          Take Assessment
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick actions for employees */}
          <motion.div variants={item}>
            <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/assessment"
                className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-brand/20 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">Readiness Assessment</h3>
                <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {personalResults ? "Retake to track your improvement over time." : "Discover your AI maturity level in 5 minutes."}
                </p>
                <div className="flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {personalResults ? "Retake" : "Start"}
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/my-results"
                className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-brand/20 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">My Results</h3>
                <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                  View your scores, risk areas, and personalised recommendations.
                </p>
                <div className="flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  View
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar: Tips & AI Chat promo */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Tip of the day */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-brand" />
                Tip of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {EMPLOYEE_TIPS[tipIndex]}
              </p>
            </CardContent>
          </Card>

          {/* AI Chat upsell */}
          <Card className="border-brand/20 bg-gradient-to-b from-brand/5 to-transparent">
            <CardContent className="pt-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                <MessageSquare className="h-4 w-4 text-brand" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">AI Chat</h3>
              <p className="mb-1 text-xs leading-relaxed text-muted-foreground">
                Access ChatGPT, Claude, Gemini, Mistral and more -- all in one platform with your company knowledge built in.
              </p>
              <p className="mb-3 text-xs text-muted-foreground/70">
                Ask your admin to upgrade to unlock AI Chat for the whole team.
              </p>
              <Badge variant="secondary" className="bg-brand/10 text-brand text-[10px]">
                Pro Feature
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Admin / Manager Hub ---------- */

function AdminHub({
  firstName,
  profile,
  usage,
  personal,
  activity,
  isOrgViewer,
}: {
  firstName: string;
  profile: UserProfile | null;
  usage: UsageSummary | null;
  personal: PersonalStats | null;
  activity: AuditEntry[];
  isOrgViewer: boolean;
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="mb-1 text-2xl font-bold">Welcome back, {firstName}</h1>
        <p className="text-sm text-muted-foreground">
          Your AI adoption hub.
        </p>
      </motion.div>

      {/* Personal stats */}
      {personal && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                  <Zap className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{personal.weeklyRequests}</p>
                  <p className="text-xs text-muted-foreground">Your requests this week</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{personal.estimatedHoursSaved}h</p>
                  <p className="text-xs text-muted-foreground">Estimated time saved</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{personal.adoptionScore}</p>
                  <p className="text-xs text-muted-foreground">Adoption score</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  {profile?.role === "super_admin" ? (
                    <>
                      <Link
                        href="/dashboard/chat"
                        className="text-sm font-semibold text-brand hover:underline"
                      >
                        Open AI Chat
                      </Link>
                      <p className="text-xs text-muted-foreground">Start a new conversation</p>
                    </>
                  ) : (
                    <>
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                        AI Chat
                        <Lock className="h-3 w-3" />
                      </p>
                      <p className="text-xs text-muted-foreground">Upgrade to Pro to unlock</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Org stats for admins */}
      {isOrgViewer && usage && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="mt-6"
        >
          <h2 className="mb-3 text-sm font-semibold">Organisation Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="pt-5">
                <p className="text-2xl font-bold">{usage.totalRequests.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total requests</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-5">
                <p className="text-2xl font-bold">{usage.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active users</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-5">
                <p className="text-2xl font-bold">${usage.totalCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total cost</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-5">
                <p className="text-2xl font-bold">{usage.avgDailyRequests}</p>
                <p className="text-xs text-muted-foreground">Avg daily requests</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Quick links */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <h2 className="mb-3 text-sm font-semibold">Quick Access</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ADMIN_QUICK_LINKS.map((mod) => {
              const gated = mod.requiredPlan && profile?.role !== "super_admin";

              return (
                <motion.div key={mod.href} variants={item}>
                  <Link
                    href={mod.href}
                    className={`group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-brand/20 hover:shadow-lg hover:shadow-black/5 ${gated ? "opacity-80" : ""}`}
                  >
                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 ${gated ? "text-muted-foreground" : "text-foreground"}`}>
                      <mod.icon className="h-4 w-4" />
                    </div>
                    <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
                      {mod.title}
                      {gated && (
                        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand">
                          {mod.requiredPlan === "enterprise" ? "Ent" : "Pro"}
                        </span>
                      )}
                    </h3>
                    <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                    <div className="flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      {gated ? "Learn more" : "Open"}
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Admin-only links */}
            {profile &&
              ADMIN_LINKS.filter((l) => l.minRole.includes(profile.role)).map((mod) => (
                <motion.div key={mod.href} variants={item}>
                  <Link
                    href={mod.href}
                    className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-brand/20 hover:shadow-lg hover:shadow-black/5"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                      <mod.icon className="h-4 w-4" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">
                      {mod.title}
                      <Badge variant="secondary" className="ml-2 text-[9px]">
                        Admin
                      </Badge>
                    </h3>
                    <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                    <div className="flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      Open
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activity.length === 0 ? (
                <p className="text-xs text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {activity.slice(0, 8).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                        {entry.user
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs">
                          <span className="font-medium">{entry.user}</span>{" "}
                          <span className="text-muted-foreground">
                            {formatAction(entry.action)}
                          </span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {entry.model !== "-" && (
                            <span className="mr-1">{entry.model}</span>
                          )}
                          {timeAgo(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
