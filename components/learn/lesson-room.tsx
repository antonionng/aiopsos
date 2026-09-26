"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Award, List } from "lucide-react";
import { Emphasis, LearnBar } from "@/components/learn/learn-bar";
import {
  courseArtefact,
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
  const artefact = courseArtefact(course);
  const artefactPhrase = artefact
    ? `${artefact.title.charAt(0).toLowerCase()}${artefact.title.slice(1)} you produced`
    : "the work you produced";
  const [progress, setProgress] = useState<CourseProgress>(initialProgress ?? emptyProgress());
  const [index, setIndex] = useState(() => firstOpenIndex(lessons, initialProgress ?? emptyProgress()));
  const [ready, setReady] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [draft, setDraft] = useState<LessonAnswer | null>(null);
  const [feedback, setFeedback] = useState<{ detail: string; passed: boolean } | null>(null);
  const [name, setName] = useState("");
  const shouldScroll = useRef(false);

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
  const passedCount = lessons.filter((item) => progress.lessons[item.id]?.passed).length;
  const toGo = lessons.length - passedCount;

  function openLesson(next: number) {
    if (!canOpenLesson(lessons, progress, next)) return;
    setIndex(next);
    setIndexOpen(false);
    shouldScroll.current = true;
  }

  useLayoutEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  }, [index]);

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
  const hasPrev = index > 0;
  const nextOpen = hasNext && canOpenLesson(lessons, progress, index + 1);

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
                    className={itemIndex === index ? "ex-lesson-link is-now" : "ex-lesson-link"}
                    disabled={!open}
                    aria-current={itemIndex === index ? "step" : undefined}
                    onClick={() => openLesson(itemIndex)}
                  >
                    <b>{String(itemIndex + 1).padStart(2, "0")}</b>
                    <strong>{item.title}</strong>
                    <span>
                      {itemIndex === index ? "You are here" : passed ? "Done" : open ? "Open" : "Locked"}
                    </span>
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
            <nav className="ex-lesson-nav" aria-label="Lessons in this course">
              <button
                type="button"
                className="ex-step-button"
                disabled={!hasPrev}
                onClick={() => openLesson(index - 1)}
                aria-label="Previous lesson"
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
              <ol className="ex-ticks">
                {lessons.map((item, itemIndex) => {
                  const passed = progress.lessons[item.id]?.passed;
                  const now = itemIndex === index;
                  const open = canOpenLesson(lessons, progress, itemIndex);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={passed ? "is-done" : now ? "is-now" : undefined}
                        disabled={!open || now}
                        aria-current={now ? "step" : undefined}
                        aria-label={`Lesson ${itemIndex + 1}: ${item.title}${passed ? ", done" : open ? "" : ", locked"}`}
                        title={item.title}
                        onClick={() => openLesson(itemIndex)}
                      />
                    </li>
                  );
                })}
              </ol>
              <button
                type="button"
                className="ex-step-button"
                disabled={!nextOpen}
                onClick={() => openLesson(index + 1)}
                aria-label="Next lesson"
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </nav>
            <p className="sr-only">
              Lesson {index + 1} of {lessons.length}
            </p>
            <p className={progress.ref ? "ex-cert-goal is-earned" : "ex-cert-goal"}>
              <Award size={16} aria-hidden="true" />
              {progress.ref ? (
                <span>
                  You are Experrt certified.{" "}
                  <Link href={`/learn/${course.slug}/certificate`}>Open your certificate</Link>
                </span>
              ) : done ? (
                <span>Every check passed. Sign your work below to receive your certificate.</span>
              ) : (
                <span>
                  {passedCount} of {lessons.length} passed. {toGo === 1 ? "One more check" : `${toGo} more checks`} to your certificate.
                </span>
              )}
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
            <PracticeFrame lesson={lesson} slug={course.slug} coach={persist} />
            <CheckFrame
              slug={course.slug}
              coach={persist}
              lesson={lesson}
              answer={answer}
              feedback={feedback}
              passed={lessonPassedNow}
              changed={draft !== null}
              onChange={setDraft}
              onCommit={commit}
            />
            <nav className="ex-pager" aria-label="Move between lessons">
              {hasPrev ? (
                <button type="button" onClick={() => openLesson(index - 1)}>
                  <span>
                    <ArrowLeft size={14} /> Previous lesson
                  </span>
                  <strong>{lessons[index - 1].title}</strong>
                </button>
              ) : (
                <span />
              )}
              {hasNext ? (
                <button
                  type="button"
                  className={nextOpen ? "is-next is-ready" : "is-next"}
                  disabled={!nextOpen}
                  onClick={() => openLesson(index + 1)}
                >
                  <span>
                    Next lesson <ArrowRight size={14} />
                  </span>
                  <strong>{lessons[index + 1].title}</strong>
                  {!nextOpen ? <em>Opens when you pass this lesson&apos;s check.</em> : null}
                </button>
              ) : null}
            </nav>
            {done ? (
              <section className="ex-sign" aria-labelledby="sign-heading">
                <h2 id="sign-heading">Sign your work and get certified</h2>
                <p className="ex-lede">
                  When you sign, Experrt issues your certificate straight away. It names you and {artefactPhrase}, carries a reference anyone can check online, and can be downloaded or added to LinkedIn. It does not say that you are compliant with any regulation.
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
                  Sign and get my certificate
                  <ArrowRight size={18} />
                </button>
                {progress.ref ? (
                  <Link className="ex-record-link" href={`/learn/${course.slug}/certificate`}>
                    Open your certificate
                  </Link>
                ) : null}
              </section>
            ) : null}
          </div>
        )}
      </main>
      {ready && lesson ? (
        <nav className="ex-dock" aria-label="Lesson controls">
          <button type="button" disabled={!hasPrev} onClick={() => openLesson(index - 1)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <button
            type="button"
            className="ex-dock-index"
            onClick={() => setIndexOpen((open) => !open)}
            aria-expanded={indexOpen}
          >
            <List size={16} />
            <span>
              Lesson {index + 1} of {lessons.length}
            </span>
          </button>
          <button
            type="button"
            className="is-next"
            disabled={!nextOpen}
            onClick={() => openLesson(index + 1)}
          >
            <span>Next</span>
            <ArrowRight size={18} />
          </button>
        </nav>
      ) : null}
    </>
  );
}

function Worked({ example }: { example: WorkedExample }) {
  return (
    <figure className="ex-example">
      <figcaption className="ex-stamp">{example.title}</figcaption>
      <p className="ex-example-label">{(example.inputLabel ?? "The prompt").toUpperCase()}</p>
      <p className="ex-quote">{example.prompt}</p>
      <p className="ex-example-label">{(example.outputLabel ?? "What the model wrote").toUpperCase()}</p>
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

function PracticeFrame({ lesson, slug, coach }: { lesson: SelfServeLesson; slug: string; coach: boolean }) {
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
      {coach && writtenWork(check) && value !== null && ready ? (
        <Coach slug={slug} lessonId={lesson.id} part="practice" answer={value} />
      ) : null}
    </section>
  );
}

function CheckFrame({
  slug,
  coach,
  lesson,
  answer,
  feedback,
  passed,
  changed,
  onChange,
  onCommit,
}: {
  slug: string;
  coach: boolean;
  lesson: SelfServeLesson;
  answer: LessonAnswer | null;
  feedback: { detail: string; passed: boolean } | null;
  passed: boolean;
  changed: boolean;
  onChange: (answer: LessonAnswer) => void;
  onCommit: (answer: LessonAnswer) => void;
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
      <CheckControls check={check} answer={answer} onChange={onChange} reviewed={feedback !== null} />
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
      {coach && writtenWork(check) && value !== null && ready ? (
        <Coach slug={slug} lessonId={lesson.id} part="check" answer={value} />
      ) : null}
      {settled && check.kind === "edit" && check.result ? (
        <div className="ex-result">
          <Material material={check.result} />
        </div>
      ) : null}
      {settled ? (
        <div className="ex-next">
          <p className="ex-bridge">{lesson.bridge}</p>
        </div>
      ) : null}
    </section>
  );
}

function writtenWork(check: LessonCheck): boolean {
  return check.kind === "build" || check.kind === "edit";
}

function Coach({
  slug,
  lessonId,
  part,
  answer,
}: {
  slug: string;
  lessonId: string;
  part: "practice" | "check";
  answer: LessonAnswer;
}) {
  const [state, setState] = useState<{ pending: boolean; text: string; error: string }>({
    pending: false,
    text: "",
    error: "",
  });
  async function ask() {
    setState({ pending: true, text: "", error: "" });
    try {
      const res = await fetch("/api/learn/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, lessonId, part, answer }),
      });
      const data = (await res.json()) as { feedback?: string; detail?: string };
      if (data.feedback) setState({ pending: false, text: data.feedback, error: "" });
      else setState({ pending: false, text: "", error: data.detail ?? "Coaching could not be generated. Try again in a moment." });
    } catch {
      setState({ pending: false, text: "", error: "Coaching could not be generated. Try again in a moment." });
    }
  }
  return (
    <div className="ex-coach">
      <button type="button" className="ex-button ex-button-line" onClick={ask} disabled={state.pending}>
        {state.pending ? "Reading your draft" : state.text ? "Get fresh feedback on this draft" : "Get feedback on my draft"}
      </button>
      <p className="ex-coach-note">
        A tutor model reads your draft against this lesson and suggests improvements. The course check still decides whether you pass.
      </p>
      {state.text ? (
        <div className="ex-coach-text" role="status">
          <p className="ex-coach-label">FEEDBACK ON YOUR DRAFT</p>
          {state.text.split(/\n+/).filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
      {state.error ? <p className="ex-hint">{state.error}</p> : null}
    </div>
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
      return "Edit the text to continue.";
    case "scenario":
      return "Answer every question to continue.";
    default:
      return "";
  }
}

function CheckControls({
  check,
  answer,
  onChange,
  reviewed = false,
}: {
  check: LessonCheck;
  answer: LessonAnswer | null;
  onChange: (answer: LessonAnswer) => void;
  reviewed?: boolean;
}) {
  switch (check.kind) {
    case "scenario":
      return (
        <ScenarioCheck
          check={check}
          answer={isRecord(answer) ? (answer as Record<string, string>) : {}}
          onChange={onChange}
          reviewed={reviewed}
        />
      );
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

function ScenarioCheck({
  check,
  answer,
  onChange,
  reviewed,
}: {
  check: Extract<LessonCheck, { kind: "scenario" }>;
  answer: Record<string, string>;
  onChange: (answer: LessonAnswer) => void;
  reviewed: boolean;
}) {
  const total = check.questions.length;
  const answered = check.questions.filter((question) => answer[question.id]).length;
  const needed = Math.min(check.passMark ?? total, total);
  return (
    <div className="ex-scenario">
      <p className="ex-scenario-meta">
        {answered} of {total} answered.{" "}
        {needed === total ? "Every answer must be right to pass." : `${needed} of ${total} must be right to pass.`}
      </p>
      <ol>
        {check.questions.map((question, index) => {
          const chosen = question.options.find((option) => option.id === answer[question.id]);
          const state = reviewed && chosen ? (chosen.correct ? "is-right" : "is-wrong") : "";
          return (
            <li key={question.id} className={`ex-scenario-q ${state}`}>
              <p className="ex-scenario-num">
                Question {index + 1} of {total}
              </p>
              <p className="ex-scenario-situation">{question.situation}</p>
              <h3>{question.question}</h3>
              <div className="ex-scenario-options" role="radiogroup" aria-label={question.question}>
                {question.options.map((option) => {
                  const on = answer[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      className={on ? "ex-scenario-option is-on" : "ex-scenario-option"}
                      onClick={() => onChange({ ...answer, [question.id]: option.id })}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
              {reviewed && chosen ? (
                <p className="ex-scenario-feedback">
                  <strong>{chosen.correct ? "Right." : "Not quite."}</strong> {chosen.feedback}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
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
      <label htmlFor="edit-prompt">{(check.label ?? "The prompt you are repairing").toUpperCase()}</label>
      <textarea
        id="edit-prompt"
        value={value}
        rows={9}
        onChange={(event) => onChange({ edited: event.target.value })}
      />
      <button type="button" className="ex-edit-reset" onClick={() => onChange({ edited: check.start })}>
        Put back the original text
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
