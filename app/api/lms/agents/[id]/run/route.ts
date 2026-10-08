import { NextResponse } from "next/server";
import { z } from "zod";
import {
  learningActor,
  learningErrorResponse,
  LearningError,
} from "@/lib/lms/server";
import { dispatchLearningTask } from "@/lib/lms/task-dispatch";
import { rateLimit } from "@/lib/rate-limit";
export const maxDuration = 100;
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await learningActor();
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success)
      throw new LearningError("Invalid task identifier");
    if (
      !rateLimit(`lms-agent:${actor.userId}`, { limit: 8, windowMs: 60000 })
        .success
    )
      throw new LearningError(
        "Please wait before starting another agent task.",
        429,
      );
    return NextResponse.json(await dispatchLearningTask(id, actor), {
      status: 202,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return learningErrorResponse(error);
  }
}
