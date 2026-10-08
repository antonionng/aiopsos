import { NextResponse } from "next/server";
import { recoverLearningTasks } from "@/lib/lms/task-recovery";

export const maxDuration = 120;
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  if (process.env.LEARNING_AGENT_RECOVERY_ENABLED !== "true")
    return NextResponse.json({ enabled: false }, { headers });
  try { return NextResponse.json(await recoverLearningTasks(), { headers }); }
  catch {
    console.error("Learning agent recovery queue could not be checked");
    return NextResponse.json({ error: "Recovery queue unavailable" }, { status: 503, headers });
  }
}
