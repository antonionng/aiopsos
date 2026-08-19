import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { logAuditBatch, AUDIT_ACTIONS } from "@/lib/audit";
import { attendanceBulkSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

/** The register for one session. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("id, cohort_id, position, title, starts_at, ends_at")
    .eq("id", id)
    .maybeSingle();

  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: enrolments }, { data: attendance }] = await Promise.all([
    supabase
      .from("enrolments")
      .select("id, user_id, status, user_profiles(name, email, avatar_url)")
      .eq("cohort_id", session.cohort_id)
      .neq("status", "withdrawn"),
    supabase
      .from("attendance")
      .select("enrolment_id, status, minutes_attended, recorded_at")
      .eq("session_id", id),
  ]);

  const byEnrolment = new Map(
    (attendance ?? []).map((a) => [a.enrolment_id, a])
  );

  const register = (enrolments ?? [])
    .map((e) => {
      const profile = e.user_profiles as unknown as {
        name: string;
        email: string;
        avatar_url: string | null;
      } | null;
      const record = byEnrolment.get(e.id);
      return {
        enrolment_id: e.id,
        name: profile?.name ?? "Unknown",
        email: profile?.email ?? "",
        avatar_url: profile?.avatar_url ?? null,
        // Null means "not yet marked", which is not the same as absent.
        status: record?.status ?? null,
        minutes_attended: record?.minutes_attended ?? 0,
        recorded_at: record?.recorded_at ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(
    { session, register },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Record or amend the register, in bulk.
 *
 * Marks made after the session has ended are audited separately and carry the
 * previous value, because a register edited days later is precisely what an
 * auditor reviewing a funded training claim looks for. Marks made during the
 * session are ordinary.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const validation = validateBody(attendanceBulkSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { records } = validation.data;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("id, cohort_id, title, ends_at")
    .eq("id", id)
    .maybeSingle();

  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const enrolmentIds = records.map((r) => r.enrolment_id);

  // Confirm every enrolment belongs to this cohort before writing anything.
  const { data: enrolments } = await supabase
    .from("enrolments")
    .select("id, org_id")
    .eq("cohort_id", session.cohort_id)
    .in("id", enrolmentIds);

  const validEnrolments = new Map((enrolments ?? []).map((e) => [e.id, e.org_id]));
  const stray = enrolmentIds.filter((eid) => !validEnrolments.has(eid));
  if (stray.length > 0) {
    return NextResponse.json(
      { error: "Some enrolments do not belong to this cohort" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("attendance")
    .select("enrolment_id, status, minutes_attended")
    .eq("session_id", id)
    .in("enrolment_id", enrolmentIds);

  const before = new Map((existing ?? []).map((a) => [a.enrolment_id, a]));

  const { data: written, error } = await supabase
    .from("attendance")
    .upsert(
      records.map((r) => ({
        session_id: id,
        enrolment_id: r.enrolment_id,
        status: r.status,
        minutes_attended: r.minutes_attended,
        recorded_by: actor.userId,
        recorded_at: new Date().toISOString(),
      })),
      { onConflict: "session_id,enrolment_id" }
    )
    .select("enrolment_id, status, minutes_attended, recorded_at");

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  const sessionHasEnded = new Date(session.ends_at) < new Date();

  await logAuditBatch(
    records
      .map((r) => {
        const orgId = validEnrolments.get(r.enrolment_id);
        if (!orgId) return null;

        const prior = before.get(r.enrolment_id);
        const changed = !prior || prior.status !== r.status;

        // A first mark during the session is routine; anything after the
        // session ended, or any change to an existing mark, is an amendment.
        const isAmendment = sessionHasEnded || (!!prior && changed);
        if (!changed && !isAmendment) return null;

        return {
          orgId,
          userId: actor.userId,
          action: isAmendment
            ? AUDIT_ACTIONS.ATTENDANCE_AMENDED
            : AUDIT_ACTIONS.ATTENDANCE_RECORDED,
          metadata: {
            session_id: id,
            session_title: session.title,
            enrolment_id: r.enrolment_id,
            previous: prior
              ? { status: prior.status, minutes_attended: prior.minutes_attended }
              : null,
            next: { status: r.status, minutes_attended: r.minutes_attended },
            after_session_ended: sessionHasEnded,
          },
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  );

  return NextResponse.json({ attendance: written ?? [] });
}
