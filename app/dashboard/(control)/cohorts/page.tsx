"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, GraduationCap, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  COHORT_STATUS_LABELS,
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  type CohortStatus,
  type CourseLevel,
  type DeliveryMode,
} from "@/lib/constants";

interface CohortRow {
  id: string;
  title: string;
  delivery_mode: DeliveryMode;
  location: string | null;
  timezone: string;
  seat_limit: number;
  starts_on: string | null;
  ends_on: string | null;
  status: CohortStatus;
  paid_at: string | null;
  enrolled_count: number;
  courses: { slug: string; title: string; level: CourseLevel } | null;
  facilitators: { display_name: string } | null;
}

const STATUS_VARIANT: Record<
  CohortStatus,
  "default" | "secondary" | "outline"
> = {
  scheduled: "outline",
  running: "default",
  completed: "secondary",
  cancelled: "secondary",
};

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active");
  const [search, setSearch] = useState("");
  const visible = cohorts.filter(c => (filter === "all" || (filter === "active" ? ["running", "scheduled"].includes(c.status) : c.status === filter)) && `${c.title} ${c.courses?.title || ""}`.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    fetch("/api/cohorts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setCohorts(d.cohorts ?? []);
      })
      .catch(() => setError("Failed to load cohorts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading cohorts...</p>
      </div>
    );
  }

  return (
    <motion.div className="training-catalogue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="catalogue-heading">
        <span className="lms-eyebrow">Learning / Live delivery</span>
        <h1>Your training, brought together.</h1>
        <p className="text-sm text-muted-foreground">
          Plan the next session, bring your people together and see every group through to completion.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard/cohorts/new"
          className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Schedule a training group →
        </Link>
        <Link
          href="/dashboard/my-learning"
          className="rounded-full border px-5 py-3 text-sm font-semibold"
        >
          My sessions & learning
        </Link>
      </div>
      <div className="catalogue-stats">
        {[["Happening now", cohorts.filter(c => c.status === "running").length], ["Coming up", cohorts.filter(c => c.status === "scheduled").length], ["Completed groups", cohorts.filter(c => c.status === "completed").length]].map(([label, count]) => <div key={label}><strong>{count}</strong><span>{label}</span></div>)}
      </div>
      <details className="mb-6 text-sm">
        <summary className="cursor-pointer font-semibold">
          How does this connect to Courses and Programmes?
        </summary>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          Courses holds your authored lessons and activities. Programmes assigns
          those courses to your people or clients. Live training currently uses
          the academy catalogue and records trainer-led sessions separately. A
          learner sees both formats in My learning and My record. Adding a
          programme does not automatically schedule a live group.
        </p>
        <div className="mt-3 flex gap-4">
          <Link href="/dashboard/programmes" className="text-brand">
            Manage programmes →
          </Link>
          <Link href="/dashboard/transcript" className="text-brand">
            My combined record →
          </Link>
        </div>
      </details>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="catalogue-controls">
        <div aria-label="Filter training groups" className="catalogue-filters">{[["active","Active & upcoming"],["completed","Completed"],["all","All groups"]].map(([value,label]) => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{label}</button>)}</div>
        <input aria-label="Search training groups" placeholder="Find a training group…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {cohorts.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
              <GraduationCap className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">
              Schedule your first training group
            </h2>
            <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
              A cohort is one delivery of a course: a facilitator, a set of
              dates, and the people attending. Start from the training needs on
              an assessment, or browse the catalogue.
            </p>
            <Link
              href="/courses"
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Browse courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="catalogue-grid">
          {!visible.length && <p className="catalogue-no-results">No groups match this view. Try another filter or search.</p>}
          {visible.map((cohort) => (
            <Link className={`catalogue-course ${cohort.status}`} key={cohort.id} href={`/dashboard/cohorts/${cohort.id}`}>
              <Card className="catalogue-course-card">
                <div className="catalogue-course-top"><span>{DELIVERY_MODE_LABELS[cohort.delivery_mode]}</span><span>{cohort.starts_on ? new Date(cohort.starts_on).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Date to confirm"}</span></div>
                <CardContent className="catalogue-course-body">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant={STATUS_VARIANT[cohort.status]}
                      className="text-[10px]"
                    >
                      {COHORT_STATUS_LABELS[cohort.status]}
                    </Badge>
                    {cohort.courses && (
                      <span className="text-xs text-muted-foreground">
                        {COURSE_LEVEL_LABELS[cohort.courses.level]}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {DELIVERY_MODE_LABELS[cohort.delivery_mode]}
                    </span>
                  </div>

                  <h2 className="catalogue-course-title">{cohort.title}</h2>
                  <span className="catalogue-course-open">
                    Open group →
                  </span>
                  {cohort.courses && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      {cohort.courses.title}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                    {cohort.starts_on && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(cohort.starts_on).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                        {cohort.ends_on &&
                          cohort.ends_on !== cohort.starts_on && (
                            <>
                              {" – "}
                              {new Date(cohort.ends_on).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </>
                          )}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {cohort.enrolled_count} of {cohort.seat_limit} seats
                    </span>
                    {cohort.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {cohort.location}
                      </span>
                    )}
                    {cohort.facilitators && (
                      <span>
                        Facilitated by {cohort.facilitators.display_name}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
