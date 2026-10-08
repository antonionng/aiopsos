import "server-only";
import { PROMPT_ENGINEERING_LESSONS } from "./prompt-engineering.ts";
import { COURSE_CONTENT } from "./courses/index.ts";
import {
  SELF_SERVE_COURSE_META,
  SELF_SERVE_TRACKS,
  trackLabel,
} from "./catalog-meta.ts";
import type { SelfServeCourse, SelfServeTrack } from "./types.ts";

export { SELF_SERVE_COURSE_META, SELF_SERVE_TRACKS, trackLabel } from "./catalog-meta.ts";
export { getSelfServeCourseMeta, coursesByTrackMeta } from "./catalog-meta.ts";

const PILOT_ARTEFACT = {
  lessonId: "prompt-card",
  title: "The prompt card",
  recordLine: "Wrote and signed a prompt a colleague can run without asking what was meant.",
} as const;

export const SELF_SERVE_COURSES: SelfServeCourse[] = SELF_SERVE_COURSE_META.map((meta): SelfServeCourse => {
  if (meta.slug === "prompt-engineering-for-professional-work") {
    return {
      ...meta,
      modules: PROMPT_ENGINEERING_LESSONS.map((lesson) => lesson.title),
      lessons: PROMPT_ENGINEERING_LESSONS,
      artefact: PILOT_ARTEFACT,
    };
  }
  const content = COURSE_CONTENT.find((item) => item.slug === meta.slug);
  if (!content) {
    return { ...meta, playable: false };
  }
  return {
    ...meta,
    hours: content.hours,
    playable: true,
    modules: content.lessons.map((lesson) => lesson.title),
    lessons: content.lessons,
    artefact: content.artefact,
  };
});

export function getSelfServeCourse(slug: string): SelfServeCourse | undefined {
  return SELF_SERVE_COURSES.find((course) => course.slug === slug);
}

export function coursesByTrack(track: SelfServeTrack): SelfServeCourse[] {
  return SELF_SERVE_COURSES.filter((course) => course.track === track);
}

export function withoutLessons(course: SelfServeCourse): SelfServeCourse {
  const { lessons: _lessons, ...rest } = course;
  return rest;
}
