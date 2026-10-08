import { z } from "zod";
import { ASSESSMENT_TEMPLATES } from "./assessment-templates.ts";

export const learningCheckSchema = z.object({
  request_id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  organisation_name: z.string().trim().max(300).default(""),
  categories: z.array(z.enum(["ai", "technology", "robotics"])).min(1).max(3),
  answers: z.record(z.string().max(80), z.number().int().min(0).max(5)),
  scope: z.enum(["My own learning", "My team's learning", "Learning for a client"]),
  marketing_consent: z.boolean().default(false),
  capture_consent: z.literal(true),
});

export function scoreLearningCheck(categories: string[], answers: Record<string, number>) {
  const selected = [...new Set(categories)];
  const questions = ASSESSMENT_TEMPLATES["training-needs"].questions.filter(q => selected.includes(q.dimension));
  if (!questions.length || questions.some(q => !Number.isInteger(answers[q.id]) || !q.options.some(o => o.value === answers[q.id]))) {
    throw new Error("Please answer every question before viewing your results.");
  }
  const cleanAnswers = Object.fromEntries(questions.map(q => [q.id, answers[q.id]]));
  const scores = selected.map(key => {
    const qs = questions.filter(q => q.dimension === key);
    return { key, score: qs.reduce((sum, q) => sum + answers[q.id], 0) / qs.length };
  }).sort((a,b) => b.score - a.score);
  return { categories: selected, answers: cleanAnswers, scores, version: "training-needs-v1" };
}
