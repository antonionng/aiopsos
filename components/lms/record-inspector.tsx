"use client";
import { useState } from "react";
import { lmsCommand } from "@/lib/lms/client";
import type { Assignment, Programme, ProgressRecord } from "@/lib/lms/schema";
import { dateLabel, Notice } from "./workspace";
type RecordDetail = {
  assignment: Assignment;
  programme: Programme;
  activities: {
    id: string;
    title: string;
    kind: string;
    criteria: string;
    course_title: string;
    version: number;
  }[];
  history: {
    id: string;
    actor_id: string;
    action: string;
    created_at: string;
    snapshot: ProgressRecord;
  }[];
};
export function RecordInspector({ id }: { id: string }) {
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  async function load() {
    setOpen(true);
    setBusy(true);
    try {
      setRecord(
        await lmsCommand<RecordDetail>({
          action: "record.get",
          payload: { id },
        }),
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load evidence");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="lms-button secondary"
        disabled={busy}
        onClick={() => (open ? setOpen(false) : load())}
      >
        {busy ? "Opening…" : open ? "Close evidence" : "View evidence"}
      </button>
      {open && (
        <div style={{ minWidth: 260, marginTop: 20 }}>
          <Notice message={error} />
          {record && (
            <>
              <p className="lms-muted">
                Assigned {dateLabel(record.assignment.created_at)} ·{" "}
                {record.assignment.completed_at
                  ? `Completed ${dateLabel(record.assignment.completed_at)}`
                  : "In progress"}
              </p>
              {record.activities.map((a) => (
                <details key={a.id}>
                  <summary>
                    {a.title} · {a.kind}
                  </summary>
                  <p>
                    {a.course_title} · Published version {a.version}
                  </p>
                  {a.criteria && (
                    <p className="lms-prose">Criteria: {a.criteria}</p>
                  )}
                  {record.history
                    .filter((h) => h.snapshot.activity_id === a.id)
                    .map((h) => (
                      <div className="lms-notice" key={h.id}>
                        <strong>
                          {h.action === "learning.review"
                            ? "Trainer review"
                            : "Learner attempt"}{" "}
                          · {h.snapshot.state}
                        </strong>
                        <p className="lms-muted">
                          {new Date(h.created_at).toLocaleString()}
                        </p>
                        {h.snapshot.answer && (
                          <p className="lms-prose">
                            {a.kind === "quiz"
                              ? `Selected option ${Number(h.snapshot.answer) + 1}`
                              : h.snapshot.answer}
                          </p>
                        )}
                        {h.snapshot.feedback && (
                          <p className="lms-prose">
                            Feedback: {h.snapshot.feedback}
                          </p>
                        )}
                        {h.snapshot.observation_context && (
                          <p className="lms-prose">
                            Observed conditions:{" "}
                            {h.snapshot.observation_context}
                          </p>
                        )}
                        <p className="lms-muted">
                          Actor reference: {h.actor_id}
                        </p>
                      </div>
                    ))}
                </details>
              ))}
              {!record.history.length && <p>No activity attempts yet.</p>}
            </>
          )}
        </div>
      )}
    </>
  );
}
