"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  arcadeCoaching,
  checkDiscovery,
  finalDiscoveries,
  type CoachedGame,
} from "@/lib/wonderlab/arcade-coaching";
import { gameGuides } from "@/lib/wonderlab/learning-guide";
import { Creature } from "./game-stage";
import { features } from "@/lib/wonderlab/games";

export function ArcadeDiscovery({
  type,
  narrate,
  onFeedback,
  onComplete,
}: {
  type: CoachedGame;
  narrate: (text: string) => void;
  onFeedback: (text: string) => void;
  onComplete: () => void;
}) {
  const config = finalDiscoveries[type];
  const [sourceOpened, setSourceOpened] = useState(false);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof checkDiscovery
  > | null>(null);
  const reward = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (result?.won) reward.current?.focus();
  }, [result?.won]);
  return (
    <section
      className={`wg-stage wg-transfer ${result?.won ? "wg-solved" : ""}`}
      id="wonderlab-game-board"
      tabIndex={-1}
    >
      <div className="wg-stage-top">
        <span className="wg-stage-label">PUT YOUR SKILL TO WORK</span>
        <button
          className="wg-narrate"
          onClick={() => narrate(config.instruction)}
        >
          <Volume2 size={18} /> Hear the challenge
        </button>
      </div>
      <h2>{config.title}</h2>
      <p className="wg-transfer-intro">{config.instruction}</p>
      <div className="wg-transfer-grid">
        <div className="wg-transfer-draft">
          <span className="wg-eyebrow">
            {type === "creature"
              ? "THIS IS YOUR NEW DESIGN."
              : result?.won
                ? "YOU HAVE CORRECTED THE EXAMPLE DRAFT."
                : "THIS IS AN EXAMPLE AI DRAFT."}
          </span>
          {type === "creature" && (
            <Creature
              features={[
                "Space helmet",
                ...(selected
                  ? [features.find((f) => f.id === selected)!.label]
                  : []),
              ]}
              happy={!!result?.won}
            />
          )}
          <p>{result?.won ? config.repaired : config.draft}</p>
          {result?.won && (
            <span className="wg-repair-stamp">
              ✓ Your change matches the note.
            </span>
          )}
        </div>
        <div>
          <button
            className="wg-source-reveal"
            aria-expanded={sourceOpened}
            onClick={() => setSourceOpened(!sourceOpened)}
          >
            {sourceOpened ? "Close" : "Open"} the{" "}
            {config.sourceLabel.toLowerCase()}{" "}
            <span aria-hidden="true">{sourceOpened ? "−" : "+"}</span>
          </button>
          {sourceOpened && (
            <div className="wg-fact-ticket">
              <span>{config.sourceLabel}</span>
              <p>{config.source}</p>
              <button
                className="wg-narrate"
                onClick={() => narrate(config.source)}
              >
                <Volume2 size={16} /> Hear the source
              </button>
            </div>
          )}
          <fieldset
            className="wg-transfer-choices"
            disabled={!sourceOpened || !!result?.won}
          >
            <legend>
              {type === "creature"
                ? "Choose the missing feature"
                : type === "prompt"
                  ? "Choose the sentence to remove"
                  : "Choose your edit"}
            </legend>
            {config.choices.map((choice) => (
              <button
                key={choice.id}
                aria-pressed={selected === choice.id}
                onClick={() => {
                  setSelected(choice.id);
                  setResult(null);
                }}
              >
                <span>{choice.label}</span>
                <span aria-hidden="true">
                  {selected === choice.id ? "●" : "○"}
                </span>
              </button>
            ))}
          </fieldset>
          <p className="wg-micro">
            {result?.won
              ? "Your repair matches the source. Collect your sticker below."
              : !sourceOpened
                ? "Open the source before choosing a repair."
                : "Choose a repair, then test it. You can change your mind and try again."}
          </p>
          {!result?.won && (
            <button
              className="wg-launch"
              disabled={!sourceOpened || !selected}
              onClick={() => {
                const next = checkDiscovery(type, selected, sourceOpened);
                setResult(next);
                onFeedback(next.message);
              }}
            >
              Test my {type === "creature" ? "design" : "repair"} →
            </button>
          )}
        </div>
      </div>
      {result && (
        <p className={`wg-reaction ${result.won ? "won" : ""}`} role="status">
          {result.message}
        </p>
      )}
      {result?.won && (
        <button ref={reward} className="wg-launch" onClick={onComplete}>
          Collect my sticker ★
        </button>
      )}
      <p className="wg-micro">
        This fictional challenge uses examples written for the game. It does not
        use live AI.
      </p>
    </section>
  );
}

export function ArcadeParentNotes({ type }: { type: CoachedGame }) {
  const guide = arcadeCoaching[type];
  return (
    <details className="wg-parent-notes">
      <summary>
        {type === "creature"
          ? "For your grown-up: how this builds AI skills"
          : "Learning notes for you and your parent"}
      </summary>
      <p>{guide.parent}</p>
      <p>{gameGuides[type].connection}</p>
      <p>{guide.ask}</p>
      <p>
        <strong>Try away from the screen:</strong> {guide.offline}
      </p>
      <p>
        The sticker celebrates practice. Ask the learner to explain a decision
        in their own words; finishing a game alone does not prove independent AI
        competence.
      </p>
    </details>
  );
}

export function ArcadeCoach({
  type,
  ready,
  tested,
  complete = false,
  narrate,
}: {
  type: CoachedGame;
  ready: boolean;
  tested: boolean;
  complete?: boolean;
  narrate: (text: string) => void;
}) {
  const guide = arcadeCoaching[type];
  const text = complete
    ? gameGuides[type].discovery
    : tested
      ? guide.repair
      : ready
        ? guide.ready
        : guide.plan;
  return (
    <div className="wg-arcade-coach">
      <p role="status">
        <strong>
          {complete
            ? "You checked the result."
            : tested
              ? "Check what needs to change."
              : ready
                ? "You are ready to test."
                : "First, make a plan."}
        </strong>
        {text}
      </p>
      <button className="wg-narrate" onClick={() => narrate(text)}>
        <Volume2 size={18} /> Hear what to do
      </button>
    </div>
  );
}
