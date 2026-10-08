import "server-only";
import { NextResponse } from "next/server";
import { getActor } from "@/lib/cohorts";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Command } from "./schema";

export class LearningError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function learningActor() {
  const actor = await getActor().catch(() => { throw new LearningError("Your workspace could not be loaded. Please retry.", 503); });
  if (!actor)
    throw new LearningError("Sign in to your workspace to continue.", 401);
  if (!actor.orgId)
    throw new LearningError(
      "Create or join an organisation in Settings to start your learning workspace.",
      409,
    );
  await assertLearningAccess({ ...actor, orgId: actor.orgId });
  return { ...actor, orgId: actor.orgId };
}
export async function commandForActor(
  actor: { userId: string; orgId: string },
  command: Command,
  requestKey = crypto.randomUUID(),
) {
  const { data, error } = await supabaseAdmin.rpc("lms_command_scoped", {
    p_actor: actor.userId,
    p_org: actor.orgId,
    p_action: command.action,
    p_payload: command.payload,
    p_request: requestKey,
  });
  if (error) {
    if (["PGRST202", "42P01"].includes(error.code))
      throw new LearningError(
        "The learning workspace needs its database migration. Contact your administrator.",
        503,
      );
    const status =
      error.code === "42501"
        ? 403
        : error.code === "P0002"
          ? 404
          : error.code === "40001"
            ? 409
            : 400;
    throw new LearningError(error.message, status);
  }
  return data;
}
/** Revalidate saved context; callers cannot grant access with a cached role. */
export async function assertLearningAccess(
  actor: { userId: string; orgId: string },
  manager = false,
) {
  const { error } = await supabaseAdmin.rpc("lms_assert_workspace", {
    p_actor: actor.userId,
    p_org: actor.orgId,
    p_manager: manager,
  });
  if (error) throw new LearningError(
    error.code === "42501" ? error.message : "Workspace permissions could not be checked. Please retry.",
    error.code === "42501" ? 403 : 503,
  );
}
export function learningErrorResponse(error: unknown) {
  if (error instanceof LearningError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  console.error("Learning workspace error", error);
  return NextResponse.json(
    {
      error:
        "The learning workspace could not complete this action. Please try again.",
    },
    { status: 500 },
  );
}
