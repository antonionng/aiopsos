"use client";
import { LearnerDiscussion } from "@/components/lms/learner-discussion";
import { DeliveryJourney } from "@/components/lms/delivery-journey";
import { AssistantMessage } from "@/components/lms/assistant-message";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Download,
  GraduationCap,
  MapPin,
  Upload,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  COHORT_STATUS_LABELS,
  DELIVERY_MODE_LABELS,
  ENROLMENT_STATUS_LABELS,
  LITERACY_DISCLAIMER,
  type CohortStatus,
  type DeliveryMode,
  type EnrolmentStatus,
} from "@/lib/constants";

interface CohortDetail {
  id: string;
  title: string;
  delivery_mode: DeliveryMode;
  location: string | null;
  timezone: string;
  seat_limit: number;
  starts_on: string | null;
  ends_on: string | null;
  status: CohortStatus;
  price_amount: number | null;
  currency: string;
  paid_at: string | null;
  pass_attendance_pct: number;
  pass_grade_pct: number;
  courses: { slug: string; title: string; level: string } | null;
  facilitators: { id: string; display_name: string } | null;
}

interface SessionRow {
  id: string;
  position: number;
  title: string;
  starts_at: string;
  ends_at: string;
  join_url: string | null;
}

interface Participant {
  enrolment_id: string;
  name: string;
  email: string;
  department: string | null;
  status: EnrolmentStatus;
}

interface EnrolOutcome {
  email: string;
  status: string;
  detail?: string;
}

export default function CohortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{
    learning_programme?: {title: string; href: string} | null;
    cohort: CohortDetail;
    modules: {
      id: string;
      title: string;
      summary: string;
      duration_hours: number;
      outcomes: string[];
    }[];
    sessions: SessionRow[];
    participants: Participant[];
    can_grade: boolean;
    can_manage: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emails, setEmails] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [section, setSection] = useState("overview");
  useEffect(() => {
    const sync = () => setSection(["sessions", "participants", "training-wall"].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "overview");
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, []);

  const load = useCallback(async () => {
    const res = await fetch(`/api/cohorts/${id}`, { cache: "no-store" });
    const d = await res.json();
    if (d.error) setError(d.error);
    else setData(d);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    load()
      .catch(() => setError("Could not load this delivery. Please refresh."))
      .finally(() => setLoading(false));
  }, [id, load]);

  async function handleEnrol() {
    const list = emails
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));

    if (list.length === 0) {
      toast.error("Enter at least one email address");
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch(`/api/cohorts/${id}/enrol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: list }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Could not enrol");
        return;
      }
      reportOutcomes(result.enrolled, result.outcomes ?? []);
      setEmails("");
      await load();
    } finally {
      setEnrolling(false);
    }
  }

  async function handleCsv(file: File) {
    setEnrolling(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/cohorts/${id}/enrol`, {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Could not read that file");
        return;
      }
      reportOutcomes(result.enrolled, result.outcomes ?? []);
      await load();
    } finally {
      setEnrolling(false);
    }
  }

  /** Say plainly who was skipped and why, rather than a bare success count. */
  function reportOutcomes(enrolled: number, outcomes: EnrolOutcome[]) {
    const noAccount = outcomes.filter((o) => o.status === "no_account").length;
    const full = outcomes.filter((o) => o.status === "full").length;
    const already = outcomes.filter(
      (o) => o.status === "already_enrolled",
    ).length;

    toast.success(`${enrolled} enrolled`);
    if (already > 0) toast.message(`${already} were already on this cohort`);
    if (noAccount > 0) {
      toast.warning(
        `${noAccount} skipped - no account in your organisation for those addresses`,
      );
    }
    if (full > 0) toast.warning(`${full} skipped - the cohort is full`);
  }

  async function handlePay() {
    const res = await fetch(`/api/cohorts/${id}/checkout`, { method: "POST" });
    const result = await res.json();
    if (result.url) window.location.href = result.url;
    else toast.error(result.error ?? "Could not start checkout");
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading cohort...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {error || "Cohort not found"}
        </p>
      </div>
    );
  }

  const { cohort, sessions, participants, can_grade, can_manage } = data;
  const active = participants.filter((p) => p.status !== "withdrawn").length;

  return (
    <motion.div className="cohort-workspace" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/dashboard/cohorts"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All live training
      </Link>

      <div className="cohort-heading">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              {COHORT_STATUS_LABELS[cohort.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {DELIVERY_MODE_LABELS[cohort.delivery_mode]}
            </span>
            {cohort.price_amount !== null && (
              <span className="text-xs text-muted-foreground">
                {cohort.paid_at ? "Paid" : "Unpaid"}
              </span>
            )}
          </div>
          <h1 className="cohort-title">{cohort.title}</h1>
          {cohort.courses && (
            <Link
              href={`/courses/${cohort.courses.slug}`}
              target="_blank"
              className="text-sm text-muted-foreground hover:text-brand"
            >
              {cohort.courses.title}
            </Link>
          )}
        </div>

        <div className="cohort-actions">
          {can_grade && sessions.length > 0 && (
            <Link href={`/dashboard/cohorts/${id}/register`}>
              <Button variant="outline" size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Take register
              </Button>
            </Link>
          )}
          {can_grade && (
            <Link href={`/dashboard/cohorts/${id}/grades`}>
              <Button variant="outline" size="sm">
                <GraduationCap className="mr-2 h-4 w-4" />
                Work & certificates
              </Button>
            </Link>
          )}
          {can_manage && (
            <a href={`/api/cohorts/${id}/export`}>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export records
              </Button>
            </a>
          )}
          {can_manage && cohort.price_amount !== null && !cohort.paid_at && (
            <Button size="sm" onClick={handlePay}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay{" "}
              {(cohort.price_amount / 100).toLocaleString("en-GB", {
                style: "currency",
                currency: cohort.currency,
              })}
            </Button>
          )}
        </div>
      </div>

      <div className="cohort-details">
        {cohort.starts_on && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" />
            {new Date(cohort.starts_on).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {cohort.ends_on && cohort.ends_on !== cohort.starts_on && (
              <>
                {" – "}
                {new Date(cohort.ends_on).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </>
            )}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          {active} of {cohort.seat_limit} seats
        </span>
        {cohort.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {cohort.location}
          </span>
        )}
        <span>Times shown in {cohort.timezone}</span>
        {cohort.facilitators && (
          <span>Facilitated by {cohort.facilitators.display_name}</span>
        )}
        <span>
          Certificate: {cohort.pass_attendance_pct}% attendance and{" "}
          {cohort.pass_grade_pct}% grade
        </span>
      </div>

      <nav aria-label="Cohort workspace" className="cohort-navigation">
        {[["overview", "Overview"], ["sessions", `Sessions (${sessions.length})`], ["participants", `People (${active})`], ["training-wall", "Training wall"]].map(([key, label]) => <a key={key} href={`#${key}`} onClick={(event) => { event.preventDefault(); setSection(key); window.history.pushState(null, "", `#${key}`); }} aria-current={section === key ? "page" : undefined} className={`shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${section === key ? "bg-brand text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{label}</a>)}
      </nav>
      {data.learning_programme && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5"><div><p className="lms-eyebrow">Connected learning programme</p><p className="mt-1 font-semibold">{data.learning_programme.title}</p></div><Link className="lms-button secondary" href={data.learning_programme.href}>Course activities & materials →</Link></div>}
      <div id="overview" hidden={section !== "overview"}>
      <DeliveryJourney
        id={id}
        canGrade={can_grade}
        canManage={can_manage}
        participants={active}
        sessions={sessions.length}
      />
      <section className="mb-8 rounded-2xl border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          What this group is learning
        </p>
        <h2 className="my-2 text-xl font-semibold">
          {cohort.courses?.title || cohort.title}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          This live group follows the academy course below. Sessions are the
          scheduled meetings; attendance and assessed work determine certificate
          eligibility.
        </p>
        {(data.modules ?? []).length ? (
          <div className="space-y-3">
            {data.modules.map((m, index) => (
              <details className="rounded-xl border p-4" key={m.id}>
                <summary className="cursor-pointer font-medium">
                  {index + 1}. {m.title}{" "}
                  <span className="text-xs text-muted-foreground">
                    · {m.duration_hours} hours
                  </span>
                </summary>
                <div className="mt-3 text-sm">
                  <AssistantMessage text={m.summary} />
                  <ul className="mt-3 list-disc pl-5">
                    {m.outcomes.map((outcome, i) => (
                      <li key={i}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            The course outline has not been added yet. Confirm the learning
            objectives with the trainer before delivery.
          </p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          Trainer:{" "}
          {cohort.facilitators?.display_name ||
            "Not assigned yet. Confirm who will lead these sessions."}
        </p>
      </section>
      </div>
      <div className={section === "participants" && can_manage ? "grid gap-6 lg:grid-cols-[1fr_20rem]" : "space-y-6"}>
        <div className="space-y-6">
          {/* Sessions */}
          <section id="sessions" hidden={section !== "sessions"} className="scroll-mt-20">
            <h2 className="mb-2 text-lg font-semibold">
              Your session schedule
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Times are shown in {cohort.timezone}. Open the meeting link for
              online delivery, or check the venue for an in-person session.
            </p>
            {sessions.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No sessions scheduled yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <Card key={session.id} className="border-border bg-card">
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                      <div>
                        <p className="text-sm font-medium">
                          <span className="mr-2 text-muted-foreground">
                            {session.position}.
                          </span>
                          {session.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(session.starts_at).toLocaleString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: cohort.timezone,
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {can_grade && (
                          <Link
                            className="text-sm font-semibold text-brand"
                            href={`/dashboard/cohorts/${id}/register`}
                          >
                            Record attendance →
                          </Link>
                        )}
                        {!session.join_url && (
                          <span className="text-xs text-muted-foreground">
                            {cohort.delivery_mode === "in_person"
                              ? cohort.location || "Venue not added"
                              : "Joining link not added"}
                          </span>
                        )}
                        {session.join_url && (
                          <a
                            href={session.join_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-foreground hover:text-brand"
                          >
                            Join session →
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Participants */}
          <section hidden={section !== "participants"} id="participants" className="scroll-mt-20">
            <h2 className="mb-3 text-sm font-semibold">
              Participants ({participants.length})
            </h2>
            {participants.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Nobody enrolled yet.
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="pt-5">
                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div
                        key={p.enrolment_id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p.email}
                            {p.department ? ` · ${p.department}` : ""}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {ENROLMENT_STATUS_LABELS[p.status]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Enrolment */}
        {can_manage && section === "participants" && (
          <aside className="space-y-4">
            <Card className="border-border bg-card">
              <CardContent className="pt-5">
                <h2 className="mb-1 text-sm font-semibold">Enrol people</h2>
                <p className="mb-3 text-xs text-muted-foreground">
                  They need an existing account in your organisation. Nobody is
                  signed up automatically.
                </p>
                <Input
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="jane@company.com, sam@company.com"
                  className="mb-2 bg-surface"
                />
                <Button
                  onClick={handleEnrol}
                  disabled={enrolling}
                  className="mb-3 w-full"
                  size="sm"
                >
                  {enrolling ? "Enrolling..." : "Enrol"}
                </Button>

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-xs text-muted-foreground transition-colors hover:border-foreground/40">
                  <Upload className="h-3.5 w-3.5" />
                  Upload a CSV of email addresses
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCsv(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </CardContent>
            </Card>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {LITERACY_DISCLAIMER}
            </p>
          </aside>
        )}
      </div>
      <div hidden={section !== "training-wall"}><LearnerDiscussion cohortId={String(id)} /></div>
    </motion.div>
  );
}
