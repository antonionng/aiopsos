import type { CourseContent } from "./types.ts";
import { COURSE as specifyingARoboticsProject } from "./specifying-a-robotics-project.ts";

/** Courses with full lessons. An outline becomes playable when its content is registered here. */
export const COURSE_CONTENT: CourseContent[] = [
  specifyingARoboticsProject,
];
