import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { renderCertificatePdf } from "@/lib/pdf/certificate-document";
import type { CertificateSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Same shape the public verification route accepts: Crockford base32, no I/L/O/U. */
const REF_PATTERN = /^[0-9A-HJKMNP-TV-Z]{12}$/;

/**
 * The certificate as a PDF.
 *
 * Authenticated, unlike /verify/<ref>. The two do different jobs: the public
 * page is a check somebody runs against a reference they were given, and
 * returns a deliberately minimal projection. This returns the full document,
 * including the participant's employer and their attendance and grade, so it
 * is limited to the people who may already read the enrolment.
 *
 * That limit is enforced by reading the row through the caller's own session:
 * `academy_can_read_enrolment` covers the participant themselves, the
 * cohort's graders, and admins of the enrolment's OWN organisation. In a
 * cohort holding several companies, that last clause is exactly what stops
 * one company's admin pulling another company's certificates, so the check
 * belongs there rather than being restated here.
 *
 * Delegates who want to show an employer download it and send it on, which
 * is the same thing they would do with a paper certificate.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;

  if (!REF_PATTERN.test(ref)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: certificate } = await supabase
    .from("certificates")
    .select("id, public_ref, issued_at, revoked_at, snapshot")
    .eq("public_ref", ref)
    .maybeSingle();

  // RLS filters rather than raises, so "not yours" and "no such certificate"
  // arrive here identically - and should stay indistinguishable to a caller
  // who might otherwise probe for valid references.
  if (!certificate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // A withdrawn certificate must not keep circulating as a clean PDF. The
  // verification page is the honest, current answer and it keeps resolving,
  // saying plainly that the certificate was withdrawn.
  if (certificate.revoked_at) {
    return NextResponse.json(
      {
        error: "This certificate has been withdrawn",
        verify_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/verify/${ref}`,
      },
      { status: 409 }
    );
  }

  const snapshot = certificate.snapshot as unknown as CertificateSnapshot | null;
  if (!snapshot?.participant_name) {
    return NextResponse.json(
      { error: "This certificate has no stored record to render" },
      { status: 409 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const buffer = await renderCertificatePdf(snapshot, {
    publicRef: String(certificate.public_ref),
    issuedAt: String(certificate.issued_at),
    verifyUrl: `${baseUrl}/verify/${certificate.public_ref}`,
  });

  const who = snapshot.participant_name
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const filename = `certificate-${who || "participant"}-${certificate.public_ref}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
