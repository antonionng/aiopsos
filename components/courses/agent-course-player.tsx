"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import type { AgentCoursePack } from "@/lib/always-on-agents/courses";
import "./agent-course-player.css";
import { AgentPracticeBench } from "./agent-practice-bench";
import { IntroductionPlayer } from "./course-introduction";
import { getLessonRecording } from "@/lib/course-introductions";

type Work = {
  notes: Record<string, string>;
  completed: string[];
  answers: Record<string, number>;
  position?: { moduleIndex: number; step: number };
  projectChecks?: Record<string, boolean>;
};
const projectChecks = [
  {
    id: "task",
    title: "Explain your task",
    help: "Keep the instructions, the records you used and a description of a correct result.",
  },
  {
    id: "permissions",
    title: "Show what the agent may do",
    help: "Include your allowed actions, approval rules and the results of checking them.",
  },
  {
    id: "running",
    title: "Show the task working",
    help: "Keep a result and the settings needed to repeat it. Label any practice simulation.",
  },
  {
    id: "checking",
    title: "Show how you checked the result",
    help: "Include your source checks and at least six different test examples.",
  },
  {
    id: "problems",
    title: "Show how you fixed a problem",
    help: "Explain what failed, which steps had already happened and how you avoided repeating completed work.",
  },
  {
    id: "value",
    title: "Explain whether the agent helped",
    help: "Include three comparable attempts, checking time, running costs and instructions for someone taking over.",
  },
];
const emptyWork: Work = { notes: {}, completed: [], answers: {} };
function Markdown({ text }: { text: string }) {
  return (
    <div className="agent-study-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => <h3>{children}</h3>,
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h4>{children}</h4>,
          table: ({ children }) => (
            <div className="agent-study-table">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
function download(name: string, text: string, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function AgentCoursePlayer({
  pack,
  cover,
  orderId,
  initialWork,
}: {
  pack: AgentCoursePack;
  cover: string;
  orderId?: string;
  initialWork?: Work;
}) {
  const [work, setWork] = useState<Work>(initialWork || emptyWork);
  const moduleIndex = work.position?.moduleIndex ?? 0;
  const step = work.position?.step ?? 0;
  const [notice, setNotice] = useState(
    orderId ? "Your place and notes are saved in your account after each change. Wait for the saved message before leaving, and download a copy of important work." : "Your place and practice notes are saved in this browser. Download a copy to keep your work elsewhere.",
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const storageKey = "experrt-agent-work:" + (orderId || pack.slug) + ":" + pack.version;
  useEffect(() => {
    if (orderId) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const stored = JSON.parse(raw) as Partial<Work>;
      const ids = new Set(pack.content.activities.map((a) => a.id));
      const notes = Object.fromEntries(
        Object.entries(stored.notes || {}).filter(
          ([key, value]) =>
            ids.has(key) && typeof value === "string" && value.length <= 20000,
        ),
      );
      const completed = Array.isArray(stored.completed)
        ? stored.completed.filter((id) => typeof id === "string" && ids.has(id))
        : [];
      const answers = Object.fromEntries(
        Object.entries(stored.answers || {}).filter(
          ([key, value]) =>
            ids.has(key) && Number.isInteger(value) && value >= 0 && value < 3,
        ),
      );
      const position =
        stored.position &&
        Number.isInteger(stored.position.moduleIndex) &&
        stored.position.moduleIndex >= 0 &&
        stored.position.moduleIndex < pack.modules.length &&
        Number.isInteger(stored.position.step) &&
        stored.position.step >= 0 &&
        stored.position.step < 6
          ? stored.position
          : undefined;
      const savedChecks = Object.fromEntries(
        projectChecks.map((item) => [
          item.id,
          stored.projectChecks?.[item.id] === true,
        ]),
      );
      // Restore local work only after hydration; browser state cannot be read during server rendering.
      setWork({
        notes,
        completed: [...new Set(completed)],
        answers,
        position,
        projectChecks: savedChecks,
      });
    } catch {
      setNotice(
        "Saved browser work could not be restored. You can continue and download your current notes.",
      );
    }
  }, [storageKey, pack.content.activities, pack.modules.length, orderId]);
  function save(next: Work) {
    setWork(next);
    if (orderId) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setNotice("Saving your notes to your account…");
      saveTimer.current = setTimeout(() => {
        saveQueue.current = saveQueue.current.then(async () => {
        try {
          const response = await fetch(`/api/courses/agents/learning/${orderId}`, {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(next)});
          if (!response.ok) throw new Error();
          setNotice("Your place and notes are saved in your account. Download a copy of your project evidence too.");
        } catch {setNotice("Account saving failed. Your browser copy is still available; download your work and retry.");}
        });
      }, 800);
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      if (!orderId) setNotice(
        "Your place and current practice work are saved in this browser. Download a copy before changing device or clearing browser data.",
      );
    } catch {
      setNotice(
        "This browser could not save your work. Keep the page open and download your notes.",
      );
    }
  }
  const activeModule = pack.modules[moduleIndex];
  const lessonRecording = getLessonRecording(pack.slug, moduleIndex + 1);
  const activity = activeModule.activities[step];
  const selection = work.answers[activity.id];
  const isQuiz = activity.kind === "quiz";
  const isPractical = activity.kind === "practice";
  const canComplete =
    !isQuiz ||
    Boolean(
      checked[activity.id] && activeModule.decision.choices[selection]?.best,
    );
  const complete = work.completed.includes(activity.id);
  const count = work.completed.length;
  function go(nextModule: number, nextStep: number) {
    save({ ...work, position: { moduleIndex: nextModule, step: nextStep } });
    requestAnimationFrame(() => heading.current?.focus());
  }
  function mark() {
    if (!canComplete) return;
    save({
      ...work,
      completed: [...new Set([...work.completed, activity.id])],
    });
  }
  function notesDownload() {
    const text = `# ${pack.title}\nVersion: ${pack.version}\nPractice only; no assessed pass or certificate.\n\n${pack.resources.map((r) => r.content).join("\n\n---\n\n")}\n\n# Your notes\n\n${pack.content.activities.map((a) => `## ${a.title}\nPractice complete: ${work.completed.includes(a.id) ? "yes" : "no"}\n\n${work.notes[a.id] || "[No notes yet.]"}`).join("\n\n")}`;
    const checklist =
      "\n\n# Your final-project checklist\nThese are your own checks, not a reviewer’s pass decision.\n\n" +
      projectChecks
        .map(
          (item) =>
            `- [${work.projectChecks?.[item.id] ? "x" : " "}] ${item.title}: ${item.help}`,
        )
        .join("\n");
    download(pack.slug + "-my-workbook.md", text + checklist);
  }
  return (
    <div className="agent-study">
      <Link className="agent-study-back" href={orderId ? "/courses/agents" : "/courses/agents/review"}>
        <ArrowLeft size={16} /> {orderId ? "All agent courses" : "All course packs"}
      </Link>
      <header className="agent-study-hero">
        <div>
          <p className="agent-study-eyebrow">
            EXPERRT ACADEMY / {orderId ? "YOUR COURSE" : "COURSE DEVELOPMENT REVIEW"}
          </p>
          <h1>{pack.title}</h1>
          <p>{pack.introduction}</p>
          <div className="agent-study-tags">
            <span>6 modules</span>
            <span>36 activities</span>
            <span>Suggested study: 7–8 hours</span>
          </div>
        </div>
        <Image
          src={cover}
          alt="Illustration of agent-assisted work with human oversight."
          width={1536}
          height={1024}
          sizes="(max-width: 800px) 100vw, 34vw"
          priority
        />
      </header>
      <div className="agent-study-intro">
        <BookOpen size={23} />
        <p>
          <strong>Work through each module in order.</strong> Read the
          explanations, look at the example, answer the practice question and
          try the task using the supplied files. Keep a record of your work in
          the workbook. {orderId ? "Your place and notes can be saved in your account. When your final project is ready, submit it in the AI assessment section below. Practice completion alone does not award a certificate." : "This internal development view contains the authored course material; it does not enrol you, submit an assessment or issue a certificate."}
        </p>
      </div>
      <details className="agent-study-getting-started">
        <summary>
          Before you start: what you need and how to use the course
        </summary>
        <h3>Who this course is for</h3>
        <p>{pack.audience}</p>
        <h3>What you need</h3>
        <p>{pack.prerequisites}</p>
        <h3>How to work through it</h3>
        <ol>
          <li>
            Read the lesson and look at the example. Try to explain the result
            in your own words.
          </li>
          <li>
            Answer the question, then try the practical task using the supplied
            fictional files. Keep private accounts and real customer records out
            of practice.
          </li>
          <li>
            Write down what you did and how you checked it. Download your
            workbook so you have a copy of your work.
          </li>
        </ol>
        <p>
          You can move between modules using the course menu. Your place and
          notes are saved in this browser, so you can return later. They do not
          move to another device automatically.
        </p>
      </details>
      <div className="agent-study-layout">
        <aside className="agent-study-sidebar">
          <h2>Your course modules</h2>
          <nav aria-label="Course modules">
            {pack.modules.map((m, index) => (
              <button
                key={m.title}
                aria-current={index === moduleIndex ? "step" : undefined}
                onClick={() => go(index, 0)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  {m.title}
                  <small>
                    {
                      m.activities.filter((a) => work.completed.includes(a.id))
                        .length
                    }{" "}
                    of 6 activities practised
                  </small>
                </span>
              </button>
            ))}
          </nav>
          <div className="agent-study-progress">
            <label htmlFor="course-practice-progress">
              Practice progress: {count} of 36 activities
            </label>
            <progress id="course-practice-progress" max={36} value={count} />
            <p>Your practice progress does not count as an assessment pass.</p>
          </div>
          <button className="agent-study-download" onClick={notesDownload}>
            <Download size={16} /> Download my workbook
          </button>
          <p className="agent-study-storage" role="status">
            {notice}
          </p>
        </aside>
        <section
          className="agent-study-main"
          aria-label="Current learning activity"
        >
          <p className="agent-study-eyebrow">
            MODULE {moduleIndex + 1} / ACTIVITY {step + 1} OF 6 /{" "}
            {activity.minutes} MINUTES SUGGESTED
          </p>
          <h2 ref={heading} tabIndex={-1}>
            {activity.title.replace(/^\d+\.\d+ /, "")}
          </h2>
          <p className="agent-study-module-name">{activeModule.title}</p>
          {step === 0 && lessonRecording ? (
            <section className="agent-study-recording" aria-label="Recorded lesson explanation">
              <h3>Watch the explanation before you try the task</h3>
              <p>Watch how the example works, then pause to choose your own task. You can replay any part you want to revisit. Continue with the written lesson and exercise below so you can practise what you have learned.</p>
              <IntroductionPlayer key={`${pack.slug}-${moduleIndex}`} video={lessonRecording} title={activeModule.title} kind="Lesson explanation" />
            </section>
          ) : null}
          <nav
            className="agent-study-steps"
            aria-label="Activities in this module"
          >
            {[
              "Learn",
              "Plan",
              "Example",
              "Decision",
              "Try it",
              "Your notes",
            ].map((label, index) => (
              <button
                key={label}
                aria-current={step === index ? "step" : undefined}
                onClick={() => go(moduleIndex, index)}
              >
                {activeModule.activities[index] &&
                work.completed.includes(activeModule.activities[index].id) ? (
                  <Check size={14} />
                ) : (
                  <span>{index + 1}</span>
                )}
                {label}
              </button>
            ))}
          </nav>
          <Markdown text={activity.content} />
          {step < 2 ? (
            <div className="agent-study-visual">
              <h3>Follow the process</h3>
              <p>Open each step to see how it applies to this module.</p>
              {activeModule.visual.map((label, index) => (
                <details key={label}>
                  <summary>
                    <span>{index + 1}</span>
                    {label}
                  </summary>
                  <p>
                    {index === 0
                      ? pack.modules[moduleIndex].activities[0].content.split(
                          "\n\n",
                        )[1]
                      : index === 1
                        ? activeModule.expected
                        : "Keep the input, output and your explanation in the workbook so another person can check the decision."}
                  </p>
                </details>
              ))}
            </div>
          ) : null}
          {isQuiz ? (
            <fieldset className="agent-study-decision">
              <legend>Which response would you choose?</legend>
              {activeModule.decision.choices.map((choice, index) => (
                <label key={choice.text}>
                  <input
                    type="radio"
                    name={activity.id}
                    value={index}
                    checked={selection === index}
                    onChange={() => {
                      save({
                        ...work,
                        answers: { ...work.answers, [activity.id]: index },
                      });
                      setChecked({ ...checked, [activity.id]: false });
                    }}
                  />
                  {choice.text}
                </label>
              ))}
              <button
                disabled={selection === undefined}
                onClick={() => setChecked({ ...checked, [activity.id]: true })}
              >
                Check my decision
              </button>
              {checked[activity.id] && selection !== undefined ? (
                <div className="agent-study-feedback" role="status">
                  <h3>
                    {activeModule.decision.choices[selection].best
                      ? "This answer follows the facts and instructions"
                      : "Review the rule before trying again"}
                  </h3>
                  <p>{activeModule.decision.choices[selection].feedback}</p>
                </div>
              ) : null}
            </fieldset>
          ) : null}
          {isPractical && step === 4 ? (
            <details>
              <summary>Follow the course lab walkthrough</summary>
              <Markdown text={pack.resources[3].content} />
            </details>
          ) : null}
          {isPractical && step === 4 ? (
            <AgentPracticeBench
              key={pack.slug + moduleIndex}
              slug={pack.slug}
              onRecord={(text) =>
                save({
                  ...work,
                  notes: {
                    ...work.notes,
                    [activity.id]: [work.notes[activity.id], text]
                      .filter(Boolean)
                      .join("\n\n"),
                  },
                })
              }
            />
          ) : null}
          {isPractical ? (
            <div className="agent-study-lab">
              <h3>
                <ClipboardCheck size={20} /> Keep a record of your work
              </h3>
              <p>
                Download the practice files and workbook before starting. Use
                the space below for your explanation and evidence references; it
                does not upload files or submit an assessment.
              </p>
              <div className="agent-study-resource-buttons">
                {pack.resources.map((r) => (
                  <button
                    key={r.id}
                    onClick={() =>
                      download(pack.slug + "-" + r.kind + ".md", r.content)
                    }
                  >
                    <Download size={15} />
                    {r.title}
                  </button>
                ))}
              </div>
              <label htmlFor={"notes-" + activity.id}>
                What you did and where you saved your work
              </label>
              <textarea
                id={"notes-" + activity.id}
                value={work.notes[activity.id] || ""}
                maxLength={20000}
                rows={7}
                placeholder="Explain what you tried, what you expected and what happened. Say where you saved your work, what you fixed and whether you used a real account or a practice example."
                onChange={(e) =>
                  save({
                    ...work,
                    notes: { ...work.notes, [activity.id]: e.target.value },
                  })
                }
              />
              <details>
                <summary>Open the self-check guide after your attempt</summary>
                <p>{activeModule.expected}</p>
                <p>
                  This guide supports practice. The AI assessor checks your submitted
                  evidence and individual explanation for assessed competence.
                </p>
              </details>
            </div>
          ) : null}
          <div className="agent-study-bottom">
            <button onClick={mark} disabled={!canComplete || complete}>
              {complete ? <Check size={16} /> : null}
              {complete
                ? "Marked as practised"
                : "Mark this activity as practised"}
            </button>
            {step < 5 ? (
              <button onClick={() => go(moduleIndex, step + 1)}>
                Next activity <ArrowRight size={16} />
              </button>
            ) : moduleIndex < 5 ? (
              <button onClick={() => go(moduleIndex + 1, 0)}>
                Next module <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={notesDownload}>
                Download final project workbook <Download size={16} />
              </button>
            )}
          </div>
        </section>
      </div>
      <section className="agent-study-reference">
        <h2>Prepare for practical assessment</h2>
        <p>{pack.project}</p>
        <p>
          The AI assessor will check the evidence of how you planned the task, chose permissions, ran
          the work, checked the results, fixed a problem and measured whether it
          helped. You need at least 3 out of 4 in each area. You earn an Experrt
          certificate after every skill passes the AI assessment.
        </p>
        <div className="agent-study-project-checklist">
          <h3>Check that your project is ready to share</h3>
          <p>
            Tick each item when you have the work ready. These are your own
            reminders; the AI assessor still needs to check the submitted evidence and decide
            whether you have passed.
          </p>
          {projectChecks.map((item) => (
            <label key={item.id}>
              <input
                type="checkbox"
                checked={work.projectChecks?.[item.id] ?? false}
                onChange={(event) =>
                  save({
                    ...work,
                    projectChecks: {
                      ...work.projectChecks,
                      [item.id]: event.target.checked,
                    },
                  })
                }
              />
              <span>
                <strong>{item.title}</strong>
                <span>{item.help}</span>
              </span>
            </label>
          ))}
          <p role="status">
            {
              projectChecks.filter((item) => work.projectChecks?.[item.id])
                .length
            }{" "}
            of 6 items checked by you.
          </p>
          <button onClick={notesDownload}>
            Download my work and checklist <Download size={16} />
          </button>
        </div>
        <details>
          <summary>Read the assessment guide</summary>
          <Markdown text={pack.resources[2].content} />
        </details>
        <details>
          <summary>Review the course case and practice files</summary>
          <Markdown text={pack.resources[0].content} />
        </details>
        <details>
          <summary>Official platform references and review status</summary>
          <p>
            Documentary review: 1 October 2026. Live account tests, learner
            pilot and commercial assessment delivery still require verification.
            The suggested study time includes practical work and has not yet
            been measured in a learner pilot.
          </p>
          <ul>
            {pack.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
          <p>
            {pack.sources.length === 0
              ? "This application course uses fictional records and original training exercises."
              : ""}
          </p>
        </details>
        {!orderId && <div className="agent-study-author-tools">
          <button
            onClick={() =>
              download(
                pack.slug + "-lms.json",
                JSON.stringify(pack.content, null, 2),
                "application/json",
              )
            }
          >
            Download LMS course pack
          </button>
          <button
            onClick={() =>
              download(
                pack.slug + "-reviewer-guide.md",
                pack.reviewerGuide +
                  "\n\n# Course-specific checks\n\n" +
                  pack.modules
                    .map(
                      (m, i) =>
                        `## Module ${i + 1}: ${m.title}\n${m.expected}\n\nDecision feedback:\n${m.decision.choices.map((c) => `${c.best ? "Best response" : "Alternative"}: ${c.text}\n${c.feedback}`).join("\n\n")}`,
                    )
                    .join("\n\n") +
                  "\n\n# Individual changed case\n" +
                  pack.challenge,
              )
            }
          >
            Download reviewer guide
          </button>
        </div>}
      </section>
    </div>
  );
}
