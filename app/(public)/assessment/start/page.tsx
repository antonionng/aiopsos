"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LearningCheckGate } from "@/components/learning-check-gate";
import { SiteNav } from "@/components/site-nav";
import { Wordmark } from "@/components/wordmark";
import { ASSESSMENT_TEMPLATES } from "@/lib/assessment-templates";
import "@/components/lms/workspace.css";
const template = ASSESSMENT_TEMPLATES["training-needs"];
const labels: Record<string, string> = {
  ai: "AI at work",
  technology: "Everyday technology",
  robotics: "Applied robotics",
};
const nextSteps: Record<string, string> = {
  ai: "Start with a real task. Practise giving clear instructions, checking sources and reviewing an AI output before using it.",
  technology:
    "Choose one repeated workflow. Identify where your existing tools can reduce manual steps, then practise the improved process.",
  robotics:
    "Map one process that might benefit from automation. Build the foundations with a trainer before progressing to supervised equipment practice.",
};
const storageKey = "experrt-learning-needs-v1";
export default function Assessment() {
  const [stage, setStage] = useState<"intro" | "questions" | "gate" | "results">(
    "intro",
  );
  const [categories, setCategories] = useState<string[]>(["ai", "technology"]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [scope, setScope] = useState("My own learning");
  const [restored, setRestored] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const questions = template.questions.filter((q) =>
    categories.includes(q.dimension),
  );
  const question = questions[index];
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (
        saved &&
        Array.isArray(saved.categories) &&
        saved.categories.every(
          (c: unknown) => typeof c === "string" && c in labels,
        ) &&
        saved.categories.length &&
        saved.answers &&
        typeof saved.answers === "object"
      ) {
        const valid = Object.fromEntries(
          Object.entries(saved.answers).filter(
            ([id, value]) =>
              template.questions.some((q) => q.id === id) &&
              Number.isInteger(value) &&
              Number(value) >= 0 &&
              Number(value) <= 5,
          ),
        );
        // Session storage is an external, browser-only source restored after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCategories(saved.categories);
        setAnswers(valid as Record<string, number>);
        setRestored(Object.keys(valid).length > 0);
      }
    } catch {}
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [index, stage]);
  function answer(value: number) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ answers: next, categories }),
      );
    } catch {}
  }
  const results = categories
    .map((key) => {
      const qs = template.questions.filter((q) => q.dimension === key);
      const score =
        qs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0) / qs.length;
      return { key, score, label: labels[key] };
    })
    .sort((a, b) => b.score - a.score);
  function download() {
    const text = [
      "Experrt learning needs snapshot",
      scope,
      new Date().toLocaleDateString(),
      "Self-reported learning priorities, not a skills test or qualification.",
      ...results.map(
        (r) =>
          `\n${r.label}: ${r.score.toFixed(1)} / 5 learning need\n${nextSteps[r.key]}`,
      ),
      "\nYour responses",
      ...questions.map(
        (q) =>
          `${q.text}\n${q.options.find((o) => o.value === answers[q.id])?.label || "Not answered"}`,
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "experrt-learning-needs.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div
      className="lms-public"
      style={{ minHeight: "100vh", background: "#faf8f5", color: "#272332" }}
    >
      <SiteNav />
      <main
        className="lms-workspace"
        style={{ maxWidth: 980, paddingTop: 110 }}
      >
        <span className="lms-eyebrow">
          A little curiosity. A clearer next step.
        </span>
        {stage === "intro" ? (
          <>
            <header className="lms-heading">
              <div>
                <h1 ref={heading} tabIndex={-1}>
                  Where could learning take you?
                </h1>
                <p>
                  A few thoughtful questions to uncover useful learning
                  priorities. No account or payment required. Enter your name and email after the questions to unlock your results. Your
                  results are available immediately.
                </p>
              </div>
            </header>
            <section className="lms-panel lms-form">
              <label>
                I&apos;m exploring
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  <option>My own learning</option>
                  <option>My team&apos;s learning</option>
                  <option>Learning for a client</option>
                </select>
              </label>
              <h2>What is relevant to your work?</h2>
              {Object.entries(labels).map(([id, label]) => (
                <label className="lms-check" key={id}>
                  <input
                    type="checkbox"
                    checked={categories.includes(id)}
                    onChange={(e) =>
                      setCategories((c) =>
                        e.target.checked
                          ? [...c, id]
                          : c.filter((x) => x !== id),
                      )
                    }
                  />
                  {label}
                  {id === "robotics" && (
                    <span className="lms-muted">Optional</span>
                  )}
                </label>
              ))}
              <p>
                {questions.length} questions · About{" "}
                {Math.ceil(questions.length / 3)} minutes. For a team or client,
                answer from what you know today; this is one person&apos;s
                perspective, not a workforce-wide result.
              </p>
              <button
                className="lms-button"
                disabled={!categories.length}
                onClick={() => {
                  setIndex(0);
                  setStage("questions");
                }}
              >
                {restored
                  ? "Continue my learning check"
                  : "Find my starting point"}{" "}
                →
              </button>
              <p className="lms-muted">
                Your answers stay in this tab until you submit your details to unlock results. We then save your answers and learning priorities with your enquiry.
              </p>
            </section>
          </>
        ) : stage === "questions" && question ? (
          <>
            <div className="lms-row between" style={{ marginTop: 24 }}>
              <span className="lms-badge">{labels[question.dimension]}</span>
              <span>
                {index + 1} of {questions.length}
              </span>
            </div>
            <progress
              className="lms-progress"
              value={index}
              max={questions.length}
              aria-label="Assessment progress"
            />
            <section className="lms-panel lms-form">
              <h1
                ref={heading}
                tabIndex={-1}
                style={{
                  fontSize: "clamp(25px,4vw,36px)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: "-.04em",
                }}
              >
                {question.text}
              </h1>
              <p>{question.description}</p>
              <fieldset className="lms-spaced">
                <legend className="sr-only">
                  Choose the answer closest to your experience
                </legend>
                {question.options.map((o) => (
                  <label
                    className="lms-check"
                    key={o.value}
                    style={
                      answers[question.id] === o.value
                        ? { borderColor: "#7046eb", background: "#f1eaff" }
                        : undefined
                    }
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === o.value}
                      onChange={() => answer(o.value)}
                    />
                    {o.label}
                  </label>
                ))}
              </fieldset>
              <div className="lms-row between">
                <button
                  className="lms-button secondary"
                  onClick={() =>
                    index ? setIndex(index - 1) : setStage("intro")
                  }
                >
                  ← Back
                </button>
                <button
                  className="lms-button"
                  disabled={answers[question.id] === undefined}
                  onClick={() =>
                    index === questions.length - 1
                      ? setStage("gate")
                      : setIndex(index + 1)
                  }
                >
                  {index === questions.length - 1
                    ? "See my learning priorities"
                    : "Next question"}{" "}
                  →
                </button>
              </div>
            </section>
          </>
        ) : stage === "gate" ? (
          <LearningCheckGate categories={categories} answers={answers} scope={scope} onSuccess={() => setStage("results")} onBack={() => setStage("questions")} />
        ) : (
          <>
            <header className="lms-heading">
              <div>
                <h1 ref={heading} tabIndex={-1}>
                  Your next chapter starts here.
                </h1>
                <p>
                  {scope}. Based on your answers, these are the areas where
                  learning could help most. A higher score means a greater
                  self-reported learning need.
                </p>
              </div>
            </header>
            <div className="lms-hero">
              <h2>
                {results[0]?.score >= 2
                  ? `${results[0]?.label} looks like a useful place to start.`
                  : "Keep building on what already works."}
              </h2>
              <p>
                This is a conversation starter, not a competence score or
                qualification. A trainer can help validate the priorities with
                practical evidence.
              </p>
            </div>
            <div className="lms-grid">
              {results.map((r, i) => (
                <section className="lms-panel" key={r.key}>
                  <div
                    className={`lms-course-art ${["lilac", "lime", "peach"][i % 3]}`}
                  >
                    <strong>
                      {r.score.toFixed(1)}
                      <small style={{ fontSize: 15 }}> / 5</small>
                    </strong>
                    <span aria-hidden>↗</span>
                  </div>
                  <h2>{r.label}</h2>
                  <span className="lms-badge">
                    {r.score >= 3.5
                      ? "High learning need"
                      : r.score >= 2
                        ? "Useful development area"
                        : "Lower current need"}
                  </span>
                  <p>{nextSteps[r.key]}</p>
                </section>
              ))}
            </div>
            <div className="lms-row" style={{ margin: "24px 0" }}>
              <button className="lms-button" onClick={download}>
                Download my full snapshot
              </button>
              <Link className="lms-button secondary" href="/courses">
                Explore the academy
              </Link>
              <Link className="lms-button secondary" href="/contact">
                Plan learning with Experrt
              </Link>
              <button
                className="lms-button secondary"
                onClick={() => {
                  setIndex(0);
                  setStage("questions");
                }}
              >
                Review my answers
              </button>
            </div>
            <details className="lms-panel">
              <summary>How these priorities are calculated</summary>
              <p>
                Each subject has four questions with answers from 0 to 5. We
                average your answers within each selected subject. Scores of 3.5
                or above indicate high learning need; 2 to below 3.5 indicate a
                useful development area. These are transparent guidance bands,
                not a validated psychometric benchmark. Unselected subjects are
                excluded.
              </p>
            </details>
          </>
        )}
        <footer
          className="lms-row between"
          style={{ padding: "32px 0", borderTop: "1px solid #e6dfee" }}
        >
          <Link href="/" aria-label="Experrt home">
            <Wordmark size="md" className="!invert" />
          </Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/dashboard/learning">Open my learning workspace →</Link>
        </footer>
      </main>
    </div>
  );
}
