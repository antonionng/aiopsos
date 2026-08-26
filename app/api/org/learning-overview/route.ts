import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * The numbers behind the Overview learning charts, in one round trip:
 * the enrolment funnel, twelve weeks of training activity, and measured
 * training need by department. Staff-only - this is org-wide reporting.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.org_id) return NextResponse.json({ error: "No organisation" }, { status: 404 });
  if (!["admin", "manager", "super_admin"].includes(profile.role ?? "user")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const orgId = profile.org_id;

  const [{ data: enrolments }, { data: members }, { data: departments }] = await Promise.all([
    supabaseAdmin
      .from("enrolments")
      .select("id, user_id, status, enrolled_at, cohort_id")
      .eq("org_id", orgId),
    supabaseAdmin.from("user_profiles").select("id, department_id").eq("org_id", orgId),
    supabaseAdmin.from("departments").select("id, name").eq("org_id", orgId),
  ]);

  const enrIds = (enrolments ?? []).map((e) => e.id);
  const [{ data: att }, { data: grades }, { data: subs }, { data: certs }] = enrIds.length
    ? await Promise.all([
        supabaseAdmin.from("attendance").select("enrolment_id, status, recorded_at").in("enrolment_id", enrIds),
        supabaseAdmin.from("grades").select("enrolment_id, graded_at").in("enrolment_id", enrIds),
        supabaseAdmin.from("submissions").select("enrolment_id").in("enrolment_id", enrIds),
        supabaseAdmin.from("certificates").select("enrolment_id, issued_at, revoked_at").in("enrolment_id", enrIds),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  // ── funnel: how far each enrolment travelled ──
  const attended = new Set(
    (att ?? []).filter((a) => a.status === "present" || a.status === "late").map((a) => a.enrolment_id)
  );
  const submitted = new Set((subs ?? []).map((s) => s.enrolment_id));
  const graded = new Set((grades ?? []).map((g) => g.enrolment_id));
  const certified = new Set(
    (certs ?? []).filter((c) => !c.revoked_at).map((c) => c.enrolment_id)
  );

  const funnel = [
    { stage: "Enrolled", count: (enrolments ?? []).length },
    { stage: "Attended", count: attended.size },
    { stage: "Submitted work", count: submitted.size },
    { stage: "Graded", count: graded.size },
    { stage: "Certified", count: certified.size },
  ];

  // ── activity: last 12 ISO-ish weeks (bucketed by 7 days from now) ──
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const end = new Date(Date.now() - i * 7 * 86400000);
    const start = new Date(end.getTime() - 7 * 86400000);
    return { start, end, label: `${end.getDate()}/${end.getMonth() + 1}` };
  }).reverse();

  const inWeek = (iso: string | null, w: { start: Date; end: Date }) => {
    if (!iso) return false;
    const t = new Date(iso).getTime();
    return t >= w.start.getTime() && t < w.end.getTime();
  };

  const activity = weeks.map((w) => ({
    week: w.label,
    enrolments: (enrolments ?? []).filter((e) => inWeek(e.enrolled_at, w)).length,
    sessions_attended: (att ?? []).filter(
      (a) => (a.status === "present" || a.status === "late") && inWeek(a.recorded_at, w)
    ).length,
    certificates: (certs ?? []).filter((c) => !c.revoked_at && inWeek(c.issued_at, w)).length,
  }));

  // ── training need by department (latest TNA per person) ──
  const { data: tnaRows } = await supabaseAdmin
    .from("assessment_responses")
    .select("user_id, department_id, dimension_scores, submitted_at, assessments!inner(org_id)")
    .eq("assessments.org_id", orgId)
    .eq("template_id", "training-needs")
    .order("submitted_at", { ascending: false });

  const latestByUser = new Map<string, Record<string, number>>();
  const deptOfRow = new Map<string, string | null>();
  for (const r of tnaRows ?? []) {
    if (!latestByUser.has(r.user_id)) {
      latestByUser.set(r.user_id, (r.dimension_scores as Record<string, number>) ?? {});
      deptOfRow.set(r.user_id, r.department_id);
    }
  }
  const deptName = new Map((departments ?? []).map((d) => [d.id, d.name]));
  const needAgg = new Map<string, { name: string; rows: Record<string, number>[] }>();
  for (const [userId, scores] of latestByUser) {
    const deptId = deptOfRow.get(userId);
    const name = (deptId && deptName.get(deptId)) || "No department";
    const entry = needAgg.get(name) ?? { name, rows: [] as Record<string, number>[] };
    entry.rows.push(scores);
    needAgg.set(name, entry);
  }
  const needsByDepartment = Array.from(needAgg.values())
    .map(({ name, rows }) => {
      const avg = (key: string) => {
        const vals = rows.map((r) => Number(r[key])).filter(Number.isFinite);
        return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : 0;
      };
      return {
        department: name,
        respondents: rows.length,
        ai: avg("ai"),
        technology: avg("technology"),
        robotics: avg("robotics"),
      };
    })
    .sort((a, b) => b.ai + b.technology + b.robotics - (a.ai + a.technology + a.robotics));

  return NextResponse.json(
    {
      headcount: (members ?? []).length,
      people_in_training: new Set((enrolments ?? []).map((e) => e.user_id)).size,
      funnel,
      activity,
      needsByDepartment,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
