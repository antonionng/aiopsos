import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendTrialEndingEmail } from "@/lib/email";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Tell org admins when a trial is inside its last three days, and once more
 * the day it ends.
 *
 * Daily, and idempotent: each phase is recorded on the audit log so a second
 * run the same week does not send again. Without CRON_SECRET the route
 * refuses to run.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }

  const provided =
    req.headers.get("authorization")?.replace(/^Bearer /i, "") ??
    req.headers.get("x-cron-secret");

  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const soon = new Date(now + 3 * DAY).toISOString();
  const justEnded = new Date(now - DAY).toISOString();

  const { data: orgs, error } = await supabaseAdmin
    .from("organisations")
    .select("id, name, trial_ends_at")
    .eq("subscription_status", "trialing")
    .not("trial_ends_at", "is", null)
    .lte("trial_ends_at", soon)
    .gte("trial_ends_at", justEnded);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;

  for (const org of orgs ?? []) {
    if (!org.trial_ends_at) continue;
    const ended = new Date(org.trial_ends_at).getTime() <= now;
    const phase = ended ? "ended" : "ending";

    const { data: prior } = await supabaseAdmin
      .from("audit_logs")
      .select("id")
      .eq("org_id", org.id)
      .eq("action", AUDIT_ACTIONS.TRIAL_ENDING_NOTIFIED)
      .contains("metadata", { phase })
      .limit(1);

    if (prior && prior.length > 0) continue;

    const { data: admins } = await supabaseAdmin
      .from("user_profiles")
      .select("email, name")
      .eq("org_id", org.id)
      .in("role", ["admin", "manager", "super_admin"]);

    const recipients = (admins ?? []).filter((admin) => admin.email);
    if (recipients.length === 0) continue;

    await Promise.allSettled(
      recipients.map((admin) =>
        sendTrialEndingEmail(admin.email, org.name, org.trial_ends_at as string, ended)
      )
    );

    await logAudit({
      orgId: org.id,
      userId: null,
      action: AUDIT_ACTIONS.TRIAL_ENDING_NOTIFIED,
      metadata: { phase, trial_ends_at: org.trial_ends_at },
    });
    sent += recipients.length;
  }

  return NextResponse.json({ orgs: orgs?.length ?? 0, sent });
}
