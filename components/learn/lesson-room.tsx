"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import {
  canOpenLesson,
  canSign,
  certificateRef,
  checksPassed,
  emptyProgress,
  evaluateCheck,
  firstOpenIndex,
} from "@/lib/self-serve/engine";
import type {
  BuildAnswer,
  CourseProgress,
  LessonAnswer,
  MarkAnswer,
  SelfServeCourse,
  SelfServeLesson,
} from "@/lib/self-serve/types";

function storageKey(slug: string) {
  return `experrt-self-serve:${slug}`;
}

function readProgress(slug: string): CourseProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as CourseProgress;
    if (!parsed || typeof parsed !== "object" || !parsed.lessons) return emptyProgress();
    return parsed;
  } catch {
    return emptyProgress();
  }
}

export function LessonRoom({ course }: { course: SelfServeCourse }) {
  const router = useRouter();
  const lessons = course.lessons ?? [];
  const [progress, setProgress] = useState<CourseProgress>(emptyProgress);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [draft, setDraft] = useState<LessonAnswer | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = readProgress(course.slug);
    setProgress(stored);
    setIndex(firstOpenIndex(lessons, stored));
    setName(stored.signedName ?? "");
    setReady(true);
  }, [course.slug, lessons]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey(course.slug), JSON.stringify(progress));
  }, [course.slug, progress, ready]);

  const lesson = lessons[index];

  useEffect(() => {
    if (!lesson || lesson.check.kind !== "order") return;
    if (progress.lessons[lesson.id]) return;
    setDraft((current) => current ?? [...lesson.check.steps].map((step) => step.id).reverse());
  }, [lesson, progress.lessons]);
  const passedCount = lessons.filter((item) => progress.lessons[item.id]?.passed).length;
  const width = lessons.length === 0 ? 0 : (passedCount / lessons.length) * 100;
  const done = checksPassed(lessons, progress);

  const savedAnswer = lesson ? progress.lessons[lesson.id]?.answer : undefined;
  const answer = draft ?? savedAnswer ?? null;

  function openLesson(next: number) {
    if (!canOpenLesson(lessons, progress, next)) return;
    setIndex(next);
    setDraft(null);
    setFeedback(null);
    setIndexOpen(false);
  }

  function commit(nextAnswer: LessonAnswer) {
    if (!lesson) return;
    const outcome = evaluateCheck(lesson.check, nextAnswer);
    setFeedback(outcome.detail);
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

  function sign() {
    if (!canSign(lessons, progress, name)) return;
    const signedAt = new Date().toISOString();
    const ref = certificateRef(name, signedAt);
    const next = { ...progress, signedName: name.trim(), signedAt, ref };
    setProgress(next);
    window.localStorage.setItem(storageKey(course.slug), JSON.stringify(next));
    router.push(`/learn/${course.slug}/certificate`);
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/learn" className="flex items-center" aria-label="All self-serve courses">
            <Wordmark size="sm" />
          </Link>
          <p className="hidden text-xs text-muted-foreground sm:block">{course.title}</p>
          <button
            type="button"
            onClick={() => setIndexOpen((open) => !open)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Lessons
          </button>
        </div>
        <div className="h-px bg-transparent">
          <div className="h-px bg-brand transition-[width] duration-300" style={{ width: `${width}%` }} />
        </div>
      </div>

      {indexOpen ? (
        <div className="fixed inset-0 z-30 bg-background/80 pt-14" onClick={() => setIndexOpen(false)}>
          <div
            className="mx-auto max-w-md border-x border-b border-border bg-background p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <ol className="space-y-2">
              {lessons.map((item, itemIndex) => {
                const open = canOpenLesson(lessons, progress, itemIndex);
                const passed = progress.lessons[item.id]?.passed;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!open}
                      onClick={() => openLesson(itemIndex)}
                      className="flex w-full items-center justify-between py-2 text-left text-sm disabled:text-muted-foreground"
                    >
                      <span>{item.title}</span>
                      {passed ? <Check className="h-4 w-4" /> : null}
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              onClick={() => {
                setProgress(emptyProgress());
                setIndex(0);
                setDraft(null);
                setFeedback(null);
                setName("");
                setIndexOpen(false);
                window.localStorage.removeItem(storageKey(course.slug));
              }}
              className="mt-6 text-xs text-muted-foreground"
            >
              Start again
            </button>
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-24">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {index + 1} of {lessons.length}
        </p>
        <h1 className="mb-4 font-display text-4xl font-bold tracking-[-0.03em]">{lesson.title}</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{lesson.decision}</p>
        {lesson.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mb-4 text-base leading-7">
            {paragraph}
          </p>
        ))}

        <figure className="my-8 rounded-2xl border border-border bg-card p-6">
          <figcaption className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {lesson.exampleTitle}
          </figcaption>
          <p className="leading-7">{lesson.example}</p>
        </figure>

        <CheckFrame
          lesson={lesson}
          answer={answer}
          feedback={feedback}
          onChange={setDraft}
          onCommit={commit}
        />

        {done ? (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="mb-2 font-display text-2xl tracking-[-0.03em]">Sign the card</h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              The certificate is issued when you sign the card. It records that you completed this course. It does not say you are compliant with any regulation.
            </p>
            <label className="mb-2 block text-sm" htmlFor="signer">
              Your name
            </label>
            <input
              id="signer"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mb-4 w-full border-b border-border bg-transparent py-2 text-lg outline-none"
            />
            <button
              type="button"
              disabled={!canSign(lessons, progress, name)}
              onClick={sign}
              className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background disabled:opacity-40"
            >
              Issue certificate
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </section>
        ) : null}
      </main>
    </div>
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
  feedback: string | null;
  onChange: (answer: LessonAnswer) => void;
  onCommit: (answer: LessonAnswer) => void;
}) {
  const check = lesson.check;
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold">{check.prompt}</h2>
      {check.kind === "mark" ? (
        <MarkCheck
          check={check}
          answer={(answer && !Array.isArray(answer) && typeof answer === "object" ? answer : {}) as MarkAnswer}
          onChange={onChange}
        />
      ) : null}
      {check.kind === "choose" ? (
        <ChooseCheck check={check} answer={answer === "left" || answer === "right" ? answer : null} onChange={onChange} />
      ) : null}
      {check.kind === "order" ? (
        <OrderCheck
          check={check}
          answer={Array.isArray(answer) ? answer : [...check.steps].map((step) => step.id).reverse()}
          onChange={onChange}
        />
      ) : null}
      {check.kind === "build" ? (
        <BuildCheck
          check={check}
          answer={(answer && !Array.isArray(answer) && typeof answer === "object" ? answer : {}) as BuildAnswer}
          onChange={onChange}
        />
      ) : null}
      <button
        type="button"
        disabled={check.kind === "choose" && answer !== "left" && answer !== "right"}
        onClick={() => {
          if (check.kind === "order") {
            const order = Array.isArray(answer)
              ? answer
              : [...check.steps].map((step) => step.id).reverse();
            onCommit(order);
            return;
          }
          if (check.kind === "choose") {
            if (answer === "left" || answer === "right") onCommit(answer);
            return;
          }
          if (answer && typeof answer === "object" && !Array.isArray(answer)) onCommit(answer);
          else onCommit({});
        }}
        className="mt-6 inline-flex h-12 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background disabled:opacity-40"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
      {feedback ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{feedback}</p> : null}
    </section>
  );
}

function MarkCheck({
  check,
  answer,
  onChange,
}: {
  check: Extract<SelfServeLesson["check"], { kind: "mark" }>;
  answer: MarkAnswer;
  onChange: (answer: LessonAnswer) => void;
}) {
  return (
    <ul className="space-y-4">
      {check.sentences.map((sentence) => (
        <li key={sentence.id} className="rounded-2xl border border-border p-4">
          <p className="mb-3 leading-7">{sentence.text}</p>
          <div className="flex gap-2">
            {(["pass", "fail"] as const).map((mark) => (
              <button
                key={mark}
                type="button"
                onClick={() => onChange({ ...answer, [sentence.id]: mark })}
                className={`rounded-full border px-3 py-1 text-xs ${
                  answer[sentence.id] === mark ? "border-foreground bg-foreground text-background" : "border-border"
                }`}
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
  check: Extract<SelfServeLesson["check"], { kind: "choose" }>;
  answer: "left" | "right" | null;
  onChange: (answer: LessonAnswer) => void;
}) {
  const sides = [
    { id: "left" as const, label: check.leftLabel, body: check.left },
    { id: "right" as const, label: check.rightLabel, body: check.right },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sides.map((side) => (
        <button
          key={side.id}
          type="button"
          onClick={() => onChange(side.id)}
          className={`rounded-2xl border p-5 text-left ${
            answer === side.id ? "border-foreground" : "border-border"
          }`}
        >
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted-foreground">{side.label}</span>
          <span className="block text-sm leading-6">{side.body}</span>
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
  check: Extract<SelfServeLesson["check"], { kind: "order" }>;
  answer: string[];
  onChange: (answer: LessonAnswer) => void;
}) {
  const labels = useMemo(() => new Map(check.steps.map((step) => [step.id, step.label])), [check.steps]);
  function move(index: number, direction: -1 | 1) {
    const next = answer.slice();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }
  return (
    <ol className="space-y-2">
      {answer.map((id, index) => (
        <li key={id} className="flex items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3">
          <span className="text-sm leading-6">{labels.get(id)}</span>
          <span className="flex gap-2 text-xs text-muted-foreground">
            <button type="button" onClick={() => move(index, -1)} aria-label="Move up">
              Up
            </button>
            <button type="button" onClick={() => move(index, 1)} aria-label="Move down">
              Down
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}

function BuildCheck({
  check,
  answer,
  onChange,
}: {
  check: Extract<SelfServeLesson["check"], { kind: "build" }>;
  answer: BuildAnswer;
  onChange: (answer: LessonAnswer) => void;
}) {
  return (
    <div className="space-y-5">
      {check.fields.map((field) => (
        <label key={field.id} className="block">
          <span className="mb-1 block text-sm font-medium">{field.label}</span>
          <span className="mb-2 block text-xs text-muted-foreground">{field.hint}</span>
          <textarea
            value={answer[field.id] ?? ""}
            onChange={(event) => onChange({ ...answer, [field.id]: event.target.value })}
            rows={2}
            className="w-full resize-none border-b border-border bg-transparent py-2 text-base outline-none"
          />
        </label>
      ))}
    </div>
  );
}
