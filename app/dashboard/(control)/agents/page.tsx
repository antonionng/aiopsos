"use client";
import { AssistantMessage } from "@/components/lms/assistant-message";
import { useEffect, useState } from "react";
import { useLearningOverview } from "@/lib/lms/client";
import {
  courseContentSchema,
  programmeSchema,
  type AgentRun,
} from "@/lib/lms/schema";
import {
  Workspace,
  LoadingState,
  ManagerOnly,
  Notice,
  useMutation,
  ActionLink,
  dateLabel,
} from "@/components/lms/workspace";
function Proposal({ run }: { run: AgentRun }) {
  const course = courseContentSchema.safeParse(run.proposal);
  const programme = programmeSchema.safeParse(run.proposal);
  return (
    <>
      {course.success && (
        <div className="lms-spaced">
          <h3>{course.data.title}</h3>
          <p>{course.data.summary}</p>
          <ul>
            {course.data.outcomes.map((o, i) => (
              <li key={i}>• {o}</li>
            ))}
          </ul>
          {course.data.activities.map((a) => (
            <details key={a.id}>
              <summary>
                {a.title} · {a.kind} · {a.minutes} min
              </summary>
              <AssistantMessage text={a.content} />
              {a.options.length > 0 && (
                <ol>
                  {a.options.map((o, i) => (
                    <li key={i}>
                      {i + 1}. {o}
                      {a.correctOption === i ? " (correct)" : ""}
                    </li>
                  ))}
                </ol>
              )}
              {a.criteria && <p>Review criteria: {a.criteria}</p>}
              {(a.materials ?? []).map((m) => (
                <div key={m.id} className="my-3 rounded-xl border p-4">
                  <h4 className="font-semibold">
                    {m.title} · {m.kind.replaceAll("_", " ")}
                  </h4>
                  <AssistantMessage text={m.content} />
                </div>
              ))}
            </details>
          ))}
        </div>
      )}
      {programme.success && (
        <div>
          <h3>{programme.data.title}</h3>
          <p>{programme.data.goal}</p>
          <p>
            {programme.data.version_ids.length} published course versions ·{" "}
            {programme.data.client_org_id ? "Client audience" : "Our people"} ·{" "}
            {dateLabel(programme.data.due_at)}
          </p>
        </div>
      )}
    </>
  );
}
export default function Agents() {
  const { data, error, refresh } = useLearningOverview();
  const { busy, message, setMessage, mutate } = useMutation(refresh);
  const [goal, setGoal] = useState("");
  const [kind, setKind] = useState<AgentRun["kind"]>("programme");
  const [running, setRunning] = useState<string | null>(null);
  const hasRunning = data?.runs.some(
    (r) => r.state === "running" || r.state === "queued",
  );
  useEffect(() => {
    if (!hasRunning) return;
    const interval = setInterval(refresh, 6000);
    return () => clearInterval(interval);
  }, [hasRunning, refresh]);
  async function run(id: string) {
    if (running) return;
    setRunning(id);
    setMessage("");
    try {
      const response = await fetch(`/api/lms/agents/${id}/run`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Agent task failed");
      setMessage(
        result.state === "needs_review"
          ? "Your proposal is ready for review."
          : result.state === "failed"
            ? "This task needs attention. Check its error and recovery limit below."
            : "Task saved. You can leave this page while it works. Activity will show the result.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not run task.");
    } finally {
      setRunning(null);
      await refresh();
    }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    const r = await mutate({ action: "agent.create", payload: { goal, kind } });
    if (r) {
      setGoal("");
      if (data?.ai_configured) await run(r.id);
      else setMessage("Goal saved. Connect the AI provider before running it.");
    }
  }
  return (
    <Workspace
      data={data}
      title="Activity & approvals"
      description="Track delegated tasks, review proposals and approve the changes you want to make. For everyday help, use Ask Experrt on any page."
    >
      {!data ? (
        <LoadingState error={error} retry={refresh} />
      ) : (
        <ManagerOnly data={data}>
          <Notice message={message} />
          {!data.ai_configured && (
            <Notice message="AI connection needed: goals can be saved, but this deployment has no AI provider key. Courses, programmes and records already work without it." />
          )}
          <div className="lms-split">
            <form onSubmit={create} className="lms-panel lms-form">
              <h2>Delegate a new task</h2>
              <label>
                Agent task
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as AgentRun["kind"])}
                >
                  <option value="programme">
                    Plan a programme from our published courses
                  </option>
                  <option value="course">Draft a new course</option>
                  <option value="delivery">Review programme delivery</option>
                </select>
              </label>
              <label>
                Your goal
                <textarea
                  required
                  minLength={10}
                  maxLength={4000}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Help our customer team evaluate AI outputs. Build a practical programme using our published courses."
                  style={{ minHeight: 150 }}
                />
              </label>
              <button className="lms-button" disabled={busy || !!running}>
                {running
                  ? "Agent working…"
                  : data.ai_configured
                    ? "Start agent task"
                    : "Save goal for later"}
              </button>
            </form>
            <section className="lms-hero">
              <h2>A colleague with a clear brief.</h2>
              <p>
                1. Read the relevant workspace records.
                <br />
                2. Draft learning or recommend a programme.
                <br />
                3. Bring the proposal back to you.
              </p>
              <p>
                Publishing, assigning people and practical assessment stay with
                your team. Agent runs use your workspace&apos;s AI credits.
              </p>
            </section>
          </div>
          <h2 className="lms-section-title">The work queue</h2>
          {!data.runs.length && (
            <section className="lms-panel">
              <h2>No busywork. Start with a goal.</h2>
              <p>
                Your agent&apos;s progress, proposals and applied changes will
                appear here.
              </p>
            </section>
          )}
          {data.runs.map((r) => (
            <section className="lms-panel" key={r.id}>
              <div className="lms-row between">
                <span className={`lms-badge ${r.state}`}>
                  {r.state === "queued" && !r.dispatch_requested_at ? "Ready to start" : r.state.replaceAll("_", " ")}
                </span>
                <span className="lms-muted">
                  {r.kind} · {dateLabel(r.created_at)} · Attempt {r.attempts}/3
                </span>
              </div>
              <h2 style={{ marginTop: 20 }}>
                {
                  {
                    course: "Course draft",
                    programme: "Programme proposal",
                    delivery: "Delivery review",
                  }[r.kind]
                }
              </h2>
              <details className="my-3">
                <summary className="cursor-pointer text-sm font-semibold">
                  Task brief
                </summary>
                <div className="mt-3">
                  <AssistantMessage text={r.goal} />
                </div>
              </details>
              {r.summary && <AssistantMessage text={r.summary} />}
              {r.error && <Notice message={r.error} />}
              {r.state === "queued" && r.dispatch_requested_at && data.agent_recovery_enabled && (
                <p className="lms-muted" role="status">Your task is saved in the queue. You can leave this page; Experrt will pick it up automatically.</p>
              )}
              <Proposal run={r} />
              <div className="lms-row" style={{ marginTop: 20 }}>
                {r.state === "queued" && (
                  <button
                    className="lms-button"
                    disabled={!!running || !data.ai_configured}
                    onClick={() => run(r.id)}
                  >
                    Run task
                  </button>
                )}
                {r.state === "running" &&
                  !running &&
                  r.lease_until &&
                  Date.parse(r.lease_until) < Date.now() && (
                    <button
                      className="lms-button secondary"
                      disabled={!data.ai_configured}
                      onClick={() => run(r.id)}
                    >
                      Resume interrupted task
                    </button>
                  )}
                {r.state === "running" && (
                  <span role="status">{r.lease_until && Date.parse(r.lease_until) < Date.now()
                    ? data.agent_recovery_enabled && r.dispatch_requested_at
                      ? "Interrupted. Experrt will try to recover this task within five minutes."
                      : "Interrupted. Resume this task to continue."
                    : "Working with your learning records…"}</span>
                )}
                {r.state === "failed" && r.attempts < 3 && (
                  <button
                    className="lms-button secondary"
                    disabled={busy || !!running || !data.ai_configured}
                    onClick={async () => {
                      const result = await mutate({
                        action: "agent.retry",
                        payload: { id: r.id },
                      });
                      if (result) await run(r.id);
                    }}
                  >
                    Retry task
                  </button>
                )}
                {r.state === "needs_review" && (
                  <button
                    className="lms-button"
                    disabled={busy}
                    onClick={async () => {
                      const result = await mutate({
                        action: "agent.approve",
                        payload: { id: r.id },
                      });
                      if (result)
                        setMessage(
                          r.kind === "course"
                            ? "Course draft created. Open it in the studio to edit and publish."
                            : r.kind === "programme"
                              ? "Programme created. Open it to assign your people."
                              : "Delivery review acknowledged and retained.",
                        );
                    }}
                  >
                    {r.kind === "course"
                      ? "Approve & create course draft"
                      : r.kind === "programme"
                        ? "Approve & create programme"
                        : "Acknowledge review"}
                  </button>
                )}
                {!["completed", "cancelled"].includes(r.state) && (
                  <button
                    className="lms-button secondary"
                    disabled={busy}
                    onClick={() =>
                      mutate({ action: "agent.cancel", payload: { id: r.id } })
                    }
                  >
                    Cancel task
                  </button>
                )}
                {r.state === "completed" &&
                  r.result?.id &&
                  r.kind !== "delivery" && (
                    <ActionLink
                      href={`/dashboard/${r.kind === "course" ? "studio" : "programmes"}/${r.result.id}`}
                    >
                      Open {r.kind}
                    </ActionLink>
                  )}
              </div>
            </section>
          ))}
        </ManagerOnly>
      )}
    </Workspace>
  );
}
