import { creationText } from "./creation.ts";
import {
  ADVENTURE_VERSION,
  type Action,
  type Adventure,
  type AdventureState,
  type ForgeLevel,
  type LabLevel,
  type Level,
  type RoundState,
} from "./types.ts";
export function freshRound(level: Level): RoundState {
  return {
    visited: [],
    links: {},
    decisions: {},
    tiles: [],
    instructions: level.kind === "forge" ? [...level.initial] : [],
    testedGoals: [],
    schedule:
      level.kind === "launch"
        ? Object.fromEntries(
            level.tasks.map((t) => [
              t.id,
              { slot: 0, resource: 0, helper: "ai" },
            ]),
          )
        : {},
    examples: level.kind === "lab" ? ["a", "b"] : [],
    moves: 0,
    attempts: 0,
    solved: false,
    feedback: "",
    failures: [],
    reflection: "",
  };
}
export function initialAdventure(game: Adventure): AdventureState {
  return {
    version: ADVENTURE_VERSION,
    round: 0,
    rounds: game.levels.map(freshRound),
    completed: false,
    cosmetic: "aqua",
    collection: [],
  };
}
export function neighbours(level: ForgeLevel, cell: number) {
  const x = cell % level.width,
    y = Math.floor(cell / level.width);
  return [
    x > 0 ? cell - 1 : -1,
    x < level.width - 1 ? cell + 1 : -1,
    y > 0 ? cell - level.width : -1,
    y < level.height - 1 ? cell + level.width : -1,
  ].filter((n) => n >= 0);
}
export function walkable(level: ForgeLevel, state: RoundState, cell: number) {
  return (
    cell === level.start ||
    level.goals.includes(cell) ||
    state.tiles.includes(cell)
  );
}
export function predict(level: LabLevel, examples: string[]) {
  return level.probes.map((probe) => {
    const candidates = level.examples.filter((s) => examples.includes(s.id));
    const ranked = candidates
      .map((example) => ({
        example,
        distance:
          Number(example.colour !== probe.colour) +
          Number(example.shape !== probe.shape),
      }))
      .sort((a, b) => a.distance - b.distance);
    const nearest = ranked.filter((c) => c.distance === ranked[0]?.distance);
    const unique = new Set(nearest.map((c) => c.example.label));
    return {
      probe,
      label: unique.size === 1 ? nearest[0].example.label : "uncertain",
      correct: unique.size === 1 && nearest[0].example.label === probe.label,
    };
  });
}
export function checkRound(level: Level, s: RoundState): string[] {
  if (level.kind === "signal")
    return level.claims.flatMap((c) =>
      !s.visited.includes(c.source)
        ? [
            `Visit the ${level.sources.find((x) => x.id === c.source)!.name.toLowerCase()} before judging this claim.`,
          ]
        : s.links[c.id] !== c.source
          ? [`Connect the source that checks “${c.text}”.`]
          : s.decisions[c.id] !== c.decision
            ? [
                `Your decision about “${c.text}” does not match the connected evidence. Read the source again.`,
              ]
            : [],
    );
  if (level.kind === "forge")
    return [
      ...(s.tiles.length > level.budget
        ? [
            `Your construction uses ${s.tiles.length} pieces. The brief allows ${level.budget}.`,
          ]
        : []),
      ...level.goals
        .filter((g) => !s.testedGoals.includes(g))
        .map(
          (g) =>
            `Playtest the journey to ${level.goalNames[level.goals.indexOf(g)]}.`,
        ),
    ];
  if (level.kind === "lab")
    return [
      ...(s.examples.length < 3
        ? ["Include more varied examples before testing unfamiliar cases."]
        : []),
      ...predict(level, s.examples)
        .filter((p) => !p.correct)
        .map(
          (p) =>
            `The ${p.probe.colour} ${p.probe.shape} example is ${p.probe.label}, but the sorter guessed ${p.label}. Find examples that separate colour from shape.`,
        ),
    ];
  const failures: string[] = [];
  for (const task of level.tasks) {
    const p = s.schedule[task.id];
    if (!p) {
      failures.push(`Place ${task.name.toLowerCase()} on the timetable.`);
      continue;
    }
    if (p.helper !== task.helper) failures.push(`${task.name}: ${task.why}`);
    if (p.resource !== task.resource)
      failures.push(
        `${task.name} needs the ${level.resources[task.resource].toLowerCase()}.`,
      );
    if (p.slot < task.earliest || p.slot + task.duration > task.latest)
      failures.push(
        `${task.name} must start no earlier than slot ${task.earliest + 1} and finish by the end of slot ${task.latest}.`,
      );
    if (task.after) {
      const prev = level.tasks.find((t) => t.id === task.after)!;
      const placed = s.schedule[prev.id];
      if (!placed || placed.slot + prev.duration > p.slot)
        failures.push(
          `${task.name} must start after ${prev.name.toLowerCase()} has finished.`,
        );
    }
  }
  for (let i = 0; i < level.tasks.length; i++)
    for (let j = i + 1; j < level.tasks.length; j++) {
      const a = level.tasks[i],
        b = level.tasks[j],
        p = s.schedule[a.id],
        q = s.schedule[b.id];
      if (
        p &&
        q &&
        p.resource === q.resource &&
        p.slot < q.slot + b.duration &&
        q.slot < p.slot + a.duration
      )
        failures.push(
          `${a.name} overlaps ${b.name.toLowerCase()} in the same space.`,
        );
    }
  return failures;
}
function invalid(): never {
  throw new Error(
    "That game action is not available. Reload your saved checkpoint and try again.",
  );
}
export function parseAction(input: unknown): Action {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return invalid();
  const a = input as Record<string, unknown>;
  const str = (k: string, max = 100) =>
    typeof a[k] === "string" && (a[k] as string).length <= max;
  const int = (k: string) =>
    Number.isInteger(a[k]) && Number(a[k]) >= 0 && Number(a[k]) < 100;
  switch (a.type) {
    case "visit":
    case "example":
      if (str("id")) return { type: a.type, id: a.id as string };
      break;
    case "link":
      if (str("claim") && str("source"))
        return {
          type: a.type,
          claim: a.claim as string,
          source: a.source as string,
        };
      break;
    case "decide":
      if (
        str("claim") &&
        ["keep", "repair", "remove"].includes(String(a.decision))
      )
        return {
          type: a.type,
          claim: a.claim as string,
          decision: String(a.decision),
        };
      break;
    case "tile":
      if (int("cell")) return { type: a.type, cell: Number(a.cell) };
      break;
    case "schedule":
      if (
        str("task") &&
        int("slot") &&
        int("resource") &&
        ["person", "calculator", "ai"].includes(String(a.helper))
      )
        return {
          type: a.type,
          task: String(a.task),
          slot: Number(a.slot),
          resource: Number(a.resource),
          helper: String(a.helper),
        };
      break;
    case "walk":
      if (
        Array.isArray(a.path) &&
        a.path.length > 0 &&
        a.path.length <= 140 &&
        a.path.every((n) => Number.isInteger(n) && n >= 0 && n < 100)
      )
        return { type: a.type, path: a.path as number[] };
      break;
    case "reflect":
      if (str("text", 600)) return { type: a.type, text: String(a.text) };
      break;
    case "cosmetic":
      if (["aqua", "violet", "orange"].includes(String(a.colour)))
        return {
          type: a.type,
          colour: a.colour as "aqua" | "violet" | "orange",
        };
      break;
    case "fabricate":
    case "test":
    case "next":
    case "replay":
      return { type: a.type };
  }
  return invalid();
}
export function transition(
  game: Adventure,
  current: AdventureState,
  input: unknown,
): AdventureState {
  const a = parseAction(input);
  if (current.version !== ADVENTURE_VERSION) return invalid();
  if (a.type === "cosmetic") {
    if (a.colour !== "aqua" && !current.completed) return invalid();
    return { ...current, cosmetic: a.colour };
  }
  if (a.type === "replay") {
    if (!current.completed) return invalid();
    return {
      ...initialAdventure(game),
      completed: true,
      cosmetic: current.cosmetic,
      collection: current.collection,
    };
  }
  if (current.round >= game.levels.length) return invalid();
  const state = structuredClone(current),
    s = state.rounds[state.round],
    level = game.levels[state.round];
  s.moves++;
  if (a.type === "next") {
    if (!s.solved || s.reflection.trim().length < 12) return invalid();
    state.round++;
    if (state.round === game.levels.length) {
      state.completed = true;
      state.collection = [creationText(game, state)];
    }
    return state;
  }
  if (a.type === "reflect") {
    s.reflection = a.text;
    return state;
  }
  if (s.solved) return invalid();
  const changed = () => {
    s.feedback = "";
    s.failures = [];
  };
  if (a.type === "visit" && level.kind === "signal") {
    if (!level.sources.some((x) => x.id === a.id)) return invalid();
    if (!s.visited.includes(a.id)) s.visited.push(a.id);
    return state;
  }
  if (a.type === "link" && level.kind === "signal") {
    if (
      !level.claims.some((c) => c.id === a.claim) ||
      !s.visited.includes(a.source)
    )
      return invalid();
    s.links[a.claim] = a.source;
    changed();
    return state;
  }
  if (a.type === "decide" && level.kind === "signal") {
    if (!level.claims.some((c) => c.id === a.claim) || !s.links[a.claim])
      return invalid();
    s.decisions[a.claim] = a.decision;
    changed();
    return state;
  }
  if (a.type === "tile" && level.kind === "forge") {
    if (
      a.cell >= level.width * level.height ||
      a.cell === level.start ||
      level.goals.includes(a.cell) ||
      level.rocks.includes(a.cell)
    )
      return invalid();
    s.instructions = s.instructions.includes(a.cell)
      ? s.instructions.filter((n) => n !== a.cell)
      : [...s.instructions, a.cell];
    s.testedGoals = [];
    s.tiles = [];
    changed();
    return state;
  }
  if (a.type === "fabricate" && level.kind === "forge") {
    s.attempts++;
    s.tiles = [...s.instructions];
    s.testedGoals = [];
    s.failures =
      s.tiles.length > level.budget
        ? [
            `The brief allows ${level.budget} pieces. Remove ${s.tiles.length - level.budget} and fabricate again.`,
          ]
        : [];
    s.feedback =
      s.failures[0] ??
      "The builder followed your fixed instructions. Now walk through the construction to check each destination.";
    return state;
  }
  if (a.type === "walk" && level.kind === "forge") {
    if (
      !s.tiles.length ||
      a.path[0] !== level.start ||
      s.tiles.length > level.budget
    )
      return invalid();
    for (let i = 0; i < a.path.length; i++)
      if (
        !walkable(level, s, a.path[i]) ||
        level.rocks.includes(a.path[i]) ||
        (i > 0 && !neighbours(level, a.path[i - 1]).includes(a.path[i]))
      )
        return invalid();
    const goal = a.path.at(-1)!;
    if (!level.goals.includes(goal)) return invalid();
    if (!s.testedGoals.includes(goal)) s.testedGoals.push(goal);
    s.failures = checkRound(level, s);
    s.solved = !s.failures.length;
    s.feedback = s.solved
      ? level.finished
      : `You reached ${level.goalNames[level.goals.indexOf(goal)]}. Return to the start and test the other destination.`;
    return state;
  }
  if (a.type === "schedule" && level.kind === "launch") {
    const task = level.tasks.find((t) => t.id === a.task);
    if (
      !task ||
      a.slot + task.duration > level.slots ||
      a.resource >= level.resources.length
    )
      return invalid();
    s.schedule[a.task] = {
      slot: a.slot,
      resource: a.resource,
      helper: a.helper,
    };
    changed();
    return state;
  }
  if (a.type === "example" && level.kind === "lab") {
    if (!level.examples.some((e) => e.id === a.id)) return invalid();
    s.examples = s.examples.includes(a.id)
      ? s.examples.filter((x) => x !== a.id)
      : [...s.examples, a.id];
    changed();
    return state;
  }
  if (a.type === "test" && level.kind !== "forge") {
    s.attempts++;
    s.failures = checkRound(level, s);
    s.solved = s.failures.length === 0;
    s.feedback = s.solved ? level.finished : s.failures[0];
    return state;
  }
  return invalid();
}
export function adventureEvidence(game: Adventure, state: AdventureState) {
  return state.rounds.flatMap((r, i) =>
    i > state.round || !r.moves
      ? []
      : [
          {
            title: game.levels[i].title,
            checked: r.solved,
            attempts: r.attempts,
            reflection: r.reflection,
            action:
              game.levels[i].kind === "signal"
                ? `Connected ${Object.keys(r.links).length} claims to sources.`
                : game.levels[i].kind === "forge"
                  ? `Built ${r.instructions.length} instructions and tested ${r.testedGoals.length} destinations.`
                  : game.levels[i].kind === "launch"
                    ? `Arranged ${Object.keys(r.schedule).length} jobs and ran ${r.attempts} rehearsals.`
                    : `Selected ${r.examples.length} training examples and ran ${r.attempts} tests.`,
          },
        ],
  );
}
