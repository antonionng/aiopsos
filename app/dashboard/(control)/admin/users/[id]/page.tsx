"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CalendarCheck2,
  Download,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { RadarChart } from "@/components/charts/radar-chart";
import type { DimensionScores } from "@/lib/types";

/**
 * One person's training record: identity header, headline stats, latest
 * assessment results, and the trainer-entered history as a timeline. This
 * is where "how facilitator assessments land on the individual" is visible.
 * Access is staff-only and audit-logged server-side; per-person AI usage is
 * structurally absent.
 */

interface MemberRecord {
  member: {
    id: string;
    name: string;
    email: string;
    job_title: string | null;
    role: string;
    department: string | null;
    joined_at: string;
  };
  stats: {
    enrolments: number;
    completed: number;
    attendance_pct: number | null;
    certificates: number;
  };
  maturity: { scores: DimensionScores; submitted_at: string } | null;
  training_needs: { needs: Record<string, number>; submitted_at: string } | null;
  timeline: {
    enrolment_id: string;
    status: string;
    cohort: {
      title: string;
      status: string;
      starts_on: string | null;
      ends_on: string | null;
      facilitator: string | null;
      course: { title: string; slug: string; category: string; level: string } | null;
    } | null;
    sessions: { position: number; title: string; starts_at: string; attendance: string | null }[];
    grades: { score: number; max_score: number; feedback: string; graded_at: string; graded_by: string | null }[];
    certificate: { public_ref: string; issued_at: string; revoked: boolean } | null;
  }[];
}

const NEED_ACCENTS: Record<string, { text: string; bar: string }> = {
  ai: { text: "text-cat-ai", bar: "bg-cat-ai" },
  technology: { text: "text-cat-technology", bar: "bg-cat-technology" },
  robotics: { text: "text-cat-robotics", bar: "bg-cat-robotics" },
};

const NEED_LABELS: Record<string, string> = {
  ai: "Applied AI",
  technology: "Technology adoption",
  robotics: "Applied robotics",
};

const ATTENDANCE_DOT: Record<string, string> = {
  present: "bg-success",
  late: "bg-warning",
  excused: "bg-muted-foreground",
  absent: "bg-danger",
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MemberRecord | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/org/members/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        setRecord(d);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [id]);

  if (state === "loading") {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-32 rounded-2xl border border-border skeleton-shimmer" />
        <div className="h-64 rounded-2xl border border-border skeleton-shimmer" />
      </div>
    );
  }

  if (state === "error" || !record) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <h2 className="text-lg font-semibold">Record unavailable</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          This person is not in your organisation, or you do not have the role
          to view training records.
        </p>
      </div>
    );
  }

  const { member, stats, timeline } = record;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl"
    >
      <Link
        href="/dashboard/admin/users"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Directory
      </Link>

      {/* Identity header */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-[-0.02em]">
              {member.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {[member.job_title, member.department].filter(Boolean).join(" · ") || member.email}
            </p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
          <a
            href={`/api/org/members/${member.id}/training-record`}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export training record (PDF)
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Enrolments", value: String(stats.enrolments), icon: GraduationCap },
            { label: "Completed", value: String(stats.completed), icon: CalendarCheck2 },
            {
              label: "Attendance",
              value: stats.attendance_pct === null ? "—" : `${stats.attendance_pct}%`,
              icon: CalendarCheck2,
            },
            { label: "Certificates", value: String(stats.certificates), icon: Award },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {/* Latest readiness */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 text-sm font-semibold">AI readiness</h2>
          {record.maturity ? (
            <>
              <p className="mb-2 text-xs text-muted-foreground">
                Assessed {fmt(record.maturity.submitted_at)}
              </p>
              <RadarChart scores={record.maturity.scores} />
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No readiness assessment on record yet — share an assessment link
              and their scores will appear here.
            </p>
          )}
        </div>

        {/* Training needs */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 text-sm font-semibold">Training needs</h2>
          {record.training_needs ? (
            <>
              <p className="mb-4 text-xs text-muted-foreground">
                Measured {fmt(record.training_needs.submitted_at)} · higher = more need
              </p>
              <div className="space-y-4">
                {Object.entries(record.training_needs.needs).map(([key, value]) => {
                  const accent = NEED_ACCENTS[key] ?? { text: "text-brand", bar: "bg-brand" };
                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className={`font-medium ${accent.text}`}>
                          {NEED_LABELS[key] ?? key}
                        </span>
                        <span className="text-muted-foreground">{Number(value).toFixed(1)} / 5</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className={`h-full rounded-full ${accent.bar}`}
                          style={{ width: `${(Number(value) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No training needs analysis yet — share the needs assessment to
              see which subjects would help them most.
            </p>
          )}
        </div>
      </div>

      {/* Training history timeline */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-1 text-sm font-semibold">Training history</h2>
        <p className="mb-6 text-xs text-muted-foreground">
          Attendance and grades exactly as the facilitator recorded them.
        </p>

        {timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No enrolments yet. Once they join a cohort, every session,
            submission and trainer grade lands on this timeline.
          </p>
        ) : (
          <div className="space-y-6">
            {timeline.map((t) => (
              <div key={t.enrolment_id} className="border-l-2 border-border pl-5">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">
                    {t.cohort?.title ?? "Cohort"}
                  </h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                    {t.status}
                  </span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  {t.cohort?.course?.title}
                  {t.cohort?.facilitator ? ` · Facilitated by ${t.cohort.facilitator}` : ""}
                  {" · "}
                  {fmt(t.cohort?.starts_on ?? null)} – {fmt(t.cohort?.ends_on ?? null)}
                </p>

                {t.sessions.length > 0 && (
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {t.sessions.map((s) => (
                      <span key={s.position} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            s.attendance ? ATTENDANCE_DOT[s.attendance] ?? "bg-muted" : "bg-muted"
                          }`}
                        />
                        {s.title}
                        {s.attendance ? ` — ${s.attendance}` : ""}
                      </span>
                    ))}
                  </div>
                )}

                {t.grades.map((g, gi) => (
                  <div key={gi} className="mb-2 rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {g.score}/{g.max_score}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — graded by {g.graded_by ?? "facilitator"} on {fmt(g.graded_at)}
                      </span>
                    </p>
                    {g.feedback && (
                      <p className="mt-1 border-l-2 border-brand/40 pl-2 text-sm italic text-muted-foreground">
                        “{g.feedback}”
                      </p>
                    )}
                  </div>
                ))}

                {t.certificate && (
                  <a
                    href={`/verify/${t.certificate.public_ref}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-brand/30 bg-brand/5 px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
                  >
                    <Award className="h-4 w-4" />
                    Certificate {t.certificate.public_ref}
                    {t.certificate.revoked ? " (revoked)" : ""} · verify
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This page shows training records only. Individual AI usage is not
        available here or anywhere — usage is reported by department, and
        access to this record has been logged.
      </p>
    </motion.div>
  );
}
