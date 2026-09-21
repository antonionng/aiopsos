"use client";
import { ContentEditor } from "@/components/lms/content-editor";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { lmsCommand, useLearningOverview } from "@/lib/lms/client";
import {
  courseContentSchema,
  emptyActivity,
  type Activity,
  type CourseContent,
  type CourseRecord,
} from "@/lib/lms/schema";
import {
  Workspace,
  LoadingState,
  ManagerOnly,
  Notice,
  useMutation,
} from "@/components/lms/workspace";
export default function Editor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, error, refresh } = useLearningOverview();
  const [record, setRecord] = useState<CourseRecord | null>(null);
  const [loadError, setLoadError] = useState("");
  const [content, setContent] = useState<CourseContent>({
    title: "",
    summary: "",
    category: "ai",
    outcomes: [""],
    activities: [],
  });
  const [dirty, setDirty] = useState(false);
  const { busy, message, setMessage, mutate } = useMutation();
  async function load() {
    try {
      const c = await lmsCommand<CourseRecord>({
        action: "course.get",
        payload: { id },
      });
      setRecord(c);
      setContent(c.content);
      setLoadError("");
      setDirty(false);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load course");
    }
  }
  useEffect(() => {
    if (id !== "new") load();
    else
      setContent((c) => ({
        ...c,
        activities: [emptyActivity()],
      })); /* route identity controls the editor */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function update(p: Partial<CourseContent>) {
    setContent((c) => ({ ...c, ...p }));
    setDirty(true);
  }
  function changeActivity(index: number, p: Partial<Activity>) {
    update({
      activities: content.activities.map((a, i) =>
        i === index ? { ...a, ...p } : a,
      ),
    });
  }
  async function save() {
    const parsed = courseContentSchema.safeParse(content);
    if (!parsed.success) {
      setMessage(
        parsed.error.issues
          .map((i) => `${i.path.join(" / ")}: ${i.message}`)
          .slice(0, 3)
          .join(" "),
      );
      return;
    }
    const result = await mutate({
      action: "course.save",
      payload: {
        ...(record ? { id: record.id, revision: record.revision } : {}),
        content: parsed.data,
      },
    });
    if (result) {
      setDirty(false);
      if (id === "new") router.replace(`/dashboard/studio/${result.id}`);
      else await load();
      setMessage(
        "Course saved. Publish a version when you are ready to use it in a programme.",
      );
    }
  }
  async function publish() {
    if (!record || dirty) return;
    const result = await mutate<{ id: string; version: number }>({
      action: "course.publish",
      payload: { id: record.id, revision: record.revision },
    });
    if (result) {
      await refresh();
      setMessage(
        `Version ${result.version} published. You can now add it to a programme.`,
      );
    }
  }
  return (
    <Workspace
      data={data}
      title={
        id === "new" ? "Create a little possibility." : "Shape the learning."
      }
      description="Draft freely. Published versions keep the exact content and checks your learners were assigned."
    >
      {!data ? (
        <LoadingState error={error} retry={refresh} />
      ) : (
        <ManagerOnly data={data}>
          {id !== "new" && !record ? (
            <LoadingState error={loadError} retry={load} />
          ) : (
            <>
              <Notice message={message} />
              <div className="lms-row between" style={{ marginBottom: 24 }}>
                <span className="lms-muted">
                  {dirty
                    ? "Unsaved changes"
                    : record
                      ? `Draft revision ${record.revision}`
                      : "New course"}{" "}
                  · {data.versions.filter((v) => v.course_id === id).length}{" "}
                  published versions
                </span>
                <div className="lms-row">
                  <button
                    className="lms-button secondary"
                    disabled={busy}
                    onClick={save}
                  >
                    {busy ? "Working…" : "Save draft"}
                  </button>
                  <button
                    className="lms-button"
                    disabled={busy || !record || dirty}
                    onClick={publish}
                  >
                    Publish saved version
                  </button>
                </div>
              </div>
              <div className="lms-panel lms-form">
                <label>
                  Course title
                  <input
                    value={content.title}
                    onChange={(e) => update({ title: e.target.value })}
                    maxLength={180}
                  />
                </label>
                <label>
                  What will this help someone do?
                  <textarea
                    value={content.summary}
                    onChange={(e) => update({ summary: e.target.value })}
                    maxLength={2500}
                  />
                </label>
                <label>
                  Subject
                  <select
                    value={content.category}
                    onChange={(e) =>
                      update({
                        category: e.target.value as CourseContent["category"],
                      })
                    }
                  >
                    <option value="ai">AI at work</option>
                    <option value="robotics">Applied robotics</option>
                    <option value="technology">Technology</option>
                    <option value="general">General learning</option>
                  </select>
                </label>
                <label>
                  Learning outcomes (one per line)
                  <textarea
                    value={content.outcomes.join("\n")}
                    onChange={(e) =>
                      update({ outcomes: e.target.value.split("\n") })
                    }
                  />
                </label>
              </div>
              <h2 className="lms-section-title">The learning journey</h2>
              {content.activities.map((a, i) => (
                <section className="lms-panel lms-form" key={a.id}>
                  <div className="lms-row between">
                    <h2>
                      {String(i + 1).padStart(2, "0")} / {a.kind}
                    </h2>
                    <div className="lms-row">
                      <button
                        className="lms-button secondary"
                        disabled={i === 0}
                        onClick={() => {
                          const list = [...content.activities];
                          [list[i - 1], list[i]] = [list[i], list[i - 1]];
                          update({ activities: list });
                        }}
                      >
                        Move up
                      </button>
                      <button
                        className="lms-button secondary"
                        disabled={content.activities.length === 1}
                        onClick={() =>
                          update({
                            activities: content.activities.filter(
                              (x) => x.id !== a.id,
                            ),
                          })
                        }
                      >
                        Remove from draft
                      </button>
                    </div>
                  </div>
                  <label>
                    Activity title
                    <input
                      value={a.title}
                      onChange={(e) =>
                        changeActivity(i, { title: e.target.value })
                      }
                    />
                  </label>
                  <ContentEditor
                    label={
                      a.kind === "lesson"
                        ? "Lesson content"
                        : "Instructions or question"
                    }
                    value={a.content}
                    onChange={(content) => changeActivity(i, { content })}
                  />
                  <label>
                    Estimated minutes
                    <input
                      type="number"
                      min={1}
                      max={600}
                      value={a.minutes}
                      onChange={(e) =>
                        changeActivity(i, { minutes: Number(e.target.value) })
                      }
                    />
                  </label>
                  {a.kind === "quiz" && (
                    <>
                      <label>
                        Answer options (one per line)
                        <textarea
                          value={a.options.join("\n")}
                          onChange={(e) =>
                            changeActivity(i, {
                              options: e.target.value.split("\n"),
                            })
                          }
                        />
                      </label>
                      <label>
                        Correct answer
                        <select
                          value={a.correctOption ?? 0}
                          onChange={(e) =>
                            changeActivity(i, {
                              correctOption: Number(e.target.value),
                            })
                          }
                        >
                          {a.options.map((option, j) => (
                            <option value={j} key={j}>
                              {j + 1}. {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                  {["practice", "observation"].includes(a.kind) && (
                    <label>
                      What must a trainer see to pass this activity?
                      <textarea
                        value={a.criteria}
                        onChange={(e) =>
                          changeActivity(i, { criteria: e.target.value })
                        }
                      />
                    </label>
                  )}
                  <details className="rounded-xl border p-4">
                    <summary className="cursor-pointer font-semibold">
                      Learner materials · {(a.materials ?? []).length} items
                    </summary>
                    <p className="my-3 text-sm text-muted-foreground">
                      These materials are included in the published course and
                      downloadable learner pack.
                    </p>
                    {(a.materials ?? []).map((m, mi) => (
                      <div
                        key={m.id}
                        className="my-4 grid gap-3 rounded-xl border p-4"
                      >
                        <label>
                          Material title
                          <input
                            value={m.title}
                            onChange={(e) =>
                              changeActivity(i, {
                                materials: a.materials!.map((x, j) =>
                                  j === mi
                                    ? { ...x, title: e.target.value }
                                    : x,
                                ),
                              })
                            }
                          />
                        </label>
                        <label>
                          Material type
                          <select
                            value={m.kind}
                            onChange={(e) =>
                              changeActivity(i, {
                                materials: a.materials!.map((x, j) =>
                                  j === mi
                                    ? {
                                        ...x,
                                        kind: e.target.value as typeof m.kind,
                                      }
                                    : x,
                                ),
                              })
                            }
                          >
                            {[
                              "handout",
                              "worksheet",
                              "lab_guide",
                              "checklist",
                              "reference",
                            ].map((k) => (
                              <option key={k} value={k}>
                                {k.replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>
                        </label>
                        <ContentEditor
                          label="Material content"
                          value={m.content}
                          onChange={(content) =>
                            changeActivity(i, {
                              materials: a.materials!.map((x, j) =>
                                j === mi ? { ...x, content } : x,
                              ),
                            })
                          }
                        />
                        <button
                          className="lms-button secondary"
                          onClick={() =>
                            changeActivity(i, {
                              materials: a.materials!.filter(
                                (_, j) => j !== mi,
                              ),
                            })
                          }
                        >
                          Remove material from draft
                        </button>
                      </div>
                    ))}
                    <button
                      className="lms-button secondary"
                      disabled={(a.materials?.length ?? 0) >= 6}
                      onClick={() =>
                        changeActivity(i, {
                          materials: [
                            ...(a.materials ?? []),
                            {
                              id: crypto.randomUUID(),
                              title: "New learner resource",
                              kind: "handout",
                              content:
                                "Add the resource learners need for this activity.",
                            },
                          ],
                        })
                      }
                    >
                      Add learner material
                    </button>
                  </details>
                  {a.kind === "observation" && (
                    <p>
                      Observation requires a trainer to record the task,
                      equipment and conditions. Course completion alone does not
                      authorise machine operation.
                    </p>
                  )}
                </section>
              ))}
              <div className="lms-row">
                {(["lesson", "quiz", "practice", "observation"] as const).map(
                  (kind) => (
                    <button
                      className="lms-button secondary"
                      key={kind}
                      disabled={content.activities.length >= 40}
                      onClick={() =>
                        update({
                          activities: [
                            ...content.activities,
                            emptyActivity(kind),
                          ],
                        })
                      }
                    >
                      + {kind}
                    </button>
                  ),
                )}
              </div>
            </>
          )}
        </ManagerOnly>
      )}
    </Workspace>
  );
}
