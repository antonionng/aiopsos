"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Compass,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import type {
  Action,
  Adventure,
  AdventureRecord,
} from "@/lib/wonderlab/adventure/types";
import { useDemoProgress, saveDemoMove } from "./demo-progress";
import { initialAdventure } from "@/lib/wonderlab/adventure/engine";
import { AdventureCoach } from "./coach";
import { useNarration } from "../use-narration";
import {
  Avatar,
  ForgeScene,
  LabScene,
  LaunchScene,
  SignalScene,
} from "./scenes";

export function AdventurePlayer({
  game,
  demo = false,
  initial,
  aiEnabled = false,
  remaining = 0,
}: {
  game: Adventure;
  demo?: boolean;
  initial?: AdventureRecord;
  aiEnabled?: boolean;
  remaining?: number;
}) {
  const [savedRecord, setRecord] = useState({
    revision: initial?.revision ?? 0,
    state: initial?.state ?? initialAdventure(game),
  });
  const demoRecord = useDemoProgress(game, demo);
  const record = demo ? (demoRecord ?? savedRecord) : savedRecord;
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const revision = useRef(initial?.revision ?? 0);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState<Action | null>(null);
  const [reflectionDraft, setReflection] = useState<string | null>(null);
  const narration = useNarration(game.band);
  const state = record.state;
  const level = game.levels[state.round];
  const round = state.rounds[state.round];
  const reflection = reflectionDraft ?? round?.reflection ?? "";
  const heading = useRef<HTMLHeadingElement>(null);
  const reflectionPanel = useRef<HTMLElement>(null);
  const previouslySolved = useRef(round?.solved ?? false);
  useEffect(() => {
    if (round?.solved && !previouslySolved.current && level?.kind !== "forge")
      reflectionPanel.current?.focus();
    previouslySolved.current = round?.solved ?? false;
  }, [round?.solved, level?.kind]);
  const previousRound = useRef(state.round);
  useEffect(() => {
    if (previousRound.current !== state.round) {
      heading.current?.focus();
      previousRound.current = state.round;
    }
  }, [state.round]);
  async function send(action: Action) {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    setRetry(null);
    try {
      if (demo) {
        const next = saveDemoMove(game, action);
        revision.current = next.revision;
        setRecord(next);
        if (action.type === "next" || action.type === "replay") {
          setReflection(null);
          narration.stop();
        }
        return true;
      }
      const response = await fetch("/api/wonderlab/adventure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: game.slug,
          revision: revision.current,
          action,
        }),
      });
      const data = await response.json();
      if (response.status === 409) {
        const latest = await fetch(
          `/api/wonderlab/adventure?slug=${encodeURIComponent(game.slug)}`,
          { cache: "no-store" },
        );
        const checkpoint = await latest.json();
        if (!latest.ok) throw new Error(checkpoint.error);
        revision.current = checkpoint.revision;
        setRecord(checkpoint);
        setReflection(
          checkpoint.state.rounds[checkpoint.state.round]?.reflection ?? "",
        );
        setError(
          "This game changed in another tab. Your latest saved checkpoint is open. Please make your next move again.",
        );
        return false;
      }
      if (!response.ok)
        throw new Error(
          data.error ?? "Your move could not be saved. Please try again.",
        );
      revision.current = data.revision;
      setRecord(data);
      if (action.type === "next" || action.type === "replay") {
        setReflection(null);
        narration.stop();
      }
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Your move could not be saved. Please try again.",
      );
      setRetry(action);
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  function download() {
    const content = state.collection[0];
    if (!content) return;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `wonderlab-${game.slug}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className={`wd-player ${game.band} ${game.zone}`}>
      <div className="wd-player-top">
        <Link href={demo ? "/wonderlab/games" : "/wonderlab/play"}>
          <Compass size={18} /> Choose another game
        </Link>
        <span role="status">
          {busy
            ? "Saving your move…"
            : demo
              ? "Free game · Progress stays in this browser tab"
              : record.revision
                ? "Your checkpoint is saved."
                : "Your moves will be saved to your profile."}
        </span>
      </div>
      <header className="wd-mission-header">
        <div>
          <span className="wd-kicker">
            WONDERLAB GAME · AGES {game.band === "creators" ? "11–13" : "14–16"}
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {game.name}
          </h1>
        </div>
        <div className="wd-progress" aria-label="Mission progress">
          {game.levels.map((l, i) => (
            <span
              key={l.title}
              className={
                state.round > i ? "done" : state.round === i ? "current" : ""
              }
            >
              {state.round > i ? <Check size={16} /> : i + 1}
              <small>
                {i === 0 ? "Build your skills" : "Try a fresh challenge"}
              </small>
            </span>
          ))}
          <span className={state.round === 2 ? "done" : ""}>
            ✦<small>Keep your creation</small>
          </span>
        </div>
      </header>
      {error && (
        <div role="alert" className="wd-save-error">
          <p>{error}</p>
          {retry && (
            <button
              className="wd-secondary"
              disabled={busy}
              onClick={() => send(retry)}
            >
              Try saving this move again
            </button>
          )}
        </div>
      )}
      {level && round ? (
        <>
          <section className="wd-brief">
            <div>
              <span className="wd-kicker">
                YOUR MISSION · CHALLENGE {state.round + 1} OF 2
              </span>
              <h2>{level.title}</h2>
              <p>{level.mission}</p>
            </div>
            <div className="wd-voice-controls">
              <button
                onClick={() => narration.speak(level.mission)}
                aria-label="Hear your mission"
              >
                <Volume2 size={20} /> Hear the mission
              </button>
              <button onClick={narration.stop} aria-label="Stop the voice">
                <VolumeX size={18} />
              </button>
            </div>
          </section>
          <p className="wd-caption">
            The optional voice is AI-generated. You can stop it at any time.
          </p>
          <details className="wd-learning-note">
            <summary>What does this teach me about AI?</summary>
            <p>{game.learning}</p>
            <p>
              These activities use prepared examples and simulations. Your
              parent can see saved progress, your creations and the reflections
              you write. Use fictional details in your work.
            </p>
          </details>
          {level.kind !== "forge" && (
            <AdventureCoach
              key={`coach-${state.round}`}
              game={game}
              state={state}
              revision={record.revision}
              aiEnabled={!demo && aiEnabled}
              allowance={remaining}
              busy={busy}
              narrate={narration.speak}
              stop={narration.stop}
            />
          )}
          <div className="wd-game-surface" key={state.round}>
            {level.kind === "signal" ? (
              <SignalScene
                level={level}
                state={round}
                send={send}
                busy={busy}
                colour={state.cosmetic}
              />
            ) : level.kind === "forge" ? (
              <ForgeScene
                level={level}
                state={round}
                send={send}
                busy={busy}
                colour={state.cosmetic}
                onReflect={() => reflectionPanel.current?.focus()}
                coach={
                  <AdventureCoach
                    key={`coach-${state.round}`}
                    game={game}
                    state={state}
                    revision={record.revision}
                    aiEnabled={!demo && aiEnabled}
                    allowance={remaining}
                    busy={busy}
                    narrate={narration.speak}
                    stop={narration.stop}
                  />
                }
              />
            ) : level.kind === "launch" ? (
              <LaunchScene
                level={level}
                state={round}
                send={send}
                busy={busy}
              />
            ) : (
              <LabScene level={level} state={round} send={send} busy={busy} />
            )}
          </div>
          {round.feedback &&
            (level.kind !== "forge" ||
              round.testedGoals.length > 0 ||
              round.failures.length > 0) && (
              <section
                className={`wd-result ${round.solved ? "success" : ""}`}
                aria-live="polite"
              >
                <div className="wd-result-symbol">
                  {round.solved ? <Check /> : <RotateCcw />}
                </div>
                <div>
                  <span className="wd-kicker">WHAT HAPPENED</span>
                  <h3>
                    {round.solved
                      ? "Your work meets this challenge."
                      : level.kind === "forge" && round.testedGoals.length
                        ? "You reached a destination."
                        : "Your test found something to change."}
                  </h3>
                  <p>{round.feedback}</p>
                  {round.failures.length > 1 && (
                    <ul>
                      {round.failures.slice(1).map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}
          {round.solved && (
            <section
              className="wd-reflection"
              ref={reflectionPanel}
              tabIndex={-1}
              aria-labelledby="game-reflection-label"
            >
              <label id="game-reflection-label" htmlFor="game-reflection">
                What did you change or check, and why did it help?
              </label>
              <p>
                Write one sentence about your own decision.{" "}
                {demo
                  ? "Your reflection stays in this free game until you download it."
                  : "Your reflection is saved for you and your parent."}{" "}
                It is not automatically graded.
              </p>
              <textarea
                id="game-reflection"
                value={reflection}
                maxLength={600}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="I changed… because…"
              />
              <div className="wd-reflection-actions">
                {reflection !== round.reflection ? (
                  <button
                    className="wd-primary"
                    disabled={busy || reflection.trim().length < 12}
                    onClick={() => send({ type: "reflect", text: reflection })}
                  >
                    Save my reflection <Check size={18} />
                  </button>
                ) : (
                  <button
                    className="wd-primary"
                    disabled={busy || round.reflection.trim().length < 12}
                    onClick={() => send({ type: "next" })}
                  >
                    {state.round === 0
                      ? "Try the fresh challenge"
                      : "Collect my creation"}
                    <ArrowRight size={18} />
                  </button>
                )}
                <small>
                  Write at least 12 characters so your reflection contains a
                  little detail.
                </small>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="wd-completion">
          <div className="wd-reward-sticker">
            <Avatar colour={state.cosmetic} />
            <span>✦</span>
          </div>
          <span className="wd-kicker">ADDED TO YOUR PRIVATE COLLECTION</span>
          <h2>You earned the {game.reward} sticker.</h2>
          <p>
            You tested your ideas in two challenges and explained a decision you
            made. Keep your work and try another approach whenever you like.
          </p>
          <div
            className="wd-colours"
            aria-label="Choose your unlocked character colour"
          >
            {(["aqua", "violet", "orange"] as const).map((colour) => (
              <button
                disabled={busy}
                aria-pressed={state.cosmetic === colour}
                key={colour}
                onClick={() => send({ type: "cosmetic", colour })}
              >
                <span className={colour} />
                {colour}
              </button>
            ))}
          </div>
          <div className="wd-district-actions">
            <button className="wd-primary" onClick={download}>
              <Download size={18} /> Download my creation
            </button>
            <button
              className="wd-secondary"
              disabled={busy}
              onClick={() => send({ type: "replay" })}
            >
              <RotateCcw size={18} /> Play again
            </button>
            <Link
              className="wd-quiet"
              href={demo ? "/wonderlab/games" : "/wonderlab/play"}
            >
              Choose another game
            </Link>
          </div>
          <p className="wd-caption">
            {demo
              ? "Download your creation before leaving this free game. It is not saved to a family profile."
              : "Your work and sticker are saved to your profile. Replaying keeps your previous creation until you complete a new one."}
          </p>
        </section>
      )}
      {narration.message && (
        <p role="status" className="wd-caption">
          {narration.message}
        </p>
      )}
    </div>
  );
}
