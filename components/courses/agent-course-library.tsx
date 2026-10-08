"use client";

import { useEffect, useRef, useState } from "react";
import type { CourseContent } from "@/lib/lms/schema";
import { courseContentSchema } from "@/lib/lms/schema";

type LibraryCourse = { slug: string; title: string; audience: string };
async function loadLibrary(slug?: string) {
  const response = await fetch(
    "/api/lms/agent-course-packs" +
      (slug ? "?slug=" + encodeURIComponent(slug) : ""),
    { cache: "no-store" },
  );
  if (
    response.redirected ||
    !response.headers.get("content-type")?.includes("application/json")
  )
    throw new Error("Sign in again to use the course library.");
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "The course library could not be loaded.");
  return result;
}

export function AgentCourseLibrary({
  onLoad,
  disabled,
}: {
  onLoad: (content: CourseContent) => void;
  disabled: boolean;
}) {
  const [courses, setCourses] = useState<LibraryCourse[]>([]);
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    loadLibrary()
      .then((result) => {
        if (!active) return;
        setCourses(result.courses);
        setVersion(result.version || "");
        setSlug(result.courses[0]?.slug || "");
        setError("");
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "The course library could not be loaded.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  async function importPack() {
    if (busy || disabled || !slug) return;
    setBusy(true);
    setError("");
    try {
      const result = await loadLibrary(slug);
      const parsed = courseContentSchema.safeParse(result.content);
      if (!parsed.success)
        throw new Error(
          "This course pack could not be read. Please ask the course author to check it.",
        );
      // Typing in the editor removes the picker; a late response must not replace that work.
      if (mounted.current) onLoad(parsed.data);
    } catch (cause) {
      if (mounted.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "The course pack could not be loaded.",
        );
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  if (loading)
    return <p role="status">Checking the authored course library…</p>;
  if (!courses.length && !error) return null;
  const selected = courses.find((course) => course.slug === slug);
  return (
    <section className="lms-panel lms-form" style={{ marginBottom: 24 }}>
      <h2>Choose an Experrt agent course</h2>
      <p>
        Load a complete authored course into this editor, including its lessons,
        practice questions, lab instructions and resources. Review the content,
        then save it as a draft. Loading a pack does not publish it or enrol
        anyone.
      </p>
      {courses.length > 0 ? (
        <>
          <label>
            Authored course
            <select
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              disabled={disabled || busy}
            >
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
          <p>{selected?.audience}</p>
          <p className="lms-muted">
            6 modules · 36 activities · Authoring version {version}. Check
            product access and practical assessment arrangements before
            publishing.
          </p>
          <button
            type="button"
            className="lms-button secondary"
            disabled={disabled || busy || !slug}
            onClick={importPack}
          >
            {busy ? "Loading course…" : "Load course for review"}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="lms-button secondary"
          onClick={() => {
            setLoading(true);
            setRetry((value) => value + 1);
          }}
        >
          Try loading the library again
        </button>
      )}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
