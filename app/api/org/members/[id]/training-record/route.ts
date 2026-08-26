import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { assembleMemberRecord } from "@/lib/member-record";
import { renderTrainingRecordPdf } from "@/lib/pdf/training-record-document";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export const dynamic = "force-dynamic";

/** Export one member's training record as a dated PDF. Staff-only, audited. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: viewer } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .maybeSingle();
  if (!viewer?.org_id) return NextResponse.json({ error: "No organisation" }, { status: 404 });
  if (!["admin", "manager", "super_admin"].includes(viewer.role ?? "user")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const record = await assembleMemberRecord(viewer.org_id, id);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: org } = await supabaseAdmin
    .from("organisations")
    .select("name")
    .eq("id", viewer.org_id)
    .single();

  await logAudit({
    orgId: viewer.org_id,
    userId: user.id,
    action: AUDIT_ACTIONS.MEMBER_RECORD_EXPORTED,
    metadata: { member_id: record.member.id, member_email: record.member.email },
  });

  const pdf = await renderTrainingRecordPdf({
    generated_at: new Date().toISOString(),
    organisation: org?.name ?? "Organisation",
    member: {
      name: record.member.name,
      email: record.member.email,
      job_title: record.member.job_title,
      department: record.member.department,
    },
    stats: record.stats,
    maturity: record.maturity,
    training_needs: record.training_needs
      ? {
          needs: record.training_needs.needs,
          submitted_at: record.training_needs.submitted_at,
        }
      : null,
    timeline: record.timeline.map((t) => ({
      cohort_title: t.cohort?.title ?? "Cohort",
      course_title: t.cohort?.course?.title ?? null,
      facilitator: t.cohort?.facilitator ?? null,
      status: t.status,
      starts_on: t.cohort?.starts_on ?? null,
      ends_on: t.cohort?.ends_on ?? null,
      sessions: t.sessions.map((s) => ({ title: s.title, attendance: s.attendance })),
      grades: t.grades,
      certificate: t.certificate,
    })),
  });

  const filename = `training-record-${record.member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
