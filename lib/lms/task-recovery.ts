import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { runLearningAgent } from "./agent";
import { assertLearningAccess, LearningError } from "./server";
import { recoveryDisposition, type RecoverableTask } from "./task-recovery-policy";

type Candidate = RecoverableTask & { id: string; org_id: string; created_by: string; updated_at: string };

/** Compare the observed revision so recovery never overwrites a newer worker or cancellation. */
async function closeCandidate(task: Candidate, message: string) {
  const { error } = await supabaseAdmin.from("lms_agent_runs").update({
    state: "failed", error: message, lease_token: null, lease_until: null, updated_at: new Date().toISOString(),
  }).eq("id", task.id).eq("org_id", task.org_id).eq("state", task.state).eq("updated_at", task.updated_at).eq("attempts", task.attempts);
  if (error) throw new Error("Could not record task recovery failure");
}

export async function recoverLearningTasks() {
  let releasedReservations = 0;
  if (process.env.LEARNING_AGENT_CREDIT_HOLDS_ENABLED === "true") {
    const release = await supabaseAdmin.rpc("lms_release_abandoned_credit_holds");
    if (release.error) throw new Error("Could not reconcile abandoned agent reservations");
    releasedReservations = release.data ?? 0;
  }
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from("lms_agent_runs")
    .select("id,org_id,created_by,state,attempts,lease_until,dispatch_requested_at,updated_at")
    .not("dispatch_requested_at", "is", null)
    .or(`state.eq.queued,and(state.eq.running,lease_until.lt.${now})`)
    .order("updated_at", { ascending: true }).limit(2);
  if (error) throw new Error("Could not read recovery queue");
  const results = await Promise.allSettled((data as Candidate[]).map(async task => {
    const disposition = recoveryDisposition(task);
    if (disposition === "ignore") return "skipped";
    if (disposition === "exhausted") {
      await closeCandidate(task, "This task reached its recovery limit. Create a new task with a revised brief.");
      return "exhausted";
    }
    try {
      const { data: profile, error: profileError } = await supabaseAdmin.from("user_profiles")
        .select("role,org_id").eq("id", task.created_by).maybeSingle();
      if (profileError) throw new LearningError("Could not check the task owner's access.", 503);
      if (!profile || profile.org_id !== task.org_id || !["admin", "manager", "super_admin"].includes(profile.role))
        throw new LearningError("The task owner's workspace access has changed. Ask a learning manager to create a new task.", 403);
      const actor = { userId: task.created_by, orgId: task.org_id, role: profile.role };
      await assertLearningAccess(actor, true);
      await runLearningAgent(task.id, actor);
      return "recovered";
    } catch (cause) {
      // A claim conflict belongs to another worker. Transient preflight failures
      // stay persisted for the next scheduled attempt; denied access/credits stop.
      if (cause instanceof LearningError && [402, 403, 429].includes(cause.status)) {
        await closeCandidate(task, cause.message);
        return "blocked";
      }
      if (cause instanceof LearningError && cause.status === 409) return "skipped";
      return "deferred";
    }
  }));
  const counts: Record<string, number> = { examined: results.length, released_reservations: releasedReservations };
  for (const result of results) {
    const key = result.status === "fulfilled" ? result.value : "error";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
