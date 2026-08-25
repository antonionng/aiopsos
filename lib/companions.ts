import { tool, type ToolSet } from "ai";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fetchPublishedCourses, fetchCourseBySlug } from "@/lib/courses";
import { rankCourses } from "@/lib/recommendation-engine";
import { MIN_ACTIVE_USERS_FOR_REPORTING } from "@/lib/practice-delta";
import {
  DIMENSIONS,
  RESPONDENT_ROLES,
  type Dimension,
  type RespondentRole,
} from "@/lib/constants";
import type { UserRole } from "@/lib/role-helpers";
import {
  COMPANION_META,
  canSelectModel,
  type CompanionId,
} from "@/lib/companion-meta";

/**
 * The three role-based companions.
 *
 * Privacy is enforced STRUCTURALLY, not by prompt: a companion's toolset
 * contains only what its audience may see. The learning companion's tools
 * are keyed to the signed-in user's id inside the executor - the model has
 * no identity parameter to abuse. The insights companion can fetch an
 * individual's TRAINING record (attendance, grades, certificates - the
 * employer's own records) but no per-user AI-usage tool exists at all;
 * usage is aggregate-only behind the 5-person floor.
 *
 * None of the companions grade work, mark attendance, or declare anyone
 * passed - a facilitator does that, and the prompts say so.
 */

export type { CompanionId };

export interface CompanionContext {
  userId: string;
  orgId: string;
  role: UserRole;
}

export interface CompanionDef {
  id: CompanionId;
  label: string;
  description: string;
  allowedRoles: readonly UserRole[];
  defaultModel: string;
  /** Whether this audience may pick a model (brief §7.3: learners may not). */
  allowModelSelect: (role: UserRole) => boolean;
  systemPrompt: (ctx: CompanionContext) => string;
  tools: (ctx: CompanionContext) => ToolSet;
}

const NEVER_CLAIM =
  "Never state or imply that the platform, a course or a certificate makes an organisation compliant with any law or regulation. The claim is always that documented, role-proportionate measures were taken and records exist to evidence them. " +
  "You never grade work, never mark attendance, and never tell anyone they have passed or failed - a live facilitator does that. If asked, explain who does and where to see recorded results.";

// ── shared data helpers ─────────────────────────────────────────────────

async function fetchMyEnrolments(userId: string, orgId: string) {
  const { data } = await supabaseAdmin
    .from("enrolments")
    .select(
      "id, status, enrolled_at, completed_at, cohorts(id, title, status, starts_on, ends_on, delivery_mode, courses(title, slug, category))"
    )
    .eq("user_id", userId)
    .eq("org_id", orgId)
    .order("enrolled_at", { ascending: false });
  return data ?? [];
}

function scoresFromResponse(row: Record<string, unknown>): Record<Dimension, number> {
  return {
    confidence: Number(row.confidence_score) || 0,
    practice: Number(row.practice_score) || 0,
    tools: Number(row.tools_score) || 0,
    responsible: Number(row.responsible_score) || 0,
    culture: Number(row.culture_score) || 0,
  };
}

// ── learning companion tools (everyone; self only) ──────────────────────

function learningTools(ctx: CompanionContext): ToolSet {
  return {
    getMyProgress: tool({
      description:
        "The signed-in learner's own enrolments: which cohorts, their status, attendance so far and grades released to them.",
      inputSchema: z.object({}),
      execute: async () => {
        const enrolments = await fetchMyEnrolments(ctx.userId, ctx.orgId);
        if (enrolments.length === 0) return { enrolments: [] };

        const ids = enrolments.map((e) => e.id);
        const [{ data: att }, { data: grades }] = await Promise.all([
          supabaseAdmin
            .from("attendance")
            .select("enrolment_id, status")
            .in("enrolment_id", ids),
          supabaseAdmin
            .from("grades")
            .select("enrolment_id, score, max_score, feedback, graded_at")
            .in("enrolment_id", ids),
        ]);

        return {
          enrolments: enrolments.map((e) => ({
            cohort: e.cohorts,
            status: e.status,
            enrolled_at: e.enrolled_at,
            attendance: (att ?? []).filter((a) => a.enrolment_id === e.id),
            grades: (grades ?? []).filter((g) => g.enrolment_id === e.id),
          })),
        };
      },
    }),

    getMyCertificates: tool({
      description:
        "Certificates issued to the signed-in learner, with their public verification references.",
      inputSchema: z.object({}),
      execute: async () => {
        const enrolments = await fetchMyEnrolments(ctx.userId, ctx.orgId);
        if (enrolments.length === 0) return { certificates: [] };
        const { data } = await supabaseAdmin
          .from("certificates")
          .select("public_ref, issued_at, revoked_at, enrolment_id")
          .in("enrolment_id", enrolments.map((e) => e.id));
        return {
          certificates: (data ?? []).map((c) => ({
            public_ref: c.public_ref,
            issued_at: c.issued_at,
            revoked: !!c.revoked_at,
            verify_url: `/verify/${c.public_ref}`,
            cohort: enrolments.find((e) => e.id === c.enrolment_id)?.cohorts ?? null,
          })),
        };
      },
    }),

    getRecommendedCourses: tool({
      description:
        "Courses recommended for the signed-in learner from their latest assessment scores. Use when asked what to learn next.",
      inputSchema: z.object({}),
      execute: async () => {
        const { data: response } = await supabaseAdmin
          .from("assessment_responses")
          .select(
            "confidence_score, practice_score, tools_score, responsible_score, culture_score, respondent_role, submitted_at"
          )
          .eq("user_id", ctx.userId)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!response) {
          return {
            assessment: null,
            note: "No assessment on record. Suggest taking the readiness assessment first - recommendations come from measured gaps, not guesses.",
          };
        }

        const scores = scoresFromResponse(response);
        const role = (RESPONDENT_ROLES as readonly string[]).includes(
          response.respondent_role as string
        )
          ? (response.respondent_role as RespondentRole)
          : "individual_contributor";
        const catalogue = await fetchPublishedCourses();
        const matches = rankCourses(scores, role, catalogue).slice(0, 5);
        return {
          assessment: { scores, taken_at: response.submitted_at },
          recommendations: matches.map((m) => ({
            slug: m.course.slug,
            title: m.course.title,
            summary: m.course.summary,
            level: m.course.level,
            category: m.course.category,
            matched_dimensions: m.matched_dimensions,
          })),
        };
      },
    }),

    getCourseInfo: tool({
      description: "Details of one published course by slug: outline, modules, outcomes, delivery.",
      inputSchema: z.object({ slug: z.string().max(200) }),
      execute: async ({ slug }) => {
        const result = await fetchCourseBySlug(slug);
        if (!result) return { found: false };
        const { course, modules } = result;
        return {
          found: true,
          course: {
            title: course.title,
            summary: course.summary,
            level: course.level,
            category: course.category,
            duration_hours: course.duration_hours,
            delivery_modes: course.delivery_modes,
            learning_outcomes: course.learning_outcomes,
          },
          modules: modules.map((m) => ({
            position: m.position,
            title: m.title,
            summary: m.summary,
            duration_hours: m.duration_hours,
          })),
        };
      },
    }),
  };
}

// ── staff aggregate tools (L&D + insights) ──────────────────────────────

function staffAggregateTools(ctx: CompanionContext): ToolSet {
  return {
    getCohortProgress: tool({
      description:
        "This organisation's training cohorts with enrolment counts, attendance rates and completion status.",
      inputSchema: z.object({}),
      execute: async () => {
        const { data: cohorts } = await supabaseAdmin
          .from("cohorts")
          .select("id, title, status, starts_on, ends_on, delivery_mode, seat_limit, courses(title, slug)")
          .eq("org_id", ctx.orgId)
          .order("starts_on", { ascending: false })
          .limit(20);
        if (!cohorts || cohorts.length === 0) return { cohorts: [] };

        const ids = cohorts.map((c) => c.id);
        const [{ data: enr }, { data: att }] = await Promise.all([
          supabaseAdmin.from("enrolments").select("id, cohort_id, status").in("cohort_id", ids),
          supabaseAdmin
            .from("attendance")
            .select("status, enrolments!inner(cohort_id)")
            .in("enrolments.cohort_id", ids),
        ]);

        return {
          cohorts: cohorts.map((c) => {
            const rows = (enr ?? []).filter((e) => e.cohort_id === c.id);
            const attRows = (att ?? []).filter(
              (a) => (a.enrolments as unknown as { cohort_id: string })?.cohort_id === c.id
            );
            const counted = attRows.length;
            const present = attRows.filter((a) => a.status === "present" || a.status === "late").length;
            return {
              title: c.title,
              course: c.courses,
              status: c.status,
              starts_on: c.starts_on,
              ends_on: c.ends_on,
              enrolled: rows.filter((e) => e.status === "enrolled" || e.status === "completed").length,
              completed: rows.filter((e) => e.status === "completed").length,
              seat_limit: c.seat_limit,
              attendance_rate_pct: counted > 0 ? Math.round((present / counted) * 100) : null,
            };
          }),
        };
      },
    }),

    getAssessmentAggregate: tool({
      description:
        "Assessment scores aggregated by department for this organisation. Departments with fewer than 5 respondents are suppressed for privacy.",
      inputSchema: z.object({}),
      execute: async () => {
        const { data: responses } = await supabaseAdmin
          .from("assessment_responses")
          .select(
            "department_id, confidence_score, practice_score, tools_score, responsible_score, culture_score, departments(name), assessments!inner(org_id)"
          )
          .eq("assessments.org_id", ctx.orgId);

        const byDept = new Map<string, { name: string; rows: Record<Dimension, number>[] }>();
        for (const r of responses ?? []) {
          const key = r.department_id ?? "none";
          const name =
            (r.departments as unknown as { name: string } | null)?.name ?? "No department";
          const entry = byDept.get(key) ?? { name, rows: [] };
          entry.rows.push(scoresFromResponse(r));
          byDept.set(key, entry);
        }

        const departments = [];
        let suppressed = 0;
        for (const { name, rows } of byDept.values()) {
          if (rows.length < MIN_ACTIVE_USERS_FOR_REPORTING) {
            suppressed += 1;
            continue;
          }
          const avg = {} as Record<Dimension, number>;
          for (const d of DIMENSIONS) {
            avg[d] = Number((rows.reduce((s, r) => s + r[d], 0) / rows.length).toFixed(2));
          }
          departments.push({ department: name, respondents: rows.length, averages: avg });
        }

        return {
          total_responses: (responses ?? []).length,
          departments,
          suppressed_departments: suppressed,
          note: `Departments with fewer than ${MIN_ACTIVE_USERS_FOR_REPORTING} respondents are not shown individually.`,
        };
      },
    }),

    getTeamOverview: tool({
      description:
        "Departments in this organisation with headcount and how many people are enrolled in or have completed training.",
      inputSchema: z.object({}),
      execute: async () => {
        const [{ data: depts }, { data: members }, { data: enr }] = await Promise.all([
          supabaseAdmin.from("departments").select("id, name").eq("org_id", ctx.orgId),
          supabaseAdmin.from("user_profiles").select("id, department_id").eq("org_id", ctx.orgId),
          supabaseAdmin.from("enrolments").select("user_id, status").eq("org_id", ctx.orgId),
        ]);

        const enrolledUsers = new Set((enr ?? []).map((e) => e.user_id));
        const completedUsers = new Set(
          (enr ?? []).filter((e) => e.status === "completed").map((e) => e.user_id)
        );

        return {
          org_headcount: (members ?? []).length,
          enrolled_people: enrolledUsers.size,
          completed_people: completedUsers.size,
          departments: (depts ?? []).map((d) => {
            const ids = (members ?? []).filter((m) => m.department_id === d.id).map((m) => m.id);
            return {
              name: d.name,
              headcount: ids.length,
              in_training: ids.filter((id) => enrolledUsers.has(id)).length,
              completed: ids.filter((id) => completedUsers.has(id)).length,
            };
          }),
        };
      },
    }),
  };
}

// ── insights-only tools ─────────────────────────────────────────────────

function insightsTools(ctx: CompanionContext): ToolSet {
  return {
    ...staffAggregateTools(ctx),

    getMemberTrainingRecord: tool({
      description:
        "One organisation member's TRAINING record: enrolments, attendance, released grades and certificates. These are the employer's own training records. This tool cannot return AI-usage data - that exists only in aggregate.",
      inputSchema: z.object({
        query: z
          .string()
          .min(2)
          .max(200)
          .describe("The member's name or email address"),
      }),
      execute: async ({ query }) => {
        // Org scoping happens here, in code the model cannot influence: the
        // lookup itself is filtered to the caller's organisation.
        const { data: members } = await supabaseAdmin
          .from("user_profiles")
          .select("id, name, email, department_id")
          .eq("org_id", ctx.orgId)
          .or(`name.ilike.%${query.replaceAll(",", "")}%,email.ilike.%${query.replaceAll(",", "")}%`)
          .limit(5);

        if (!members || members.length === 0) return { found: false, matches: [] };
        if (members.length > 1) {
          return {
            found: false,
            matches: members.map((m) => ({ name: m.name, email: m.email })),
            note: "Multiple matches - ask which person is meant.",
          };
        }

        const member = members[0];
        const enrolments = await fetchMyEnrolments(member.id, ctx.orgId);
        const ids = enrolments.map((e) => e.id);
        const [{ data: att }, { data: grades }, { data: certs }] = ids.length
          ? await Promise.all([
              supabaseAdmin.from("attendance").select("enrolment_id, status").in("enrolment_id", ids),
              supabaseAdmin
                .from("grades")
                .select("enrolment_id, score, max_score, graded_at")
                .in("enrolment_id", ids),
              supabaseAdmin
                .from("certificates")
                .select("enrolment_id, public_ref, issued_at, revoked_at")
                .in("enrolment_id", ids),
            ])
          : [{ data: [] }, { data: [] }, { data: [] }];

        return {
          found: true,
          member: { name: member.name, email: member.email },
          enrolments: enrolments.map((e) => ({
            cohort: e.cohorts,
            status: e.status,
            attendance: (att ?? []).filter((a) => a.enrolment_id === e.id),
            grades: (grades ?? []).filter((g) => g.enrolment_id === e.id),
            certificate:
              (certs ?? [])
                .filter((c) => c.enrolment_id === e.id)
                .map((c) => ({ public_ref: c.public_ref, issued_at: c.issued_at, revoked: !!c.revoked_at }))[0] ??
              null,
          })),
        };
      },
    }),

    getUsageSummary: tool({
      description:
        "AI usage for this organisation, aggregated by department over the last 30 days. Departments with fewer than 5 active users are suppressed; per-person usage is not available to anyone.",
      inputSchema: z.object({}),
      execute: async () => {
        const since = new Date(Date.now() - 30 * 86400000).toISOString();
        const { data: logs } = await supabaseAdmin
          .from("usage_logs")
          .select("department_id, user_id, created_at, departments(name)")
          .eq("org_id", ctx.orgId)
          .gte("created_at", since);

        const byDept = new Map<string, { name: string; users: Set<string>; requests: number }>();
        for (const l of logs ?? []) {
          const key = l.department_id ?? "none";
          const name =
            (l.departments as unknown as { name: string } | null)?.name ?? "No department";
          const entry = byDept.get(key) ?? { name, users: new Set<string>(), requests: 0 };
          entry.users.add(l.user_id);
          entry.requests += 1;
          byDept.set(key, entry);
        }

        const departments = [];
        let suppressed = 0;
        for (const { name, users, requests } of byDept.values()) {
          if (users.size < MIN_ACTIVE_USERS_FOR_REPORTING) {
            suppressed += 1;
            continue;
          }
          departments.push({ department: name, active_users: users.size, requests });
        }

        return {
          period_days: 30,
          total_requests: (logs ?? []).length,
          active_users: new Set((logs ?? []).map((l) => l.user_id)).size,
          departments,
          suppressed_departments: suppressed,
        };
      },
    }),
  };
}

// ── the registry ────────────────────────────────────────────────────────

export const COMPANIONS: Record<CompanionId, CompanionDef> = {
  learning: {
    ...COMPANION_META.learning,
    allowModelSelect: canSelectModel,
    systemPrompt: () =>
      "You are the Experrt learning companion. You support one learner on their training: their enrolments, attendance, grades already released to them, certificates, and which courses fit their assessment results. " +
      "Every course is delivered live by a facilitator - you support that learning between sessions, you never replace it. Encourage questions to the facilitator for anything about course content judgement. " +
      "Use your tools for any question about the learner's own record rather than guessing. Be warm, specific and brief. " +
      NEVER_CLAIM,
    tools: learningTools,
  },
  ld: {
    ...COMPANION_META.ld,
    allowModelSelect: canSelectModel,
    systemPrompt: () =>
      "You are the Experrt L&D companion, supporting the people who run training programmes. You can report cohort progress, attendance rates, assessment aggregates by department, and training coverage. " +
      "Aggregates suppress departments below the privacy floor; say so when it happens rather than inventing numbers. " +
      "Help the user decide who to train next and how to evidence what has been done. " +
      NEVER_CLAIM,
    tools: staffAggregateTools,
  },
  insights: {
    ...COMPANION_META.insights,
    allowModelSelect: canSelectModel,
    systemPrompt: () =>
      "You are the Experrt insights companion for owners and managers. You can look up an individual member's training record - enrolments, attendance, released grades, certificates - because those are the employer's own training records. " +
      "AI-usage data is different: it exists only as department-level aggregates behind a privacy floor, and you have no tool that returns one person's usage. If asked how a named individual uses AI, decline and explain why: usage is reported in aggregate so that people can use the tools without being individually watched, which is what makes honest adoption data possible. " +
      NEVER_CLAIM,
    tools: insightsTools,
  },
};

/** 403-shaped resolution: unknown id or disallowed role returns null. */
export function resolveCompanion(
  id: string | undefined,
  role: UserRole
): CompanionDef | null {
  const def = COMPANIONS[(id ?? "learning") as CompanionId];
  if (!def) return null;
  return def.allowedRoles.includes(role) ? def : null;
}
