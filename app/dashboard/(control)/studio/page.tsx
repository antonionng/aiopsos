"use client";
import { useState } from "react";
import { useLearningOverview } from "@/lib/lms/client";
import {
  Workspace,
  LoadingState,
  ManagerOnly,
  Empty,
  ActionLink,
  dateLabel,
} from "@/components/lms/workspace";
export default function Studio() {
  const { data, error, refresh } = useLearningOverview();
  const [search, setSearch] = useState("");
  return (
    <Workspace
      data={data}
      title="Courses"
      description="Create lessons, knowledge checks and practical challenges. Publish a version when it is ready for learners."
      action={
        <ActionLink href="/dashboard/studio/new">Create a course</ActionLink>
      }
    >
      {!data ? (
        <LoadingState error={error} retry={refresh} />
      ) : (
        <ManagerOnly data={data}>
          <input
            className="lms-input"
            aria-label="Find a course"
            placeholder="Find a course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 24 }}
          />
          <div className="lms-grid">
            {data.courses
              .filter((c) =>
                c.content.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((c, i) => (
                <article className="lms-panel" key={c.id}>
                  <div
                    className={`lms-course-art ${["lilac", "peach", "lime", "blue"][i % 4]}`}
                  >
                    {c.content.category.toUpperCase()}
                    <span aria-hidden>{["✳", "↗", "◎", "⤴"][i % 4]}</span>
                  </div>
                  <span className="lms-badge">
                    {data.versions.some((v) => v.course_id === c.id)
                      ? "Published version available"
                      : "Draft"}
                  </span>
                  <h2 style={{ marginTop: 14 }}>{c.content.title}</h2>
                  <p>{c.content.summary}</p>
                  <p className="lms-muted">
                    {c.content.activities.length} activities · Updated{" "}
                    {dateLabel(c.updated_at)}
                  </p>
                  <ActionLink href={`/dashboard/studio/${c.id}`}>
                    Open studio
                  </ActionLink>
                </article>
              ))}
          </div>
          {!data.courses.length && (
            <Empty title="Make something worth learning">
              <p>
                Start with a course, or ask your agent to draft one from a clear
                learning goal.
              </p>
              <ActionLink href="/dashboard/agents">
                Draft with an agent
              </ActionLink>
            </Empty>
          )}
        </ManagerOnly>
      )}
    </Workspace>
  );
}
