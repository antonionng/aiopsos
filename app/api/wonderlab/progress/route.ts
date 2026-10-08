import { NextResponse } from "next/server";
import {
  apiError,
  assertOrigin,
  readBody,
  requireMission,
  db,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { evaluateProgress, normaliseAnswers } from "@/lib/wonderlab/engine";
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const b = await readBody(req);
    const { mission, child } = await requireMission(String(b.slug));
    if (
      typeof b.creation !== "string" ||
      b.creation.length > 8000 ||
      !Number.isInteger(b.revision) ||
      Number(b.revision) < 0 ||
      !Array.isArray(b.checks) ||
      b.checks.length > 6 ||
      b.checks.some((x) => typeof x !== "boolean")
    )
      throw new WonderlabError("Please check your saved work.");
    let answers;
    try {
      answers = normaliseAnswers(mission, b.answers);
    } catch {
      throw new WonderlabError("An answer could not be saved.");
    }
    const evaluation = evaluateProgress(mission, answers, b.creation, b.checks);
    const { data, error } = await db.rpc("wonderlab_save_progress", {
      p_child: child.id,
      p_parent: child.parent_id,
      p_slug: mission.slug,
      p_version: mission.version,
      p_revision: b.revision,
      p_answers: answers,
      p_creation: b.creation,
      p_checks: b.checks,
      p_passed: evaluation.passed,
      p_completed: evaluation.completed,
    });
    if (error) {
      if (error.message.includes("Progress conflict"))
        throw new WonderlabError(
          "This mission changed in another tab. Download your work, then reload to continue.",
          409,
        );
      throw error;
    }
    return NextResponse.json(data);
  } catch (e) {
    return apiError(e);
  }
}
