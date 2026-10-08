export type RecoverableTask = {
  state: string;
  attempts: number;
  lease_until: string | null;
  dispatch_requested_at: string | null;
};

/** Only explicit starts and expired leases are eligible. Failed tasks need a user retry. */
export function recoveryDisposition(task: RecoverableTask, now = Date.now()) {
  if (!task.dispatch_requested_at) return "ignore" as const;
  const eligible = task.state === "queued" ||
    (task.state === "running" && task.lease_until !== null && Date.parse(task.lease_until) < now);
  if (!eligible) return "ignore" as const;
  return task.attempts >= 3 ? "exhausted" as const : "recover" as const;
}
