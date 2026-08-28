import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { tourProvisionSchema, validateBody } from "@/lib/validations";
import {
  assessmentLinkToken,
  normaliseCompanyName,
  suggestedSeatLimit,
} from "@/lib/tour-provisioning";
import { assessUrlForToken } from "@/lib/assessment-link";

export const dynamic = "force-dynamic";

/**
 * Provision one training day.
 *
 * A tour day is ONE cohort, owned by the delivering organisation, holding
 * delegates from several companies. Each attending company gets its own
 * organisation and its own QR link pointing at that cohort, because
 * lib/assess-claim.ts attaches a response - and a brand new profile - to the
 * *link's* org. That is what puts a delegate inside their own employer's
 * tenant by scanning a code, with no signup form to shepherd them through and
 * no company admin work on the morning of the course.
 *
 * Written as a super-admin route rather than reusing POST /api/cohorts
 * because that route hard-sets org_id to the caller's own organisation, and
 * here the cohort belongs to whoever is delivering, not to whoever is typing.
 *
 * Idempotent by company name: re-running a day matches existing
 * organisations instead of duplicating them, so a half-finished run can
 * simply be repeated.
 */

async function requireSuperAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, role, org_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin") return null;
  return profile;
}

interface CompanyOutcome {
  name: string;
  org_id: string | null;
  org_status: "created" | "matched_existing" | "error";
  token: string | null;
  assess_url: string | null;
  credits: number | null;
  detail?: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const validation = validateBody(
    tourProvisionSchema,
    await req.json().catch(() => null)
  );
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const input = validation.data;

  // The delivering org must exist: a cohort with a null org_id is
  // unmanageable (academy_can_manage_cohort returns false for it) and
  // unpayable, which is the trap 021 left behind when partner tenancy never
  // landed.
  const { data: deliveringOrg } = await supabaseAdmin
    .from("organisations")
    .select("id, name")
    .eq("id", input.delivering_org_id)
    .maybeSingle();

  if (!deliveringOrg) {
    return NextResponse.json(
      { error: "The delivering organisation does not exist" },
      { status: 400 }
    );
  }

  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("id, title")
    .eq("id", input.course_id)
    .maybeSingle();

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 400 });
  }

  // Seats are for the whole room. The column default is 12 and the enrol
  // route enforces the cap inside a loop, so an undersized limit seats part
  // of the room and then starts reporting "full".
  const seatLimit = input.seat_limit ?? suggestedSeatLimit(input.companies);

  const { data: cohort, error: cohortError } = await supabaseAdmin
    .from("cohorts")
    .insert({
      course_id: input.course_id,
      org_id: input.delivering_org_id,
      facilitator_id: input.facilitator_id ?? null,
      title: input.title,
      delivery_mode: input.delivery_mode,
      location: input.venue,
      timezone: input.timezone,
      seat_limit: seatLimit,
      starts_on: input.event_date,
      ends_on: input.ends_on ?? input.event_date,
      pass_attendance_pct: input.pass_attendance_pct,
      pass_grade_pct: input.pass_grade_pct,
      status: "scheduled",
    })
    .select("id, title, starts_on, ends_on, timezone, seat_limit")
    .single();

  if (cohortError || !cohort) {
    return NextResponse.json(
      { error: cohortError?.message ?? "Could not create the cohort" },
      { status: 500 }
    );
  }

  await logAudit({
    orgId: input.delivering_org_id,
    userId: admin.id,
    action: AUDIT_ACTIONS.COHORT_CREATED,
    metadata: {
      cohort_id: cohort.id,
      via: "tour_provisioning",
      venue: input.venue,
      companies: input.companies.length,
    },
  });

  // Match companies on a normalised name so "ACME Sdn. Bhd." and
  // "acme sdn bhd" resolve to one tenant. Deliberately not fuzzy beyond
  // punctuation and case: silently merging two real companies into one
  // tenant is far worse than creating a duplicate somebody can spot.
  const { data: existingOrgs } = await supabaseAdmin
    .from("organisations")
    .select("id, name");

  const byNormalisedName = new Map<string, string>();
  for (const org of existingOrgs ?? []) {
    byNormalisedName.set(normaliseCompanyName(String(org.name)), String(org.id));
  }

  const outcomes: CompanyOutcome[] = [];

  for (const company of input.companies) {
    const key = normaliseCompanyName(company.name);
    let orgId = byNormalisedName.get(key) ?? null;
    let orgStatus: CompanyOutcome["org_status"] = "matched_existing";

    if (!orgId) {
      const { data: created, error: orgError } = await supabaseAdmin
        .from("organisations")
        .insert({
          name: company.name,
          industry: company.industry ?? "",
        })
        .select("id")
        .single();

      if (orgError || !created) {
        outcomes.push({
          name: company.name,
          org_id: null,
          org_status: "error",
          token: null,
          assess_url: null,
          credits: null,
          detail: orgError?.message ?? "Could not create the organisation",
        });
        continue;
      }
      orgId = String(created.id);
      orgStatus = "created";
      byNormalisedName.set(key, orgId);
    }

    // The QR link. Readable on purpose - these get printed on registration
    // cards and read aloud in a room. token is unique, so a clash retries
    // with a suffix rather than handing two companies the same link.
    let token: string | null = null;
    let linkError: string | null = null;

    for (let attempt = 0; attempt < 4; attempt++) {
      const candidate = assessmentLinkToken(
        company.name,
        input.venue,
        input.event_date,
        attempt
      );
      const { error } = await supabaseAdmin.from("assessment_links").insert({
        org_id: orgId,
        created_by: admin.id,
        token: candidate,
        title: `${company.name} - ${input.title}`,
        description: `${input.venue}, ${input.event_date}`,
        template_id: input.template_id,
        cohort_id: cohort.id,
        active: true,
      });

      if (!error) {
        token = candidate;
        break;
      }
      if (error.code !== "23505") {
        linkError = error.message;
        break;
      }
    }

    // Seed a wallet so the room's AI usage is bounded and visible. Orgs with
    // no credit_wallets row fail OPEN on AI usage, so thirty fresh tenants
    // and three hundred delegates would otherwise be unmetered.
    let credits: number | null = null;
    if (input.starter_credits > 0) {
      const { data: balance, error: creditError } = await supabaseAdmin.rpc(
        "academy_apply_credit_delta",
        {
          p_org: orgId,
          p_delta: input.starter_credits,
          p_reason: "adjustment",
          p_description: `Tour starter credits - ${input.title}`,
          p_created_by: admin.id,
        }
      );
      if (!creditError) {
        credits = typeof balance === "number" ? balance : input.starter_credits;
        await logAudit({
          orgId,
          userId: admin.id,
          action: AUDIT_ACTIONS.CREDITS_ADJUSTED,
          metadata: {
            delta: input.starter_credits,
            reason: "tour_provisioning",
            cohort_id: cohort.id,
          },
        });
      }
    }

    outcomes.push({
      name: company.name,
      org_id: orgId,
      org_status: orgStatus,
      token,
      assess_url: token ? assessUrlForToken(token) : null,
      credits,
      detail: linkError ?? undefined,
    });
  }

  return NextResponse.json(
    {
      cohort: {
        id: cohort.id,
        title: cohort.title,
        starts_on: cohort.starts_on,
        ends_on: cohort.ends_on,
        timezone: cohort.timezone,
        seat_limit: cohort.seat_limit,
        course: course.title,
        delivering_org: deliveringOrg.name,
      },
      companies: outcomes,
    },
    { status: 201 }
  );
}
