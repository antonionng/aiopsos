import { z } from "zod";
import {
  ATTENDANCE_STATUSES,
  COHORT_STATUSES,
  DELIVERY_MODES,
  ENROLMENT_STATUSES,
  RESPONDENT_ROLES,
} from "./constants";

export const teamInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(200).optional(),
  role: z.enum(["user", "manager", "admin"]).optional().default("user"),
});

export const stripeCheckoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  plan: z.enum(["basic", "pro", "enterprise"]),
});

export const assessmentCreateSchema = z.object({
  title: z.string().min(1).max(500).optional().default("AI Readiness Assessment"),
  template_id: z.string().min(1).max(100).optional().default("org-wide"),
});

export const publicAssessmentSubmitSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().max(100).optional(),
  answers: z.record(z.string(), z.number().min(0).max(5)),
  assessment_id: z.string().uuid("Invalid assessment ID"),
  respondent_role: z.string().max(50).optional().nullable(),
  tools_used: z.array(z.string()).optional().nullable(),
});

export const courseRecommendSchema = z.object({
  scores: z.object({
    confidence: z.number().min(0).max(5),
    practice: z.number().min(0).max(5),
    tools: z.number().min(0).max(5),
    responsible: z.number().min(0).max(5),
    culture: z.number().min(0).max(5),
  }),
  respondent_role: z.enum(RESPONDENT_ROLES).optional().nullable(),
});

export const organisationUpdateSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  website: z.string().url().or(z.literal("")).optional(),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  founded_year: z.number().int().min(1800).max(2100).nullable().optional(),
  mission: z.string().max(2000).optional(),
  products_services: z.string().max(2000).optional(),
  tech_stack: z.string().max(1000).optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  job_title: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.string().max(1000).optional(),
  preferences: z.record(z.string(), z.string()).optional(),
});

export const approvalActionSchema = z.object({
  message_id: z.string().uuid().optional(),
  id: z.string().uuid().optional(),
  status: z.enum(["approved", "rejected"]),
  comment: z.string().max(2000).optional(),
});

// --- Cohort delivery ---

export const cohortCreateSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1).max(300),
  delivery_mode: z.enum(DELIVERY_MODES),
  location: z.string().max(300).optional().nullable(),
  // IANA zone name. Sessions are stored UTC and rendered in this zone.
  timezone: z.string().min(1).max(100).default("Europe/London"),
  seat_limit: z.number().int().min(1).max(500).default(12),
  starts_on: z.string().date().optional().nullable(),
  ends_on: z.string().date().optional().nullable(),
  facilitator_id: z.string().uuid().optional().nullable(),
  // Minor units. Per-cohort pricing, so this is the whole cohort, not a seat.
  // Minor units, capped at 10,000,000 (GBP 100,000) as a fat-finger guard.
  price_amount: z.number().int().min(0).max(10_000_000).optional().nullable(),
  currency: z.string().length(3).default("GBP"),
  pass_attendance_pct: z.number().min(0).max(100).default(80),
  pass_grade_pct: z.number().min(0).max(100).default(70),
});

export const cohortUpdateSchema = cohortCreateSchema
  .partial()
  .extend({ status: z.enum(COHORT_STATUSES).optional() })
  .omit({ course_id: true });

export const sessionUpsertSchema = z.object({
  sessions: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        module_id: z.string().uuid().optional().nullable(),
        position: z.number().int().min(1).max(200),
        title: z.string().min(1).max(300),
        starts_at: z.string().datetime({ offset: true }),
        ends_at: z.string().datetime({ offset: true }),
        join_url: z.string().url().max(1000).optional().nullable().or(z.literal("")),
      })
    )
    .min(1)
    .max(200),
});

export const enrolSchema = z.object({
  emails: z.array(z.string().email()).min(1).max(500),
});

export const attendanceBulkSchema = z.object({
  records: z
    .array(
      z.object({
        enrolment_id: z.string().uuid(),
        status: z.enum(ATTENDANCE_STATUSES),
        minutes_attended: z.number().int().min(0).max(1440).default(0),
      })
    )
    .min(1)
    .max(500),
});

export const gradeSchema = z.object({
  id: z.string().uuid().optional(),
  enrolment_id: z.string().uuid(),
  module_id: z.string().uuid().optional().nullable(),
  submission_id: z.string().uuid().optional().nullable(),
  score: z.number().min(0).max(10_000),
  max_score: z.number().gt(0).max(10_000).default(100),
  rubric: z.record(z.string(), z.unknown()).optional(),
  feedback: z.string().max(5000).default(""),
});

export const submissionSchema = z.object({
  session_id: z.string().uuid(),
  enrolment_id: z.string().uuid(),
  artefact_url: z.string().url().max(1000).optional().nullable().or(z.literal("")),
  notes: z.string().max(5000).default(""),
});

export const certificateIssueSchema = z.object({
  enrolment_id: z.string().uuid(),
});

export const enrolmentStatusSchema = z.object({
  status: z.enum(ENROLMENT_STATUSES),
});

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues;
    if (issues && issues.length > 0) {
      const first = issues[0];
      return { success: false, error: `${first.path.join(".")}: ${first.message}` };
    }
    return { success: false, error: "Validation failed" };
  }
  return { success: true, data: result.data };
}
