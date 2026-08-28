"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, CalendarDays, GraduationCap, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ATTENDANCE_STATUS_LABELS,
  ENROLMENT_STATUS_LABELS,
  LITERACY_DISCLAIMER,
  type AttendanceStatus,
  type EnrolmentStatus,
} from "@/lib/constants";

interface LearningSession {
  id: string;
  position: number;
  title: string;
  starts_at: string;
  ends_at: string;
  join_url: string | null;
  my_attendance: AttendanceStatus | null;
}

interface RecommendedCourse {
  slug: string;
  title: string;
  summary: string;
  category: "ai" | "technology" | "robotics";
  level: string;
  duration_hours: number;
  reason: string;
}

const CATEGORY_BADGE: Record<RecommendedCourse["category"], string> = {
  ai: "bg-cat-ai-soft text-cat-ai",
  technology: "bg-cat-technology-soft text-cat-technology",
  robotics: "bg-cat-robotics-soft text-cat-robotics",
};

interface LearningEnrolment {
  enrolment_id: string;
  status: EnrolmentStatus;
  cohort: {
    id: string;
    title: string;
    timezone: string;
    location: string | null;
    pass_attendance_pct: number;
    pass_grade_pct: number;
    courses: { slug: string; title: string } | null;
    facilitators: { display_name: string } | null;
  } | null;
  sessions: LearningSession[];
  grades: { id: string; score: number; max_score: number; feedback: string }[];
  progress: {
    eligible: boolean;
    attendance_pct: number;
    grade_pct: number | null;
    reasons: string[];
  };
  certificate: { public_ref: string; issued_at: string; revoked_at: string | null } | null;
}

function WhatsNextStrip({ courses }: { courses: RecommendedCourse[] }) {
  if (courses.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-1 text-sm font-semibold">What&apos;s next for you</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Matched from your assessment - facilitated live, booked through your
        organisation.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {courses.map((c) => (
          <a
            key={c.slug}
            href={`/courses/${c.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
          >
            <span
              className={`mb-2 w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${CATEGORY_BADGE[c.category] ?? "bg-brand/10 text-brand"}`}
            >
              {c.reason}
            </span>
            <span className="mb-1 text-sm font-semibold leading-snug">{c.title}</span>
            <span className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
              {c.summary}
            </span>
            <span className="text-xs text-muted-foreground">
              {c.duration_hours} facilitated hrs · {c.level}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MyLearningPage() {
  const [enrolments, setEnrolments] = useState<LearningEnrolment[]>([]);
  const [recommended, setRecommended] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  // Captured when the data arrives rather than read during render, so
  // splitting sessions into upcoming and past is a pure function of state.
  const [loadedAt, setLoadedAt] = useState(0);

  useEffect(() => {
    fetch("/api/my-learning", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setEnrolments(d.enrolments ?? []);
        setRecommended(d.recommended ?? []);
        setLoadedAt(Date.now());
      })
      .catch(() => setEnrolments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your learning...</p>
      </div>
    );
  }

  if (enrolments.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <div className="flex min-h-[36vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
              <GraduationCap className="h-7 w-7 text-brand" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Nothing scheduled yet</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              When your organisation books you onto a course, your sessions,
              joining links and grades will appear here.
            </p>
            <Link href="/courses" target="_blank">
              <Button variant="outline">Browse the catalogue</Button>
            </Link>
          </div>
        </div>
        <WhatsNextStrip courses={recommended} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="mb-1">My Learning</h1>
        <p className="text-sm text-muted-foreground">
          Your cohorts, sessions and results. Times are shown in each
          cohort&apos;s own timezone.
        </p>
      </div>

      <div className="space-y-6">
        {enrolments.map((enrolment) => {
          const cohort = enrolment.cohort;
          const upcoming = enrolment.sessions.filter(
            (s) => new Date(s.ends_at).getTime() >= loadedAt
          );
          const past = enrolment.sessions.filter(
            (s) => new Date(s.ends_at).getTime() < loadedAt
          );

          return (
            <Card key={enrolment.enrolment_id} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">
                      {cohort?.courses?.title ?? cohort?.title ?? "Course"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cohort?.title}
                      {cohort?.facilitators
                        ? ` · Facilitated by ${cohort.facilitators.display_name}`
                        : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {ENROLMENT_STATUS_LABELS[enrolment.status]}
                  </Badge>
                </div>

                {/* Progress against the certificate rule */}
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <span>
                        {enrolment.progress.attendance_pct}% of{" "}
                        {cohort?.pass_attendance_pct ?? 80}% needed
                      </span>
                    </div>
                    <Progress value={enrolment.progress.attendance_pct} className="h-1.5" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Grade</span>
                      <span>
                        {enrolment.progress.grade_pct === null
                          ? "Not graded yet"
                          : `${enrolment.progress.grade_pct}% of ${cohort?.pass_grade_pct ?? 70}% needed`}
                      </span>
                    </div>
                    <Progress value={enrolment.progress.grade_pct ?? 0} className="h-1.5" />
                  </div>
                </div>

                {enrolment.certificate && !enrolment.certificate.revoked_at && (
                  <Link
                    href={`/verify/${enrolment.certificate.public_ref}`}
                    target="_blank"
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs font-medium text-emerald-500"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Certificate issued - view and share the verification link
                  </Link>
                )}

                {upcoming.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Coming up
                    </p>
                    <div className="space-y-2">
                      {upcoming.map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm">
                              <span className="mr-2 text-muted-foreground">
                                {session.position}.
                              </span>
                              {session.title}
                            </p>
                            <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(session.starts_at).toLocaleString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: cohort?.timezone ?? "Europe/London",
                              })}{" "}
                              ({cohort?.timezone})
                            </p>
                          </div>
                          {session.join_url && (
                            <a href={session.join_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">
                                <Video className="mr-1.5 h-3.5 w-3.5" />
                                Join
                              </Button>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {past.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Completed sessions
                    </p>
                    <div className="space-y-1">
                      {past.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="text-muted-foreground">
                            {session.position}. {session.title}
                          </span>
                          <span
                            className={
                              session.my_attendance === "present" ||
                              session.my_attendance === "late"
                                ? "text-emerald-500"
                                : "text-muted-foreground"
                            }
                          >
                            {session.my_attendance
                              ? ATTENDANCE_STATUS_LABELS[session.my_attendance]
                              : "Not recorded"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {enrolment.grades.length > 0 && (
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Feedback
                    </p>
                    {enrolment.grades.map((grade) => (
                      <p key={grade.id} className="mb-1 text-xs text-muted-foreground">
                        <span className="text-foreground/80">
                          {grade.score} / {grade.max_score}
                        </span>
                        {grade.feedback ? ` - ${grade.feedback}` : ""}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <WhatsNextStrip courses={recommended} />

      <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
        {LITERACY_DISCLAIMER}
      </p>
    </motion.div>
  );
}
