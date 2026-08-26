import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assembleMemberRecord } from "@/lib/member-record";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * One member's full training record for the staff profile page. Staff-only
 * and audit-logged - viewing a personnel record is itself a record. No
 * per-person AI usage appears here by design.
 */
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

  await logAudit({
    orgId: viewer.org_id,
    userId: user.id,
    action: AUDIT_ACTIONS.MEMBER_RECORD_VIEWED,
    metadata: { member_id: record.member.id, member_email: record.member.email },
  });

  return NextResponse.json(record, { headers: { "Cache-Control": "no-store" } });
}
