import { z } from "zod";
export const assessmentSkills = [
  { id: "task", title: "Choose and explain your task", requirement: "A clear task, its owner, source records, schedule and checks for a correct result." },
  { id: "authority", title: "Set clear limits", requirement: "Allowed, approval-only and blocked actions, with recorded boundary and conflicting-instruction tests." },
  { id: "implementation", title: "Show the task working", requirement: "Settings, source inputs and recorded results in the intended workspace. Identify simulations honestly." },
  { id: "verification", title: "Check the results", requirement: "Source checks and six distinct test cases, including missing information, boundaries, failure and the changed example." },
  { id: "recovery", title: "Fix a problem safely", requirement: "A failed attempt, inspection of completed effects, correction and a retest without duplicate work." },
  { id: "value", title: "Measure the benefit and explain the task", requirement: "Three comparable attempts, review time, costs, assumptions and instructions for another person to operate and stop the task." },
] as const;
export const assessmentPolicy = "experrt-agent-ai-v1";
export const projectSubmissionSchema = z.object({
  evidence: z.record(z.enum(["task", "authority", "implementation", "verification", "recovery", "value"]), z.string().trim().min(100).max(10000)),
  changedCase: z.string().trim().min(100).max(10000),
  declaration: z.literal(true),
}).strict();
export const assessmentResultSchema = z.object({
  skills: z.array(z.object({ id: z.enum(["task", "authority", "implementation", "verification", "recovery", "value"]), score: z.number().int().min(0).max(4), evidenceQuote: z.string().max(2000), feedback: z.string().min(20).max(1800), nextStep: z.string().min(10).max(1200) }).strict()).length(6),
  summary: z.string().min(20).max(3000),
  limitations: z.array(z.string().max(500)).min(1).max(10),
}).strict();
export type ProjectSubmission = z.infer<typeof projectSubmissionSchema>;
export type AssessmentResult = z.infer<typeof assessmentResultSchema> & { passed: boolean; policy: string };
export function validateAssessment(raw: unknown, submission: ProjectSubmission): AssessmentResult {
  const result = assessmentResultSchema.parse(raw);
  if (new Set(result.skills.map(s => s.id)).size !== 6) throw new Error("Assessment must cover each skill exactly once.");
  for (const skill of result.skills) {
    if (skill.score >= 3 && (skill.evidenceQuote.trim().length < 30 || !submission.evidence[skill.id].includes(skill.evidenceQuote)))
      throw new Error("A passing score must cite an exact extract from the submitted evidence.");
  }
  return { ...result, passed: result.skills.every(s => s.score >= 3), policy: assessmentPolicy };
}
export const projectWorkSchema = z.object({
  notes: z.record(z.string().uuid(), z.string().max(20000)),
  completed: z.array(z.string().uuid()).max(36),
  answers: z.record(z.string().uuid(), z.number().int().min(0).max(2)),
  position: z.object({ moduleIndex: z.number().int().min(0).max(5), step: z.number().int().min(0).max(5) }).optional(),
  projectChecks: z.record(z.string().max(30), z.boolean()).optional(),
}).strict();
