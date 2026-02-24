import { z } from "zod";

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
