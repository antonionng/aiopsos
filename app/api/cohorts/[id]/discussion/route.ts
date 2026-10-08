import { cohortMembershipGuardsEnabled } from "@/lib/workspace-rollout";
import { NextResponse } from "next/server";
import { z } from "zod";
import {

  learningErrorResponse,
  LearningError,
} from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getWorkspaceActor as getActor } from "@/lib/cohorts";
import { rateLimit } from "@/lib/rate-limit";
const bodySchema = z.object({
  body: z.string().trim().min(1).max(4000),
  parent_id: z.string().uuid().nullable().default(null),
  request_id: z.string().uuid(),
});
async function handle(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await getActor();
    if (!actor) throw new LearningError("Sign in to continue.", 401);
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success)
      throw new LearningError("Invalid cohort");
    const input =
      request.method === "POST" ? bodySchema.parse(await request.json()) : null;
    if (
      input &&
      !rateLimit(`lms-discussion:${actor.userId}`, {
        limit: 20,
        windowMs: 60000,
      }).success
    )
      throw new LearningError("Please wait before posting again.", 429);
    const { data, error } = await supabaseAdmin.rpc(cohortMembershipGuardsEnabled() ? "cohort_wall_scoped" : "cohort_wall", {
      p_actor: actor.userId,
      ...(cohortMembershipGuardsEnabled() ? { p_org: actor.orgId } : {}),
      p_cohort: id,
      ...(input
        ? {
            p_body: input.body,
            p_parent: input.parent_id,
            p_request: input.request_id,
          }
        : {}),
    });
    if (error)
      throw new LearningError(
        error.code === "42501"
          ? "This wall belongs to another training group. Switch to its organisation, or ask the trainer to check your enrolment."
          : error.code === "22023"
            ? error.message
            : "Could not load the discussion.",
        error.code === "42501" ? 403 : 400,
      );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: "Enter a message of up to 4,000 characters." },
        { status: 400 },
      );
    return learningErrorResponse(error);
  }
}
export const GET = handle;
export const POST = handle;
