"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  Eye,
  Building2,
  User,
  Mail,
  KeyRound,
  Briefcase,
  BarChart3,
  Users,
  TrendingUp,
  Brain,
  Zap,
  Wrench,
  ShieldCheck,
  Lightbulb,
  Map,
  FileText,
  Share2,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import {
  calculateDimensionScores,
  calculateOverallScore,
  type AssessmentQuestion,
} from "@/lib/scoring";
import {
  DIMENSION_LABELS,
  DIMENSIONS,
  DEPARTMENT_TYPES,
  DEPARTMENT_LABELS,
  getTierForScore,
  type Dimension,
} from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";
import { OrgAvatar } from "@/components/org-avatar";
import { getTemplate } from "@/lib/assessment-templates";

type Phase = "assess" | "signup" | "results";

export default function PublicTakeAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("assess");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentMeta, setAssessmentMeta] = useState<{ role: string; toolsUsed: string[] } | null>(null);
  const [scores, setScores] = useState<DimensionScores | null>(null);
  const [overall, setOverall] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orgName, setOrgName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [templateQuestions, setTemplateQuestions] = useState<AssessmentQuestion[] | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessment/${id}/public-info`)
      .then((r) => r.json())
      .then((d) => {
        setOrgName(d.org_name ?? null);
        setLogoUrl(d.logo_url ?? null);
        setCompletedCount(d.completed_count ?? 0);
        if (d.template_id) {
          const tmpl = getTemplate(d.template_id);
          setTemplateQuestions(tmpl.questions);
        }
      })
      .catch(() => {
        setOrgName(null);
        setLogoUrl(null);
      });
  }, [id]);

  function handleAssessmentComplete(ans: Record<string, number>, meta: { role: string; toolsUsed: string[] }) {
    const dimScores = calculateDimensionScores(ans, templateQuestions);
    const overallScore = calculateOverallScore(dimScores);
    setAnswers(ans);
    setAssessmentMeta(meta);
    setScores(dimScores);
    setOverall(overallScore);
    setPhase("signup");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/assessment/public-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          department: department || undefined,
          answers,
          assessment_id: id,
          respondent_role: assessmentMeta?.role,
          tools_used: assessmentMeta?.toolsUsed,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const errData = JSON.parse(text);
          setError(errData.error || "Something went wrong. Please try again.");
        } catch {
          setError("Something went wrong. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setSubmitting(false);
        return;
      }

      setPhase("results");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!scores) {
    return (
      <AnimatePresence mode="wait">
        {phase === "assess" && (
          <motion.div
            key="assess"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10 text-center">
              <h1 className="mb-2 text-2xl font-bold tracking-[-0.02em]">
                AI Readiness Assessment
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover where your organisation stands on the AI maturity
                curve.
              </p>
            </div>
            <AssessmentWizard
              onComplete={handleAssessmentComplete}
              questions={templateQuestions}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const tier = getTierForScore(overall);

  return (
    <AnimatePresence mode="wait">
      {phase === "signup" && (
        <SignupPhase
          key="signup"
          scores={scores}
          overall={overall}
          tier={tier}
          name={name}
          email={email}
          password={password}
          department={department}
          submitting={submitting}
          error={error}
          orgName={orgName}
          logoUrl={logoUrl}
          completedCount={completedCount}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onDepartmentChange={setDepartment}
          onSubmit={handleSignup}
        />
      )}

      {phase === "results" && (
        <ResultsPhase
          key="results"
          scores={scores}
          overall={overall}
          tier={tier}
          name={name}
          onDashboard={() => router.push("/dashboard")}
        />
      )}
    </AnimatePresence>
  );
}

function useCountUp(target: number, duration = 1.4, delay = 0.5) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const elapsed = (now - start) / 1000;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(eased * target);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  animated = true,
  tierColor,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  tierColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 5) * circumference;
  const displayValue = useCountUp(score, 1.4, animated ? 0.5 : 0);
  const gradientId = `score-gradient-${size}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className="absolute rounded-full"
        style={{
          width: size + 32,
          height: size + 32,
          background: `radial-gradient(circle, ${tierColor ?? "hsl(var(--brand))"}20 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tierColor ?? "hsl(var(--brand))"} stopOpacity="1" />
            <stop offset="100%" stopColor={tierColor ?? "hsl(var(--brand))"} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
          opacity={0.3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <motion.div
        className="absolute text-center"
        initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <span className="text-4xl font-bold tracking-tight">
          {displayValue.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">/5</span>
      </motion.div>
    </div>
  );
}

interface SignupPhaseProps {
  scores: DimensionScores;
  overall: number;
  tier: ReturnType<typeof getTierForScore>;
  name: string;
  email: string;
  password: string;
  department: string;
  submitting: boolean;
  error: string;
  orgName?: string | null;
  logoUrl?: string | null;
  completedCount?: number;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function SignupPhase({
  scores,
  overall,
  tier,
  name,
  email,
  password,
  department,
  submitting,
  error,
  orgName,
  logoUrl,
  completedCount = 0,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onDepartmentChange,
  onSubmit,
}: SignupPhaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl"
    >
      {/* Tenant branding header */}
      {orgName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col items-center gap-3"
        >
          <OrgAvatar logoUrl={logoUrl} orgName={orgName} size="lg" />
          <div className="text-center">
            <p className="text-base font-semibold">{orgName}</p>
            <p className="text-xs text-muted-foreground">
              invited you to take this assessment
            </p>
          </div>
        </motion.div>
      )}

      <div className="mb-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/10"
        >
          <CheckCircle2 className="h-8 w-8 text-brand" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-2xl font-bold tracking-[-0.02em]"
        >
          Assessment Complete
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          Here&apos;s a preview of your AI maturity score.
        </motion.p>
      </div>

      {/* Score teaser */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 flex flex-col items-center"
      >
        <ScoreRing score={overall} tierColor={tier.color} />

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: `${tier.color}15`,
            color: tier.color,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Tier {tier.tier}: {tier.label}
        </motion.div>
      </motion.div>

      {/* Blurred dimension cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative mb-8"
      >
        {orgName && (
          <p className="mb-3 text-center text-xs text-muted-foreground">
            {orgName} is building an AI-ready team. See how you compare.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DIMENSIONS.map((dim, i) => (
            <motion.div
              key={dim}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">
                {DIMENSION_LABELS[dim]}
              </p>
              <p className="mt-1 text-lg font-bold blur-md select-none">
                {scores[dim].toFixed(1)}
              </p>
              <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[2px]">
                <Lock className="h-4 w-4 text-muted-foreground/60" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Eye className="h-3.5 w-3.5" />
          Create an account to unlock your full breakdown
        </motion.div>
      </motion.div>

      {/* Signup form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="rounded-2xl border-2 border-brand/20 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
          {/* Signup header with branding */}
          <div className="mb-5 flex flex-col items-center gap-3">
            {orgName && (
              <OrgAvatar logoUrl={logoUrl} orgName={orgName} size="md" />
            )}
            <div className="text-center">
              <h2 className="text-lg font-semibold tracking-[-0.01em]">
                {orgName ? `Join ${orgName}` : "Unlock Your Full Results"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                See dimension breakdowns, personalised recommendations, and
                your AI readiness roadmap.
              </p>
            </div>
          </div>

          {/* Value proposition */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            {[
              { icon: BarChart3, text: "Detailed breakdown across all 5 dimensions" },
              { icon: Sparkles, text: "Personalised recommendations for your role" },
              {
                icon: Users,
                text: orgName
                  ? `Compare with colleagues at ${orgName}`
                  : "See how you compare to your team",
              },
              { icon: TrendingUp, text: "Track your progress over time" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="h-3 w-3 text-brand" />
                </div>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          {completedCount > 1 && orgName && (
            <p className="mb-5 text-center text-xs font-medium text-brand">
              {completedCount} people at {orgName} have already taken this
              assessment
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="bg-background pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="bg-background pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs">
                  Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    required
                    className="bg-background pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-xs">
                  Department{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => onDepartmentChange(e.target.value)}
                    className="h-9 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select...</option>
                    {DEPARTMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {DEPARTMENT_LABELS[dt]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              size="lg"
            >
              {submitting ? (
                "Creating your account..."
              ) : (
                <>
                  {orgName ? (
                    <>
                      Join {orgName} &amp; View Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Unlock Your Full Results
                    </>
                  )}
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-foreground underline underline-offset-4 hover:text-brand"
              >
                Sign in
              </a>
              {" · "}
              By signing up you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

const DIMENSION_ICONS: Record<string, typeof Brain> = {
  confidence: Brain,
  practice: Zap,
  tools: Wrench,
  responsible: ShieldCheck,
  culture: Users,
};

function ResultsPhase({
  scores,
  overall,
  tier,
  name,
  onDashboard,
}: {
  scores: DimensionScores;
  overall: number;
  tier: ReturnType<typeof getTierForScore>;
  name: string;
  onDashboard: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex justify-center"
      >
        <Image
          src="/logo.png"
          alt="AIOPSOS"
          width={120}
          height={48}
          unoptimized
          className="opacity-80"
        />
      </motion.div>

      {/* Celebratory header */}
      <div className="mb-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${tier.color}30, ${tier.color}10)`,
            boxShadow: `0 0 40px ${tier.color}20`,
          }}
        >
          <Trophy className="h-10 w-10" style={{ color: tier.color }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-3xl font-bold tracking-[-0.03em]"
        >
          Congratulations, {name.split(" ")[0]}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base text-muted-foreground"
        >
          Your AI Readiness Score is ready
        </motion.p>
      </div>

      {/* Score ring with glow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10 flex flex-col items-center"
      >
        <ScoreRing score={overall} size={180} strokeWidth={12} tierColor={tier.color} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: `${tier.color}18`,
            color: tier.color,
            border: `1px solid ${tier.color}30`,
          }}
        >
          <Sparkles className="h-4 w-4" />
          Tier {tier.tier}: {tier.label}
        </motion.div>
      </motion.div>

      {/* Dimension cards with icons and colour accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-10"
      >
        <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Breakdown by Dimension
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DIMENSIONS.map((dim, i) => {
            const DimIcon = DIMENSION_ICONS[dim] ?? Building2;
            const dimTier = getTierForScore(scores[dim]);
            return (
              <motion.div
                key={dim}
                initial={{ opacity: 0, y: 16, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.6 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                }}
                className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-colors"
                style={{ borderColor: `${dimTier.color}30` }}
              >
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    background: `linear-gradient(135deg, ${dimTier.color}, transparent)`,
                  }}
                />
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${dimTier.color}18` }}
                    >
                      <DimIcon className="h-3.5 w-3.5" style={{ color: dimTier.color }} />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {DIMENSION_LABELS[dim]}
                    </p>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-2xl font-bold" style={{ color: dimTier.color }}>
                      {scores[dim].toFixed(1)}
                    </span>
                    <span className="mb-0.5 text-xs text-muted-foreground">/5</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted/50">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: dimTier.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(scores[dim] / 5) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-10 overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.06] to-transparent p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {getInsights(scores).map((insight, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {insight}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="mb-10"
      >
        <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          What&apos;s Next
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Map,
              title: "Personalised Roadmap",
              desc: "A tailored 90-day AI adoption plan",
            },
            {
              icon: FileText,
              title: "AI Policy Generator",
              desc: "Generate compliant AI usage policies",
            },
            {
              icon: Share2,
              title: "Team Benchmarking",
              desc: "See how your team compares",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 + i * 0.1 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-4 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                <Icon className="h-5 w-5 text-brand" />
              </div>
              <p className="text-xs font-semibold">{title}</p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3 }}
        className="text-center"
      >
        <Button
          onClick={onDashboard}
          size="lg"
          className="h-12 px-8 bg-brand text-brand-foreground hover:bg-brand/90 text-base font-semibold shadow-lg"
          style={{ boxShadow: `0 4px 24px ${tier.color}25` }}
        >
          Explore Your Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Access personalised recommendations, roadmaps, and AI routing.
        </p>
      </motion.div>
    </motion.div>
  );
}

function getInsights(scores: DimensionScores): string[] {
  const insights: string[] = [];
  const sorted = DIMENSIONS.slice().sort(
    (a, b) => scores[b] - scores[a]
  ) as Dimension[];

  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  insights.push(
    `Your strongest area is ${DIMENSION_LABELS[strongest]} (${scores[strongest].toFixed(1)}/5).`
  );

  if (scores[weakest] < 2) {
    insights.push(
      `${DIMENSION_LABELS[weakest]} needs attention at ${scores[weakest].toFixed(1)}/5 - this is your biggest growth opportunity.`
    );
  } else {
    insights.push(
      `${DIMENSION_LABELS[weakest]} scored ${scores[weakest].toFixed(1)}/5 - room to improve here.`
    );
  }

  const avg =
    Object.values(scores).reduce((a, b) => a + b, 0) /
    Object.values(scores).length;
  if (avg >= 3.5) {
    insights.push(
      "Your organisation is well positioned to adopt advanced AI workflows and agent orchestration."
    );
  } else if (avg >= 2) {
    insights.push(
      "You have a solid foundation - targeted training and process integration will accelerate your AI journey."
    );
  } else {
    insights.push(
      "Starting your AI journey is the first step - explore your dashboard for a tailored adoption roadmap."
    );
  }

  return insights;
}
