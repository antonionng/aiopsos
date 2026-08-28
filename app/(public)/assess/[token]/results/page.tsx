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
import type { CourseRecommendation, DimensionScores } from "@/lib/types";
import { OrgAvatar } from "@/components/org-avatar";
import { RecommendedCourses } from "@/components/recommended-courses";

interface ResultsData {
  scores: DimensionScores | Record<string, number>;
  overall: number;
  tier: { tier: number; label: string; color: string } | null;
  template_id?: string;
  session_token: string;
  respondent_role?: string | null;
}

interface NeedsSubject {
  category: "ai" | "technology" | "robotics";
  label: string;
  score: number;
  band: { id: string; label: string; description: string };
  courses: {
    slug: string;
    title: string;
    summary: string;
    level: string;
    duration_hours: number;
  }[];
}

const SUBJECT_ACCENT: Record<NeedsSubject["category"], { text: string; bar: string; soft: string }> = {
  ai: { text: "text-cat-ai", bar: "bg-cat-ai", soft: "bg-cat-ai-soft" },
  technology: { text: "text-cat-technology", bar: "bg-cat-technology", soft: "bg-cat-technology-soft" },
  robotics: { text: "text-cat-robotics", bar: "bg-cat-robotics", soft: "bg-cat-robotics-soft" },
};

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
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [needsSubjects, setNeedsSubjects] = useState<NeedsSubject[]>([]);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`assess_results_${token}`);
    if (stored) {
      setResults(JSON.parse(stored));
      return;
    }
    // sessionStorage does not survive a refresh in some browsers, a new tab,
    // or iOS tab eviction. The submit route set an httpOnly cookie for this
    // moment - recover from it before forcing anyone into a retake.
    let cancelled = false;
    fetch(`/api/public/assess/${token}/session`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        if (d && d.scores) {
          const recovered = {
            scores: d.scores,
            overall: d.overall,
            tier: d.tier,
            template_id: d.template_id,
            session_token: d.session_token,
            respondent_role: d.respondent_role,
          };
          sessionStorage.setItem(
            `assess_results_${token}`,
            JSON.stringify(recovered)
          );
          setResults(recovered);
        } else {
          router.push(`/assess/${token}`);
        }
      })
      .catch(() => router.push(`/assess/${token}`));
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  // Already signed in (e.g. came back after the email-exists path, or was
  // signed in all along): attach the results to their account directly -
  // the signup form below would only fail with 409 anyway.
  useEffect(() => {
    if (!results?.session_token) return;
    let cancelled = false;

    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient()
        .auth.getUser()
        .then(({ data }) => {
          if (cancelled || !data.user) return;
          fetch(`/api/public/assess/${token}/claim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: results.session_token }),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
              if (cancelled || !d?.success) return;
              sessionStorage.removeItem(`assess_results_${token}`);
              router.push(d.redirect || "/dashboard/my-results");
            })
            .catch(() => {
              // Claiming is a convenience here; the signup form remains.
            });
        });
    });

    return () => {
      cancelled = true;
    };
  }, [results, token, router]);

  // The scores are already in the browser, so asking the server which
  // courses they map to discloses nothing new. The catalogue itself is public.
  useEffect(() => {
    if (!results) return;
    let cancelled = false;

    const isNeeds = results.template_id === "training-needs";
    const endpoint = isNeeds
      ? "/api/public/courses/recommend-needs"
      : "/api/public/courses/recommend";
    const payload = isNeeds
      ? { needs: results.scores, respondent_role: results.respondent_role ?? null }
      : { scores: results.scores, respondent_role: results.respondent_role ?? null };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        if (isNeeds && d?.subjects) setNeedsSubjects(d.subjects);
        if (!isNeeds && d?.recommendations) setCourses(d.recommendations);
      })
      .catch(() => {
        // A failed recommendation lookup must never block the signup path.
      });

    return () => {
      cancelled = true;
    };
  }, [results]);

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
        // The account exists (409) or was created but claiming failed (500
        // with code). Either way the fix is the same: sign in, come back
        // here, and the page claims the results automatically.
        if (data?.code === "email_exists" || data?.code === "claim_failed") {
          setEmailExists(true);
          setError(data.error);
          setLoading(false);
          return;
        }
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
      // Email confirmation is on: the account and the claimed assessment
      // exist, but there is no session until the emailed link is clicked.
      // Keep the results in sessionStorage - nothing is lost - and say so.
      if (data.needs_confirmation) {
        setAwaitingConfirmation(true);
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

  const isNeeds = results.template_id === "training-needs";

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
        <h1 className="mb-2 text-2xl font-bold">
          {isNeeds ? "Your training priorities" : "Assessment Complete"}
        </h1>
        {isNeeds ? (
          <p className="mb-8 text-muted-foreground">
            Ranked by measured need - highest first. Each subject shows
            the courses that close its gap.
          </p>
        ) : (
          <>
            <p className="mb-2 text-muted-foreground">
              Here&apos;s a preview of your AI maturity score.
            </p>
            <p className="mb-6 text-3xl font-bold">
              {results.overall.toFixed(1)}
              <span className="text-lg font-normal text-muted-foreground"> / 5</span>
            </p>
            {results.tier && (
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: `${results.tier.color}15`,
                  color: results.tier.color,
                }}
              >
                Tier {results.tier.tier}: {results.tier.label}
              </div>
            )}
          </>
        )}
      </div>

      {/* Training priorities: the selling surface for the needs instrument */}
      {isNeeds && (
        <div className="mb-8 space-y-4">
          {needsSubjects.map((subject, i) => {
            const accent = SUBJECT_ACCENT[subject.category];
            return (
              <motion.div
                key={subject.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className={`px-5 pt-4 pb-3 ${accent.soft}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className={`text-sm font-semibold ${accent.text}`}>
                      {subject.label}
                    </p>
                    <span className={`rounded-full border border-border/60 bg-card px-2.5 py-0.5 text-xs font-semibold ${accent.text}`}>
                      {subject.band.label}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                      className={`h-full rounded-full ${accent.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(subject.score / 5) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                    {subject.band.description}
                  </p>
                  {subject.courses.length > 0 && subject.band.id !== "low" && (
                    <div className="space-y-2">
                      {subject.courses.map((course) => (
                        <a
                          key={course.slug}
                          href={`/courses/${course.slug}`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:border-foreground/30"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {course.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {course.duration_hours} facilitated hrs
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Locked dimension preview */}
      {!isNeeds && orgName && (
        <p className="mb-3 text-center text-xs text-muted-foreground">
          {orgName} is building an AI-ready team. See how you compare.
        </p>
      )}
      {!isNeeds && (
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
              {(results.scores[dim] ?? 0).toFixed(1)}
            </p>
            <div className="absolute inset-0 flex items-center justify-center bg-card/60">
              <Lock className="h-4 w-4 text-muted-foreground/60" />
            </div>
          </div>
        ))}
      </div>
      )}

      <p className="mb-8 text-center text-xs text-muted-foreground">
        {isNeeds
          ? "Create an account to keep these results and track progress over time"
          : "Create an account to unlock your full breakdown"}
      </p>

      {/* Course recommendations stay unlocked: the gap the assessment finds
          is only useful to the respondent if they can see what closes it. */}
      {!isNeeds && (
      <RecommendedCourses
        recommendations={courses}
        heading="Courses matched to your results"
        description="Based on your weakest dimensions and your role. Delivered live by a facilitator, in person or online."
        className="mb-8"
      />
      )}

      {awaitingConfirmation && (
        <div className="mb-8 rounded-2xl border-2 border-brand/20 bg-card p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">Check your email</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your account and your results are saved. We&apos;ve sent a
            confirmation link to{" "}
            <span className="font-medium text-foreground">{email}</span>  - 
            click it and you&apos;ll land on your full results, including your
            recommended courses.
          </p>
        </div>
      )}

      {/* Signup card -- always visible */}
      {!awaitingConfirmation && (
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
          {emailExists && (
            <a
              href={`/login?next=${encodeURIComponent(`/assess/${token}/results`)}`}
              className="block rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-brand/10"
            >
              Sign in - your results will be attached automatically
            </a>
          )}

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
      )}
    </motion.div>
  );
}
