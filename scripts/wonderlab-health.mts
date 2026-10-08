/** Read-only operational summary. Run with the environment of the verified project.
 * node --env-file=.env.local --experimental-strip-types scripts/wonderlab-health.mts
 * This report never selects nicknames, project text, answers or provider responses.
 */
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error("Configure the verified project environment first.");
const db = createClient(url, key, { auth: { persistSession: false } });
const since = new Date(Date.now() - 7 * 86400000).toISOString();
const [orders, generations, progress, deletions, memberships] = await Promise.all([
  db
    .from("wonderlab_orders")
    .select("state,created_at,expires_at")
    .gte("created_at", since),
  db
    .from("wonderlab_generations")
    .select("state,created_at,finished_at,estimated_cost_microusd")
    .gte("created_at", since),
  db
    .from("wonderlab_progress")
    .select("completed,updated_at")
    .lt("updated_at", new Date(Date.now() - 3 * 86400000).toISOString())
    .eq("completed", false),
  db
    .from("wonderlab_children")
    .select("id", { count: "exact", head: true })
    .not("deletion_requested_at", "is", null),
  db.from("wonderlab_memberships").select("state,cancel_at_period_end,paid_until"),
]);
for (const r of [orders, generations, progress, deletions, memberships])
  if (r.error)
    throw new Error(
      "A health query failed. Check migration and project configuration.",
    );
const latency = (generations.data ?? [])
  .filter((g) => g.finished_at)
  .map((g) => Date.parse(g.finished_at) - Date.parse(g.created_at));
console.log(
  JSON.stringify(
    {
      period: "Last seven days",
      memberships: {
        active: memberships.data?.filter(m => m.state === "active").length,
        awaitingPayment: memberships.data?.filter(m => ["pending", "incomplete", "past_due", "unpaid"].includes(m.state)).length,
        renewalCancelled: memberships.data?.filter(m => m.cancel_at_period_end).length,
      },
      courseAccessRecords: {
        paid: orders.data?.filter((o) => o.state === "paid").length,
        pending: orders.data?.filter((o) => o.state === "pending").length,
        refunded: orders.data?.filter((o) => o.state === "refunded").length,
      },
      ai: {
        successful: generations.data?.filter((g) => g.state === "succeeded")
          .length,
        failed: generations.data?.filter((g) => g.state === "failed").length,
        staleReservations: generations.data?.filter(
          (g) =>
            g.state === "pending" &&
            Date.parse(g.created_at) < Date.now() - 180000,
        ).length,
        estimatedSuccessfulGenerationCostUsd:
          (generations.data ?? []).reduce(
            (sum, g) => sum + Number(g.estimated_cost_microusd ?? 0),
            0,
          ) / 1e6,
        meanCompletedRequestLatencyMs: latency.length
          ? Math.round(latency.reduce((a, b) => a + b, 0) / latency.length)
          : null,
      },
      unfinishedMissionsInactiveForThreeDays: progress.data?.length,
      deletionRequests: deletions.count,
    },
    null,
    2,
  ),
);
