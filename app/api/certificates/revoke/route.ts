import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Revoke a certificate.
 *
 * The row is kept and stamped, never deleted: a verification URL that has
 * been shared with an employer must keep resolving and say plainly that the
 * certificate was withdrawn. Silently 404ing would look like a broken link
 * rather than a revocation.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const certificateId = typeof body?.certificate_id === "string" ? body.certificate_id : null;
  const reason = typeof body?.reason === "string" ? body.reason.slice(0, 500) : "";

  if (!certificateId) {
    return NextResponse.json({ error: "certificate_id is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: certificate } = await supabase
    .from("certificates")
    .select("id, enrolment_id, public_ref, revoked_at")
    .eq("id", certificateId)
    .maybeSingle();

  if (!certificate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (certificate.revoked_at) {
    return NextResponse.json({ error: "Already revoked" }, { status: 409 });
  }

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id, org_id, cohort_id")
    .eq("id", certificate.enrolment_id)
    .maybeSingle();

  const { data: updated, error } = await supabase
    .from("certificates")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", certificateId)
    .select("id, public_ref, issued_at, revoked_at")
    .single();

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  if (enrolment?.org_id) {
    await logAudit({
      orgId: enrolment.org_id,
      userId: actor.userId,
      action: AUDIT_ACTIONS.CERTIFICATE_REVOKED,
      metadata: {
        certificate_id: certificateId,
        enrolment_id: certificate.enrolment_id,
        cohort_id: enrolment.cohort_id,
        public_ref: certificate.public_ref,
        reason,
      },
    });
  }

  return NextResponse.json({ certificate: updated });
}
