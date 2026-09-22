"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Emphasis, LearnBar } from "@/components/learn/learn-bar";
import {
  canOpenLesson,
  canSign,
  certificateRef,
  checksPassed,
  emptyProgress,
  evaluateCheck,
  firstOpenIndex,
  progressStorageKey,
} from "@/lib/self-serve/engine";
import { trackLabel } from "@/lib/self-serve/catalog";
import type {
  BuildAnswer,
  CourseProgress,
  LessonAnswer,
  LessonCheck,
  MarkAnswer,
  SelfServeCourse,
  SelfServeLesson,
} from "@/lib/self-serve/types";

function readProgress(slug: string): CourseProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(progressStorageKey(slug));
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as CourseProgress;
    if (!parsed || typeof parsed !== "object" || !parsed.lessons) return emptyProgress();
    return parsed;
  } catch {
    return emptyProgress();
  }
}

function reversedIds(check: Extract<LessonCheck, { kind: "order" }>): string[] {
  return [...check.steps].map((step) => step.id).reverse();
}

export function LessonRoom({
  course,
  persist = false,
  initialProgress,
}: {
  course: SelfServeCourse;
  persist?: boolean;
  initialProgress?: CourseProgress;
}) {
  const router = useRouter();
  const lessons = course.lessons ?? [];
  const [progress, setProgress] = useState<CourseProgress>(initialProgress ?? emptyProgress());
  const [index, setIndex] = useState(() => firstOpenIndex(lessons, initialProgress ?? emptyProgress()));
  const [ready, setReady] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [draft, setDraft] = useState<LessonAnswer | null>(null);
  const [feedback, setFeedback] = useState<{ detail: string; passed: boolean } | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = initialProgress ?? readProgress(course.slug);
    const serverEmpty = !initialProgress || Object.keys(initialProgress.lessons).length === 0;
    const local = readProgress(course.slug);
    const next =
      persist && serverEmpty && Object.keys(local.lessons).length > 0 ? local : stored;
    setProgress(next);
    setIndex(firstOpenIndex(lessons, next));
    setName(next.signedName ?? "");
    setReady(true);
  }, [course.slug, initialProgress, lessons, persist]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(progressStorageKey(course.slug), JSON.stringify(progress));
    if (!persist) return;
    void fetch("/api/learn/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: course.slug, progress }),
    });
  }, [course.slug, persist, progress, ready]);

  const lesson = lessons[index];

  useEffect(() => {
    setDraft(null);
    setFeedback(null);
  }, [lesson?.id]);

  useEffect(() => {
    if (!lesson || lesson.check.kind !== "order") return;
    if (progress.lessons[lesson.id]) return;
    setDraft(reversedIds(lesson.check));
  }, [lesson, progress.lessons]);

  const savedAnswer = lesson ? progress.lessons[lesson.id]?.answer : undefined;
  const answer = draft ?? savedAnswer ?? null;
  const done = checksPassed(lessons, progress);

  function openLesson(next: number) {
    if (!canOpenLesson(lessons, progress, next)) return;
    setIndex(next);
    setIndexOpen(false);
  }

  function commit(nextAnswer: LessonAnswer) {
    if (!lesson) return;
    const outcome = evaluateCheck(lesson.check, nextAnswer);
    setFeedback({ detail: outcome.detail, passed: outcome.passed });
    setProgress((current) => ({
      ...current,
      lessons: {
        ...current.lessons,
        [lesson.id]: { passed: outcome.passed, answer: nextAnswer },
      },
    }));
    if (outcome.passed && index < lessons.length - 1) {
      setIndex(index + 1);
      setDraft(null);
      setFeedback(null);
    }
  }

  function restart() {
    setProgress(emptyProgress());
    setIndex(0);
    setDraft(null);
    setFeedback(null);
    setName("");
    setIndexOpen(false);
    window.localStorage.removeItem(progressStorageKey(course.slug));
  }

  async function sign() {
    if (!canSign(lessons, progress, name)) return;
    const signedAt = new Date().toISOString();
    const next = {
      ...progress,
      signedName: name.trim(),
      signedAt,
      ref: persist ? progress.ref : progress.ref ?? certificateRef(name, signedAt),
    };
    setProgress(next);
    window.localStorage.setItem(progressStorageKey(course.slug), JSON.stringify(next));
    if (persist) {
      const res = await fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: course.slug, progress: next, sign: true }),
      });
      const data = (await res.json()) as { progress?: CourseProgress };
      if (data.progress?.ref) {
        window.localStorage.setItem(progressStorageKey(course.slug), JSON.stringify(data.progress));
        setProgress(data.progress);
      }
    }
    router.push(`/learn/${course.slug}/certificate`);
  }

  return (
    <>
      <a className="ex-skip" href="#lesson">
        Skip to the lesson
      </a>
      <LearnBar
        action={
          <button type="button" onClick={() => setIndexOpen((open) => !open)} aria-expanded={indexOpen}>
            Lessons
          </button>
        }
      />
      {indexOpen ? (
        <div className="ex-sheet">
          <ol className="ex-measure">
            {lessons.map((item, itemIndex) => {
              const open = canOpenLesson(lessons, progress, itemIndex);
              const passed = progress.lessons[item.id]?.passed;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="ex-lesson-link"
                    disabled={!open}
                    onClick={() => openLesson(itemIndex)}
                  >
                    <strong>{item.title}</strong>
                    <span>{passed ? "Done" : open ? "Open" : "Locked"}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <button type="button" className="ex-restart ex-measure" onClick={restart}>
            Start again
          </button>
        </div>
      ) : null}

      <main id="lesson" className="ex-room ex-measure">
        {!ready || !lesson ? (
          <p className="ex-lede">Opening the lesson.</p>
        ) : (
          <div className="ex-room-body" key={lesson.id}>
            <p className="ex-eyebrow">
              <span />
              {trackLabel(course.track).toUpperCase()} · {String(index + 1).padStart(2, "0")} / {String(lessons.length).padStart(2, "0")}
            </p>
            <h1>
              <Emphasis text={lesson.title} word={lesson.emphasis} />
            </h1>
            <div className="ex-ticks" aria-hidden="true">
              {lessons.map((item, itemIndex) => {
                const passed = progress.lessons[item.id]?.passed;
                const now = itemIndex === index;
                return <span key={item.id} className={passed ? "is-done" : now ? "is-now" : undefined} />;
              })}
            </div>
            <p className="sr-only">
              Lesson {index + 1} of {lessons.length}
            </p>
            <p className="ex-decision">{lesson.decision}</p>
            <div className="ex-read">
              {lesson.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <figure className="ex-example">
              <figcaption className="ex-stamp">{lesson.exampleTitle}</figcaption>
              <p>{lesson.example}</p>
            </figure>
            <CheckFrame lesson={lesson} answer={answer} feedback={feedback} onChange={setDraft} onCommit={commit} />
            {done ? (
              <section className="ex-sign" aria-labelledby="sign-heading">
                <h2 id="sign-heading">Sign the record</h2>
                <p className="ex-lede">
                  When you sign, the record names you and the prompt card you produced. A second person can open the public reference. The record does not say that you are compliant with any regulation.
                </p>
                <label htmlFor="signer">YOUR NAME</label>
                <input
                  id="signer"
                  value={name}
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                />
                {name.trim().length === 1 ? <p className="ex-hint">Use at least two characters.</p> : null}
                <button
                  type="button"
                  className="ex-button ex-button-dark"
                  disabled={!canSign(lessons, progress, name)}
                  onClick={sign}
                >
                  Sign the record
                  <ArrowRight size={18} />
                </button>
                {progress.ref ? (
                  <Link className="ex-record-link" href={`/learn/${course.slug}/certificate`}>
                    Open the record
                  </Link>
                ) : null}
              </section>
            ) : null}
          </div>
        )}
      </main>
    </>
  );
}

function CheckFrame({
  lesson,
  answer,
  feedback,
  onChange,
  onCommit,
}: {
  lesson: SelfServeLesson;
  answer: LessonAnswer | null;
  feedback: { detail: string; passed: boolean } | null;
  onChange: (answer: LessonAnswer) => void;
  onCommit: (answer: LessonAnswer) => void;
}) {
  const check = lesson.check;
  const chooseReady = check.kind === "choose" && (answer === "left" || answer === "right");
  return (
    <section className="ex-work" aria-labelledby="check-prompt">
      <p className="ex-frame-intro">Complete the check below. You will stay on this lesson until it is right.</p>
      <h2 id="check-prompt">{check.prompt}</h2>
      {check.kind === "mark" ? (
        <MarkCheck
          check={check}
          answer={isRecord(answer) ? (answer as MarkAnswer) : {}}
          onChange={onChange}
        />
      ) : null}
      {check.kind === "choose" ? (
        <ChooseCheck
          check={check}
          answer={answer === "left" || answer === "right" ? answer : null}
          onChange={onChange}
        />
      ) : null}
      {check.kind === "order" ? (
        <OrderCheck
          check={check}
          answer={Array.isArray(answer) ? answer : reversedIds(check)}
          onChange={onChange}
        />
      ) : null}
      {check.kind === "build" ? (
        <BuildCheck
          check={check}
          answer={isRecord(answer) ? (answer as BuildAnswer) : {}}
          onChange={onChange}
        />
      ) : null}
      <button
        type="button"
        className="ex-button ex-button-dark ex-continue"
        disabled={check.kind === "choose" && !chooseReady}
        onClick={() => {
          if (check.kind === "order") {
            onCommit(Array.isArray(answer) ? answer : reversedIds(check));
            return;
          }
          if (check.kind === "choose") {
            if (answer === "left" || answer === "right") onCommit(answer);
            return;
          }
          if (isRecord(answer)) onCommit(answer);
          else onCommit({});
        }}
      >
        Continue
        <ArrowRight size={18} />
      </button>
      {feedback ? (
        <p className={feedback.passed ? "ex-feedback is-pass" : "ex-feedback"} role="status">
          {feedback.detail}
        </p>
      ) : null}
    </section>
  );
}

function isRecord(answer: LessonAnswer | null): answer is MarkAnswer | BuildAnswer {
  return !!answer && typeof answer === "object" && !Array.isArray(answer);
}

function MarkCheck({
  check,
  answer,
  onChange,
}: {
  check: Extract<LessonCheck, { kind: "mark" }>;
  answer: MarkAnswer;
  onChange: (answer: LessonAnswer) => void;
}) {
  return (
    <ul className="ex-order">
      {check.sentences.map((sentence) => (
        <li key={sentence.id} className="ex-sentence" style={{ display: "block" }}>
          <p>{sentence.text}</p>
          <div className="ex-choices">
            {(["pass", "fail"] as const).map((mark) => (
              <button
                key={mark}
                type="button"
                className={answer[sentence.id] === mark ? "ex-choice is-on" : "ex-choice"}
                aria-pressed={answer[sentence.id] === mark}
                onClick={() => onChange({ ...answer, [sentence.id]: mark })}
              >
                {mark === "pass" ? check.passLabel : check.failLabel}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ChooseCheck({
  check,
  answer,
  onChange,
}: {
  check: Extract<LessonCheck, { kind: "choose" }>;
  answer: "left" | "right" | null;
  onChange: (answer: LessonAnswer) => void;
}) {
  const sides = [
    { id: "left" as const, label: check.leftLabel, body: check.left },
    { id: "right" as const, label: check.rightLabel, body: check.right },
  ];
  return (
    <div className="ex-briefs">
      {sides.map((side) => (
        <button
          key={side.id}
          type="button"
          className={answer === side.id ? "ex-brief is-on" : "ex-brief"}
          aria-pressed={answer === side.id}
          onClick={() => onChange(side.id)}
        >
          <span>{side.label.toUpperCase()}</span>
          <span className="ex-brief-body">{side.body}</span>
        </button>
      ))}
    </div>
  );
}

function OrderCheck({
  check,
  answer,
  onChange,
}: {
  check: Extract<LessonCheck, { kind: "order" }>;
  answer: string[];
  onChange: (answer: LessonAnswer) => void;
}) {
  const labels = useMemo(() => new Map(check.steps.map((step) => [step.id, step.label])), [check.steps]);

  function move(from: number, direction: -1 | 1) {
    const next = answer.slice();
    const target = from + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(from, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <ol className="ex-order">
      {answer.map((id, stepIndex) => {
        const label = labels.get(id) ?? id;
        return (
          <li key={id}>
            <b>{String(stepIndex + 1).padStart(2, "0")}</b>
            <p>{label}</p>
            <span className="ex-nudges">
              <button type="button" onClick={() => move(stepIndex, -1)} disabled={stepIndex === 0} aria-label={`Move up: ${label}`}>
                Up
              </button>
              <button
                type="button"
                onClick={() => move(stepIndex, 1)}
                disabled={stepIndex === answer.length - 1}
                aria-label={`Move down: ${label}`}
              >
                Down
              </button>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function BuildCheck({
  check,
  answer,
  onChange,
}: {
  check: Extract<LessonCheck, { kind: "build" }>;
  answer: BuildAnswer;
  onChange: (answer: LessonAnswer) => void;
}) {
  return (
    <div className="ex-card">
      {check.fields.map((field) => (
        <label key={field.id}>
          <span>{field.label.toUpperCase()}</span>
          <small>{field.hint}</small>
          <textarea
            value={answer[field.id] ?? ""}
            rows={2}
            onChange={(event) => onChange({ ...answer, [field.id]: event.target.value })}
          />
        </label>
      ))}
    </div>
  );
}
