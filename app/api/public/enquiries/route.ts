import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { courseEnquirySchema, validateBody } from "@/lib/validations";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { sendEnquiryEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Someone asking to be taught a course.
 *
 * Open to anonymous visitors on purpose - the whole point is to catch the
 * person who has just been told which course they need and would otherwise
 * leave. Rate limited on the same budget as the public assessment submit,
 * because an unauthenticated write is an unauthenticated write.
 *
 * If the caller happens to be signed in, their org and user are attached so
 * the enquiry shows up for their own admins as well as for us.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`enquiry:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const validation = validateBody(courseEnquirySchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data;
  const supabase = await createClient();

  // Resolve the course from its slug rather than trusting an id from the
  // client, and only ever match a published one.
  let courseId: string | null = null;
  let courseTitle: string | null = null;
  if (input.course_slug) {
    const { data: course } = await supabase
      .from("courses")
      .select("id, title")
      .eq("slug", input.course_slug)
      .eq("status", "published")
      .maybeSingle();
    courseId = course?.id ?? null;
    courseTitle = course?.title ?? null;
  }

  // Attach the org only if this person is genuinely signed in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let orgId: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id")
      .eq("id", user.id)
      .maybeSingle();
    orgId = profile?.org_id ?? null;
  }

  // No .select() on this insert. Returning the inserted row requires a read
  // policy, and anon deliberately has none - an enquiry holds a name, an
  // email and an organisation. Asking for the row back would mean opening
  // reads to everyone, which is exactly the thing to avoid.
  const { error } = await supabase
    .from("course_enquiries")
    .insert({
      course_id: courseId,
      org_id: orgId,
      created_by: user?.id ?? null,
      name: input.name,
      email: input.email,
      organisation_name: input.organisation_name,
      message: input.message,
      seats: input.seats ?? null,
      source: input.source,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // A failed email must not fail the enquiry - the row is already saved, and
  // losing the notification is recoverable where losing the lead is not.
  await sendEnquiryEmails({
    name: input.name,
    email: input.email,
    organisationName: input.organisation_name,
    message: input.message,
    seats: input.seats ?? null,
    courseTitle,
    courseSlug: input.course_slug ?? null,
    source: input.source,
  }).catch((err) => console.error("Enquiry emails failed:", err));

  // Deliberately returns nothing about the row beyond acknowledgement.
  return NextResponse.json({ ok: true }, { status: 201 });
}
