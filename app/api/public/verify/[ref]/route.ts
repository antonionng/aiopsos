import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import type { CertificateSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Public certificate verification.
 *
 * A third party checks a certificate without an account, so this reads with
 * the service role and returns a fixed, minimal projection: what was
 * completed, when, by whom it was facilitated, and the attendance and grade
 * against the thresholds that applied. No email address, no department, no
 * identifiers that would let someone walk the rest of the tenancy.
 *
 * Everything comes from the frozen snapshot rather than the live catalogue,
 * so editing a course never changes what an issued certificate asserts.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`verify:${ip}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const { ref } = await params;

  // References are 12 characters of Crockford base32. Reject anything else
  // before it reaches the database.
  if (!/^[0-9A-HJKMNP-TV-Z]{12}$/.test(ref.toUpperCase())) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data } = await supabaseAdmin
    .from("certificates")
    .select("public_ref, issued_at, revoked_at, snapshot")
    .eq("public_ref", ref.toUpperCase())
    .maybeSingle();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const snapshot = (data.snapshot ?? {}) as Partial<CertificateSnapshot>;

  return NextResponse.json(
    {
      public_ref: data.public_ref,
      issued_at: data.issued_at,
      revoked: !!data.revoked_at,
      revoked_at: data.revoked_at,
      participant_name: snapshot.participant_name ?? "",
      course_title: snapshot.course_title ?? "",
      course_level: snapshot.course_level ?? null,
      cohort_title: snapshot.cohort_title ?? "",
      delivery_mode: snapshot.delivery_mode ?? null,
      starts_on: snapshot.starts_on ?? null,
      ends_on: snapshot.ends_on ?? null,
      facilitator_name: snapshot.facilitator_name ?? null,
      facilitator_credentials: snapshot.facilitator_credentials ?? [],
      attendance_pct: snapshot.attendance_pct ?? null,
      grade_pct: snapshot.grade_pct ?? null,
      pass_attendance_pct: snapshot.pass_attendance_pct ?? null,
      pass_grade_pct: snapshot.pass_grade_pct ?? null,
      issued_by_org: snapshot.issued_by_org ?? null,
      modules: snapshot.modules ?? [],
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
