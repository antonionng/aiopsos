import { NextResponse } from "next/server";
import {
  learningActor,
  learningErrorResponse,
  LearningError,
} from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getMyLearning } from "@/lib/my-learning-server";
import type { TranscriptRecord } from "@/lib/lms/transcript";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const actor = await learningActor();
    const [native, liveResponse] = await Promise.all([
      supabaseAdmin
        .from("lms_assignments")
        .select("id,completed_at,programme:lms_programmes(title,status)")
        .eq("user_id", actor.userId)
        .eq("org_id", actor.orgId)
        .order("created_at", { ascending: false }),
      getMyLearning(),
    ]);
    if (native.error || !liveResponse.ok)
      throw new LearningError(
        "Could not load your complete transcript. Please retry.",
        503,
      );
    const live = await liveResponse.json();
    const records: TranscriptRecord[] = (native.data || []).map((r) => {
      const p = r.programme as unknown as { title: string; status: string };
      return {
        id: r.id,
        kind: "programme",
        title: p.title,
        status: r.completed_at
          ? "completed"
          : p.status === "archived"
            ? "archived"
            : "in progress",
        completed_at: r.completed_at,
        href: `/dashboard/learn/${r.id}`,
        certificate: null,
        attendance_pct: null,
        grade_pct: null,
      };
    });
    for (const r of live.enrolments || []) {
      records.push({
        id: r.enrolment_id,
        kind: "live",
        title: r.cohort?.title || "Live training",
        status: r.status,
        completed_at: r.completed_at || null,
        href: "/dashboard/my-learning",
        certificate: r.certificate,
        attendance_pct: r.progress?.attendance_pct ?? null,
        grade_pct: r.progress?.grade_pct ?? null,
      });
    }
    return NextResponse.json(
      { records },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return learningErrorResponse(e);
  }
}
