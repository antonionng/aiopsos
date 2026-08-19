import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { CERTIFICATE_REF_LENGTH } from "@/lib/constants";
import {
  evaluateCertificateEligibility,
  type CertificateEligibility,
} from "@/lib/certification";
import type { CertificateSnapshot } from "@/lib/types";

/**
 * Server-side cohort helpers.
 *
 * These read through the anon/SSR client on purpose, so row-level security is
 * the real access control rather than defence in depth behind a hand-rolled
 * check. In particular the facilitator's cross-organisation reach is enforced
 * in `021_cohorts.sql` and exercised here.
 */

/**
 * Crockford-style base32: no I, L, O or U, so a reference read aloud from a
 * printed certificate cannot be mistyped into a different valid one.
 */
const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * A short, non-guessable public certificate reference.
 *
 * 12 characters of a 32-symbol alphabet is 60 bits of entropy - far past
 * anything worth enumerating, while still being short enough to print and
 * read out. Uniqueness is guaranteed by the unique index, not by hope: the
 * caller retries on conflict.
 */
export function generateCertificateRef(): string {
  const bytes = randomBytes(CERTIFICATE_REF_LENGTH);
  let ref = "";
  for (let i = 0; i < CERTIFICATE_REF_LENGTH; i++) {
    ref += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return ref;
}

export interface EnrolmentAssessment {
  eligibility: CertificateEligibility;
  totalSessions: number;
  cohortId: string;
  orgId: string;
  userId: string;
}

/**
 * Attendance and grades for one enrolment, measured against its cohort's
 * thresholds. Used both to decide whether a certificate may be issued and to
 * show a participant where they stand.
 */
export async function assessEnrolment(
  enrolmentId: string
): Promise<EnrolmentAssessment | null> {
  const supabase = await createClient();

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id, cohort_id, org_id, user_id")
    .eq("id", enrolmentId)
    .maybeSingle();

  if (!enrolment) return null;

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, pass_attendance_pct, pass_grade_pct")
    .eq("id", enrolment.cohort_id)
    .maybeSingle();

  if (!cohort) return null;

  const [{ count: sessionCount }, { data: attendance }, { data: grades }] =
    await Promise.all([
      supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("cohort_id", enrolment.cohort_id),
      supabase.from("attendance").select("status").eq("enrolment_id", enrolmentId),
      supabase
        .from("grades")
        .select("score, max_score")
        .eq("enrolment_id", enrolmentId),
    ]);

  const totalSessions = sessionCount ?? 0;

  const eligibility = evaluateCertificateEligibility({
    totalSessions,
    attendance: attendance ?? [],
    grades: (grades ?? []).map((g) => ({
      score: Number(g.score),
      max_score: Number(g.max_score),
    })),
    passAttendancePct: Number(cohort.pass_attendance_pct),
    passGradePct: Number(cohort.pass_grade_pct),
  });

  return {
    eligibility,
    totalSessions,
    cohortId: enrolment.cohort_id,
    orgId: enrolment.org_id,
    userId: enrolment.user_id,
  };
}

/**
 * Freezes everything a certificate asserts, at the moment it is issued.
 *
 * Course titles, module lists and outcomes are all editable in the catalogue.
 * A certificate must keep saying what was actually delivered, so none of this
 * is looked up again at verification time.
 */
export async function buildCertificateSnapshot(
  enrolmentId: string,
  assessment: EnrolmentAssessment
): Promise<CertificateSnapshot | null> {
  const supabase = await createClient();

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id, cohort_id, user_id, user_profiles(name), organisations:org_id(name)")
    .eq("id", enrolmentId)
    .maybeSingle();

  if (!enrolment) return null;

  const { data: cohort } = await supabase
    .from("cohorts")
    .select(
      "id, title, delivery_mode, starts_on, ends_on, pass_attendance_pct, pass_grade_pct, course_id, facilitators:facilitator_id(display_name, credentials), courses:course_id(slug, title, level, learning_outcomes)"
    )
    .eq("id", enrolment.cohort_id)
    .maybeSingle();

  if (!cohort) return null;

  const { data: modules } = await supabase
    .from("course_modules")
    .select("position, title, outcomes")
    .eq("course_id", cohort.course_id)
    .order("position", { ascending: true });

  const course = cohort.courses as unknown as {
    slug: string;
    title: string;
    level: CertificateSnapshot["course_level"];
    learning_outcomes: string[];
  } | null;

  const facilitator = cohort.facilitators as unknown as {
    display_name: string;
    credentials: CertificateSnapshot["facilitator_credentials"];
  } | null;

  const profile = enrolment.user_profiles as unknown as { name: string } | null;
  const org = enrolment.organisations as unknown as { name: string } | null;

  return {
    participant_name: profile?.name ?? "",
    course_title: course?.title ?? "",
    course_level: course?.level ?? "practitioner",
    course_slug: course?.slug ?? "",
    cohort_title: cohort.title,
    delivery_mode: cohort.delivery_mode as CertificateSnapshot["delivery_mode"],
    starts_on: cohort.starts_on,
    ends_on: cohort.ends_on,
    facilitator_name: facilitator?.display_name ?? null,
    facilitator_credentials: facilitator?.credentials ?? [],
    modules: (modules ?? []).map((m) => ({
      position: Number(m.position),
      title: String(m.title),
      outcomes: Array.isArray(m.outcomes) ? (m.outcomes as string[]) : [],
    })),
    learning_outcomes: Array.isArray(course?.learning_outcomes)
      ? course.learning_outcomes
      : [],
    attendance_pct: assessment.eligibility.attendance_pct,
    grade_pct: assessment.eligibility.grade_pct,
    pass_attendance_pct: Number(cohort.pass_attendance_pct),
    pass_grade_pct: Number(cohort.pass_grade_pct),
    issued_by_org: org?.name ?? null,
  };
}

export interface Actor {
  userId: string;
  orgId: string | null;
  role: string;
  /** Set when this user has an active row in `facilitators`. */
  facilitatorId: string | null;
}

/**
 * The current user, their org, and whether they facilitate.
 *
 * Routes use this for shaping responses and for audit attribution. It is not
 * the access control - that lives in row-level security, so a route that
 * forgets a check still cannot read another organisation's register.
 */
export async function getActor(): Promise<Actor | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: facilitator }] = await Promise.all([
    supabase.from("user_profiles").select("org_id, role").eq("id", user.id).maybeSingle(),
    supabase.from("facilitators").select("id").eq("user_id", user.id).eq("active", true).maybeSingle(),
  ]);

  return {
    userId: user.id,
    orgId: profile?.org_id ?? null,
    role: profile?.role ?? "user",
    facilitatorId: facilitator?.id ?? null,
  };
}
