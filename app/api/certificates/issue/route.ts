import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  assessEnrolment,
  buildCertificateSnapshot,
  generateCertificateRef,
  getActor,
} from "@/lib/cohorts";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { certificateIssueSchema, validateBody } from "@/lib/validations";
import { sendCertificateIssuedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Issue a certificate.
 *
 * Both thresholds must be met - the attendance floor and the pass grade - and
 * the route refuses with the specific reasons rather than a generic error, so
 * whoever is running the cohort can see what is missing. The certificate
 * freezes a snapshot of the course as delivered, because the catalogue is
 * editable and a certificate must keep saying what actually happened.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const validation = validateBody(certificateIssueSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { enrolment_id } = validation.data;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("certificates")
    .select("id, public_ref, issued_at, revoked_at")
    .eq("enrolment_id", enrolment_id)
    .maybeSingle();

  if (existing && !existing.revoked_at) {
    return NextResponse.json(
      { error: "A certificate has already been issued for this enrolment", certificate: existing },
      { status: 409 }
    );
  }

  const assessment = await assessEnrolment(enrolment_id);
  if (!assessment) {
    return NextResponse.json({ error: "Enrolment not found" }, { status: 404 });
  }

  if (!assessment.eligibility.eligible) {
    return NextResponse.json(
      {
        error: "This participant has not met the requirements for a certificate",
        reasons: assessment.eligibility.reasons,
        attendance_pct: assessment.eligibility.attendance_pct,
        grade_pct: assessment.eligibility.grade_pct,
      },
      { status: 409 }
    );
  }

  const snapshot = await buildCertificateSnapshot(enrolment_id, assessment);
  if (!snapshot) {
    return NextResponse.json(
      { error: "Could not assemble the certificate record" },
      { status: 500 }
    );
  }

  // Uniqueness comes from the index, not from hoping. Retry on collision.
  let certificate = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 5 && !certificate; attempt++) {
    const { data, error } = await supabase
      .from("certificates")
      .upsert(
        {
          enrolment_id,
          public_ref: generateCertificateRef(),
          issued_at: new Date().toISOString(),
          revoked_at: null,
          snapshot,
        },
        { onConflict: "enrolment_id" }
      )
      .select("id, enrolment_id, public_ref, issued_at, revoked_at")
      .single();

    if (data) {
      certificate = data;
      break;
    }

    lastError = error?.message ?? null;
    // 23505 is a unique violation: only the public_ref can collide here, so
    // retry with a fresh one. Anything else is a real failure.
    if (error && error.code !== "23505") {
      const status = error.code === "42501" ? 403 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
  }

  if (!certificate) {
    return NextResponse.json(
      { error: lastError ?? "Could not issue a certificate" },
      { status: 500 }
    );
  }

  await supabase
    .from("enrolments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", enrolment_id);

  await logAudit({
    orgId: assessment.orgId,
    userId: actor.userId,
    action: AUDIT_ACTIONS.CERTIFICATE_ISSUED,
    metadata: {
      certificate_id: certificate.id,
      enrolment_id,
      cohort_id: assessment.cohortId,
      public_ref: certificate.public_ref,
      attendance_pct: assessment.eligibility.attendance_pct,
      grade_pct: assessment.eligibility.grade_pct,
    },
  });

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("email, name")
    .eq("id", assessment.userId)
    .maybeSingle();

  if (profile?.email) {
    await sendCertificateIssuedEmail(String(profile.email), {
      recipientName: String(profile.name ?? ""),
      courseTitle: snapshot.course_title,
      attendancePct: snapshot.attendance_pct,
      gradePct: snapshot.grade_pct,
      publicRef: certificate.public_ref,
    });
  }

  return NextResponse.json({ certificate }, { status: 201 });
}
