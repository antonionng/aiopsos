import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendSessionReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Send the 24-hour reminder for every session starting tomorrow.
 *
 * Runs on a schedule (Vercel Cron or any external scheduler) and is
 * idempotent within its window: the window is a fixed 23-to-25 hour band
 * ahead of "now", so an hourly run picks each session up roughly twice. To
 * make that safe, reminders are deduplicated per session per participant
 * against `audit_logs`-free state below - see `alreadyReminded`.
 *
 * Authorisation is a shared secret in a header rather than a user session,
 * because there is no user. Without CRON_SECRET set the route refuses to run
 * at all, so an unconfigured deployment cannot be used to blast email.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 503 }
    );
  }

  const provided =
    req.headers.get("authorization")?.replace(/^Bearer /i, "") ??
    req.headers.get("x-cron-secret");

  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = new Date(now + 23 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now + 25 * 60 * 60 * 1000).toISOString();

  const { data: sessions } = await supabaseAdmin
    .from("sessions")
    .select(
      "id, cohort_id, title, starts_at, join_url, cohorts:cohort_id(title, timezone, location, status)"
    )
    .gte("starts_at", windowStart)
    .lte("starts_at", windowEnd);

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ sessions: 0, reminders: 0 });
  }

  let reminders = 0;

  for (const session of sessions) {
    const cohort = session.cohorts as unknown as {
      title: string;
      timezone: string;
      location: string | null;
      status: string;
    } | null;

    // Nobody needs a reminder for a cohort that was called off.
    if (cohort?.status === "cancelled") continue;

    const { data: enrolments } = await supabaseAdmin
      .from("enrolments")
      .select("id, user_profiles(name, email)")
      .eq("cohort_id", session.cohort_id)
      .in("status", ["invited", "enrolled"]);

    if (!enrolments || enrolments.length === 0) continue;

    // Dedupe: one reminder per session per enrolment, tracked in a small
    // table so a scheduler that fires twice does not email twice.
    const { data: alreadyReminded } = await supabaseAdmin
      .from("session_reminders")
      .select("enrolment_id")
      .eq("session_id", session.id);

    const sent = new Set((alreadyReminded ?? []).map((r) => r.enrolment_id));

    const toSend = enrolments.filter((e) => !sent.has(e.id));
    if (toSend.length === 0) continue;

    const results = await Promise.allSettled(
      toSend.map((enrolment) => {
        const profile = enrolment.user_profiles as unknown as {
          name: string;
          email: string;
        } | null;
        if (!profile?.email) return Promise.resolve();

        return sendSessionReminderEmail(profile.email, {
          recipientName: profile.name ?? "",
          sessionTitle: session.title,
          cohortTitle: cohort?.title ?? "",
          startsAt: session.starts_at,
          timezone: cohort?.timezone ?? "Europe/London",
          location: cohort?.location ?? null,
          joinUrl: session.join_url,
        });
      })
    );

    const delivered = toSend.filter((_, i) => results[i].status === "fulfilled");
    reminders += delivered.length;

    if (delivered.length > 0) {
      await supabaseAdmin.from("session_reminders").insert(
        delivered.map((e) => ({ session_id: session.id, enrolment_id: e.id }))
      );
    }
  }

  return NextResponse.json({ sessions: sessions.length, reminders });
}
