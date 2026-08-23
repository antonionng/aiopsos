import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Attach a completed public assessment to a signed-in (or just-created) user.
 *
 * This is the piece the signup route used to do inline, extracted so it can
 * also run *after* signup: when the email already exists, when a 500
 * interrupted the original attempt, or when the respondent was signed in all
 * along. It is written to be safely retryable, because the failure mode it
 * replaces was exactly a non-retryable half-claim - an auth user existed,
 * the pending response didn't get attached, and the retry hit "account
 * already exists" with the results lost for good.
 *
 * Idempotency latch: `claimed_by` is set first with a conditional update
 * (`claimed_by IS NULL OR claimed_by = user`). A retry passes the latch and
 * re-runs the inserts, each of which checks for its own prior success.
 *
 * Org rules: the response always attaches to the *link's* organisation - it
 * is that org's assessment. The user's own profile only gains the link's
 * org when they have none; an existing member of a different organisation is
 * never silently moved.
 */

export interface ClaimInput {
  userId: string;
  userEmail: string;
  userName: string;
  /** From assessment_links. */
  linkOrgId: string;
  sessionToken: string;
  /** Department type slug chosen at signup; optional on later claims. */
  department?: string | null;
}

export interface ClaimResult {
  ok: boolean;
  /** True when there was nothing to claim (bad/expired token, someone else's). */
  notFound?: boolean;
  error?: string;
}

const DEPARTMENT_LABELS: Record<string, string> = {
  engineering: "Engineering", sales: "Sales", operations: "Operations",
  leadership: "Leadership", marketing: "Marketing", legal: "Legal & Compliance",
  hr: "Human Resources", finance: "Finance", product: "Product", support: "Support",
};

export async function claimPendingResponse(input: ClaimInput): Promise<ClaimResult> {
  const { userId, userEmail, userName, linkOrgId, sessionToken, department } = input;

  // 1. The latch. Conditional update means two racing claims cannot both
  //    win, and a retry by the same user sails through.
  const { data: pending, error: latchError } = await supabaseAdmin
    .from("pending_responses")
    .update({ claimed_by: userId, claimed_at: new Date().toISOString() })
    .eq("session_token", sessionToken)
    .or(`claimed_by.is.null,claimed_by.eq.${userId}`)
    .select("*")
    .maybeSingle();

  if (latchError) return { ok: false, error: latchError.message };
  if (!pending) return { ok: false, notFound: true };

  // 2. Department: find or create within the link's org.
  let departmentId: string | null = null;
  if (department) {
    const { data: existing } = await supabaseAdmin
      .from("departments")
      .select("id")
      .eq("org_id", linkOrgId)
      .eq("type", department)
      .limit(1)
      .maybeSingle();

    if (existing) {
      departmentId = existing.id;
    } else {
      const { data: created } = await supabaseAdmin
        .from("departments")
        .insert({
          org_id: linkOrgId,
          name: DEPARTMENT_LABELS[department] || department,
          type: department,
        })
        .select("id")
        .maybeSingle();
      departmentId = created?.id ?? null;
    }
  }

  // 3. Profile: create if missing; adopt the link's org only when the user
  //    has none. Never move an existing member of another organisation.
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, department_id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
      id: userId,
      org_id: linkOrgId,
      department_id: departmentId,
      email: userEmail,
      name: userName,
      role: "user",
    });
    if (profileError) return { ok: false, error: profileError.message };
  } else if (!profile.org_id) {
    await supabaseAdmin
      .from("user_profiles")
      .update({ org_id: linkOrgId, department_id: departmentId ?? profile.department_id })
      .eq("id", userId);
  }

  // 4. The org's active assessment, created if none exists.
  let assessmentId: string;
  const { data: existingAssessment } = await supabaseAdmin
    .from("assessments")
    .select("id")
    .eq("org_id", linkOrgId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingAssessment) {
    assessmentId = existingAssessment.id;
  } else {
    const { data: created, error: assessmentError } = await supabaseAdmin
      .from("assessments")
      .insert({
        org_id: linkOrgId,
        created_by: userId,
        title: "AI Readiness Assessment",
        status: "active",
      })
      .select("id")
      .single();
    if (assessmentError || !created) {
      return { ok: false, error: assessmentError?.message ?? "Could not create assessment" };
    }
    assessmentId = created.id;
  }

  // 5. The response itself, guarded for retries: one response per user per
  //    assessment through this path. (Retakes go through the authenticated
  //    flow, which writes directly.)
  const { data: existingResponse } = await supabaseAdmin
    .from("assessment_responses")
    .select("id")
    .eq("assessment_id", assessmentId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!existingResponse) {
    const { error: responseError } = await supabaseAdmin.from("assessment_responses").insert({
      assessment_id: assessmentId,
      user_id: userId,
      ...(departmentId ? { department_id: departmentId } : {}),
      confidence_score: pending.confidence_score,
      practice_score: pending.practice_score,
      tools_score: pending.tools_score,
      responsible_score: pending.responsible_score,
      culture_score: pending.culture_score,
      respondent_role: pending.respondent_role,
      tools_used: pending.tools_used,
      raw_answers: pending.raw_answers,
    });
    if (responseError) return { ok: false, error: responseError.message };
  }

  return { ok: true };
}
