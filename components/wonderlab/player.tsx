"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Download, Volume2 } from "lucide-react";
import type { Answer, Mission, SavedProgress } from "@/lib/wonderlab/types";
import { checkActivity } from "@/lib/wonderlab/engine";
import { Pip } from "./art";
import { GameStage } from "./game-stage";
import { StoryGameMaker } from "./story-game-maker";
import { CreationWorkshop } from "./creation-workshop";
import { useNarration } from "./use-narration";
import { MissionArtwork } from "./mission-artwork";
import { rescueLevels } from "@/lib/wonderlab/games";
import { missionPurpose } from "@/lib/wonderlab/learning-guide";
export function downloadWork(title: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `wonderlab-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Player({
  mission,
  demo,
  initial,
  aiEnabled = false,
  remaining = 30,
  narrationPreferred = false,
}: {
  mission: Mission;
  demo: boolean;
  initial?: SavedProgress & { project_checks?: boolean[] };
  aiEnabled?: boolean;
  remaining?: number;
  narrationPreferred?: boolean;
}) {
  const activities = demo ? mission.activities.slice(0, 1) : mission.activities;
  const [answers, setAnswers] = useState<Record<string, Answer>>(
    initial?.answers ?? {},
  );
  const [step, setStep] = useState(() => {
    const n = activities.findIndex(
      (a) => !checkActivity(a, initial?.answers[a.id] ?? []),
    );
    return n < 0 ? activities.length : n;
  });
  const [creation, setCreation] = useState(initial?.creation ?? "");
  const [checks, setChecks] = useState<boolean[]>(
    initial?.project_checks ?? mission.project.checks.map(() => false),
  );
  const [voice, setVoice] = useState(narrationPreferred);
  const { speak, stop, message: voiceMessage } = useNarration(mission.band);
  const [feedback, setFeedback] = useState<{
    good: boolean;
    text: string;
  } | null>(null);
  const [saveState, setSaveState] = useState("");
  const [saveError, setSaveError] = useState("");
  const [completed, setCompleted] = useState(initial?.completed ?? false);
  const [retry, setRetry] = useState(0);
  const [generated, setGenerated] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [allowance, setAllowance] = useState(remaining);
  const revision = useRef(initial?.revision ?? 0);
  const queue = useRef(Promise.resolve());
  const conflict = useRef(false);
  const signature = JSON.stringify({ answers, creation, checks });
  const savedSignature = useRef(signature);
  useEffect(() => {
    if (demo || signature === savedSignature.current || conflict.current)
      return;
    const timer = setTimeout(() => {
      setSaveState("Your work is being saved…");
      queue.current = queue.current.then(async () => {
        if (conflict.current) return;
        try {
          const response = await fetch("/api/wonderlab/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: mission.slug,
              revision: revision.current,
              ...JSON.parse(signature),
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            if (response.status === 409) conflict.current = true;
            throw new Error(data.error);
          }
          revision.current = data.revision;
          savedSignature.current = signature;
          setCompleted(data.completed);
          setSaveState("Your work is saved in your private collection.");
          setSaveError("");
        } catch (error) {
          setSaveState("Your latest changes have not been saved yet.");
          setSaveError(
            error instanceof Error ? error.message : "Please try saving again.",
          );
        }
      });
    }, 650);
    return () => clearTimeout(timer);
  }, [signature, demo, mission.slug, retry]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (!demo && signature !== savedSignature.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [signature, demo]);
  useEffect(() => {
    const protectNavigation = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (
        !demo &&
        anchor &&
        anchor.target !== "_blank" &&
        !anchor.hasAttribute("download") &&
        !anchor.href.startsWith("blob:") &&
        signature !== savedSignature.current
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setSaveError(
          "Your latest change has not been saved yet. Wait for the saved message, or download your work before leaving.",
        );
      }
    };
    document.addEventListener("click", protectNavigation, true);
    return () => document.removeEventListener("click", protectNavigation, true);
  }, [demo, signature]);
  const activity = activities[step];
  const answer = activity ? (answers[activity.id] ?? []) : [];
  const passed = activities.filter((a) =>
    checkActivity(a, answers[a.id] ?? []),
  ).length;
  function change(next: Answer) {
    setAnswers((old) => ({ ...old, [activity.id]: next }));
    setFeedback(null);
  }
  function navigate(index: number) {
    setStep(index);
    setFeedback(null);
    stop();
  }
  function narrate() {
    setVoice(true);
    speak(
      mission.slug === "robot-rescue" && step === 0
        ? rescueLevels[0].instruction
        : activity
          ? `${activity.title.replace(/[.!?]+$/, "")}. ${activity.intro} ${activity.instruction}`
          : mission.project.prompt,
    );
  }
  async function generate(variant: string) {
    setGenerating(true);
    setAiError("");
    try {
      const response = await fetch("/api/wonderlab/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: mission.slug,
          variant,
          requestId: crypto.randomUUID(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setGenerated(data.text);
      setAllowance((v) => v - 1);
    } catch (e) {
      setAiError(
        e instanceof Error
          ? e.message
          : "Please use the practice example for now.",
      );
    } finally {
      setGenerating(false);
    }
  }
  const exportText = `Wonderlab by Experrt\n${mission.title}\n\nMy creation\n${creation}\n\nMy checks\n${mission.project.checks.map((c, i) => `${checks[i] ? "Done" : "To check"}: ${c}`).join("\n")}\n\nWhat I practised\nI practised how to ${mission.outcome.charAt(0).toLowerCase() + mission.outcome.slice(1)}.\n\n${completed ? "I have completed this mission." : "I am still working on this mission."}\n${generated ? `\nAI draft to check\n${generated}` : ""}`;
  return (
    <div className="wl-game wg-mission-game">
      <div className="wl-game-top">
        <Link href={demo ? "/wonderlab" : "/wonderlab/play"}>
          ← {demo ? "Back to Wonderlab" : "My mission map"}
        </Link>
        <span>
          {demo
            ? "FREE ACTIVITY · No account needed"
            : "PRIVATE LEARNING SPACE · Your parent can see your saved work"}
        </span>
        <Link href="/wonderlab/family">Grown-up area</Link>
      </div>
      <div className="wl-game-header">
        <Pip small />
        <div>
          <span className="wl-eyebrow">
            {demo ? "A LITTLE TASTE OF WONDERLAB" : mission.skill}
          </span>
          <h1>{mission.title}</h1>
        </div>
        <button
          className="wg-narrate"
          aria-pressed={voice}
          onClick={() => {
            if (voice) {
              setVoice(false);
              stop();
            } else narrate();
          }}
        >
          <Volume2 size={18} /> Voice {voice ? "on" : "off"}
        </button>
      </div>
      <p className="wg-micro">
        Pip’s voice is made with AI. You can turn it off at any time.
      </p>
      {voiceMessage && <p role="status">{voiceMessage}</p>}
      <div
        className="wl-game-progress"
        role="progressbar"
        aria-label="Activities completed"
        aria-valuenow={passed}
        aria-valuemin={0}
        aria-valuemax={activities.length}
      >
        <span style={{ width: `${(passed / activities.length) * 100}%` }} />
      </div>
      <aside className="wg-learning-guide">
        <div className="wg-guide-heading">
          <h2>This game helps you practise useful AI skills.</h2>
          <button
            className="wg-narrate"
            onClick={() => {
              setVoice(true);
              speak(missionPurpose(mission));
            }}
          >
            <Volume2 size={18} /> Hear why
          </button>
        </div>
        <p>{missionPurpose(mission)}</p>
      </aside>
      <MissionArtwork
        className="wg-mission-panorama"
        band={mission.band}
        number={mission.number}
      />
      <div className="wl-game-layout wg-mission-layout">
        <aside className="wl-chapters" aria-label="Adventure checkpoints">
          {activities.map((a, i) => (
            <button
              key={a.id}
              aria-current={step === i ? "step" : undefined}
              onClick={() => navigate(i)}
            >
              <span>
                {checkActivity(a, answers[a.id] ?? []) ? (
                  <Check size={14} />
                ) : (
                  i + 1
                )}
              </span>
              {checkActivity(a, answers[a.id] ?? [])
                ? "Discovery earned"
                : i === 3
                  ? "Final challenge"
                  : `Adventure ${i + 1}`}
            </button>
          ))}
          <button
            onClick={() => navigate(activities.length)}
            disabled={passed < activities.length}
            aria-current={step === activities.length ? "step" : undefined}
          >
            <span>✳</span>
            {demo ? "Collect my discovery" : "My making space"}
          </button>
        </aside>
        <section className="wl-stage">
          {activity ? (
            <GameStage
              key={activity.id}
              mission={mission}
              activity={activity}
              answer={answer}
              onChange={change}
              onTry={(next) => {
                change(next);
                const good = checkActivity(activity, next);
                const text = good
                  ? activity.feedback
                  : `Try another idea. ${activity.hint}`;
                setFeedback({ good, text });
                if (voice) speak(text);
              }}
              feedback={feedback}
              onNext={() => navigate(step + 1)}
              number={step + 1}
              total={activities.length}
              narrate={narrate}
            />
          ) : demo ? (
            <div className="wl-demo-end">
              <span className="wl-sticker">✳ A new discovery!</span>
              <h2>You helped Pip work it out.</h2>
              <p>
                You practised how to{" "}
                {mission.outcome.charAt(0).toLowerCase() +
                  mission.outcome.slice(1)}
                . This was one free activity from {mission.title}.
              </p>
              <p>
                Free activity progress stays in this page and is not saved to an
                account.
              </p>
              <div className="wl-actions">
                <Link
                  className="wl-button"
                  href={`/wonderlab/missions/${mission.slug}`}
                >
                  Explore the full mission →
                </Link>
                <button
                  className="wl-button wl-outline"
                  onClick={() => {
                    setAnswers({});
                    navigate(0);
                  }}
                >
                  Play again
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="wl-eyebrow">YOUR CREATION</span>
              <h2>{mission.project.title}</h2>
              <p>{mission.project.prompt}</p>
              <div className="wl-notice">
                {mission.project.offline}{" "}
                {mission.band === "explorers"
                  ? "A grown-up can help type what you made below."
                  : ""}{" "}
                Use pretend details. Keep real names, addresses and account
                secrets out of your work.
              </div>
              {mission.slug === "game-concept-studio" ? (
                <StoryGameMaker value={creation} onChange={setCreation} />
              ) : mission.band === "explorers" ||
                mission.band === "inventors" ||
                mission.slug === "worldbuilder-studio" ? (
                <CreationWorkshop
                  mission={mission}
                  value={creation}
                  onChange={setCreation}
                />
              ) : (
                <label className="wl-form">
                  Describe your creation and what you checked.
                  <textarea
                    value={creation}
                    maxLength={8000}
                    onChange={(e) => setCreation(e.target.value)}
                    placeholder="Describe what you made, the choices you took and what you checked…"
                  />
                </label>
              )}
              {mission.project.checks.map((c, i) => (
                <label key={c} className="wl-check">
                  <input
                    type="checkbox"
                    checked={checks[i] ?? false}
                    onChange={(e) =>
                      setChecks((old) =>
                        mission.project.checks.map((_, j) =>
                          i === j ? e.target.checked : (old[j] ?? false),
                        ),
                      )
                    }
                  />
                  {c}
                </label>
              ))}
              {mission.aiBrief && (
                <div className="wl-box">
                  <h3>You can use an AI draft to explore another idea.</h3>
                  <p className="wl-caption">
                    Choose how you would like the AI to help. It will use the
                    practice instructions below, which describe a fictional
                    task. Your private work is not sent to the AI provider.
                    Compare any draft with the instructions before using it.
                  </p>
                  {aiEnabled && allowance > 0 ? (
                    <div className="wl-actions">
                      {[
                        ["ideas", "Create a first draft"],
                        ["simpler", "Make it clearer"],
                        ["challenge", "Try a different approach"],
                      ].map(([v, label]) => (
                        <button
                          className="wl-button wl-outline wl-button-small"
                          key={v}
                          disabled={generating}
                          onClick={() => generate(v)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="wl-notice">
                      {allowance <= 0
                        ? "You have used all the AI drafts included for this course in your current access period."
                        : "Live AI is not enabled for this mission."}{" "}
                      You can still complete your project using the practice
                      instructions below and the examples in this game.
                    </p>
                  )}
                  <details>
                    <summary>Read the practice instructions</summary>
                    <p>{mission.aiBrief}</p>
                    <p>
                      Plan a first draft yourself, check it against the
                      requirements, then make one useful change. The game
                      challenges above contain examples written for you to
                      compare.
                    </p>
                  </details>
                  {generating && (
                    <p role="status">
                      The AI is preparing a draft for you to check…
                    </p>
                  )}
                  {aiError && (
                    <p role="alert" className="wl-error">
                      {aiError}
                    </p>
                  )}
                  {generated && (
                    <div className="wl-draft">
                      <strong>
                        AI created this draft. Check it before you use it.
                      </strong>
                      <p>{generated}</p>
                    </div>
                  )}
                  <p className="wl-caption">
                    You can create {allowance} more of the 30 AI drafts included
                    for this course in your current access period.
                  </p>
                </div>
              )}
              {completed && (
                <div className="wl-success" role="status">
                  <span className="wl-sticker">✳ {mission.skill} explorer</span>
                  <h2>You have completed this mission.</h2>
                  <p>
                    You practised how to{" "}
                    {mission.outcome.charAt(0).toLowerCase() +
                      mission.outcome.slice(1)}
                    .
                  </p>
                </div>
              )}
              <div className="wl-stage-actions">
                <button
                  className="wl-button"
                  onClick={() => downloadWork(mission.title, exportText)}
                >
                  <Download size={17} /> Keep my creation
                </button>
                <button
                  className="wl-button wl-outline"
                  onClick={() => navigate(0)}
                >
                  Replay the activities
                </button>
              </div>
              <p className="wl-caption">
                Finish all four activities, add your creation and complete the
                checks to earn your mission sticker. Your parent can see your
                saved work and progress.
              </p>
            </>
          )}
          {!demo && (
            <p className="wl-status" role="status">
              {saveState || "Your progress saves as you play."}
            </p>
          )}
          {saveError && (
            <div className="wl-error" role="alert">
              {saveError}
              <div className="wl-actions">
                <button
                  className="wl-button wl-button-small wl-outline"
                  onClick={() => downloadWork(mission.title, exportText)}
                >
                  Download my work
                </button>
                {!conflict.current && (
                  <button
                    className="wl-button wl-button-small"
                    onClick={() => setRetry((v) => v + 1)}
                  >
                    Retry save
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
