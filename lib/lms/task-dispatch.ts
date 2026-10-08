import "server-only";
import { after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { runLearningAgent } from "./agent";
import { assertLearningAccess, LearningError } from "./server";

/** Persist first, then continue after the HTTP response. Atomic leases own execution.
 * Explicit start intent lets scheduled recovery resume after a process crash.
 */
export async function dispatchLearningTask(
  id: string,
  actor: { userId: string; orgId: string; role: string },
) {
  if (!["admin", "manager", "super_admin"].includes(actor.role))
    throw new LearningError("A learning manager is required.", 403);
  await assertLearningAccess(actor, true);
  const { data: task, error } = await supabaseAdmin
    .from("lms_agent_runs")
    .select("id,state,lease_until,attempts")
    .eq("id", id)
    .eq("org_id", actor.orgId)
    .maybeSingle();
  if (error)
    throw new LearningError(
      "Could not read the saved task. Check Activity before retrying.",
      503,
    );
  if (!task) throw new LearningError("Task not found in this workspace.", 404);
  const expired =
    task.state === "running" &&
    task.lease_until &&
    Date.parse(task.lease_until) < Date.now();
  if (task.state === "queued" || expired) {
    const { error: dispatchError } = await supabaseAdmin.from("lms_agent_runs")
      .update({ dispatch_requested_at: new Date().toISOString() })
      .eq("id", id).eq("org_id", actor.orgId).eq("state", task.state);
    if (dispatchError) throw new LearningError("Could not save the task start. Please retry.", 503);
    if (task.attempts >= 3) {
      let close = supabaseAdmin
        .from("lms_agent_runs")
        .update({
          state: "failed",
          error:
            "This task reached its recovery limit. Create a new task with a revised brief.",
          lease_token: null,
          lease_until: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("org_id", actor.orgId)
        .eq("state", task.state)
        .eq("attempts", task.attempts);
      if (expired) close = close.lt("lease_until", new Date().toISOString());
      const closed = await close.select("id").maybeSingle();
      if (closed.error)
        throw new LearningError(
          "Could not save the recovery status. Refresh Activity.",
          503,
        );
      if (!closed.data)
        throw new LearningError("Task state changed. Refresh Activity.", 409);
      return { id, state: "failed" as const };
    }
    after(async () => {
      try {
        await runLearningAgent(id, actor);
      } catch (error) {
        // Execution failures are saved by the runner. Capture preflight failures
        // only while still queued, so another worker's lease is never overwritten.
        await supabaseAdmin
          .from("lms_agent_runs")
          .update({
            state: "failed",
            error:
              error instanceof LearningError
                ? error.message
                : "The task could not start. Retry from Activity.",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("org_id", actor.orgId)
          .eq("state", "queued");
      }
    });
  }
  return { id, state: task.state };
}
