import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { AcademyArtwork } from "@/components/courses/academy-artwork";
import {
  COURSE_CATEGORY_LABELS,
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  DIMENSION_LABELS,
  RESPONDENT_ROLE_LABELS,
  type CourseCategory,
} from "@/lib/constants";
import type { Course } from "@/lib/types";

const CATEGORY_BADGE: Record<CourseCategory, string> = {
  hr: "bg-cat-hr-soft text-cat-hr",
  ai: "bg-cat-ai-soft text-cat-ai",
  technology: "bg-cat-technology-soft text-cat-technology",
  robotics: "bg-cat-robotics-soft text-cat-robotics",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="academy-course-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/30"
    >
      <AcademyArtwork category={course.category} variant={course.slug} />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              CATEGORY_BADGE[course.category] ?? "bg-brand/10 text-brand"
            }`}
          >
            {COURSE_CATEGORY_LABELS[course.category] ?? course.category}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {COURSE_LEVEL_LABELS[course.level]}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {course.duration_hours} hrs
          </span>
          <span className="text-xs text-muted-foreground">
            {course.delivery_modes
              .map((mode) => DELIVERY_MODE_LABELS[mode] ?? mode)
              .join(" / ")}
          </span>
        </div>

        <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
          {course.title}
        </h2>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {course.summary}
        </p>

        {course.target_dimensions.length > 0 && (
          <p className="mb-3 text-xs text-muted-foreground">
            Addresses:{" "}
            <span className="text-foreground/80">
              {course.target_dimensions
                .map((d) => DIMENSION_LABELS[d] ?? d)
                .join(", ")}
            </span>
          </p>
        )}

        {course.target_roles.length > 0 && (
          <p className="mb-4 inline-flex items-start gap-1.5 text-xs text-muted-foreground">
            <Users className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              {course.target_roles
                .map((r) => RESPONDENT_ROLE_LABELS[r] ?? r)
                .join(", ")}
            </span>
          </p>
        )}

        <span className="mt-auto inline-flex items-center text-sm font-medium text-foreground">
          Explore course
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function CourseCardGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
