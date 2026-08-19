import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActor } from "@/lib/cohorts";
import { logAuditBatch, AUDIT_ACTIONS } from "@/lib/audit";
import { enrolSchema, validateBody } from "@/lib/validations";
import { sendCohortEnrolmentEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

interface EnrolOutcome {
  email: string;
  status: "enrolled" | "already_enrolled" | "no_account" | "full" | "error";
  detail?: string;
}

/** Pull an email column out of a pasted CSV, header row or not. */
function emailsFromCsv(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const headerIndex = headers.findIndex((h) => h.includes("email"));
  const hasHeader = headerIndex >= 0;
  const emailCol = hasHeader ? headerIndex : 0;

  const rows = hasHeader ? lines.slice(1) : lines;
  const seen = new Set<string>();
  const emails: string[] = [];

  for (const row of rows) {
    const value = (row.split(",")[emailCol] ?? "").trim().toLowerCase();
    if (!value || !value.includes("@") || seen.has(value)) continue;
    seen.add(value);
    emails.push(value);
  }

  return emails;
}

/**
 * Enrol people onto a cohort, by JSON list or CSV upload.
 *
 * Enrolment does not create accounts. A participant always belongs to an
 * organisation, so an address with no profile is reported back as
 * `no_account` rather than being quietly signed up - the buyer decides who
 * gets a seat, and a silently created account would be an unpleasant
 * surprise in a regulated tenant.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let emails: string[] = [];
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    emails = emailsFromCsv(await file.text());
    if (emails.length === 0) {
      return NextResponse.json(
        { error: "No email addresses found in that file" },
        { status: 400 }
      );
    }
    if (emails.length > 500) emails = emails.slice(0, 500);
  } else {
    const validation = validateBody(enrolSchema, await req.json().catch(() => null));
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    emails = validation.data.emails.map((e) => e.toLowerCase());
  }

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select(
      "id, org_id, title, seat_limit, status, starts_on, timezone, courses:course_id(title)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: existing } = await supabase
    .from("enrolments")
    .select("id, user_id, status")
    .eq("cohort_id", id);

  const alreadyEnrolled = new Set(
    (existing ?? []).filter((e) => e.status !== "withdrawn").map((e) => e.user_id)
  );
  let seatsTaken = alreadyEnrolled.size;

  // Look up profiles by email. Service role because an admin enrolling a
  // colleague needs to resolve an address they may not otherwise be able to
  // read, and the result is filtered to their own org below.
  const { data: profiles } = await supabaseAdmin
    .from("user_profiles")
    .select("id, email, name, org_id, department_id")
    .in("email", emails);

  const byEmail = new Map(
    (profiles ?? []).map((p) => [String(p.email).toLowerCase(), p])
  );

  const outcomes: EnrolOutcome[] = [];
  const toInsert: {
    cohort_id: string;
    user_id: string;
    org_id: string;
    department_id: string | null;
  }[] = [];

  for (const email of emails) {
    const profile = byEmail.get(email);

    if (!profile || !profile.org_id) {
      outcomes.push({
        email,
        status: "no_account",
        detail: "No account with an organisation for this address.",
      });
      continue;
    }

    // An admin may only enrol people from their own organisation.
    if (actor.role !== "super_admin" && profile.org_id !== actor.orgId) {
      outcomes.push({
        email,
        status: "error",
        detail: "This person is not in your organisation.",
      });
      continue;
    }

    if (alreadyEnrolled.has(profile.id)) {
      outcomes.push({ email, status: "already_enrolled" });
      continue;
    }

    if (seatsTaken >= cohort.seat_limit) {
      outcomes.push({
        email,
        status: "full",
        detail: `This cohort is limited to ${cohort.seat_limit} seats.`,
      });
      continue;
    }

    toInsert.push({
      cohort_id: id,
      user_id: profile.id,
      org_id: profile.org_id,
      department_id: profile.department_id ?? null,
    });
    alreadyEnrolled.add(profile.id);
    seatsTaken++;
    outcomes.push({ email, status: "enrolled" });
  }

  if (toInsert.length > 0) {
    const { error } = await supabase.from("enrolments").insert(toInsert);
    if (error) {
      const status = error.code === "42501" ? 403 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    await logAuditBatch(
      toInsert.map((row) => ({
        orgId: row.org_id,
        userId: actor.userId,
        action: AUDIT_ACTIONS.ENROLMENT_CREATED,
        metadata: {
          cohort_id: id,
          cohort_title: cohort.title,
          enrolled_user_id: row.user_id,
        },
      }))
    );

    const course = cohort.courses as unknown as { title: string } | null;

    // Email failures must not undo an enrolment that has already been written.
    await Promise.allSettled(
      toInsert.map((row) => {
        const profile = (profiles ?? []).find((p) => p.id === row.user_id);
        if (!profile?.email) return Promise.resolve();
        return sendCohortEnrolmentEmail(String(profile.email), {
          recipientName: String(profile.name ?? ""),
          cohortTitle: cohort.title,
          courseTitle: course?.title ?? cohort.title,
          startsOn: cohort.starts_on,
          timezone: cohort.timezone,
        });
      })
    );
  }

  return NextResponse.json({
    enrolled: outcomes.filter((o) => o.status === "enrolled").length,
    seats_remaining: Math.max(0, cohort.seat_limit - seatsTaken),
    outcomes,
  });
}
