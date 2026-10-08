import { z } from "zod";

export const materialSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(180),
  kind: z.enum(["handout", "worksheet", "lab_guide", "checklist", "reference"]),
  content: z.string().trim().min(1).max(16000),
});
export type LearningMaterial = z.infer<typeof materialSchema>;
export const activitySchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1).max(180),
    kind: z.enum(["lesson", "quiz", "practice", "observation"]),
    content: z.string().trim().min(1).max(20000),
    minutes: z.number().int().min(1).max(600),
    options: z.array(z.string().trim().min(1).max(500)).max(8).default([]),
    correctOption: z.number().int().min(0).max(7).nullable().default(null),
    criteria: z.string().max(4000).default(""),
    materials: z.array(materialSchema).max(6).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.kind === "quiz" &&
      (value.options.length < 2 ||
        value.correctOption === null ||
        value.correctOption >= value.options.length)
    )
      ctx.addIssue({
        code: "custom",
        message: "Quizzes need at least two options and a correct answer.",
      });
    if (
      (value.kind === "practice" || value.kind === "observation") &&
      !value.criteria.trim()
    )
      ctx.addIssue({
        code: "custom",
        message: "Practical activities need review criteria.",
      });
  });
export const courseContentSchema = z
  .object({
    title: z.string().trim().min(3).max(180),
    summary: z.string().trim().max(2500),
    category: z.enum(["ai", "robotics", "technology", "general"]),
    outcomes: z.array(z.string().trim().min(1).max(500)).min(1).max(20),
    activities: z.array(activitySchema).min(1).max(40),
  })
  .refine(
    (value) =>
      new Set(value.activities.map((a) => a.id)).size ===
      value.activities.length,
    "Activity identifiers must be unique.",
  );
export type CourseContent = z.infer<typeof courseContentSchema>;
export type Activity = z.infer<typeof activitySchema>;
export const programmeSchema = z.object({
  title: z.string().trim().min(3).max(180),
  goal: z.string().trim().min(3).max(4000),
  version_ids: z.array(z.string().uuid()).min(1).max(20),
  client_org_id: z.string().uuid().nullable().default(null),
  due_at: z.string().datetime({ offset: true }).nullable().default(null),
});
export const agentGoalSchema = z.object({
  goal: z.string().trim().min(10).max(4000),
  kind: z.enum(["programme", "course", "delivery"]),
});
export const commandSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("record.get"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("client.disconnect"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("overview"),
    payload: z.object({}).default({}),
  }),
  z.object({
    action: z.literal("course.get"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("course.save"),
    payload: z.object({
      id: z.string().uuid().optional(),
      revision: z.number().int().positive().optional(),
      content: courseContentSchema,
    }),
  }),
  z.object({
    action: z.literal("course.publish"),
    payload: z.object({
      id: z.string().uuid(),
      revision: z.number().int().positive(),
    }),
  }),
  z.object({ action: z.literal("programme.create"), payload: programmeSchema }),
  z.object({
    action: z.literal("programme.get"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("programme.assign"),
    payload: z.object({
      id: z.string().uuid(),
      user_ids: z.array(z.string().uuid()).min(1).max(200),
    }),
  }),
  z.object({
    action: z.literal("programme.archive"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("learning.get"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("learning.submit"),
    payload: z.object({
      id: z.string().uuid(),
      activity_id: z.string().uuid(),
      answer: z.string().trim().max(20000).default(""),
      option: z.number().int().min(0).max(7).nullable().default(null),
    }),
  }),
  z.object({
    action: z.literal("learning.review"),
    payload: z.object({
      id: z.string().uuid(),
      revision: z.number().int().positive(),
      decision: z.enum(["passed", "returned"]),
      feedback: z.string().trim().min(3).max(4000),
      observation_context: z.string().trim().max(2000).default(""),
    }),
  }),
  z.object({
    action: z.literal("client.request"),
    payload: z.object({ client_org_id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("client.respond"),
    payload: z.object({ id: z.string().uuid(), accept: z.boolean() }),
  }),
  z.object({
    action: z.literal("settings.save"),
    payload: z.object({
      brand_name: z.string().trim().min(2).max(100),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      provider: z.boolean(),
      enterprise: z.boolean(),
    }),
  }),
  z.object({ action: z.literal("agent.create"), payload: agentGoalSchema }),
  z.object({
    action: z.literal("agent.approve"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("agent.cancel"),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("agent.retry"),
    payload: z.object({ id: z.string().uuid() }),
  }),
]);
export type Command = z.infer<typeof commandSchema>;
export type CourseRecord = {
  id: string;
  org_id: string;
  revision: number;
  content: CourseContent;
  updated_at: string;
};
export type Version = {
  id: string;
  course_id: string;
  version: number;
  title: string;
  content?: CourseContent;
  created_at: string;
};
export type Programme = {
  id: string;
  org_id: string;
  client_org_id: string | null;
  title: string;
  goal: string;
  status: "active" | "archived";
  version_ids: string[];
  due_at: string | null;
  created_at: string;
};
export type Assignment = {
  id: string;
  user_id: string;
  org_id: string;
  programme_id: string;
  completed_at: string | null;
  created_at: string;
  title?: string;
  due_at?: string | null;
  learner_name?: string;
};
export type ProgressRecord = {
  id: string;
  assignment_id: string;
  activity_id: string;
  state: "passed" | "submitted" | "returned";
  answer: string;
  feedback: string;
  revision: number;
  reviewed_by: string | null;
  updated_at: string;
  observation_context: string;
  learner_name?: string;
  activity_title?: string;
  criteria?: string;
  activity_kind?: string;
};
export type AgentRun = {
  id: string;
  kind: "course" | "programme" | "delivery";
  goal: string;
  state:
    | "queued"
    | "running"
    | "needs_review"
    | "completed"
    | "failed"
    | "cancelled";
  proposal: unknown;
  summary: string;
  error: string | null;
  created_at: string;
  updated_at: string;
  result: { id?: string } | null;
  attempts: number;
  lease_until?: string | null;
  dispatch_requested_at?: string | null;
};
export type Client = {
  id: string;
  provider_org_id: string;
  client_org_id: string;
  state: "pending" | "accepted" | "declined";
  provider_name: string;
  client_name: string;
};
export type Overview = {
  user_id: string;
  org_id: string;
  can_manage: boolean;
  courses: CourseRecord[];
  versions: Version[];
  programmes: Programme[];
  assignments: Assignment[];
  reviews: ProgressRecord[];
  runs: AgentRun[];
  clients: Client[];
  members: { id: string; name: string; org_id: string }[];
  settings: {
    brand_name: string;
    accent: string;
    provider: boolean;
    enterprise: boolean;
  } | null;
  events: {
    id: string;
    action: string;
    created_at: string;
    actor_id: string;
  }[];
  ai_configured: boolean;
  agent_recovery_enabled?: boolean;
};
export function emptyActivity(kind: Activity["kind"] = "lesson"): Activity {
  return {
    id: crypto.randomUUID(),
    kind,
    title: "",
    content: "",
    minutes: 10,
    options: kind === "quiz" ? ["", ""] : [],
    correctOption: kind === "quiz" ? 0 : null,
    criteria: "",
  };
}
