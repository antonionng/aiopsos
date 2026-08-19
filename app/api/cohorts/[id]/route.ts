import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { logAudit, diffForAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { cohortUpdateSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

const COHORT_COLUMNS =
  "id, course_id, org_id, facilitator_id, title, delivery_mode, location, timezone, seat_limit, starts_on, ends_on, status, price_amount, currency, paid_at, pass_attendance_pct, pass_grade_pct, created_at";

/** One cohort with its sessions and register. RLS decides visibility. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select(
      `${COHORT_COLUMNS}, courses:course_id(slug, title, level, duration_hours), facilitators:facilitator_id(id, display_name, bio, credentials)`
    )
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: sessions }, { data: enrolments }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, module_id, position, title, starts_at, ends_at, join_url")
      .eq("cohort_id", id)
      .order("position", { ascending: true }),
    supabase
      .from("enrolments")
      .select(
        "id, user_id, org_id, department_id, status, enrolled_at, completed_at, user_profiles(name, email, avatar_url), departments(name)"
      )
      .eq("cohort_id", id),
  ]);

  const participants = (enrolments ?? [])
    .map((e) => {
      const profile = e.user_profiles as unknown as {
        name: string;
        email: string;
        avatar_url: string | null;
      } | null;
      const department = e.departments as unknown as { name: string } | null;
      return {
        enrolment_id: e.id,
        user_id: e.user_id,
        name: profile?.name ?? "Unknown",
        email: profile?.email ?? "",
        avatar_url: profile?.avatar_url ?? null,
        department: department?.name ?? null,
        status: e.status,
        enrolled_at: e.enrolled_at,
        completed_at: e.completed_at,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(
    {
      cohort,
      sessions: sessions ?? [],
      participants,
      can_grade:
        actor.role === "super_admin" ||
        actor.role === "admin" ||
        actor.role === "manager" ||
        (!!actor.facilitatorId && cohort.facilitator_id === actor.facilitatorId),
      can_manage:
        actor.role === "super_admin" ||
        ((actor.role === "admin" || actor.role === "manager") &&
          cohort.org_id === actor.orgId),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const validation = validateBody(cohortUpdateSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("cohorts")
    .select(COHORT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const patch = Object.fromEntries(
    Object.entries(validation.data).filter(([, v]) => v !== undefined)
  );

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ cohort: before });
  }

  const { data: after, error } = await supabase
    .from("cohorts")
    .update(patch)
    .eq("id", id)
    .select(COHORT_COLUMNS)
    .single();

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  // Record what actually moved, not the whole row - an auditor reading this
  // wants the change, and the previous value is the point of the record.
  const diff = diffForAudit(
    before as Record<string, unknown>,
    after as Record<string, unknown>
  );

  if (diff.changed.length > 0 && after.org_id) {
    await logAudit({
      orgId: after.org_id,
      userId: actor.userId,
      action:
        after.status === "cancelled" && before.status !== "cancelled"
          ? AUDIT_ACTIONS.COHORT_CANCELLED
          : AUDIT_ACTIONS.COHORT_UPDATED,
      metadata: {
        cohort_id: id,
        changed: diff.changed,
        previous: diff.previous,
        next: diff.next,
      },
    });
  }

  return NextResponse.json({ cohort: after });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, org_id, title, status")
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // A cohort that has run is a training record. Deleting it would destroy
  // evidence, so it is cancelled instead and the rows stay.
  const { count } = await supabase
    .from("attendance")
    .select("id", { count: "exact", head: true })
    .in(
      "enrolment_id",
      (
        await supabase.from("enrolments").select("id").eq("cohort_id", id)
      ).data?.map((e) => e.id) ?? ["00000000-0000-0000-0000-000000000000"]
    );

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      {
        error:
          "This cohort has attendance recorded against it and cannot be deleted. Set its status to cancelled instead.",
      },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("cohorts").delete().eq("id", id);
  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  if (cohort.org_id) {
    await logAudit({
      orgId: cohort.org_id,
      userId: actor.userId,
      action: AUDIT_ACTIONS.COHORT_CANCELLED,
      metadata: { cohort_id: id, title: cohort.title, deleted: true },
    });
  }

  return NextResponse.json({ ok: true });
}
