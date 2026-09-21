import { reviewSubmittedLab } from "@/lib/lms/lab-ai-server";
import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { commandSchema } from "@/lib/lms/schema";
import {
  commandForActor,
  learningActor,
  learningErrorResponse,
} from "@/lib/lms/server";
import { rateLimit } from "@/lib/rate-limit";
export const maxDuration = 120;
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const actor = await learningActor();
    if (
      !rateLimit(`lms:${actor.userId}`, { limit: 100, windowMs: 60000 }).success
    )
      return NextResponse.json(
        { error: "Please wait a moment before trying again." },
        { status: 429 },
      );
    const raw = await request.text();
    if (raw.length > 950000)
      return NextResponse.json(
        { error: "This learning content is too large." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const parsed = commandSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        {
          error: parsed.error.issues
            .map((i) => i.message)
            .slice(0, 3)
            .join(" "),
        },
        { status: 400 },
      );
    const requestKey = z
      .string()
      .uuid()
      .safeParse(request.headers.get("Idempotency-Key"));
    if (!requestKey.success)
      return NextResponse.json(
        { error: "A unique request identifier is required." },
        { status: 400 },
      );
    const data = await commandForActor(
      actor,
      parsed.data,
      requestKey.data,
    );
    if(parsed.data.action === "learning.submit") {
      const {id,activity_id}=parsed.data.payload;
      after(()=>reviewSubmittedLab(id,activity_id));
    }
    return NextResponse.json(
      parsed.data.action === "overview"
        ? {
            ...data,
            user_id: actor.userId,
            ai_configured: Boolean(process.env.OPENAI_API_KEY),
            agent_recovery_enabled: process.env.LEARNING_AGENT_RECOVERY_ENABLED === "true" && Boolean(process.env.CRON_SECRET),
          }
        : data,
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return learningErrorResponse(error);
  }
}
