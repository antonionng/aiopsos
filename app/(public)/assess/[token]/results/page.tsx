"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  TrendingUp,
  Sparkles,
  Lock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DIMENSION_LABELS,
  DIMENSIONS,
  DEPARTMENT_LABELS,
  DEPARTMENT_TYPES,
  type Dimension,
} from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";
import { OrgAvatar } from "@/components/org-avatar";

interface ResultsData {
  scores: DimensionScores;
  overall: number;
  tier: { tier: number; label: string; color: string };
  session_token: string;
}

export default function AssessResultsPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    const stored = sessionStorage.getItem(`assess_results_${token}`);
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      router.push(`/assess/${token}`);
    }
  }, [token, router]);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/public/assess/${token}`)
      .then((r) => r.json())
      .then((d) => {
        setOrgName(d.link?.org?.name ?? null);
        setLogoUrl(d.link?.org?.logo_url ?? null);
        setCompletedCount(d.link?.completed_count ?? 0);
      })
      .catch(() => {
        setOrgName(null);
        setLogoUrl(null);
      });
  }, [token]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!results) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/public/assess/${token}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          department,
          session_token: results.session_token,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || `Signup failed (${res.status}). Please try again.`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      sessionStorage.removeItem(`assess_results_${token}`);
      router.push(data.redirect || "/dashboard/my-results");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  if (!results) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg"
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

      {/* Score summary */}
      <div className="text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <CheckCircle2 className="h-8 w-8 text-brand" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Assessment Complete</h1>
        <p className="mb-2 text-muted-foreground">
          Here&apos;s a preview of your AI maturity score.
        </p>
        <p className="mb-6 text-3xl font-bold">
          {results.overall.toFixed(1)}
          <span className="text-lg font-normal text-muted-foreground"> / 5</span>
        </p>

        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: `${results.tier.color}15`,
            color: results.tier.color,
          }}
        >
          Tier {results.tier.tier}: {results.tier.label}
        </div>
      </div>

      {/* Locked dimension preview */}
      {orgName && (
        <p className="mb-3 text-center text-xs text-muted-foreground">
          {orgName} is building an AI-ready team. See how you compare.
        </p>
      )}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DIMENSIONS.map((dim: Dimension) => (
          <div
            key={dim}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4 text-left"
          >
            <p className="text-xs text-muted-foreground blur-[3px] select-none">
              {DIMENSION_LABELS[dim]}
            </p>
            <p className="mt-1 text-lg font-bold blur-[3px] select-none">
              {results.scores[dim].toFixed(1)}
            </p>
            <div className="absolute inset-0 flex items-center justify-center bg-card/60">
              <Lock className="h-4 w-4 text-muted-foreground/60" />
            </div>
          </div>
        ))}
      </div>

      <p className="mb-8 text-center text-xs text-muted-foreground">
        Create an account to unlock your full breakdown
      </p>

      {/* Signup card -- always visible */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border-2 border-brand/20 bg-card p-6 shadow-lg"
      >
        {/* Signup header with branding */}
        <div className="mb-5 flex flex-col items-center gap-3">
          {orgName && (
            <OrgAvatar logoUrl={logoUrl} orgName={orgName} size="md" />
          )}
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {orgName ? `Join ${orgName}` : "Unlock Your Full Results"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              See dimension breakdowns, personalised recommendations, and your
              AI readiness roadmap.
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
            {completedCount} {completedCount === 1 ? "person" : "people"} at{" "}
            {orgName} have already taken this assessment
          </p>
        )}

        {/* Signup form */}
        <form onSubmit={handleSignup} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 bg-surface"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-surface"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-10 bg-surface"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs">Department</Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger id="department" className="h-10 bg-surface">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_TYPES.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {DEPARTMENT_LABELS[dept]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="h-11 w-full bg-brand text-brand-foreground hover:bg-brand/90"
            disabled={loading}
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                {orgName
                  ? `Join ${orgName} & View Results`
                  : "Sign Up & View Full Results"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-foreground underline underline-offset-4 hover:text-brand"
          >
            Sign in
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
