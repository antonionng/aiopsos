"use client";
import { RecordInspector } from "@/components/lms/record-inspector";
import { useState } from "react";
import { useLearningOverview } from "@/lib/lms/client";
import type { ProgressRecord } from "@/lib/lms/schema";
import {
  Workspace,
  LoadingState,
  ManagerOnly,
  Notice,
  useMutation,
  ActionLink,
  dateLabel,
} from "@/components/lms/workspace";
function Review({
  item,
  refresh,
}: {
  item: ProgressRecord;
  refresh: () => Promise<void>;
}) {
  const [feedback, setFeedback] = useState("");
  const [context, setContext] = useState("");
  const { busy, message, mutate } = useMutation(refresh);
  return (
    <section className="lms-panel lms-form">
      <span className="lms-badge">{item.activity_kind}</span>
      <h2>{item.activity_title}</h2>
      <p>
        Submitted by {item.learner_name || "Learner"} ·{" "}
        {dateLabel(item.updated_at)}
      </p>
      <h3>Review criteria</h3>
      <div className="lms-prose">{item.criteria}</div>
      <h3>Learner&apos;s work</h3>
      <div className="lms-prose">{item.answer}</div>
      <label>
        Feedback for the learner
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Explain what meets the criteria or what needs another attempt."
          maxLength={4000}
        />
      </label>
      {item.activity_kind === "observation" && (
        <label>
          Observed task, equipment and conditions
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            maxLength={2000}
            placeholder="What did you personally observe, where and under which conditions?"
          />
        </label>
      )}
      <Notice message={message} />
      <div className="lms-row">
        {(["passed", "returned"] as const).map((decision) => (
          <button
            key={decision}
            className={`lms-button ${decision === "returned" ? "secondary" : ""}`}
            disabled={
              busy ||
              feedback.trim().length < 3 ||
              (item.activity_kind === "observation" &&
                context.trim().length < 10)
            }
            onClick={() =>
              mutate({
                action: "learning.review",
                payload: {
                  id: item.id,
                  revision: item.revision,
                  decision,
                  feedback,
                  observation_context: context,
                },
              })
            }
          >
            {decision === "passed" ? "Meets criteria" : "Return with feedback"}
          </button>
        ))}
      </div>
    </section>
  );
}
export default function Records() {
  const { data, error, refresh } = useLearningOverview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const rows =
    data?.assignments.filter(
      (a) =>
        (status === "all" ||
          (status === "complete" ? !!a.completed_at : !a.completed_at)) &&
        `${a.learner_name} ${a.title}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) || [];
  function download() {
    const escape = (value: string) =>
      `"${(/^[=+@\-\t\r]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
    const lines = [
      ["Learner", "Programme", "Assigned", "Completed", "Assignment ID"],
      ...rows.map((a) => [
        a.learner_name || "Learner",
        a.title || "Programme",
        a.created_at,
        a.completed_at || "",
        a.id,
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        ["\uFEFF" + lines.map((row) => row.map(escape).join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "learning-records.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Workspace
      data={data}
      title="Records & reviews"
      description="Review real work, follow completion and keep a traceable record of the decisions behind it."
      action={
        <ActionLink href="/dashboard/evidence">
          Live training evidence packs
        </ActionLink>
      }
    >
      {!data ? (
        <LoadingState error={error} retry={refresh} />
      ) : (
        <ManagerOnly data={data}>
          <h2 className="lms-section-title">
            Trainer review queue · {data.reviews.length}
          </h2>
          {data.reviews.length ? (
            <div className="lms-grid">
              {data.reviews.map((item) => (
                <Review
                  key={`${item.id}:${item.revision}`}
                  item={item}
                  refresh={refresh}
                />
              ))}
            </div>
          ) : (
            <section className="lms-panel">
              <h2>All caught up.</h2>
              <p>
                Practical submissions from your programmes will appear here.
                Knowledge checks are marked against the published answer key.
              </p>
            </section>
          )}
          <section className="lms-panel">
            <div className="lms-row between">
              <h2>Programme completion records</h2>
              <button className="lms-button secondary" onClick={download}>
                Export filtered records
              </button>
            </div>
            <div className="lms-row lms-form" style={{ margin: "20px 0" }}>
              <input
                aria-label="Search learning records"
                placeholder="Search person or programme…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                aria-label="Record status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All records</option>
                <option value="complete">Completed</option>
                <option value="progress">In progress</option>
              </select>
            </div>
            <div className="lms-table-wrap">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Programme</th>
                    <th>Assigned</th>
                    <th>Completion</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id}>
                      <td>{a.learner_name || "Learner"}</td>
                      <td>{a.title}</td>
                      <td>{dateLabel(a.created_at)}</td>
                      <td>
                        {a.completed_at
                          ? dateLabel(a.completed_at)
                          : "In progress"}
                      </td>
                      <td>
                        <RecordInspector id={a.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length && <p>No records match this view.</p>}
            <p className="lms-muted">
              Programme completion records are separate from accredited
              certificates and equipment authorisation. Existing live training
              certificates remain in My Learning.
            </p>
          </section>
          <details className="lms-panel">
            <summary>Recent workspace activity</summary>
            <div className="lms-table-wrap">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Action</th>
                    <th>Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((e) => (
                    <tr key={e.id}>
                      <td>{new Date(e.created_at).toLocaleString()}</td>
                      <td>{e.action.replaceAll(".", " / ")}</td>
                      <td>
                        {data.members.find((m) => m.id === e.actor_id)?.name ||
                          e.actor_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </ManagerOnly>
      )}
    </Workspace>
  );
}
