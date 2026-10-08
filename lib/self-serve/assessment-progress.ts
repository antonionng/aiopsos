import { z } from "zod";
import { evaluateCheck } from "./engine.ts";
import type { CourseProgress, SelfServeLesson } from "./types.ts";

const answerSchema = z.union([
  z.enum(["left", "right"]),
  z.array(z.string().max(1000)).max(100),
  z.record(z.string().max(100), z.string().max(30000)),
]);
const progressSchema = z.object({
  lessons: z.record(z.string().max(100), z.object({
    passed: z.boolean().optional(),
    answer: answerSchema,
  })),
  signedName: z.string().trim().max(160).optional(),
  signedAt: z.string().optional(),
  ref: z.string().optional(),
});

/** Browser flags and certificate identifiers cannot establish an assessment result. */
export function assessSubmittedProgress(
  lessons: SelfServeLesson[],
  raw: unknown,
): CourseProgress {
  const submitted = progressSchema.parse(raw);
  const ids = new Set(lessons.map(lesson => lesson.id));
  if (Object.keys(submitted.lessons).some(id => !ids.has(id))) {
    throw new Error("The answers include a lesson outside this course.");
  }
  return {
    lessons: Object.fromEntries(lessons.flatMap(lesson => {
      const result = submitted.lessons[lesson.id];
      if (!result) return [];
      return [[lesson.id, {
        answer: result.answer,
        passed: evaluateCheck(lesson.check, result.answer).passed,
      }]];
    })),
    signedName: submitted.signedName,
  };
}
