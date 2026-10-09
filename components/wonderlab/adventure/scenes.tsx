"use client";
import { useEffect, useRef, useState } from "react";
import { NextStep } from "../next-step";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Hammer,
  MapPin,
  Play,
  Radio,
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
import { predict } from "@/lib/wonderlab/adventure/engine";
import { CourierWorld } from "./courier-world";
import { planRouteTest } from "@/lib/wonderlab/adventure/route-test";
type SendAction = (action: Action) => Promise<boolean>;
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
    <div
      className="wd-direction-pad"
      aria-label="Movement controls"
      onKeyDown={(event) => {
        if (!disabled) directionKey(event, move);
      }}
    >
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
    event.stopPropagation();
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
      <NextStep
        steps={["Find the clues", "Check the draft", "Explain your change"]}
        current={state.solved ? 2 : tab === "casebook" ? 1 : 0}
        title={
          state.solved
            ? "You checked the draft."
            : tab === "explore"
              ? `Collect the clues: ${state.visited.length} of ${level.sources.length} saved.`
              : "Match each statement to a clue, then decide what to change."
        }
      >
        {state.solved
          ? "Write one sentence below about a change you made and why it helped."
          : tab === "explore"
            ? state.visited.length === level.sources.length
              ? "You have all the clues. Choose ‘Check the draft’ to use them."
              : "Tap a building to visit it. Read its note, then choose ‘Collect this evidence’. Each note is a clue you will use to check the draft."
            : "Choose a clue on the left, then connect it to the statement it checks. Keep, repair or remove that statement. Repeat for every statement, then test your edits."}
      </NextStep>
      <div className="wd-scene-tabs">
        <button
          aria-pressed={tab === "explore"}
          onClick={() => setTab("explore")}
        >
          <MapPin size={16} /> Find the clues
        </button>
        <button
          aria-pressed={tab === "casebook"}
          disabled={state.visited.length < level.sources.length}
          onClick={() => setTab("casebook")}
        >
          <BookOpen size={16} /> Check the draft
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
                Check the draft <ArrowRight size={18} />
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
  coach,
  onReflect,
}: {
  level: ForgeLevel;
  state: RoundState;
  send: SendAction;
  busy: boolean;
  colour: string;
  coach?: React.ReactNode;
  onReflect?: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [position, setPosition] = useState(level.start);
  const [gap, setGap] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const run = useRef(0);
  const active = useRef(false);
  useEffect(
    () => () => {
      run.current++;
      active.current = false;
    },
    [],
  );
  const disabled = busy || running || state.solved;
  async function testRoute() {
    if (active.current || busy || state.solved) return;
    active.current = true;
    const token = ++run.current;
    setRunning(true);
    setGap(null);
    setPosition(level.start);
    setNotice(
      "I am building your instructions. Then the courier will test each destination automatically.",
    );
    try {
      if (!(await send({ type: "fabricate" }))) {
        if (token === run.current)
          setNotice(
            "The route could not be saved. Your pieces are still here. Try sending the courier again.",
          );
        return;
      }
      if (token !== run.current) return;
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? 60
        : 430;
      for (const goal of level.goals) {
        const result = planRouteTest(level, state.instructions, goal);
        setPosition(level.start);
        setNotice(
          `The courier is testing the route to ${level.goalNames[level.goals.indexOf(goal)]}. Watch what your instructions make possible.`,
        );
        for (const cell of result.path) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          if (token !== run.current) return;
          setPosition(cell);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (token !== run.current) return;
        if (!result.reached) {
          setGap(result.gap);
          setNotice(
            result.gap === null
              ? "The rocks block this destination. Try a different route, then test again."
              : level.water.includes(result.gap)
                ? "The courier has stopped at the river. Your route needs a bridge here. Tap the glowing water to build it, then test again."
                : "The courier has reached a gap. Tap the glowing space to connect your path, then test again.",
          );
          return;
        }
        if (
          !(await send({ type: "walk", path: result.path })) ||
          token !== run.current
        ) {
          if (token === run.current)
            setNotice(
              "The journey could not be saved. Your route is still here. Try testing it again.",
            );
          return;
        }
      }
      setNotice(
        "Delivery complete! Your instructions connected every destination. You checked the result instead of assuming the plan would work.",
      );
    } finally {
      if (token === run.current) {
        active.current = false;
        setRunning(false);
      }
    }
  }
  async function place(cell: number) {
    if (disabled) return;
    if (await send({ type: "tile", cell })) {
      setGap(null);
      setNotice(
        level.water.includes(cell)
          ? state.instructions.includes(cell)
            ? "You removed a bridge. Make sure the courier still has a way across before you send it."
            : "You added a bridge. Now test the route to see whether it connects all the way to the destination."
          : "You changed the route. Send the courier when you are ready to see what happens.",
      );
    }
  }
  return (
    <div className="wd-forge-layout wd-delivery-game">
      <div className="wd-forge-main">
        <div className="wd-delivery-hud">
          <div>
            <span className="wd-live-dot" />
            {state.solved
              ? "DELIVERY COMPLETE"
              : running
                ? "COURIER ON THE MOVE"
                : "YOUR DELIVERY WORLD"}
          </div>
          <span>
            {state.instructions.length} / {level.budget} pieces
          </span>
        </div>
        <CourierWorld
          level={level}
          pieces={state.instructions}
          position={state.solved ? level.goals.at(-1)! : position}
          gap={gap}
          running={running}
          solved={state.solved}
          testedGoals={state.testedGoals}
          disabled={disabled}
          onPlace={place}
        />
        <div
          className={`wd-delivery-message ${gap !== null ? "needs-repair" : ""}`}
          role="status"
        >
          <span aria-hidden="true">
            {state.solved ? "✓" : gap !== null ? "!" : "↗"}
          </span>
          <p>
            {notice ||
              (state.solved
                ? "You already checked this route. Your reflection is below."
                : "Connect the depot to each destination. Tap the landscape to add paths and tap water to build bridges. Then send the courier.")}
          </p>
        </div>
        <div className="wd-playtest-controls">
          {state.solved && (
            <button className="wd-primary" onClick={onReflect}>
              Explain what worked <ArrowRight size={18} />
            </button>
          )}
          {!state.solved &&
            (running ? (
              <button
                className="wd-secondary"
                onClick={() => {
                  run.current++;
                  active.current = false;
                  setRunning(false);
                  setNotice(
                    "The test has stopped. Change your route or send the courier again when you are ready.",
                  );
                }}
              >
                Stop the test
              </button>
            ) : (
              <button
                className="wd-primary"
                disabled={
                  busy ||
                  !state.instructions.length ||
                  state.instructions.length > level.budget
                }
                onClick={testRoute}
              >
                <Play size={18} /> Send the courier{" "}
                <span className="wd-button-detail">Test my route</span>
              </button>
            ))}
          <p className="wd-caption">
            {state.instructions.length > level.budget
              ? `Remove ${state.instructions.length - level.budget} pieces before testing. You can use up to ${level.budget}.`
              : state.solved
                ? "Your delivery reached every destination. Explain what you checked below."
                : "The courier moves automatically. You design the route and repair anything that stops it."}
          </p>
        </div>
      </div>
      <div className="wd-mission-side">
        {coach}
        <aside className="wd-blueprint">
          <span className="wd-kicker">YOUR DELIVERY BRIEF</span>
          <h3>
            {state.solved
              ? "Your world is connected."
              : "Give the courier a route that works."}
          </h3>
          <ul>
            {level.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <div className="wd-destination-list">
            {level.goals.map((goal, i) => (
              <div key={goal}>
                <span>{state.testedGoals.includes(goal) ? "✓" : i + 1}</span>
                <p>
                  {level.goalNames[i]}
                  <small>
                    {state.testedGoals.includes(goal)
                      ? "The courier reached this destination."
                      : "Waiting for a successful delivery."}
                  </small>
                </p>
              </div>
            ))}
          </div>
          <details className="wd-build-details">
            <summary>See the instructions your route creates.</summary>
            <div className="wd-build-tickets">
              {state.instructions.length ? (
                state.instructions.map((cell, i) => (
                  <button
                    key={cell}
                    disabled={disabled}
                    onClick={() => place(cell)}
                  >
                    <span>{i + 1}</span>Put a{" "}
                    {level.water.includes(cell) ? "bridge" : "path"} at{" "}
                    {(cell % level.width) + 1},{" "}
                    {Math.floor(cell / level.width) + 1}.
                    <b aria-hidden="true">×</b>
                  </button>
                ))
              ) : (
                <p>Tap the landscape to place your first path.</p>
              )}
            </div>
          </details>
          <p className="wd-caption">
            The courier follows connected paths using fixed rules. This
            simulation helps you practise checking instructions; it does not use
            live AI to find a route.
          </p>
        </aside>
      </div>
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
      <NextStep
        steps={["Arrange the jobs", "Test your plan", "Explain your change"]}
        current={state.solved ? 2 : tick >= 0 ? 1 : 0}
        title={
          state.solved
            ? "Your plan passed its rehearsal."
            : "Repair the starting plan so every job can happen."
        }
      >
        {state.solved
          ? "Write one sentence below about a decision you made and why it helped."
          : `Choose a job, choose its helper, then tap a square in the timetable to place it. Each column is one time slot. You are placing ‘${task.name}’. When you have arranged all the jobs, choose ‘Run my rehearsal’ to check the plan.`}
      </NextStep>
      <aside className="wd-jobs">
        <span className="wd-kicker">THE JOBS IN YOUR BRIEF</span>
        <h3>1. Choose a job to place.</h3>
        {level.tasks.map((t, index) => (
          <button
            key={t.id}
            className="wd-job"
            aria-pressed={selected === t.id}
            onClick={() => {
              setSelected(t.id);
              setHelper(state.schedule[t.id]?.helper ?? "ai");
            }}
          >
            <strong>
              {index + 1}. {t.name}
            </strong>
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
          2. Choose the helper for “{task.name}”.
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
          <h3>3. Tap a starting slot for “{task.name}”.</h3>
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
      <NextStep
        steps={["Choose examples", "Test the sorter", "Explain your change"]}
        current={state.solved ? 2 : state.feedback ? 1 : 0}
        title={
          state.solved
            ? "You checked the sorter's guesses."
            : state.attempts
              ? "Change the examples and test the sorter again."
              : "Test the sorter with its starting examples."
        }
      >
        {state.solved
          ? "Write one sentence below about which examples helped and why."
          : "The selected cards are the examples the sorter learns from. Choose ‘Test the unfamiliar examples’ to see its guesses. Compare them with the field notes, then add or remove cards and test again."}
      </NextStep>
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
