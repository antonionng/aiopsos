/**
 * Creature Crossing: the child teaches a gate with labelled examples, then a herd of
 * unseen creatures tests what it learned. The gate is a nearest-example classifier, so
 * every mistake can be traced back to the examples the child chose.
 */

export const CROSSING_VERSION = "creature-crossing-2026-10-13.1";

export const COLOURS = ["blue", "orange", "green", "pink"] as const;
export const PATTERNS = ["stripes", "spots", "plain"] as const;
export const SHAPES = ["round", "tall", "spiky"] as const;
export const LIMBS = ["fins", "legs", "wings"] as const;

export type Colour = (typeof COLOURS)[number];
export type Pattern = (typeof PATTERNS)[number];
export type Shape = (typeof SHAPES)[number];
export type Limbs = (typeof LIMBS)[number];
export type Home = "river" | "woods" | "sky";
export type Feature = "colour" | "pattern" | "limbs";

export type Creature = {
  id: string;
  colour: Colour;
  pattern: Pattern;
  shape: Shape;
  limbs: Limbs;
};

/** What the gate compares. Body shape is visual variety only, so every mistake has a reason the child can see. */
export const FEATURES: Feature[] = ["colour", "pattern", "limbs"];

export const HOMES: Record<Home, { name: string; place: string }> = {
  river: { name: "River", place: "the river" },
  woods: { name: "Woods", place: "the woods" },
  sky: { name: "Sky nests", place: "the sky nests" },
};

/** Where a creature really lives. The child is never told this rule; the herd reveals it. */
export function homeOf(creature: Pick<Creature, "limbs">): Home {
  return creature.limbs === "fins" ? "river" : creature.limbs === "wings" ? "sky" : "woods";
}

export type CrossingLevel = {
  id: string;
  number: number;
  title: string;
  brief: string;
  hint: string;
  lesson: string;
  homes: Home[];
  slots: number;
  pen: Creature[];
  herd: Creature[];
  /** The examples a hurried player is likely to choose first. Used to check the level teaches something. */
  obvious: string[];
};

function parse(prefix: string, codes: string[]): Creature[] {
  return codes.map((code, index) => {
    const [colour, pattern, shape, limbs] = code.split(" ") as [Colour, Pattern, Shape, Limbs];
    if (!COLOURS.includes(colour) || !PATTERNS.includes(pattern) || !SHAPES.includes(shape) || !LIMBS.includes(limbs)) {
      throw new Error(`Invalid creature code: ${code}`);
    }
    return { id: `${prefix}${index + 1}`, colour, pattern, shape, limbs };
  });
}

export const CROSSING_LEVELS: CrossingLevel[] = [
  {
    id: "first-crossing",
    number: 1,
    title: "Teach the gate",
    brief:
      "The Wonder Gate sends each creature home, but it has never met a creature before. Tap creatures in the pen to show it some examples from the river and some from the woods. Then open the gate and watch where the herd goes.",
    hint: "Try to show the gate at least one river creature and one woods creature.",
    lesson:
      "The gate compared every new creature with your examples and sent it to the home of the one it looked most like. That is how this kind of AI learns: from examples, not from rules someone wrote down.",
    homes: ["river", "woods"],
    slots: 4,
    pen: parse("p1-", [
      "blue stripes round fins",
      "green plain tall fins",
      "orange spots spiky legs",
      "pink plain round legs",
      "blue plain spiky fins",
      "green spots tall legs",
    ]),
    herd: parse("h1-", [
      "blue stripes round fins",
      "green plain round fins",
      "orange spots round legs",
      "pink plain tall legs",
      "blue plain tall fins",
      "green spots spiky legs",
      "orange spots tall legs",
      "green plain spiky fins",
    ]),
    obvious: ["p1-1", "p1-3"],
  },
  {
    id: "colour-trap",
    number: 2,
    title: "The colour trap",
    brief:
      "In this pen, most river creatures are blue and most woods creatures are orange. If the gate only sees those, it might decide that colour is what matters. Choose your examples, then watch what happens to creatures that do not match the pattern.",
    hint: "Look for an orange creature that lives in the river, or a blue one that lives in the woods. Unusual examples help the gate notice what really matters.",
    lesson:
      "When every example from one home shared a colour, the gate used colour as its clue. Adding unusual examples showed it that fins and legs decide where a creature lives. Real AI systems make the same kind of mistake when their examples are lopsided.",
    homes: ["river", "woods"],
    slots: 4,
    pen: parse("p2-", [
      "blue stripes round fins",
      "blue stripes tall fins",
      "blue stripes spiky fins",
      "orange spots round legs",
      "orange spots tall legs",
      "orange spots spiky legs",
      "orange spots round fins",
      "blue stripes round legs",
    ]),
    herd: parse("h2-", [
      "blue stripes tall fins",
      "orange spots spiky legs",
      "orange spots tall fins",
      "blue stripes spiky legs",
      "orange spots spiky fins",
      "blue stripes tall legs",
      "blue stripes round fins",
      "orange spots round legs",
      "orange spots round fins",
      "blue stripes round legs",
    ]),
    obvious: ["p2-1", "p2-2", "p2-4", "p2-5"],
  },
  {
    id: "sky-visitors",
    number: 3,
    title: "Visitors from the sky",
    brief:
      "A new home has opened in the clouds. Some creatures in today's herd have wings, but the gate can only recognise a sky creature if you have shown it one. You have six examples to share between three homes.",
    hint: "If a creature stops at the gate with a question mark, the gate could not decide. Which home has it never seen an example from?",
    lesson:
      "An AI system cannot recognise something it has never been shown. When the herd included wings, the gate needed examples of winged creatures before it could send them to the sky nests.",
    homes: ["river", "woods", "sky"],
    slots: 6,
    pen: parse("p3-", [
      "blue stripes round fins",
      "orange spots spiky legs",
      "blue stripes tall fins",
      "green plain spiky fins",
      "orange spots tall legs",
      "pink stripes round legs",
      "pink plain round wings",
      "green plain tall fins",
      "orange stripes tall wings",
    ]),
    herd: parse("h3-", [
      "blue stripes spiky fins",
      "pink plain tall wings",
      "orange spots round legs",
      "green plain round fins",
      "orange stripes round wings",
      "pink stripes tall legs",
      "pink plain spiky wings",
      "blue stripes round fins",
      "orange spots spiky legs",
      "orange stripes spiky wings",
    ]),
    obvious: ["p3-1", "p3-2", "p3-4", "p3-6"],
  },
  {
    id: "great-stampede",
    number: 4,
    title: "The great stampede",
    brief:
      "The whole valley is on the move: river, woods and sky creatures in every colour. You only have five examples, so each one has to teach the gate something useful.",
    hint: "Choose examples that are different from each other. If two examples look alike and live in the same home, one of them may not be teaching the gate anything new.",
    lesson:
      "Good examples are varied. They show the AI what really decides the answer, rather than whatever most of the examples happen to have in common. Choosing training examples carefully is a real job in AI teams.",
    homes: ["river", "woods", "sky"],
    slots: 5,
    pen: parse("p4-", [
      "blue stripes round fins",
      "blue stripes tall fins",
      "orange spots round legs",
      "orange spots tall legs",
      "pink plain spiky wings",
      "pink plain round wings",
      "green plain spiky fins",
      "green spots tall legs",
      "blue spots round wings",
      "orange stripes spiky fins",
    ]),
    herd: parse("h4-", [
      "blue stripes spiky fins",
      "orange spots spiky legs",
      "pink plain tall wings",
      "green plain round fins",
      "green spots round legs",
      "blue spots tall wings",
      "orange stripes round fins",
      "pink spots round wings",
      "green plain tall fins",
      "orange spots round legs",
      "blue stripes round fins",
      "green spots spiky legs",
    ]),
    obvious: ["p4-1", "p4-2", "p4-3", "p4-4", "p4-5"],
  },
];

export type Decision = {
  creature: Creature;
  /** "unsure" when the nearest examples disagree, or when there are no examples. */
  sentTo: Home | "unsure";
  correct: boolean;
  nearest: Creature[];
  shared: Feature[];
};

export function difference(a: Creature, b: Creature) {
  return FEATURES.filter((feature) => a[feature] !== b[feature]).length;
}

/** One-nearest-example classifier with ties reported as uncertainty rather than guessed. */
export function decide(creature: Creature, examples: Creature[]): Decision {
  if (!examples.length) {
    return { creature, sentTo: "unsure", correct: false, nearest: [], shared: [] };
  }
  const best = Math.min(...examples.map((example) => difference(creature, example)));
  const nearest = examples.filter((example) => difference(creature, example) === best);
  const homes = new Set(nearest.map(homeOf));
  const sentTo = homes.size === 1 ? homeOf(nearest[0]) : "unsure";
  const shared = FEATURES.filter((feature) => nearest.some((example) => example[feature] === creature[feature]));
  return { creature, sentTo, correct: sentTo === homeOf(creature), nearest, shared };
}

export function runHerd(level: CrossingLevel, exampleIds: string[]) {
  const examples = level.pen.filter((creature) => exampleIds.includes(creature.id));
  const decisions = level.herd.map((creature) => decide(creature, examples));
  const home = decisions.filter((decision) => decision.correct).length;
  return { decisions, home, total: level.herd.length, stars: starsFor(home, level.herd.length) };
}

export function starsFor(home: number, total: number) {
  const share = total ? home / total : 0;
  return share === 1 ? 3 : share >= 0.8 ? 2 : share >= 0.6 ? 1 : 0;
}

/** Plain-language reason a creature went where it did, for the review panel. */
export function explain(decision: Decision) {
  const { creature, sentTo, nearest, shared } = decision;
  const truth = homeOf(creature);
  if (!nearest.length) return "The gate had no examples to compare with, so it could not choose a home.";
  if (sentTo === "unsure") {
    const homes = [...new Set(nearest.map(homeOf))].map((home) => HOMES[home].place);
    const unseen = nearest.every((example) => example.limbs !== creature.limbs)
      ? ` None of your examples has ${creature.limbs}, so the gate has never seen the clue that matters most for this creature.`
      : " An example that is more like this creature would help.";
    return `This creature looked equally like examples from ${homes.join(" and ")}, so the gate could not decide.${unseen}`;
  }
  const clue = shared.length ? `They share ${describeFeatures(creature, shared)}.` : "";
  if (decision.correct) {
    return `The gate matched this creature with one of your ${HOMES[sentTo].name.toLowerCase()} examples. ${clue}`.trim();
  }
  return `The gate matched this creature with an example from ${HOMES[sentTo].place}. ${clue} But it has ${creature.limbs}, so it really lives in ${HOMES[truth].place}.`.replace(/\s+/g, " ");
}

export function describeFeatures(creature: Creature, features: Feature[]) {
  const words = features.map((feature) =>
    feature === "colour" ? `${creature.colour} colour` : creature[feature],
  );
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** Every combination of up to `slots` examples. Small pens keep this cheap enough for tests. */
export function* exampleSets(level: CrossingLevel): Generator<string[]> {
  const ids = level.pen.map((creature) => creature.id);
  function* pick(start: number, chosen: string[]): Generator<string[]> {
    if (chosen.length) yield chosen;
    if (chosen.length === level.slots) return;
    for (let index = start; index < ids.length; index += 1) yield* pick(index + 1, [...chosen, ids[index]]);
  }
  yield* pick(0, []);
}

export type CrossingSave = { version: string; stars: Record<string, number> };

export function readCrossingSave(raw: unknown): CrossingSave {
  const empty: CrossingSave = { version: CROSSING_VERSION, stars: {} };
  if (!raw || typeof raw !== "object") return empty;
  const stars = (raw as { stars?: unknown }).stars;
  if (!stars || typeof stars !== "object") return empty;
  const clean: Record<string, number> = {};
  for (const level of CROSSING_LEVELS) {
    const value = (stars as Record<string, unknown>)[level.id];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3) clean[level.id] = value;
  }
  return { version: CROSSING_VERSION, stars: clean };
}

/** A level opens once the previous one has at least one star. */
export function unlocked(save: CrossingSave, index: number) {
  return index === 0 || (save.stars[CROSSING_LEVELS[index - 1].id] ?? 0) > 0;
}
