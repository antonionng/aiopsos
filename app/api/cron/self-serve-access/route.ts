import { NextRequest, NextResponse } from "next/server";
import { sendSelfServeAccessEnding } from "@/lib/email";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { ACCESS_MONTHS, accessEndsAt, accessReminderDue } from "@/lib/self-serve/entitlement";
import { getPublicSiteUrl } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  course_slug: string;
  email: string | null;
  buyer_name: string | null;
  access_token: string | null;
  paid_at: string | null;
  access_month_sent_at: string | null;
  access_week_sent_at: string | null;
  self_serve_progress:
    | { lessons: Record<string, { passed?: boolean }> | null; signed_at: string | null; signed_name: string | null }
    | { lessons: Record<string, { passed?: boolean }> | null; signed_at: string | null; signed_name: string | null }[]
    | null;
};

const COLUMN = { month: "access_month_sent_at", week: "access_week_sent_at" } as const;

/** Daily. Reminds unfinished learners a month and a week before their 12 months end. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  const provided =
    req.headers.get("authorization")?.replace(/^Bearer /i, "") ?? req.headers.get("x-cron-secret");
  if (provided !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const earliest = new Date(now);
  earliest.setUTCMonth(earliest.getUTCMonth() - ACCESS_MONTHS);
  const latest = new Date(earliest.getTime() + 31 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabaseAdmin
    .from("self_serve_purchases")
    .select(
      "id, course_slug, email, buyer_name, access_token, paid_at, access_month_sent_at, access_week_sent_at, self_serve_progress(lessons, signed_at, signed_name)"
    )
    .eq("status", "paid")
    .not("email", "is", null)
    .not("access_token", "is", null)
    .gt("paid_at", earliest.toISOString())
    .lte("paid_at", latest.toISOString())
    .is("access_week_sent_at", null)
    .limit(500);
  if (error) {
    console.error("[self-serve] access reminder query", error);
    return NextResponse.json({ error: "Could not read purchases" }, { status: 500 });
  }

  const base = getPublicSiteUrl().replace(/\/$/, "");
  let sent = 0;
  for (const row of (data ?? []) as Row[]) {
    const course = getSelfServeCourse(row.course_slug);
    if (!course?.lessons?.length || !row.email || !row.paid_at) continue;
    const progress = Array.isArray(row.self_serve_progress) ? row.self_serve_progress[0] : row.self_serve_progress;
    const kind = accessReminderDue({
      paidAt: row.paid_at,
      now,
      signed: Boolean(progress?.signed_at),
      sent: { month: Boolean(row.access_month_sent_at), week: Boolean(row.access_week_sent_at) },
    });
    if (!kind) continue;

    const { count } = await supabaseAdmin
      .from("self_serve_purchases")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .eq("course_slug", row.course_slug)
      .ilike("email", row.email.replace(/[\\%_]/g, (c) => `\\${c}`))
      .gt("paid_at", row.paid_at);
    if ((count ?? 0) > 0) continue;

    const passed = course.lessons.filter((lesson) => progress?.lessons?.[lesson.id]?.passed).length;
    const ends = accessEndsAt(row.paid_at);
    try {
      const delivered = await sendSelfServeAccessEnding({
        email: row.email,
        name: progress?.signed_name ?? row.buyer_name,
        courseTitle: course.title,
        endsOn: ends ? ends.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "",
        kind,
        passed,
        total: course.lessons.length,
        learnUrl: `${base}/learn/${course.slug}?access=${row.access_token}`,
        renewUrl: `${base}/learn/${course.slug}`,
        priceGbp: course.priceGbp,
      });
      if (!delivered) continue;
      await supabaseAdmin
        .from("self_serve_purchases")
        .update({
          [COLUMN[kind]]: now.toISOString(),
          ...(kind === "week" ? { access_month_sent_at: row.access_month_sent_at ?? now.toISOString() } : {}),
        })
        .eq("id", row.id);
      sent += 1;
    } catch (mailError) {
      console.error("[self-serve] access reminder mail", mailError);
    }
  }
  return NextResponse.json({ checked: data?.length ?? 0, sent });
}
