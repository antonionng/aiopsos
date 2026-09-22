"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Emphasis, LearnBar } from "@/components/learn/learn-bar";
import {
  answerComplete,
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
  CheckMaterial,
  CourseProgress,
  EditAnswer,
  LessonAnswer,
  LessonCheck,
  MarkAnswer,
  SelfServeCourse,
  SelfServeLesson,
  WorkedExample,
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
    window.scrollTo({ top: 0 });
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
    if (outcome.passed) setDraft(null);
  }

  const lessonPassedNow = lesson ? progress.lessons[lesson.id]?.passed === true : false;
  const hasNext = index < lessons.length - 1;

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
            <p className="ex-decision">{lesson.place}</p>
            <div className="ex-read">
              {lesson.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.beforeAfter ? (
                    <div className="ex-before-after">
                      <div>
                        <span>BEFORE</span>
                        <p>{section.beforeAfter.before}</p>
                      </div>
                      <div>
                        <span>AFTER</span>
                        <p>{section.beforeAfter.after}</p>
                      </div>
                      <p className="ex-before-after-reading">{section.beforeAfter.reading}</p>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
            <Worked example={lesson.workedExample} />
            <PracticeFrame lesson={lesson} />
            <CheckFrame
              lesson={lesson}
              answer={answer}
              feedback={feedback}
              passed={lessonPassedNow}
              changed={draft !== null}
              onChange={setDraft}
              onCommit={commit}
              onNext={hasNext ? () => openLesson(index + 1) : undefined}
            />
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

function Worked({ example }: { example: WorkedExample }) {
  return (
    <figure className="ex-example">
      <figcaption className="ex-stamp">{example.title}</figcaption>
      <p className="ex-example-label">THE PROMPT</p>
      <p className="ex-quote">{example.prompt}</p>
      <p className="ex-example-label">WHAT THE MODEL WROTE</p>
      <p className="ex-quote">{example.output}</p>
      <p className="ex-example-label">READING IT</p>
      <div className="ex-reading">
        {example.reading.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </figure>
  );
}

function Material({ material }: { material?: CheckMaterial }) {
  if (!material) return null;
  return (
    <figure className="ex-material">
      <figcaption>{material.label.toUpperCase()}</figcaption>
      <p>{material.text}</p>
    </figure>
  );
}

/** The value Continue submits, filling in the defaults a control shows before it is touched. */
function submittable(check: LessonCheck, answer: LessonAnswer | null): LessonAnswer | null {
  if (check.kind === "order") return Array.isArray(answer) ? answer : reversedIds(check);
  if (check.kind === "choose") return answer === "left" || answer === "right" ? answer : null;
  if (check.kind === "edit") return isRecord(answer) ? answer : { edited: check.start };
  return isRecord(answer) ? answer : {};
}

function PracticeFrame({ lesson }: { lesson: SelfServeLesson }) {
  const check = lesson.practice.check;
  const [answer, setAnswer] = useState<LessonAnswer | null>(null);
  const [result, setResult] = useState<{ detail: string; passed: boolean } | null>(null);
  const value = submittable(check, answer);
  const ready = value !== null && answerComplete(check, value);
  return (
    <section className="ex-practice" aria-labelledby="practice-prompt">
      <p className="ex-stamp">Practice</p>
      <p className="ex-frame-intro">{lesson.practice.intro}</p>
      <h2 id="practice-prompt">{check.prompt}</h2>
      <Material material={check.material} />
      <CheckControls
        check={check}
        answer={answer}
        onChange={(next) => {
          setAnswer(next);
          setResult(null);
        }}
      />
      <button
        type="button"
        className="ex-button ex-button-line ex-continue"
        disabled={!ready}
        onClick={() => {
          if (value !== null) setResult(evaluateCheck(check, value));
        }}
      >
        Check my practice
      </button>
      {result ? (
        <p className={result.passed ? "ex-feedback is-pass" : "ex-feedback"} role="status">
          {result.detail}
        </p>
      ) : null}
    </section>
  );
}

function CheckFrame({
  lesson,
  answer,
  feedback,
  passed,
  changed,
  onChange,
  onCommit,
  onNext,
}: {
  lesson: SelfServeLesson;
  answer: LessonAnswer | null;
  feedback: { detail: string; passed: boolean } | null;
  passed: boolean;
  changed: boolean;
  onChange: (answer: LessonAnswer) => void;
  onCommit: (answer: LessonAnswer) => void;
  onNext?: () => void;
}) {
  const check = lesson.check;
  const value = submittable(check, answer);
  const ready = value !== null && answerComplete(check, value);
  const settled = passed && !changed;
  return (
    <section className="ex-work" aria-labelledby="check-prompt">
      <p className="ex-stamp">Check</p>
      <p className="ex-frame-intro">This is a new case. You will stay on this lesson until the check is right.</p>
      <h2 id="check-prompt">{check.prompt}</h2>
      <Material material={check.material} />
      <CheckControls check={check} answer={answer} onChange={onChange} />
      {settled ? null : (
        <>
          <button
            type="button"
            className="ex-button ex-button-dark ex-continue"
            disabled={!ready}
            onClick={() => {
              if (value !== null) onCommit(value);
            }}
          >
            Continue
            <ArrowRight size={18} />
          </button>
          {!ready ? <p className="ex-hint">{waitingNote(check)}</p> : null}
        </>
      )}
      {feedback ? (
        <p className={feedback.passed ? "ex-feedback is-pass" : "ex-feedback"} role="status">
          {feedback.detail}
        </p>
      ) : null}
      {settled && check.kind === "edit" && check.result ? (
        <div className="ex-result">
          <Material material={check.result} />
        </div>
      ) : null}
      {settled ? (
        <div className="ex-next">
          <p className="ex-bridge">{lesson.bridge}</p>
          {onNext ? (
            <button type="button" className="ex-button ex-button-dark" onClick={onNext}>
              Next lesson
              <ArrowRight size={18} />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function waitingNote(check: LessonCheck): string {
  switch (check.kind) {
    case "mark":
      return "Mark every sentence to continue.";
    case "choose":
      return "Choose one of the two to continue.";
    case "build":
      return "Write something in every part of the card to continue.";
    case "edit":
      return "Edit the prompt to continue.";
    default:
      return "";
  }
}

function CheckControls({
  check,
  answer,
  onChange,
}: {
  check: LessonCheck;
  answer: LessonAnswer | null;
  onChange: (answer: LessonAnswer) => void;
}) {
  switch (check.kind) {
    case "mark":
      return <MarkCheck check={check} answer={isRecord(answer) ? (answer as MarkAnswer) : {}} onChange={onChange} />;
    case "choose":
      return (
        <ChooseCheck
          check={check}
          answer={answer === "left" || answer === "right" ? answer : null}
          onChange={onChange}
        />
      );
    case "order":
      return (
        <OrderCheck check={check} answer={Array.isArray(answer) ? answer : reversedIds(check)} onChange={onChange} />
      );
    case "build":
      return <BuildCheck check={check} answer={isRecord(answer) ? (answer as BuildAnswer) : {}} onChange={onChange} />;
    case "edit":
      return (
        <EditCheck
          check={check}
          value={isRecord(answer) && typeof answer.edited === "string" ? answer.edited : check.start}
          onChange={onChange}
        />
      );
  }
}

function isRecord(answer: LessonAnswer | null): answer is MarkAnswer | BuildAnswer | EditAnswer {
  return !!answer && typeof answer === "object" && !Array.isArray(answer);
}

function EditCheck({
  check,
  value,
  onChange,
}: {
  check: Extract<LessonCheck, { kind: "edit" }>;
  value: string;
  onChange: (answer: LessonAnswer) => void;
}) {
  return (
    <div className="ex-edit">
      <label htmlFor="edit-prompt">THE PROMPT YOU ARE REPAIRING</label>
      <textarea
        id="edit-prompt"
        value={value}
        rows={9}
        onChange={(event) => onChange({ edited: event.target.value })}
      />
      <button type="button" className="ex-edit-reset" onClick={() => onChange({ edited: check.start })}>
        Put back the original prompt
      </button>
    </div>
  );
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
