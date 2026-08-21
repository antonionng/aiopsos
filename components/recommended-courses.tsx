"use client";

import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import {
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  DIMENSION_LABELS,
  LITERACY_DISCLAIMER,
} from "@/lib/constants";
import type { CourseRecommendation } from "@/lib/types";

/**
 * The assessment-to-training join, rendered. Shown to anonymous respondents
 * on the public results page and to signed-in users on their own results.
 *
 * Deliberately states *why* each course was matched: a recommendation an
 * employee cannot interrogate is not one they will act on, and the same
 * reasoning has to stand up in the evidence pack later.
 */
export function RecommendedCourses({
  recommendations,
  heading = "Recommended for you",
  description,
  className = "",
}: {
  recommendations: CourseRecommendation[];
  heading?: string;
  description?: string;
  className?: string;
}) {
  if (recommendations.length === 0) return null;

  return (
    <section className={className}>
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
          <GraduationCap className="h-4 w-4 text-brand" />
        </div>
        <div>
          <h2 className="text-base font-semibold">{heading}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description ??
              "Matched to your weakest dimensions and your role. Each course is delivered live by a facilitator."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((course) => (
          <div key={course.slug} className="rounded-xl border border-border bg-card p-4">
          <Link
            href={`/courses/${course.slug}`}
            className="group block"
          >
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {COURSE_LEVEL_LABELS[course.level] ?? course.level}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {course.duration_hours} hrs
              </span>
              {course.delivery_modes.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {course.delivery_modes
                    .map((mode) => DELIVERY_MODE_LABELS[mode] ?? mode)
                    .join(" / ")}
                </span>
              )}
            </div>

            <h3 className="mb-1 text-sm font-semibold">{course.title}</h3>
            <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
              {course.summary}
            </p>

            {course.matched_dimensions.length > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Recommended because of your{" "}
                <span className="text-foreground/80">
                  {course.matched_dimensions
                    .map((d) => DIMENSION_LABELS[d] ?? d)
                    .join(" and ")}
                </span>{" "}
                {course.matched_dimensions.length === 1 ? "score" : "scores"}.
              </p>
            )}

            <span className="mt-2 inline-flex items-center text-xs font-medium text-foreground">
              Course outline
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href={`/courses/${course.slug}#request`}
            className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand px-4 text-xs font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Request this course
          </Link>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {LITERACY_DISCLAIMER}
      </p>
    </section>
  );
}
