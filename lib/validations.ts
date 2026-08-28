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

/**
 * One training day on the tour: a single cohort owned by the delivering
 * organisation, plus one organisation and one QR link per attending company.
 * Seats are for the whole room, so seat_limit is optional here and derived
 * from the delegate counts when it is left out.
 */
export const tourProvisionSchema = z.object({
  delivering_org_id: z.string().uuid(),
  course_id: z.string().uuid(),
  title: z.string().min(1).max(300),
  venue: z.string().min(1).max(300),
  event_date: z.string().date(),
  ends_on: z.string().date().optional().nullable(),
  timezone: z.string().min(1).max(100),
  delivery_mode: z.enum(DELIVERY_MODES).default("in_person"),
  facilitator_id: z.string().uuid().optional().nullable(),
  seat_limit: z.number().int().min(1).max(500).optional(),
  pass_attendance_pct: z.number().min(0).max(100).default(80),
  pass_grade_pct: z.number().min(0).max(100).default(70),
  template_id: z
    .enum([
      "org-wide", "engineering", "sales", "marketing",
      "leadership", "governance", "training-needs",
    ])
    .default("training-needs"),
  // Orgs with no credit_wallets row fail OPEN on AI usage, so a fresh tenant
  // is unmetered until it has one.
  starter_credits: z.number().int().min(0).max(1_000_000).default(1000),
  companies: z
    .array(
      z.object({
        name: z.string().min(1).max(300),
        industry: z.string().max(200).optional(),
        contact_email: z.string().email().optional(),
        seats: z.number().int().min(1).max(500).optional(),
      })
    )
    .min(1)
    .max(100),
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

export const evidencePackSchema = z.object({
  period_start: z.string().date(),
  period_end: z.string().date(),
  // The org's own statement of which AI systems it deploys. Free text on
  // purpose: it is a declaration by the organisation, not something the
  // platform can infer for them.
  declaration: z.string().max(5000).default(""),
});

/**
 * Joining the insights list.
 *
 * One field, because the form has one field. `source` records which surface
 * the sign-up came from so we can tell whether the article footers actually
 * convert better than the index, which is the whole reason for putting the
 * form in both places.
 */
export const insightSubscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(320),
  source: z
    .enum(["insights_index", "insights_article", "courses", "use_cases"])
    .default("insights_index"),
  source_slug: z.string().max(200).optional().nullable(),
});

export const courseEnquirySchema = z.object({
  course_slug: z.string().max(200).optional().nullable(),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  organisation_name: z.string().max(300).default(""),
  message: z.string().max(3000).default(""),
  seats: z.number().int().min(1).max(10_000).optional().nullable(),
  source: z
    .enum(["course_page", "assessment_results", "catalogue", "dashboard"])
    .default("course_page"),
});

/**
 * Answers to the public assessment.
 *
 * Previously the route checked only `typeof answers === "object"`, so a
 * payload missing questions scored 0 for each one (`?? 0` in the scorer) and
 * persisted as a genuine "Tier 0" result. A partial submission should be
 * rejected, not recorded as a bad score.
 */
export const assessmentAnswersSchema = z.object({
  answers: z.record(z.string().min(1).max(50), z.number().min(0).max(5)),
  respondent_role: z.enum(RESPONDENT_ROLES).optional().nullable(),
  tools_used: z.array(z.string().max(100)).max(50).optional().nullable(),
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
