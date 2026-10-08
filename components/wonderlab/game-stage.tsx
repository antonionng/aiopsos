"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Play,
  RotateCcw,
  Square,
  Sparkles,
  Volume2,
} from "lucide-react";
import type { Activity, Answer, Mission } from "@/lib/wonderlab/types";
import {
  rescueLevels,
  runRoute,
  type Direction,
  type Point,
} from "@/lib/wonderlab/games";
import { checkActivity } from "@/lib/wonderlab/engine";
import { Pip, PictureTile } from "./art";
import { rescueCoaching, readRescueDraft } from "@/lib/wonderlab/rescue-coach";
import { Treehouse, GoldenKey } from "./game-scenery";

const rescueDrafts = new Map<string, string>();
function subscribeDraft(callback: () => void) {
  window.addEventListener("wonderlab-rescue-draft", callback);
  return () => window.removeEventListener("wonderlab-rescue-draft", callback);
}
function useRescueDraft(level: number, persistent: boolean) {
  const key = `wonderlab-rescue-draft-v1:${level}`;
  const [local, setLocal] = useState<Direction[]>([]);
  const getSnapshot = useCallback(() => {
    if (!persistent) return "[]";
    if (rescueDrafts.has(key)) return rescueDrafts.get(key)!;
    try {
      return sessionStorage.getItem(key) ?? "[]";
    } catch {
      return "[]";
    }
  }, [key, persistent]);
  const raw = useSyncExternalStore(subscribeDraft, getSnapshot, () => "[]");
  const set = (next: Direction[]) => {
    if (!persistent) {
      setLocal(next);
      return;
    }
    const value = JSON.stringify(next);
    rescueDrafts.set(key, value);
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* Play without storage. */
    }
    window.dispatchEvent(new Event("wonderlab-rescue-draft"));
  };
  return [persistent ? readRescueDraft(raw) : local, set] as const;
}
export function clearRescueDrafts() {
  for (let level = 0; level < rescueLevels.length; level++) {
    const key = `wonderlab-rescue-draft-v1:${level}`;
    rescueDrafts.set(key, "[]");
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* Play without storage. */
    }
  }
  window.dispatchEvent(new Event("wonderlab-rescue-draft"));
}
export function RescueBoard({
  level = 0,
  onResult,
  onEdit,
  narrate,
  persistent = false,
}: {
  level?: number;
  persistent?: boolean;
  onEdit?: () => void;
  narrate?: (text: string) => void;
  onResult: (won: boolean, message: string) => void;
}) {
  const config = rescueLevels[level];
  const [commands, setCommands] = useRescueDraft(level, persistent);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [failure, setFailure] = useState<number | null>(null);
  const [tested, setTested] = useState(false);
  const [position, setPosition] = useState<Point>(config.start);
  const [running, setRunning] = useState(false);
  const [keyTaken, setKeyTaken] = useState(false);
  const run = useRef(0);
  useEffect(
    () => () => {
      run.current++;
    },
    [],
  );
  const arrows = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
  };
  async function go() {
    if (running || !commands.length) return;
    setRunning(true);
    setFailure(null);
    setTested(false);
    onEdit?.();
    setPosition(config.start);
    setKeyTaken(false);
    const id = ++run.current;
    const result = runRoute(config, commands);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    for (const [index, point] of result.steps.entries()) {
      setActiveStep(index);
      await new Promise((resolve) => setTimeout(resolve, reduced ? 80 : 380));
      if (run.current !== id) return;
      setPosition(point);
      if (
        config.key &&
        point[0] === config.key[0] &&
        point[1] === config.key[1]
      )
        setKeyTaken(true);
    }
    setActiveStep(null);
    setFailure(result.failedStep);
    setTested(true);
    setRunning(false);
    onResult(result.won, result.message);
  }
  function halt() {
    run.current++;
    setRunning(false);
    setActiveStep(null);
    setPosition(config.start);
    setKeyTaken(false);
    onEdit?.();
  }
  function edit(next: Direction[]) {
    onEdit?.();
    setFailure(null);
    setTested(false);
    setActiveStep(null);
    setCommands(next);
    setPosition(config.start);
    setKeyTaken(false);
  }
  const outcome = tested ? runRoute(config, commands) : null;
  const coachText = running
    ? rescueCoaching.watch
    : outcome?.won
      ? rescueCoaching.home
      : failure !== null
        ? rescueCoaching.repair
        : tested && config.key && !keyTaken
          ? rescueCoaching.key
          : tested
            ? rescueCoaching.short
            : commands.length >= 14
              ? rescueCoaching.limit
              : commands.length
                ? rescueCoaching.ready
                : rescueCoaching.plan;
  return (
    <div className="wg-rescue wg-rescue-coached">
      <div className="wg-rescue-world">
        <div
          className="wg-island"
          role="img"
          aria-label={`Island map. Pip is now at column ${position[0] + 1}, row ${position[1] + 1}. Pip starts at column ${config.start[0] + 1}, row ${config.start[1] + 1}. Home is column ${config.goal[0] + 1}, row ${config.goal[1] + 1}. River in column 3, bridge in row ${config.bridge + 1}.${config.key ? ` Key in column ${config.key[0] + 1}, row ${config.key[1] + 1}.` : ""}`}
        >
          {Array.from({ length: 20 }, (_, i) => {
            const x = i % 5,
              y = Math.floor(i / 5);
            const water = x === 2;
            return (
              <div
                key={i}
                className={`wg-tile ${water ? (y === config.bridge ? "bridge" : "water") : "grass"}`}
              >
                {x === config.goal[0] && y === config.goal[1] ? (
                  <span className="wg-home">
                    <Treehouse />
                    <small>HOME</small>
                  </span>
                ) : config.key &&
                  x === config.key[0] &&
                  y === config.key[1] &&
                  !keyTaken ? (
                  <GoldenKey />
                ) : (
                  <span aria-hidden="true">
                    {water && y !== config.bridge ? "∿" : "·"}
                  </span>
                )}
              </div>
            );
          })}
          <div
            className="wg-moving-pip"
            style={{
              left: `${position[0] * 20}%`,
              top: `${position[1] * 25}%`,
            }}
          >
            <Pip small />
            {keyTaken && <span>🔑</span>}
          </div>
        </div>
        <p className="wg-map-key">
          <span>✳ Pip</span>
          <span>▤ Bridge</span>
          {config.key && <span>🔑 Key first</span>}
          <span>⌂ Home</span>
        </p>
      </div>
      <div className="wg-rescue-console">
        <div className="wg-coach-bubble" role="status">
          <strong>
            {running
              ? "2 · Watch Pip"
              : tested
                ? "3 · Check and change"
                : "1 · Give Pip instructions"}
          </strong>
          <p>{coachText}</p>
        </div>
        {narrate && (
          <button
            className="wg-narrate"
            disabled={running}
            onClick={() => narrate(coachText)}
          >
            <Volume2 size={18} /> Hear what to do
          </button>
        )}
        <div className="wg-program" aria-label="Your route">
          {commands.length ? (
            commands.map((command, i) => {
              const Icon = arrows[command];
              return (
                <button
                  key={i}
                  className={`${activeStep === i ? "is-running" : ""} ${failure === i ? "needs-repair" : ""}`}
                  disabled={running}
                  aria-label={`Remove step ${i + 1}: ${command}${failure === i ? ". This step needs changing" : ""}`}
                  aria-current={activeStep === i ? "step" : undefined}
                  onClick={() =>
                    edit(commands.filter((_, index) => index !== i))
                  }
                >
                  <small>{i + 1}</small>
                  <Icon size={22} />
                  {failure === i && <b aria-hidden="true">×</b>}
                </button>
              );
            })
          ) : (
            <span className="wg-program-empty">
              Your arrows will appear here
            </span>
          )}
        </div>
        <div className="wg-controls">
          {(["left", "up", "down", "right"] as Direction[]).map((direction) => {
            const Icon = arrows[direction];
            return (
              <button
                key={direction}
                disabled={running || commands.length >= 14}
                aria-label={`Add ${direction} step`}
                onClick={() => edit([...commands, direction])}
              >
                <Icon />
                <span>{direction}</span>
              </button>
            );
          })}
          <button
            disabled={running || !commands.length}
            onClick={() => edit(commands.slice(0, -1))}
            aria-label="Undo last step"
          >
            ↶<span>Undo</span>
          </button>
          <button
            disabled={running || !commands.length}
            onClick={() => edit([])}
            aria-label="Clear route"
          >
            <RotateCcw />
            <span>Clear</span>
          </button>
          <button
            className="wg-go"
            disabled={!commands.length}
            onClick={running ? halt : go}
          >
            {running ? (
              <Square fill="currentColor" />
            ) : (
              <Play fill="currentColor" />
            )}
            {running ? "Stop Pip" : "Go!"}
          </button>
        </div>
        <p className="wg-micro">
          Tap an arrow in your route to remove it. You can try as often as you
          like.
        </p>
      </div>
    </div>
  );
}

export function Creature({
  features,
  happy = false,
}: {
  features: string[];
  happy?: boolean;
}) {
  const has = (word: string) =>
    features.some((f) => f.toLowerCase().includes(word));
  return (
    <svg
      viewBox="0 0 280 280"
      className={`wg-creature ${happy ? "happy" : ""}`}
      role="img"
      aria-label={`Your creature with ${features.join(", ") || "no features yet"}`}
    >
      <ellipse cx="140" cy="254" rx="90" ry="12" fill="#29213c18" />
      {has("wing") && (
        <g fill="#d9c4ff" stroke="#29213c" strokeWidth="4">
          <path d="M88 143Q-8 50 38 182L95 195Z" />
          <path d="M190 143Q288 50 242 182L185 195Z" />
        </g>
      )}
      <path
        d="M100 218L92 244M175 218L188 244"
        stroke="#29213c"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M69 153Q48 186 64 202M209 153Q235 172 218 197"
        fill="none"
        stroke="#29213c"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <rect
        x="66"
        y="96"
        width="148"
        height="139"
        rx="61"
        fill="#a9dda0"
        stroke="#29213c"
        strokeWidth="5"
      />
      <path
        d="M91 107L78 77L111 98M170 99L196 78L191 110"
        fill="#a9dda0"
        stroke="#29213c"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <ellipse cx="110" cy="151" rx="17" ry="21" fill="#fffaf0" />
      <ellipse cx="174" cy="151" rx="17" ry="21" fill="#fffaf0" />
      <circle cx="114" cy="153" r="8" fill="#29213c" />
      <circle cx="170" cy="153" r="8" fill="#29213c" />
      <path
        d={happy ? "M119 182Q142 212 165 182Z" : "M126 187Q141 198 156 187"}
        fill={happy ? "#29213c" : "none"}
        stroke="#29213c"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {has("boot") && (
        <g fill="#ffae61" stroke="#29213c" strokeWidth="4">
          <path d="M76 227H103V250H66Q59 242 76 238Z" />
          <path d="M176 227H200V239Q226 244 209 251H176Z" />
        </g>
      )}
      {(has("leaf") || has("disguise")) && (
        <g fill="#3a997a" stroke="#236b58" strokeWidth="3">
          <path d="M142 116Q83 65 119 35Q160 47 142 116Z" />
          <path d="M142 116Q180 37 207 62Q205 110 142 116Z" />
        </g>
      )}
      {has("helmet") && (
        <g fill="#b7eeff55" stroke="#6552bd" strokeWidth="5">
          <circle cx="140" cy="130" r="91" />
          <path d="M73 201H208" />
          <path
            d="M75 95Q84 69 111 62"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
      )}
      {(has("star") || has("signal")) && (
        <g>
          <path d="M218 180V68" stroke="#29213c" strokeWidth="4" />
          <path
            d="m218 31 9 18 21 3-15 15 4 20-19-10-19 10 4-20-15-15 21-3Z"
            fill="#ffce69"
            stroke="#29213c"
            strokeWidth="3"
          />
        </g>
      )}
      {(has("wide") || has("sand")) && (
        <g fill="#ba9aee" stroke="#29213c" strokeWidth="4">
          <ellipse cx="91" cy="249" rx="31" ry="10" />
          <ellipse cx="188" cy="249" rx="31" ry="10" />
        </g>
      )}
      {has("shade") && (
        <g stroke="#29213c" strokeWidth="4">
          <path d="M140 99V20" />
          <path d="M64 51Q140-28 218 51Z" fill="#ffbd75" />
        </g>
      )}
    </svg>
  );
}

export function GameStage({
  mission,
  activity,
  answer,
  onChange,
  onTry,
  feedback,
  onNext,
  number,
  total,
  narrate,
}: {
  mission: Mission;
  activity: Activity;
  answer: Answer;
  onChange: (answer: Answer) => void;
  onTry: (answer: Answer) => void;
  feedback: { good: boolean; text: string } | null;
  onNext: () => void;
  number: number;
  total: number;
  narrate: () => void;
}) {
  const [localMessage, setLocalMessage] = useState("");
  const younger = mission.band === "explorers" || mission.band === "inventors";
  const [resumedSolved] = useState(() => checkActivity(activity, answer));
  const solved = feedback?.good || resumedSolved;
  const index = activity.options.findIndex(
    (_, i) => answer[i] !== activity.correct[i],
  );
  function toggle(id: string) {
    onChange(
      answer.includes(id) ? answer.filter((x) => x !== id) : [...answer, id],
    );
  }
  const specialRescue = mission.slug === "robot-rescue" && number === 1;
  return (
    <section
      className={`wg-stage ${younger ? "junior" : "senior"} ${solved ? "wg-solved" : ""}`}
      aria-label={activity.title}
    >
      <div className="wg-stage-top">
        <span className="wg-stage-label">
          {number === total
            ? "FINAL CHALLENGE"
            : `MISSION ${number} / ${total}`}
        </span>
        <button className="wg-narrate" onClick={narrate}>
          <Volume2 size={18} /> Hear the mission
        </button>
      </div>
      <h2>{activity.title}</h2>
      <div className="wg-brief">
        <Pip small />
        <p>
          {specialRescue
            ? rescueLevels[0].instruction
            : `${activity.intro} ${activity.instruction}`}
        </p>
      </div>
      {specialRescue ? (
        <RescueBoard
          onResult={(won, message) => {
            setLocalMessage(message);
            if (won) onTry(activity.correct);
          }}
        />
      ) : activity.kind === "sort" ? (
        <div className="wg-sort-world">
          <div className="wg-sort-object">
            {index >= 0 ? (
              <>
                <span className="wg-eyebrow">WHERE DOES THIS BELONG?</span>
                {activity.options[index].picture && (
                  <PictureTile picture={activity.options[index].picture!} />
                )}
                <h3>{activity.options[index].text}</h3>
              </>
            ) : (
              <>
                <Sparkles size={55} />
                <h3>You have sorted every item!</h3>
              </>
            )}
          </div>
          <div className="wg-baskets">
            {activity.categories?.map((category, categoryIndex) => (
              <button
                className="wg-basket"
                key={category}
                disabled={index < 0 || solved}
                onClick={() => {
                  const next = activity.options.map((_, i) =>
                    i === index ? String(categoryIndex) : (answer[i] ?? ""),
                  );
                  onChange(next);
                  if (activity.correct[index] === String(categoryIndex))
                    setLocalMessage(
                      `You placed “${activity.options[index].text}” in the matching group, “${category}”.`,
                    );
                  else
                    setLocalMessage(
                      `“${activity.options[index].text}” does not fit “${category}”. Look at the item and the group names, then try the other group.`,
                    );
                  if (next.every((value, i) => value === activity.correct[i]))
                    onTry(next);
                }}
              >
                <strong>{category}</strong>
                <div className="wg-basket-items">
                  {activity.options.map((option, i) =>
                    answer[i] === String(categoryIndex) &&
                    answer[i] === activity.correct[i] ? (
                      <span key={option.id}>
                        {option.picture ? (
                          <PictureTile picture={option.picture} />
                        ) : (
                          option.text
                        )}
                      </span>
                    ) : null,
                  )}
                </div>
                <span>Tap to place it here ↓</span>
              </button>
            ))}
          </div>
        </div>
      ) : activity.kind === "order" ? (
        <div className="wg-sequence-world">
          <div className="wg-stepping-stones" aria-label="Your plan">
            {activity.options.map((_, i) => (
              <div className={answer[i] ? "filled" : ""} key={i}>
                <span className="wg-step-count">{i + 1}</span>
                {answer[i] ? (
                  <button
                    onClick={() => toggle(answer[i])}
                    disabled={solved}
                    aria-label={`Remove step ${i + 1}: ${answer[i]}`}
                  >
                    {answer[i]}
                  </button>
                ) : (
                  <span>Choose a step</span>
                )}
              </div>
            ))}
            <span className="wg-plan-pip">
              <Pip small />
            </span>
          </div>
          <div className="wg-pieces">
            {activity.options.map((option) => (
              <button
                key={option.id}
                disabled={solved}
                aria-pressed={answer.includes(option.id)}
                onClick={() => toggle(option.id)}
              >
                {option.picture && <PictureTile picture={option.picture} />}
                <span>{option.text}</span>
                <strong>
                  {answer.includes(option.id)
                    ? `${answer.indexOf(option.id) + 1} ✓`
                    : "+"}
                </strong>
              </button>
            ))}
          </div>
          <button
            className="wg-launch"
            disabled={solved || answer.length !== activity.options.length}
            onClick={() => onTry(answer)}
          >
            <Play size={18} /> Run my plan
          </button>
        </div>
      ) : activity.kind === "scene" ? (
        <div className="wg-builder-world">
          <div
            className={`wg-scene ${mission.slug === "creature-creator" ? "creature" : ""}`}
          >
            <span className="wg-sun" />
            <span className="wg-cloud one" />
            <span className="wg-cloud two" />
            {mission.slug === "creature-creator" ? (
              <Creature features={answer} happy={!!solved} />
            ) : (
              <div className="wg-scene-objects">
                {activity.options
                  .filter((option) => answer.includes(option.id))
                  .map((option) => (
                    <div key={option.id}>
                      {option.picture && (
                        <PictureTile picture={option.picture} />
                      )}
                      <span>{option.text}</span>
                    </div>
                  ))}
                {!answer.length && (
                  <span className="wg-scene-empty">
                    Build your scene with the pieces below ↓
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="wg-pieces">
            {activity.options.map((option) => (
              <button
                key={option.id}
                aria-pressed={answer.includes(option.id)}
                disabled={solved}
                onClick={() => toggle(option.id)}
              >
                {option.picture && <PictureTile picture={option.picture} />}
                <span>{option.text}</span>
                <strong>{answer.includes(option.id) ? "✓" : "+"}</strong>
              </button>
            ))}
          </div>
          <button
            className="wg-launch"
            disabled={!answer.length || solved}
            onClick={() => onTry(answer)}
          >
            <Play size={18} /> Test my creation
          </button>
        </div>
      ) : activity.kind === "evidence" ? (
        <div className="wg-caseboard">
          <div className="wg-sources">
            <span className="wg-eyebrow">
              READ THESE NOTES TO CHECK THE STATEMENTS.
            </span>
            {activity.evidence?.map((item, i) => (
              <details key={item} open>
                <summary>Source card {i + 1}</summary>
                <p>{item}</p>
              </details>
            ))}
          </div>
          <div className="wg-claims">
            <span className="wg-eyebrow">
              CHOOSE THE STATEMENTS THAT MATCH THE NOTES.
            </span>
            {activity.options.map((option) => (
              <button
                key={option.id}
                disabled={solved}
                aria-pressed={answer.includes(option.id)}
                onClick={() => toggle(option.id)}
              >
                <span className="wg-pin">
                  {answer.includes(option.id) ? "✓" : "+"}
                </span>
                {option.text}
              </button>
            ))}
            <button
              className="wg-launch"
              disabled={!answer.length || solved}
              onClick={() => onTry(answer)}
            >
              Check my choices →
            </button>
          </div>
        </div>
      ) : (
        <div className="wg-decision-world">
          <div
            className="wg-decision-scene"
            style={{
              backgroundImage: `linear-gradient(0deg, #fffaf0 1%, transparent 85%), url(/images/wonderlab/${mission.band}.png)`,
            }}
          >
            <Pip />
            <span className="wg-speech">
              {solved ? "That worked!" : "What should we do?"}
            </span>
          </div>
          {activity.evidence && (
            <div className="wg-sources">
              {activity.evidence.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )}
          <div className="wg-action-paths">
            {activity.options.map((option, i) => (
              <button
                key={option.id}
                disabled={solved}
                aria-pressed={answer.includes(option.id)}
                onClick={() => {
                  onChange([option.id]);
                  onTry([option.id]);
                }}
              >
                <span className="wg-path-icon">
                  {option.picture ? (
                    <PictureTile picture={option.picture} />
                  ) : (
                    ["✦", "◈", "✳", "○"][i % 4]
                  )}
                </span>
                <span>{option.text}</span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
      {(localMessage || feedback || resumedSolved) && (
        <div className={`wg-reaction ${solved ? "won" : ""}`} role="status">
          <span aria-hidden="true">{solved ? "★" : "◉"}</span>
          <p>
            {specialRescue && !solved
              ? localMessage
              : (feedback?.text ??
                (resumedSolved ? activity.feedback : localMessage))}
          </p>
        </div>
      )}
      {solved ? (
        <div className="wg-win-actions">
          <span>★ You completed this challenge.</span>
          <button className="wg-launch" onClick={onNext}>
            {number === total ? "Create my keepsake" : "Next adventure"}{" "}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        !specialRescue && (
          <button
            className="wg-hint"
            onClick={() => setLocalMessage(activity.hint)}
          >
            Ask Pip for a clue
          </button>
        )
      )}
    </section>
  );
}
