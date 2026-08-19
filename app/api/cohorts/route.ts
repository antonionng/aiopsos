import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { cohortCreateSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

const COHORT_COLUMNS =
  "id, course_id, org_id, facilitator_id, title, delivery_mode, location, timezone, seat_limit, starts_on, ends_on, status, price_amount, currency, paid_at, pass_attendance_pct, pass_grade_pct, created_at";

/**
 * Cohorts this user can see. Row-level security decides that: their own
 * organisation's cohorts, plus any cohort they facilitate, which may belong
 * to a different organisation entirely.
 */
export async function GET(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const scope = req.nextUrl.searchParams.get("scope");

  let query = supabase
    .from("cohorts")
    .select(
      `${COHORT_COLUMNS}, courses:course_id(slug, title, level), facilitators:facilitator_id(display_name)`
    )
    .order("starts_on", { ascending: false, nullsFirst: false });

  // "facilitating" is the trainer's own view across every client org.
  if (scope === "facilitating") {
    if (!actor.facilitatorId) {
      return NextResponse.json({ cohorts: [] }, { headers: { "Cache-Control": "no-store" } });
    }
    query = query.eq("facilitator_id", actor.facilitatorId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const cohorts = data ?? [];

  // Seats taken, so a scheduler can see capacity without a second request.
  const counts = new Map<string, number>();
  if (cohorts.length > 0) {
    const { data: enrolments } = await supabase
      .from("enrolments")
      .select("cohort_id, status")
      .in("cohort_id", cohorts.map((c) => c.id));

    for (const e of enrolments ?? []) {
      if (e.status === "withdrawn") continue;
      counts.set(e.cohort_id, (counts.get(e.cohort_id) ?? 0) + 1);
    }
  }

  return NextResponse.json(
    {
      cohorts: cohorts.map((c) => ({ ...c, enrolled_count: counts.get(c.id) ?? 0 })),
      can_facilitate: !!actor.facilitatorId,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Participants always belong to an organisation, so a cohort must too.
  // Open cohorts without an org or partner context are out of scope for this
  // iteration; migration 023 relaxes this for partner-run cohorts.
  if (!actor.orgId) {
    return NextResponse.json(
      { error: "You must belong to an organisation to create a cohort" },
      { status: 403 }
    );
  }

  const validation = validateBody(cohortCreateSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data;

  if (input.starts_on && input.ends_on && input.ends_on < input.starts_on) {
    return NextResponse.json(
      { error: "A cohort cannot end before it starts" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cohorts")
    .insert({
      course_id: input.course_id,
      org_id: actor.orgId,
      facilitator_id: input.facilitator_id ?? null,
      title: input.title,
      delivery_mode: input.delivery_mode,
      location: input.location ?? null,
      timezone: input.timezone,
      seat_limit: input.seat_limit,
      starts_on: input.starts_on ?? null,
      ends_on: input.ends_on ?? null,
      price_amount: input.price_amount ?? null,
      currency: input.currency,
      pass_attendance_pct: input.pass_attendance_pct,
      pass_grade_pct: input.pass_grade_pct,
    })
    .select(COHORT_COLUMNS)
    .single();

  // RLS rejects a non-admin here rather than the route doing its own check.
  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  await logAudit({
    orgId: actor.orgId,
    userId: actor.userId,
    action: AUDIT_ACTIONS.COHORT_CREATED,
    metadata: {
      cohort_id: data.id,
      course_id: data.course_id,
      title: data.title,
      delivery_mode: data.delivery_mode,
      seat_limit: data.seat_limit,
    },
  });

  return NextResponse.json({ cohort: data }, { status: 201 });
}
