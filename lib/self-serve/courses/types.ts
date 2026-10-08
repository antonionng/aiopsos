import type { CourseArtefact, SelfServeLesson } from "../types.ts";

/** A full course, written to `.cursor/skills/experrt-course-author/SKILL.md`. */
export type CourseContent = {
  /** Must match the slug the catalogue derives from the outline title. */
  slug: string;
  hours: number;
  artefact: CourseArtefact;
  lessons: SelfServeLesson[];
};
