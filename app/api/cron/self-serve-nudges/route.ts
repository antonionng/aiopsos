import { NextRequest, NextResponse } from "next/server";
import { sendSelfServeNudge } from "@/lib/email";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { chooseSelfServeNudge, type SelfServeNudgeKind } from "@/lib/self-serve/nudges";
import { getPublicSiteUrl } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SENT_COLUMN: Record<SelfServeNudgeKind, string> = {
  start: "nudge_start_sent_at",
  continue: "nudge_continue_sent_at",
  sign: "nudge_sign_sent_at",
};

type ProgressJoin = {
  lessons: Record<string, { passed?: boolean }> | null;
  signed_at: string | null;
  updated_at: string | null;
};

type PurchaseJoin = {
  id: string;
  course_slug: string;
  email: string | null;
  access_token: string | null;
  paid_at: string | null;
  nudge_start_sent_at: string | null;
  nudge_continue_sent_at: string | null;
  nudge_sign_sent_at: string | null;
  self_serve_progress: ProgressJoin | ProgressJoin[] | null;
};

/**
 * One encouragement note per unfinished point.
 * A day after payment with no check passed, three days after the last check
 * if the course is unfinished, and a day after the last check if the card
 * is still unsigned. Each note is sent once.
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

  const { data, error } = await supabaseAdmin
    .from("self_serve_purchases")
    .select(
      "id, course_slug, email, access_token, paid_at, nudge_start_sent_at, nudge_continue_sent_at, nudge_sign_sent_at, self_serve_progress(lessons, signed_at, updated_at)"
    )
    .eq("status", "paid")
    .not("email", "is", null)
    .order("paid_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("[self-serve] nudge query", error);
    return NextResponse.json({ error: "Could not read purchases" }, { status: 500 });
  }

  const now = Date.now();
  const base = getPublicSiteUrl().replace(/\/$/, "");
  let sent = 0;

  for (const row of (data ?? []) as PurchaseJoin[]) {
    if (!row.email || !row.access_token || !row.paid_at) continue;
    const course = getSelfServeCourse(row.course_slug);
    if (!course?.lessons?.length) continue;
    const lessons = course.lessons;

    const progress = Array.isArray(row.self_serve_progress)
      ? row.self_serve_progress[0]
      : row.self_serve_progress;
    const passedIds = lessons
      .filter((lesson) => progress?.lessons?.[lesson.id]?.passed === true)
      .map((lesson) => lesson.id);
    const kind = chooseSelfServeNudge({
      now,
      paidAt: row.paid_at,
      lessonIds: lessons.map((lesson) => lesson.id),
      passedIds,
      signed: Boolean(progress?.signed_at),
      progressUpdatedAt: progress?.updated_at ?? null,
      sent: {
        start: Boolean(row.nudge_start_sent_at),
        continue: Boolean(row.nudge_continue_sent_at),
        sign: Boolean(row.nudge_sign_sent_at),
      },
    });
    if (!kind) continue;

    const learnUrl = `${base}/learn/${row.course_slug}?access=${row.access_token}`;
    try {
      const delivered = await sendSelfServeNudge({
        email: row.email,
        kind,
        courseTitle: course.title,
        learnUrl,
        passed: passedIds.length,
        total: lessons.length,
      });
      if (!delivered) continue;
      const { error: markError } = await supabaseAdmin
        .from("self_serve_purchases")
        .update({ [SENT_COLUMN[kind]]: new Date(now).toISOString() })
        .eq("id", row.id)
        .is(SENT_COLUMN[kind], null);
      if (markError) {
        console.error("[self-serve] nudge mark", markError);
        continue;
      }
      sent += 1;
    } catch (mailError) {
      console.error("[self-serve] nudge mail", mailError);
    }
  }

  return NextResponse.json({ checked: data?.length ?? 0, sent });
}
