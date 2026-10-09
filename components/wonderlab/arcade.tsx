"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  arcadeGames,
  checkCreature,
  checkEvidence,
  checkPrompt,
  evidenceRounds,
  features,
  habitats,
  promptRounds,
  rescueLevels,
  type ArcadeGame,
  type Verdict,
} from "@/lib/wonderlab/games";
import {
  ArcadeCoach,
  ArcadeDiscovery,
  ArcadeParentNotes,
} from "./arcade-discovery";
import { clearArcadeDrafts, useArcadeDraft } from "./use-arcade-draft";
import { finalDiscoveries } from "@/lib/wonderlab/arcade-coaching";
import { RescueDiscovery, RescueParentNotes } from "./rescue-discovery";
import { rescueCoaching } from "@/lib/wonderlab/rescue-coach";
import { Creature, RescueBoard, clearRescueDrafts } from "./game-stage";
import { Pip } from "./art";
import { useNarration } from "./use-narration";
import { MissionArtwork } from "./mission-artwork";
import { GameGuide } from "./game-guide";
import { gameGuides, guideNarration } from "@/lib/wonderlab/learning-guide";
const eventName = "wonderlab-game-progress";
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  return () => window.removeEventListener(eventName, callback);
}
function readProgress(key: string, maximum: number) {
  try {
    const n = Number(sessionStorage.getItem(key) ?? 0);
    return Number.isInteger(n) && n >= 0 && n <= maximum ? n : 0;
  } catch {
    return 0;
  }
}
const memoryProgress = new Map<string, number>();
function useProgress(slug: string, maximum: number) {
  const key = `wonderlab-game-v1:${slug}`;
  const get = useCallback(
    () => memoryProgress.get(key) ?? readProgress(key, maximum),
    [key, maximum],
  );
  const round = useSyncExternalStore(subscribe, get, () => 0);
  const set = (next: number) => {
    memoryProgress.set(key, next);
    try {
      sessionStorage.setItem(key, String(next));
    } catch {
      /* Games remain playable when storage is unavailable. */
    }
    window.dispatchEvent(new Event(eventName));
  };
  return [round, set] as const;
}
type Result = { won: boolean; message: string };
export function Arcade({ game }: { game: ArcadeGame }) {
  const [round, setRound] = useProgress(game.slug, 4);
  const [result, setResult] = useState<Result | null>(null);
  const [voice, setVoice] = useState(false);
  const [sound, setSound] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const { speak, stop, message: voiceMessage } = useNarration(game.band);
  const audio = useRef<AudioContext | null>(null);
  const done = round === 4;
  const nextButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (result?.won) nextButton.current?.focus();
  }, [result?.won]);
  const titles =
    game.type === "route"
      ? rescueLevels
      : game.type === "creature"
        ? habitats
        : game.type === "prompt"
          ? promptRounds
          : evidenceRounds;
  const current = titles[Math.min(round, 2)];
  const title = "title" in current ? current.title : current.name;
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  function respond(next: Result) {
    setResult(next);
    if (voice) speak(next.message);
    if (sound && next.won) {
      try {
        const ctx = audio.current ?? new AudioContext();
        audio.current = ctx;
        void ctx.resume();
        [523, 659, 784].forEach((frequency, i) => {
          const oscillator = ctx.createOscillator(),
            gain = ctx.createGain();
          oscillator.connect(gain);
          gain.connect(ctx.destination);
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.045, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + i * 0.12 + 0.25,
          );
          oscillator.start(ctx.currentTime + i * 0.12);
          oscillator.stop(ctx.currentTime + i * 0.12 + 0.26);
        });
      } catch {
        setAudioMessage(
          "Sound is unavailable here. You can keep playing without it.",
        );
      }
    }
  }
  function nextRound() {
    const next = round + 1;
    setRound(next);
    setResult(null);
    requestAnimationFrame(() =>
      document.getElementById("wonderlab-game-board")?.focus(),
    );
    if (voice)
      speak(
        next === 3
          ? game.type === "route"
            ? rescueCoaching.transfer
            : finalDiscoveries[game.type].instruction
          : next < 3
            ? titles[next].instruction
            : `You earned the ${game.badge} sticker. ${gameGuides[game.type].discovery}`,
      );
  }
  function download() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" rx="90" fill="#fffaf0"/><circle cx="300" cy="268" r="185" fill="#d9c8ff" stroke="#29213c" stroke-width="6"/><text x="300" y="295" text-anchor="middle" font-size="150" fill="#7242d5">★</text><text x="300" y="400" text-anchor="middle" font-family="sans-serif" font-size="29" fill="#29213c">${game.badge}</text><text x="300" y="494" text-anchor="middle" font-family="sans-serif" font-size="21" fill="#29213c">I explored three challenges. • Wonderlab</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `wonderlab-${game.slug}-sticker.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className={`wg-arcade ${game.band}`}>
      <div className="wg-arcade-nav">
        <Link href="/wonderlab/games">← Game worlds</Link>
        <span>FREE GAME · AGES {game.ages}</span>
        <div>
          <button
            aria-label={`Voice ${voice ? "on" : "off"}`}
            aria-pressed={voice}
            onClick={() => {
              setVoice(!voice);
              if (!voice)
                speak(
                  done
                    ? gameGuides[game.type].discovery
                    : round === 3
                      ? game.type === "route"
                        ? rescueCoaching.transfer
                        : finalDiscoveries[game.type].instruction
                      : round === 0
                        ? guideNarration(game.type)
                        : current.instruction,
                );
              else stop();
            }}
          >
            {voice ? <Volume2 size={17} /> : <VolumeX size={17} />} Voice{" "}
            {voice ? "on" : "off"}
          </button>
          <button aria-pressed={sound} onClick={() => setSound(!sound)}>
            Sound {sound ? "on" : "off"}
          </button>
        </div>
      </div>
      <div className="wg-arcade-title">
        <div>
          <span className="wg-eyebrow">WONDERLAB / PLAY</span>
          <h1>{game.name}</h1>
        </div>
        <div
          className="wg-star-meter"
          aria-label={`${Math.min(3, round + (result?.won ? 1 : 0))} of 3 discoveries earned`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={
                i < round || (i === round && result?.won) ? "earned" : ""
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="wg-micro">
        Pip’s voice is made with AI. You can turn it off at any time.
      </p>
      {(voiceMessage || audioMessage) && (
        <p role="status">{voiceMessage || audioMessage}</p>
      )}
      {!done && round < 3 && (
        <details className="wg-optional-guide">
          <summary>Show me how this game works.</summary>
          <GameGuide
            type={game.type}
            young={game.band === "explorers" || game.band === "inventors"}
            narrate={(text, onEnd) => {
              setVoice(true);
              speak(text, onEnd);
            }}
            stop={stop}
          />
        </details>
      )}
      {done ? (
        <section
          className="wg-trophy-room"
          id="wonderlab-game-board"
          tabIndex={-1}
        >
          <div className="wg-big-sticker">
            <span>★</span>
            <strong>{game.badge}</strong>
            <small>YOU EXPLORED THREE CHALLENGES.</small>
          </div>
          <h2>You made it happen.</h2>
          <p>{game.learning}</p>
          <p className="wg-ai-connection">
            <strong>Keep using what you have practised.</strong>
            {gameGuides[game.type].discovery}
          </p>
          <div className="wg-win-actions">
            <button className="wg-launch" onClick={download}>
              <Download size={18} /> Keep my sticker
            </button>
            <button
              className="wg-secondary"
              onClick={() => {
                stop();
                if (game.type === "route") clearRescueDrafts();
                else clearArcadeDrafts(game.type);
                setRound(0);
                setResult(null);
              }}
            >
              <RotateCcw size={18} /> Play again
            </button>
          </div>
          <Link href="/wonderlab/games">Choose another game →</Link>
          <p className="wg-micro">
            Your sticker celebrates this game. Progress stays in this browser
            tab until it is closed.
          </p>
        </section>
      ) : round === 3 && game.type !== "route" ? (
        <ArcadeDiscovery
          type={game.type}
          onFeedback={(text) => {
            if (voice) speak(text);
          }}
          narrate={(text) => {
            setVoice(true);
            speak(text);
          }}
          onComplete={() => {
            stop();
            setRound(4);
            requestAnimationFrame(() =>
              document.getElementById("wonderlab-game-board")?.focus(),
            );
          }}
        />
      ) : game.type === "route" && round === 3 ? (
        <RescueDiscovery
          onFeedback={(text) => {
            if (voice) speak(text);
          }}
          narrate={(text) => {
            setVoice(true);
            speak(text);
          }}
          onComplete={() => {
            stop();
            setRound(4);
            requestAnimationFrame(() =>
              document.getElementById("wonderlab-game-board")?.focus(),
            );
          }}
        />
      ) : (
        <section
          tabIndex={-1}
          id="wonderlab-game-board"
          className={`wg-stage ${result?.won ? "wg-solved" : ""}`}
        >
          <div className="wg-stage-top">
            <span className="wg-stage-label">
              {`ACTIVITY ${round + 1} OF 3`}
            </span>
            <button
              className="wg-narrate"
              onClick={() => {
                setVoice(true);
                speak(current.instruction);
              }}
            >
              <Volume2 size={18} /> Hear the mission
            </button>
          </div>
          <h2>{title}</h2>
          <div className="wg-brief">
            <Pip small />
            <p>{current.instruction}</p>
          </div>
          <fieldset
            className={`wg-activity-controls ${result?.won ? "wg-board-complete" : ""}`}
            aria-label="Game activity"
            disabled={!!result?.won}
          >
            {game.type === "route" ? (
              <RescueBoard
                key={round}
                level={round}
                persistent
                narrate={(text) => {
                  setVoice(true);
                  speak(text);
                }}
                onEdit={() => setResult(null)}
                onResult={(won, message) => respond({ won, message })}
              />
            ) : game.type === "creature" ? (
              <CreatureGame
                key={round}
                round={round}
                onResult={respond}
                onEdit={() => setResult(null)}
                narrate={(text) => {
                  setVoice(true);
                  speak(text);
                }}
              />
            ) : game.type === "prompt" ? (
              <PromptGame
                key={round}
                round={round}
                onResult={respond}
                onEdit={() => setResult(null)}
                narrate={(text) => {
                  setVoice(true);
                  speak(text);
                }}
              />
            ) : (
              <EvidenceGame
                key={round}
                round={round}
                onResult={respond}
                onEdit={() => setResult(null)}
                narrate={(text) => {
                  setVoice(true);
                  speak(text);
                }}
              />
            )}
          </fieldset>
          {result && (
            <div
              className={`wg-reaction ${result.won ? "won" : ""}`}
              role="status"
            >
              <span>{result.won ? "★" : "↻"}</span>
              <p>{result.message}</p>
            </div>
          )}
          {result?.won && (
            <div className="wg-win-actions">
              <span>★ Discovery {round + 1} earned</span>
              <button
                ref={nextButton}
                className="wg-launch"
                onClick={nextRound}
              >
                {round === 2
                  ? game.type === "route"
                    ? "Check an AI answer →"
                    : "Try a new challenge →"
                  : "Next adventure"}
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>
      )}
      {game.type === "route" ? (
        <RescueParentNotes complete={done} />
      ) : (
        <ArcadeParentNotes type={game.type} />
      )}
      <p className="wg-game-note">
        {game.band === "explorers" ? "Play together with a grown-up. " : ""}Pip
        is a fictional game character. These are prepared game responses, not a
        live AI conversation. You can try again as often as you like.
      </p>
    </div>
  );
}
function CreatureGame({
  round,
  onResult,
  onEdit,
  narrate,
}: {
  round: number;
  onResult: (result: Result) => void;
  onEdit: () => void;
  narrate: (text: string) => void;
}) {
  const [selected, setSelected] = useArcadeDraft("creature", round);
  const [testing, setTesting] = useState(false);
  const habitat = habitats[round];
  return (
    <div className="wg-creature-builder">
      <ArcadeCoach
        type="creature"
        ready={selected.length === 2}
        tested={testing && !checkCreature(round, selected).won}
        complete={testing && checkCreature(round, selected).won}
        narrate={narrate}
      />
      <div className={`wg-habitat ${habitat.name} ${testing ? "testing" : ""}`}>
        <span className="wg-habitat-label">
          {habitat.name.toUpperCase()} / FIELD TEST
        </span>
        <span className="wg-sun" />
        <span className="wg-cloud one" />
        <span className="wg-cloud two" />
        <Creature
          features={selected.map(
            (id) => features.find((f) => f.id === id)!.label,
          )}
          happy={testing && checkCreature(round, selected).won}
        />
        <div className="wg-feature-slots">
          {[0, 1].map((i) => (
            <span key={i}>
              {selected[i]
                ? features.find((f) => f.id === selected[i])!.label
                : "Empty feature slot"}
            </span>
          ))}
        </div>
      </div>
      <div className="wg-field-report" aria-live="polite">
        <strong>
          {testing
            ? "Here is what happened when you tested it."
            : "Your creature needs to do two jobs."}
        </strong>
        <ul>
          {habitat.jobs.map((job, i) => (
            <li key={job}>
              <span>
                {testing
                  ? selected.includes(habitat.needs[i])
                    ? "✓ Fits"
                    : "↻ Still needed"
                  : `${i + 1}.`}
              </span>{" "}
              {job}
            </li>
          ))}
        </ul>
      </div>
      <div className="wg-pieces">
        {features.map((feature) => (
          <button
            key={feature.id}
            aria-pressed={selected.includes(feature.id)}
            disabled={!selected.includes(feature.id) && selected.length === 2}
            onClick={() => {
              onEdit();
              setTesting(false);
              setSelected(
                selected.includes(feature.id)
                  ? selected.filter((id) => id !== feature.id)
                  : [...selected, feature.id],
              );
            }}
          >
            <span className="wg-feature-symbol">{feature.symbol}</span>
            <span>{feature.label}</span>
            <strong>{selected.includes(feature.id) ? "✓" : "+"}</strong>
          </button>
        ))}
      </div>
      <p className="wg-micro">
        Your creature has room for two features. Tap a fitted feature to remove
        it before choosing a replacement.
      </p>
      <button
        className="wg-launch"
        disabled={selected.length !== 2}
        onClick={() => {
          setTesting(true);
          onResult(checkCreature(round, selected));
        }}
      >
        Send creature on mission →
      </button>
    </div>
  );
}
function PromptGame({
  round,
  onResult,
  onEdit,
  narrate,
}: {
  round: number;
  onResult: (result: Result) => void;
  onEdit: () => void;
  narrate: (text: string) => void;
}) {
  const config = promptRounds[round];
  const [selected, setSelected] = useArcadeDraft("prompt", round);
  const [failedSlot, setFailedSlot] = useState<number | null>(null);
  const [output, setOutput] = useState("");
  return (
    <div className="wg-prompt-shop">
      <ArcadeCoach
        type="prompt"
        ready={selected.every((v) => v >= 0)}
        tested={failedSlot !== null}
        complete={!!output && failedSlot === null}
        narrate={narrate}
      />
      <div className="wg-fact-ticket">
        <span>USE THESE FACTS TO CHECK YOUR SIGN.</span>
        <p>{config.fact}</p>
      </div>
      <div className="wg-prompt-console">
        <div className="wg-console-bar">
          <span />
          <span />
          <span />
          <strong>CHOOSE YOUR INSTRUCTIONS.</strong>
        </div>
        {config.slots.map((slot, i) => (
          <fieldset
            key={slot.label}
            className={failedSlot === i ? "wg-slot-repair" : ""}
          >
            <legend>
              {String(i + 1).padStart(2, "0")} / {slot.label}
              {failedSlot === i ? " · Check this instruction" : ""}
            </legend>
            <div>
              {slot.choices.map((choice, j) => (
                <button
                  key={choice}
                  aria-pressed={selected[i] === j}
                  onClick={() => {
                    onEdit();
                    setFailedSlot(null);
                    setOutput("");
                    setSelected(selected.map((v, k) => (k === i ? j : v)));
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="wg-output-screen">
        <span>READ THE MACHINE’S EXAMPLE DRAFT.</span>
        <p>
          {output ||
            "Fit the instructions, then test what the machine produces."}
        </p>
      </div>
      <button
        className="wg-launch"
        disabled={selected.some((v) => v < 0)}
        onClick={() => {
          const result = checkPrompt(round, selected);
          setFailedSlot(result.failedSlot);
          setOutput(result.output);
          onResult(result);
        }}
      >
        Run the drafting machine →
      </button>
      <p className="wg-micro">
        Prepared examples show how changing instructions can affect a result.
        Real AI responses can vary and still need checking.
      </p>
    </div>
  );
}
function EvidenceGame({
  round,
  onResult,
  onEdit,
  narrate,
}: {
  round: number;
  onResult: (result: Result) => void;
  onEdit: () => void;
  narrate: (text: string) => void;
}) {
  const config = evidenceRounds[round];
  const [actions, setActions] = useArcadeDraft("evidence", round);
  const [verified, setVerified] = useState(false);
  const [failedClaim, setFailedClaim] = useState<number | null>(null);
  const [focused, setFocused] = useState(0);
  return (
    <div className="wg-editor-desk">
      <ArcadeCoach
        type="evidence"
        ready={actions.every((a) => a !== null)}
        tested={failedClaim !== null}
        complete={verified}
        narrate={narrate}
      />
      <div className="wg-editor-grid">
        <div className="wg-poster">
          <span>
            {verified
              ? "YOUR EDITS MATCH THE CONFIRMED DETAILS."
              : "THIS DRAFT STILL NEEDS CHECKING."}
          </span>
          <h3>{config.heading}</h3>
          <div className="wg-poster-graphic">✳</div>
          {config.claims.map((claim, i) => (
            <button
              key={claim.text}
              className={`${focused === i ? "active" : ""} ${failedClaim === i ? "wg-claim-repair" : ""}`}
              aria-label={`Inspect claim ${i + 1}: ${claim.text}`}
              aria-pressed={focused === i}
              onClick={() => setFocused(i)}
            >
              <span>{i + 1}</span>
              <strong>
                {actions[i] === "remove" ? (
                  <s>{claim.text}</s>
                ) : actions[i] === "correct" ? (
                  claim.fixed || "The notes do not provide a replacement."
                ) : (
                  claim.text
                )}
              </strong>
              <small>
                {verified
                  ? "This decision matches the notes."
                  : failedClaim === i
                    ? "Check this decision again."
                    : actions[i]
                      ? `You chose to ${actions[i]}. This still needs checking.`
                      : "Inspect"}
              </small>
            </button>
          ))}
        </div>
        <div className="wg-inspector">
          <div className="wg-fact-ticket">
            <span>THE ORGANISER CONFIRMED THESE DETAILS.</span>
            <p>{config.source}</p>
          </div>
          <span className="wg-eyebrow">
            YOU ARE CHECKING STATEMENT {focused + 1}.
          </span>
          <h3>{config.claims[focused].text}</h3>
          <p>What does the source actually support?</p>
          <div className="wg-verdicts">
            {(["keep", "correct", "remove"] as Verdict[]).map((action) => (
              <button
                key={action}
                aria-pressed={actions[focused] === action}
                onClick={() => {
                  onEdit();
                  setFailedClaim(null);
                  setVerified(false);
                  setActions(
                    actions.map((v, i) => (i === focused ? action : v)),
                  );
                }}
              >
                {action === "keep"
                  ? "Keep this statement"
                  : action === "correct"
                    ? "Correct it using the notes"
                    : "Remove this statement"}
              </button>
            ))}
          </div>
          <p className="wg-decision-status" role="status">
            {actions[focused]
              ? `You chose to ${actions[focused]} this statement. Select another statement or check all your edits.`
              : "Choose a decision for this claim."}
          </p>
          <button
            className="wg-secondary"
            onClick={() => setFocused((focused + 1) % 3)}
          >
            Inspect claim {((focused + 1) % 3) + 1} →
          </button>
          <div className="wg-review-dots" aria-label="Claims reviewed">
            {actions.map((action, i) => (
              <button
                key={i}
                aria-label={`Inspect claim ${i + 1}${verified ? ": verified against source" : action ? ": decision selected, not yet checked" : ": no decision yet"}`}
                onClick={() => setFocused(i)}
              >
                {action ? "●" : i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        className="wg-launch"
        disabled={actions.some((a) => a === null)}
        onClick={() => {
          const result = checkEvidence(round, actions);
          setVerified(result.won);
          setFailedClaim(result.failedClaim);
          if (result.failedClaim !== null) setFocused(result.failedClaim);
          onResult(result);
        }}
      >
        Check my edits →
      </button>
    </div>
  );
}
export function GameCards() {
  return (
    <div className="wg-game-cards">
      {arcadeGames.map((game) => (
        <Link key={game.slug} href={`/wonderlab/play/${game.slug}?demo=1`}>
          <MissionArtwork
            band={game.band}
            number={2}
            className="wg-card-illustration"
          />
          <span>AGES {game.ages}</span>
          <div>
            <h3>{game.name}</h3>
            <p>{game.pitch}</p>
            <strong>
              Play free <ArrowRight size={17} />
            </strong>
          </div>
        </Link>
      ))}
    </div>
  );
}
