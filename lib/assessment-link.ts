import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Resolve the share link that belongs to an assessment.
 *
 * `assessment_links` has no `assessment_id`: a link carries an org and a
 * template, and lib/assess-claim.ts joins a response to an assessment at
 * claim time by matching (org_id, status='active', template_id). Three
 * call sites used to reimplement "find a link for this org" as
 *
 *     .eq("org_id", orgId).eq("active", true).limit(1).single()
 *
 * with no template filter at all, so an org running both instruments could
 * send a training-needs invite to a link serving the maturity questions -
 * and, if no link existed yet, mint one with the default 'org-wide'
 * template regardless of the assessment it was created for. The template
 * is the instrument, so matching on it is the whole job.
 */

export interface ResolvedAssessmentLink {
  id: string;
  token: string;
  templateId: string;
}

/** 8 hex characters, matching the tokens the invite route has always minted. */
function newToken(): string {
  return crypto.randomUUID().slice(0, 8);
}

/**
 * Find - or create - the active link serving this assessment's instrument.
 *
 * Returns null only when the assessment itself cannot be read, which the
 * callers already treat as a 404.
 */
export async function resolveAssessmentLink(
  assessmentId: string,
  createdBy: string
): Promise<ResolvedAssessmentLink | null> {
  const { data: assessment } = await supabaseAdmin
    .from("assessments")
    .select("id, org_id, title, template_id")
    .eq("id", assessmentId)
    .maybeSingle();

  if (!assessment) return null;

  const templateId: string = assessment.template_id ?? "org-wide";

  const { data: existing } = await supabaseAdmin
    .from("assessment_links")
    .select("id, token, template_id")
    .eq("org_id", assessment.org_id)
    .eq("template_id", templateId)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return {
      id: existing.id,
      token: existing.token,
      templateId: existing.template_id ?? templateId,
    };
  }

  // `token` is unique, so a collision is a 23505 rather than a silent
  // overwrite. Two retries is plenty for 8 hex characters, and failing
  // loudly beats handing out someone else's link.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: created, error } = await supabaseAdmin
      .from("assessment_links")
      .insert({
        org_id: assessment.org_id,
        created_by: createdBy,
        token: newToken(),
        title: assessment.title,
        template_id: templateId,
      })
      .select("id, token, template_id")
      .single();

    if (created) {
      return {
        id: created.id,
        token: created.token,
        templateId: created.template_id ?? templateId,
      };
    }
    if (error?.code !== "23505") return null;
  }

  return null;
}

/** The public URL a respondent opens. */
export function assessUrlForToken(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/assess/${token}`;
}
