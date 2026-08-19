"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  COURSE_LEVEL_LABELS,
  DIMENSION_LABELS,
  LITERACY_DISCLAIMER,
  type CourseLevel,
  type Dimension,
} from "@/lib/constants";

interface DepartmentNeed {
  department: string;
  headcount: number;
  dominant_role: string;
  dominant_role_label: string;
  courses: {
    slug: string;
    title: string;
    level: CourseLevel;
    duration_hours: number;
    match_score: number;
    matched_dimensions: Dimension[];
  }[];
}

interface CourseRollup {
  slug: string;
  title: string;
  level: CourseLevel;
  duration_hours: number;
  headcount: number;
  departments: string[];
}

interface CoursesData {
  departments: DepartmentNeed[];
  courses: CourseRollup[];
  response_count: number;
}

/**
 * What this assessment's cohort needs to be trained on, by department and
 * rolled up per course with headcount. The org-side half of the
 * assessment-to-training join: the same ranking the individual sees on their
 * own results, aggregated to something a budget holder can act on.
 */
export function CohortTrainingNeeds({ assessmentId }: { assessmentId: string }) {
  const [data, setData] = useState<CoursesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;
    let cancelled = false;

    fetch(`/api/assessment/${assessmentId}/courses`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && !d.error) setData(d);
      })
      .catch(() => {
        // Training needs are additive to the results page; a failure here
        // must not take the rest of the page down.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  if (loading || !data || data.courses.length === 0) return null;

  return (
    <div>
      <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <GraduationCap className="h-4 w-4" />
        Training Needs by Department
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Derived from {data.response_count}{" "}
        {data.response_count === 1 ? "response" : "responses"}. Each department
        is matched on its average scores and the role most of its respondents
        hold.
      </p>

      {/* Roll-up: what to actually book */}
      <Card className="mb-4 border-border bg-card">
        <CardContent className="pt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Courses to schedule
          </p>
          <div className="space-y-2">
            {data.courses.map((course) => (
              <div
                key={course.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-brand"
                  >
                    {course.title}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {COURSE_LEVEL_LABELS[course.level] ?? course.level} ·{" "}
                    {course.duration_hours} hrs ·{" "}
                    {course.departments.join(", ")}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium">
                  <Users className="h-3 w-3" />
                  {course.headcount}{" "}
                  {course.headcount === 1 ? "person" : "people"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Per-department detail */}
      <div className="space-y-3">
        {data.departments.map((dept) => (
          <Card key={dept.department} className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{dept.department}</p>
                <p className="text-xs text-muted-foreground">
                  {dept.headcount}{" "}
                  {dept.headcount === 1 ? "respondent" : "respondents"} · mostly{" "}
                  {dept.dominant_role_label}
                </p>
              </div>

              {dept.courses.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No catalogue course matches this department&apos;s weakest
                  dimensions.
                </p>
              ) : (
                <ol className="space-y-2">
                  {dept.courses.map((course, i) => (
                    <li
                      key={course.slug}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs"
                    >
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="font-medium text-foreground hover:text-brand"
                      >
                        {course.title}
                      </Link>
                      <span className="text-muted-foreground">
                        closes{" "}
                        {course.matched_dimensions
                          .map((d) => DIMENSION_LABELS[d] ?? d)
                          .join(" and ")}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {LITERACY_DISCLAIMER}
      </p>
    </div>
  );
}
