"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Flag,
  Hammer,
  MapPin,
  Play,
  Radio,
  RotateCcw,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import type {
  Action,
  ForgeLevel,
  LabLevel,
  LaunchLevel,
  RoundState,
  SignalLevel,
} from "@/lib/wonderlab/adventure/types";
import {
  neighbours,
  predict,
  walkable,
} from "@/lib/wonderlab/adventure/engine";
type SendAction = (action: Action) => void;
const directions = [
  { label: "left", dx: -1, dy: 0, Icon: ArrowLeft },
  { label: "up", dx: 0, dy: -1, Icon: ArrowUp },
  { label: "down", dx: 0, dy: 1, Icon: ArrowDown },
  { label: "right", dx: 1, dy: 0, Icon: ArrowRight },
];
export function Avatar({ colour = "aqua" }: { colour?: string }) {
  return (
    <span className={`wd-avatar ${colour}`} aria-hidden="true">
      <i />
      <b />
      <span />
    </span>
  );
}
function Movement({
  move,
  disabled = false,
}: {
  move: (dx: number, dy: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="wd-direction-pad" aria-label="Movement controls">
      {directions.map(({ label, dx, dy, Icon }) => (
        <button
          key={label}
          disabled={disabled}
          aria-label={`Move ${label}`}
          onClick={() => move(dx, dy)}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}
function directionKey(
  event: React.KeyboardEvent,
  move: (dx: number, dy: number) => void,
) {
  const map: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0],
    ArrowUp: [0, -1],
    w: [0, -1],
    ArrowDown: [0, 1],
    s: [0, 1],
  };
  const vector = map[event.key];
  if (vector) {
    event.preventDefault();
    move(...vector);
  }
}
export function SignalScene({
  level,
  state,
  send,
  busy,
  colour,
}: {
  level: SignalLevel;
  state: RoundState;
  send: SendAction;
  busy: boolean;
  colour: string;
}) {
  const [position, setPosition] = useState({ x: 3, y: 5 });
  const [tab, setTab] = useState<"explore" | "casebook">("explore");
  const [source, setSource] = useState("");
  const move = (dx: number, dy: number) =>
    setPosition((p) => ({
      x: Math.max(0, Math.min(6, p.x + dx)),
      y: Math.max(0, Math.min(5, p.y + dy)),
    }));
  const nearby = level.sources.find(
    (s) => Math.abs(s.x - position.x) + Math.abs(s.y - position.y) <= 1,
  );
  return (
    <div className="wd-signal">
      <div className="wd-scene-tabs">
        <button
          aria-pressed={tab === "explore"}
          onClick={() => setTab("explore")}
        >
          <MapPin size={16} /> Explore the district
        </button>
        <button
          aria-pressed={tab === "casebook"}
          onClick={() => setTab("casebook")}
        >
          <BookOpen size={16} /> Casebook{" "}
          <span>{state.visited.length}/3 sources</span>
        </button>
      </div>
      {tab === "explore" ? (
        <div className="wd-exploration-layout">
          <div>
            <div
              className={`wd-city ${state.solved ? "restored" : ""}`}
              tabIndex={0}
              role="group"
              aria-label="City map. Use arrow keys or W A S D to move, or select a location below."
              onKeyDown={(e) => directionKey(e, move)}
            >
              <div className="wd-city-road horizontal" />
              <div className="wd-city-road vertical" />
              <div className="wd-city-road diagonal" />
              <div className="wd-city-tower">
                <Radio />
                <span>
                  {state.solved ? "SIGNAL RESTORED" : "SIGNAL UNCHECKED"}
                </span>
                <i />
              </div>
              <div className="wd-city-trees">
                <i />
                <i />
                <i />
              </div>
              {level.sources.map((s, i) => (
                <button
                  key={s.id}
                  className={`wd-location building-${i} ${state.visited.includes(s.id) ? "collected" : ""}`}
                  style={{
                    left: `${(s.x / 7) * 100 + 7}%`,
                    top: `${(s.y / 6) * 100 + 8}%`,
                  }}
                  onClick={() => setPosition({ x: s.x, y: s.y })}
                  aria-label={`Travel to the ${s.name.toLowerCase()}`}
                >
                  <span className="wd-building-shape">
                    <i />
                    <i />
                    <i />
                    {i === 0 ? <BookOpen /> : i === 1 ? <Hammer /> : <Search />}
                  </span>
                  <strong>{s.name}</strong>
                  <small>
                    {state.visited.includes(s.id)
                      ? "✓ Evidence collected"
                      : "Explore this location"}
                  </small>
                </button>
              ))}
              <div
                className="wd-explorer"
                style={{
                  left: `${(position.x / 7) * 100 + 7}%`,
                  top: `${(position.y / 6) * 100 + 8}%`,
                }}
              >
                <Avatar colour={colour} />
              </div>
              <span className="wd-map-coordinates" aria-live="polite">
                You are at column {position.x + 1}, row {position.y + 1}.
              </span>
            </div>
            <Movement move={move} />
            <p className="wd-caption">
              Tap a building to travel there, or use the movement controls. The
              map also works with arrow keys.
            </p>
          </div>
          <aside className="wd-inspect-panel">
            <span className="wd-kicker">YOUR NEXT CLUE</span>
            {nearby ? (
              <>
                <h3>{nearby.name}</h3>
                <p>{nearby.text}</p>
                <button
                  disabled={
                    busy || state.visited.includes(nearby.id) || state.solved
                  }
                  className="wd-primary"
                  onClick={() => send({ type: "visit", id: nearby.id })}
                >
                  {state.visited.includes(nearby.id) ? (
                    <>
                      <Check size={18} /> Saved in your casebook
                    </>
                  ) : (
                    <>
                      <Search size={18} /> Collect this evidence
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <h3>Follow a source.</h3>
                <p>
                  Visit the archive, workshop and observatory. Their records
                  will help you check the broadcast.
                </p>
              </>
            )}
            <div className="wd-source-inventory">
              {level.sources.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPosition({ x: s.x, y: s.y })}
                >
                  <span>{state.visited.includes(s.id) ? "✓" : "◇"}</span> Visit
                  the {s.name.toLowerCase()}
                </button>
              ))}
            </div>
            {state.visited.length === 3 && (
              <button
                className="wd-secondary"
                onClick={() => setTab("casebook")}
              >
                Connect the evidence <ArrowRight size={18} />
              </button>
            )}
          </aside>
        </div>
      ) : (
        <div className="wd-case-layout">
          <aside className="wd-evidence-sources">
            <h3>Choose a source to connect.</h3>
            <p className="wd-caption">
              Select a collected source, then connect it to the statement it
              checks.
            </p>
            {level.sources.map((s) => (
              <button
                key={s.id}
                className={`wd-source-card ${source === s.id ? "selected" : ""}`}
                disabled={!state.visited.includes(s.id)}
                aria-pressed={source === s.id}
                onClick={() => setSource(s.id)}
              >
                <span>
                  {state.visited.includes(s.id)
                    ? s.name
                    : "Visit this location first"}
                </span>
                <p>
                  {state.visited.includes(s.id)
                    ? s.text
                    : `The ${s.name.toLowerCase()} holds a source you have not collected.`}
                </p>
              </button>
            ))}
          </aside>
          <div className="wd-broadcast">
            <div className="wd-broadcast-title">
              <Radio />
              <span>
                {state.solved
                  ? "YOUR VERIFIED BROADCAST"
                  : "PREPARED AI DRAFT · NEEDS CHECKING"}
              </span>
            </div>
            {level.claims.map((c) => (
              <article
                key={c.id}
                className={`wd-claim ${state.decisions[c.id] === "remove" ? "removed" : ""}`}
              >
                <p>{state.decisions[c.id] === "repair" ? c.repair : c.text}</p>
                <button
                  className="wd-connection"
                  disabled={!source || busy || state.solved}
                  onClick={() => send({ type: "link", claim: c.id, source })}
                >
                  {state.links[c.id]
                    ? `Connected to ${level.sources.find((s) => s.id === state.links[c.id])?.name}`
                    : "＋ Connect the selected source"}
                </button>
                {state.links[c.id] && (
                  <div className="wd-edit-tools" aria-label={`Edit ${c.text}`}>
                    {(["keep", "repair", "remove"] as const).map((decision) => (
                      <button
                        key={decision}
                        disabled={busy || state.solved}
                        aria-pressed={state.decisions[c.id] === decision}
                        onClick={() =>
                          send({ type: "decide", claim: c.id, decision })
                        }
                      >
                        {decision === "keep"
                          ? "Keep"
                          : decision === "repair"
                            ? "Repair using the source"
                            : "Remove"}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
            <button
              className="wd-primary"
              disabled={busy || state.solved}
              onClick={() => send({ type: "test" })}
            >
              <Send size={18} /> Test the broadcast
            </button>
            <p className="wd-caption">
              This only changes your fictional city. Nothing is published
              outside your game.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export function ForgeScene({
  level,
  state,
  send,
  busy,
  colour,
}: {
  level: ForgeLevel;
  state: RoundState;
  send: SendAction;
  busy: boolean;
  colour: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [path, setPath] = useState([level.start]);
  const [notice, setNotice] = useState("");
  const [waiting, setWaiting] = useState(false);
  const position = path.at(-1)!;
  const board = useRef<HTMLDivElement>(null);
  function move(dx: number, dy: number) {
    if (!playing || busy || waiting || state.solved) return;
    const x = (position % level.width) + dx,
      y = Math.floor(position / level.width) + dy,
      next = y * level.width + x;
    if (
      x < 0 ||
      x >= level.width ||
      y < 0 ||
      y >= level.height ||
      !walkable(level, state, next) ||
      level.rocks.includes(next)
    ) {
      setNotice(
        "That route is blocked. Return to the builder and change your instructions.",
      );
      return;
    }
    const nextPath = [...path, next];
    if (nextPath.length > 140) {
      setNotice("Restart this journey to continue testing.");
      return;
    }
    setPath(nextPath);
    setNotice("");
    if (level.goals.includes(next)) {
      setWaiting(true);
      send({ type: "walk", path: nextPath });
    }
  }
  const pieces = playing ? state.tiles : state.instructions;
  return (
    <div className="wd-forge-layout">
      <div className="wd-forge-main">
        <div className="wd-canvas-toolbar">
          <span>
            <span className="wd-live-dot" />
            {playing ? "PLAYTEST MODE" : "BUILD MODE"}
          </span>
          <span>
            {pieces.length}/{level.budget} pieces
          </span>
        </div>
        <div
          className="wd-forge-board"
          ref={board}
          tabIndex={0}
          role="group"
          aria-label="Construction board. In playtest mode, use arrow keys or W A S D to move."
          onKeyDown={(e) => directionKey(e, move)}
          style={{ gridTemplateColumns: `repeat(${level.width},1fr)` }}
        >
          {Array.from({ length: level.width * level.height }, (_, cell) => {
            const goal = level.goals.indexOf(cell),
              water = level.water.includes(cell),
              rock = level.rocks.includes(cell),
              placed = pieces.includes(cell);
            return (
              <button
                key={cell}
                disabled={
                  busy ||
                  state.solved ||
                  rock ||
                  cell === level.start ||
                  goal >= 0
                }
                aria-label={`Column ${(cell % level.width) + 1}, row ${Math.floor(cell / level.width) + 1}: ${rock ? "blocked machinery" : goal >= 0 ? level.goalNames[goal] : cell === level.start ? "arrival point" : placed ? (water ? "bridge instruction" : "path instruction") : water ? "water" : "empty ground"}`}
                aria-pressed={placed}
                className={`wd-world-cell ${water ? "water" : "ground"} ${placed ? (water ? "bridge" : "path") : ""} ${rock ? "rock" : ""} ${goal >= 0 ? "goal" : ""} ${cell === level.start ? "start" : ""}`}
                onClick={() => {
                  if (playing) {
                    if (neighbours(level, position).includes(cell))
                      move(
                        (cell % level.width) - (position % level.width),
                        Math.floor(cell / level.width) -
                          Math.floor(position / level.width),
                      );
                    else setNotice("Tap a neighbouring path square to move.");
                  } else send({ type: "tile", cell });
                }}
              >
                {rock ? (
                  <span className="wd-rock-shape" />
                ) : goal >= 0 ? (
                  <span className="wd-goal-marker">
                    <Flag />
                    <b>{goal + 1}</b>
                  </span>
                ) : cell === level.start ? (
                  <span className="wd-arrival">START</span>
                ) : placed ? (
                  <span className="wd-path-piece" />
                ) : water ? (
                  <span className="wd-water-ripple">≈</span>
                ) : (
                  <span className="wd-ground-mark">·</span>
                )}
              </button>
            );
          })}
          <div
            className="wd-walker"
            style={{
              left: `${((((playing ? position : level.start) % level.width) + 0.5) / level.width) * 100}%`,
              top: `${((Math.floor((playing ? position : level.start) / level.width) + 0.5) / level.height) * 100}%`,
            }}
          >
            <Avatar colour={colour} />
          </div>
        </div>
        {playing ? (
          <>
            <Movement move={move} disabled={busy || waiting} />
            <div className="wd-playtest-controls">
              <button
                className="wd-secondary"
                onClick={() => {
                  setPath([level.start]);
                  setWaiting(false);
                  setNotice("");
                  board.current?.focus();
                }}
              >
                <RotateCcw size={16} /> Restart this journey
              </button>
              <button
                className="wd-secondary"
                onClick={() => {
                  setPlaying(false);
                  setWaiting(false);
                  setNotice("");
                }}
              >
                Return to the builder
              </button>
            </div>
          </>
        ) : (
          <div className="wd-playtest-controls">
            <button
              className="wd-primary"
              disabled={busy || state.solved}
              onClick={() => {
                send({ type: "fabricate" });
                setNotice("");
              }}
            >
              <Hammer size={18} /> Fabricate my instructions
            </button>
            <button
              className="wd-secondary"
              disabled={
                busy ||
                !state.tiles.length ||
                state.tiles.length > level.budget ||
                state.solved
              }
              onClick={() => {
                setPlaying(true);
                setPath([level.start]);
                setWaiting(false);
                setNotice("");
                requestAnimationFrame(() => board.current?.focus());
              }}
            >
              <Play size={18} /> Step inside my world
            </button>
          </div>
        )}
        {notice && (
          <p role="status" className="wd-local-feedback">
            {notice}
          </p>
        )}
        <p className="wd-caption">
          {playing
            ? "Move with the arrow keys or tap the neighbouring path squares. Use the arrow controls to enter a destination."
            : "Tap a square to add a path instruction. Tap it again to remove it. A water square becomes a bridge."}
        </p>
      </div>
      <aside className="wd-blueprint">
        <span className="wd-kicker">YOUR CLIENT’S BRIEF</span>
        <h3>Build something that works.</h3>
        <ul>
          {level.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div className="wd-destination-list">
          {level.goals.map((g, i) => (
            <div key={g}>
              <span>{state.testedGoals.includes(g) ? "✓" : i + 1}</span>
              <p>
                {level.goalNames[i]}
                <small>
                  {state.testedGoals.includes(g)
                    ? "You tested this journey."
                    : "This journey needs testing."}
                </small>
              </p>
            </div>
          ))}
        </div>
        <h4>Your build instructions</h4>
        <div className="wd-build-tickets">
          {state.instructions.length ? (
            state.instructions.map((cell, i) => (
              <button
                key={cell}
                disabled={playing || busy || state.solved}
                onClick={() => send({ type: "tile", cell })}
              >
                <span>{i + 1}</span>Put a{" "}
                {level.water.includes(cell) ? "bridge" : "path"} at{" "}
                {(cell % level.width) + 1}, {Math.floor(cell / level.width) + 1}
                .<b aria-hidden="true">×</b>
              </button>
            ))
          ) : (
            <p>Tap the board to write your first instruction.</p>
          )}
        </div>
        <p className="wd-caption">
          This builder follows fixed instructions. Real AI may interpret a
          request differently, so its output also needs testing.
        </p>
      </aside>
    </div>
  );
}
export function LaunchScene({
  level,
  state,
  send,
  busy,
}: {
  level: LaunchLevel;
  state: RoundState;
  send: SendAction;
  busy: boolean;
}) {
  const [selected, setSelected] = useState(level.tasks[0].id);
  const [helper, setHelper] = useState("ai");
  const [tick, setTick] = useState(-1);
  const task = level.tasks.find((t) => t.id === selected)!;
  useEffect(() => {
    if (tick < 0) return;
    if (tick >= level.slots) return;
    const timeout = setTimeout(
      () => setTick((n) => n + 1),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 650,
    );
    return () => clearTimeout(timeout);
  }, [tick, level.slots]);
  function test() {
    setTick(0);
    send({ type: "test" });
  }
  return (
    <div className="wd-launch-layout">
      <aside className="wd-jobs">
        <span className="wd-kicker">THE JOBS IN YOUR BRIEF</span>
        <h3>Build your running order.</h3>
        {level.tasks.map((t) => (
          <button
            key={t.id}
            className="wd-job"
            aria-pressed={selected === t.id}
            onClick={() => {
              setSelected(t.id);
              setHelper(state.schedule[t.id]?.helper ?? "ai");
            }}
          >
            <strong>{t.name}</strong>
            <span>
              {t.duration} time slot{t.duration > 1 ? "s" : ""} ·{" "}
              {level.resources[t.resource]}
            </span>
            <small>
              {t.after
                ? `Start after “${level.tasks.find((x) => x.id === t.after)?.name}” has finished. `
                : ""}
              Start from slot {t.earliest + 1}; finish by slot {t.latest}.
            </small>
          </button>
        ))}
        <label className="wd-helper-label">
          Choose the helper for “{task.name}”.
          <select value={helper} onChange={(e) => setHelper(e.target.value)}>
            <option value="ai">AI drafting helper</option>
            <option value="calculator">Calculator</option>
            <option value="person">A person</option>
          </select>
        </label>
        <p className="wd-caption">{task.why}</p>
      </aside>
      <div className="wd-control-room">
        <div className={`wd-launch-world ${state.solved ? "ready" : ""}`}>
          <div className="wd-stage-rig">
            <i />
            <i />
            <i />
            <span>
              {state.solved ? "READY FOR LAUNCH" : "REHEARSAL STUDIO"}
            </span>
          </div>
          <div className="wd-stage-platform" />
          <div className="wd-stage-light one" />
          <div className="wd-stage-light two" />
          <div className="wd-runner-row">
            {level.tasks.map((t, i) => {
              const p = state.schedule[t.id],
                active = p && tick >= p.slot && tick < p.slot + t.duration;
              return (
                <div
                  key={t.id}
                  className={`wd-job-runner ${active ? "active" : ""} ${p && tick >= p.slot + t.duration ? "finished" : ""}`}
                  style={{ left: `${15 + i * 23}%` }}
                >
                  <span>{["◈", "✧", "▦", "⚑"][i]}</span>
                  <small>{t.name}</small>
                </div>
              );
            })}
          </div>
          <div className="wd-simulation-time">
            {tick < 0
              ? "Your plan is waiting for a test."
              : tick < level.slots
                ? `Rehearsal: time slot ${tick + 1}`
                : state.solved
                  ? "The rehearsal meets the brief."
                  : "The rehearsal found a problem to repair."}
          </div>
        </div>
        <div className="wd-timetable-scroll">
          <div
            className="wd-timetable"
            style={{
              gridTemplateColumns: `110px repeat(${level.slots},minmax(42px,1fr))`,
            }}
          >
            <span className="wd-table-key">SPACE / TIME</span>
            {Array.from({ length: level.slots }, (_, i) => (
              <span
                className={`wd-slot-number ${tick === i ? "current" : ""}`}
                key={i}
              >
                {i + 1}
              </span>
            ))}
            {level.resources.map((resource, r) => (
              <div className="wd-timetable-row" key={resource}>
                <strong>{resource}</strong>
                {Array.from({ length: level.slots }, (_, slot) => {
                  const jobs = level.tasks.filter((t) => {
                    const p = state.schedule[t.id];
                    return (
                      p &&
                      p.resource === r &&
                      slot >= p.slot &&
                      slot < p.slot + t.duration
                    );
                  });
                  return (
                    <button
                      key={slot}
                      disabled={
                        busy ||
                        state.solved ||
                        slot + task.duration > level.slots
                      }
                      className={`${jobs.length > 1 ? "conflict" : ""} ${jobs.length ? "occupied" : ""}`}
                      aria-label={`Place ${task.name} in ${resource}, slot ${slot + 1}${jobs.length ? `. Currently used by ${jobs.map((j) => j.name).join(" and ")}` : ""}`}
                      onClick={() => {
                        setTick(-1);
                        send({
                          type: "schedule",
                          task: task.id,
                          slot,
                          resource: r,
                          helper,
                        });
                      }}
                    >
                      {jobs.map((j) => (
                        <span key={j.id} title={j.name}>
                          {level.tasks.indexOf(j) + 1}
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="wd-caption">
          Select a job and its helper, then tap its starting slot. Numbered
          blocks show how long the job takes. Select the job again to move it.
        </p>
        <button
          className="wd-primary"
          disabled={busy || state.solved}
          onClick={test}
        >
          <Play size={18} /> Run my rehearsal
        </button>
      </div>
    </div>
  );
}
export function LabScene({
  level,
  state,
  send,
  busy,
}: {
  level: LabLevel;
  state: RoundState;
  send: SendAction;
  busy: boolean;
}) {
  const predictions = predict(level, state.examples);
  return (
    <div className="wd-lab-layout">
      <div className="wd-specimen-bank">
        <span className="wd-kicker">EXAMPLES WITH KNOWN LABELS</span>
        <h3>Feed the sorter varied examples.</h3>
        <p>
          Each example has a shape, colour and checked label. Tap one to add it
          to the training tray or remove it.
        </p>
        <div className="wd-specimens">
          {level.examples.map((e) => (
            <button
              key={e.id}
              disabled={busy || state.solved}
              aria-pressed={state.examples.includes(e.id)}
              onClick={() => send({ type: "example", id: e.id })}
            >
              <span className={`wd-specimen ${e.colour} ${e.shape}`}>
                <i />
                <i />
              </span>
              <strong>
                {e.colour} · {e.shape}
              </strong>
              <small>Known label: {e.label}</small>
              <b>
                {state.examples.includes(e.id)
                  ? "✓ In the training tray"
                  : "＋ Add example"}
              </b>
            </button>
          ))}
        </div>
      </div>
      <div className="wd-sorter">
        <div className="wd-sorter-machine">
          <Sparkles size={38} />
          <span>{state.examples.length} examples in the tray</span>
          <div className="wd-sorter-belt" />
        </div>
        <h3>Test creatures the sorter has not seen.</h3>
        <div className="wd-probes">
          {predictions.map(({ probe, label, correct }) => (
            <div
              key={probe.id}
              className={
                state.feedback ? (correct ? "correct" : "incorrect") : ""
              }
            >
              <span className={`wd-specimen ${probe.colour} ${probe.shape}`}>
                <i />
                <i />
              </span>
              <strong>
                {probe.colour} · {probe.shape}
              </strong>
              <p>
                {state.feedback ? `Sorter: ${label}` : "Waiting for a test"}
              </p>
              {state.feedback && <small>Field notes: {probe.label}</small>}
            </div>
          ))}
        </div>
        <button
          disabled={busy || state.solved}
          className="wd-primary"
          onClick={() => send({ type: "test" })}
        >
          <Play size={18} /> Test the unfamiliar examples
        </button>
        <p className="wd-caption">
          This simplified model finds the nearest examples by colour and shape.
          If equally close examples disagree, it reports uncertainty. Real AI
          systems can be more complex.
        </p>
      </div>
    </div>
  );
}
