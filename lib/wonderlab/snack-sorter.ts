/**
 * Pip's Snack Sorter (ages 4 to 6): the child teaches Pip with a few labelled examples, then a
 * conveyor belt brings new things. Pip copies the basket of the example that looks most alike,
 * judging only colour and shape, so every mistake comes from the examples the child chose.
 */
import { narrationId } from "./narration.ts";

export const SORTER_VERSION = "snack-sorter-2026-10-17.1";

export type Colour = "red" | "yellow" | "orange" | "green" | "brown" | "grey";
export type Shape = "round" | "long" | "flat" | "tall";
export type Basket = "yummy" | "yucky";
export type Look = "colour" | "shape";

export type Item = { id: string; emoji: string; name: string; colour: Colour; shape: Shape; food: boolean };

/** The things that can appear. Colours are chosen so the picture reads the same on every device. */
export const ITEMS: Record<string, Item> = Object.fromEntries(
  (
    [
      ["apple", "🍎", "apple", "red", "round", true],
      ["strawberry", "🍓", "strawberry", "red", "round", true],
      ["cherries", "🍒", "cherries", "red", "round", true],
      ["tomato", "🍅", "tomato", "red", "round", true],
      ["banana", "🍌", "banana", "yellow", "long", true],
      ["lemon", "🍋", "lemon", "yellow", "round", true],
      ["corn", "🌽", "corn", "yellow", "long", true],
      ["carrot", "🥕", "carrot", "orange", "long", true],
      ["orange", "🍊", "orange", "orange", "round", true],
      ["pear", "🍐", "pear", "green", "round", true],
      ["broccoli", "🥦", "broccoli", "green", "tall", true],
      ["cucumber", "🥒", "cucumber", "green", "long", true],
      ["cookie", "🍪", "cookie", "brown", "flat", true],
      ["bread", "🍞", "bread", "brown", "flat", true],
      ["car", "🚗", "toy car", "red", "long", false],
      ["key", "🔑", "key", "yellow", "long", false],
      ["ball", "🏀", "ball", "orange", "round", false],
      ["dinosaur", "🦖", "toy dinosaur", "green", "tall", false],
      ["boot", "🥾", "boot", "brown", "tall", false],
      ["rock", "🪨", "rock", "grey", "round", false],
      ["teddy", "🧸", "teddy", "brown", "round", false],
    ] as const
  ).map(([id, emoji, name, colour, shape, food]) => [id, { id, emoji, name, colour, shape, food }]),
);

export type SorterLevel = {
  id: string;
  number: number;
  title: string;
  /** Which basket an item really belongs in for this level. */
  rule: (item: Item) => Basket;
  slots: number;
  pen: string[];
  belt: string[];
  obvious: string[];
  pip: string;
  lesson: string;
  question: { ask: string; options: Array<{ text: string; emoji: string; correct: boolean }> };
};

const isFood = (item: Item): Basket => (item.food ? "yummy" : "yucky");

export const PIP_LINES = {
  welcome: "Hi! I'm Pip. I want to learn which things are yummy to eat. Can you teach me?",
  tapApple: "Tap the apple. Apples are yummy!",
  tapRock: "Now tap the rock. Rocks are yucky. Don't eat rocks!",
  tapBanana: "Tap the banana. Bananas are yummy too!",
  tapBoot: "Now tap the boot. Boots are yucky!",
  start: "Great teaching! Press the big button to start my lunch belt.",
  full: "My tummy brain is full! Tap one to take it out.",
  predict: "Here comes something! Which basket will I choose?",
  next: "What about this one?",
  right: "Yes! You guessed what I would do!",
  wrong: "Oh! Watch what I do.",
  allRight: "Every thing went in the right basket. You are a great teacher!",
  some: "I made some mistakes. Tap one to see why.",
  many: "Oops! I got lots wrong. I need better examples.",
  answerRight: "Yes, that's right!",
  answerWrong: "Hmm, try again.",
  finale: "You taught me so much! You are a robot teacher!",
} as const;

/** The guided first moves of level one: what Pip asks for, one tap at a time. */
export const SORTER_TUTORIAL = [
  { target: "apple", say: PIP_LINES.tapApple },
  { target: "rock", say: PIP_LINES.tapRock },
  { target: "banana", say: PIP_LINES.tapBanana },
  { target: "boot", say: PIP_LINES.tapBoot },
] as const;

export const SORTER_LEVELS: SorterLevel[] = [
  {
    id: "first-lunch",
    number: 1,
    title: "Pip's first lunch",
    rule: isFood,
    slots: 4,
    pen: ["apple", "banana", "rock", "boot", "carrot", "teddy"],
    belt: ["strawberry", "corn", "rock", "lemon", "teddy", "boot"],
    obvious: ["apple", "rock", "banana", "boot"],
    pip: PIP_LINES.welcome,
    lesson: "Pip learned from your examples. When something new came along, Pip looked for the example that looked the most like it.",
    question: {
      ask: "How did Pip know what was yummy?",
      options: [
        { text: "I showed Pip examples", emoji: "👩‍🏫", correct: true },
        { text: "Pip tasted everything", emoji: "👅", correct: false },
        { text: "Pip guessed", emoji: "🎲", correct: false },
      ],
    },
  },
  {
    id: "red-trap",
    number: 2,
    title: "The red trap",
    rule: isFood,
    slots: 4,
    pen: ["apple", "strawberry", "cherries", "banana", "car", "rock", "boot"],
    belt: ["tomato", "car", "lemon", "rock", "cherries", "corn"],
    obvious: ["apple", "strawberry", "banana", "rock"],
    pip: "I mostly look at colour. If all your yummy examples are red, I might think every red thing is yummy!",
    lesson: "Pip mostly looks at colour. When every red example was yummy, Pip thought the red toy car was yummy too! A red yucky example helped Pip learn.",
    question: {
      ask: "Why did Pip try to eat the red toy car?",
      options: [
        { text: "It was red like my yummy examples", emoji: "🍎", correct: true },
        { text: "Pip loves cars", emoji: "🚗", correct: false },
        { text: "Pip was sleepy", emoji: "😴", correct: false },
      ],
    },
  },
  {
    id: "bo-hates-green",
    number: 3,
    title: "Bo hates green",
    rule: (item) => (item.food && item.colour !== "green" ? "yummy" : "yucky"),
    slots: 5,
    pen: ["apple", "banana", "pear", "broccoli", "dinosaur", "rock", "cookie"],
    belt: ["cucumber", "strawberry", "pear", "bread", "dinosaur", "corn"],
    obvious: ["apple", "banana", "rock", "cookie"],
    pip: "This is my friend Bo. Bo thinks green food is yucky! Can you teach me Bo's new rule?",
    lesson: "Pip does not know a new rule until you show it. When Bo's rule changed, Pip needed green examples in the yucky basket.",
    question: {
      ask: "How did Pip learn Bo's new rule?",
      options: [
        { text: "I showed Pip green yucky examples", emoji: "🥦", correct: true },
        { text: "Pip asked Bo", emoji: "💬", correct: false },
        { text: "Pip already knew", emoji: "🤖", correct: false },
      ],
    },
  },
];

export type Decision = {
  item: Item;
  sentTo: Basket | "unsure";
  truth: Basket;
  correct: boolean;
  nearest: Item[];
  shared: Look[];
};

const LOOKS: Look[] = ["colour", "shape"];

/** Pip looks at colour first; shape only decides between examples of the same colour. */
export function difference(a: Item, b: Item) {
  return (a.colour !== b.colour ? 1 : 0) + (a.shape !== b.shape ? 0.6 : 0);
}

/** Nearest-example sorting on colour and shape; a tie between baskets leaves Pip unsure. */
export function decide(level: SorterLevel, item: Item, examples: Item[]): Decision {
  const truth = level.rule(item);
  if (!examples.length) return { item, sentTo: "unsure", truth, correct: false, nearest: [], shared: [] };
  const best = Math.min(...examples.map((example) => difference(item, example)));
  const nearest = examples.filter((example) => difference(item, example) === best);
  const baskets = new Set(nearest.map((example) => level.rule(example)));
  const sentTo = baskets.size === 1 ? level.rule(nearest[0]) : "unsure";
  const shared = LOOKS.filter((look) => nearest.some((example) => example[look] === item[look]));
  return { item, sentTo, truth, correct: sentTo === truth, nearest, shared };
}

export function runBelt(level: SorterLevel, exampleIds: string[]) {
  const examples = exampleIds.map((id) => ITEMS[id]);
  const decisions = level.belt.map((id, index) => ({ ...decide(level, ITEMS[id], examples), key: `${id}-${index}` }));
  const right = decisions.filter((decision) => decision.correct).length;
  return { decisions, right, total: decisions.length, stars: right === decisions.length ? 3 : right >= decisions.length - 1 ? 2 : right >= decisions.length / 2 ? 1 : 0 };
}

export function missingBaskets(level: SorterLevel, exampleIds: string[]) {
  const taught = new Set(exampleIds.map((id) => level.rule(ITEMS[id])));
  return (["yummy", "yucky"] as const).filter((basket) => !taught.has(basket));
}

/** Short spoken reason for a mistake, built from the example Pip matched. */
export function explain(decision: Decision) {
  const { item, sentTo, nearest, shared } = decision;
  if (!nearest.length) return `I had no examples, so I could not choose a basket for the ${item.name}.`;
  if (sentTo === "unsure") return `I could not decide about the ${item.name}. It looked a bit like a yummy thing and a bit like a yucky thing.`;
  const match = nearest[0];
  const why = shared.length === 2 ? `it is ${item.colour} and ${item.shape}` : shared[0] === "colour" ? `it is ${item.colour}` : shared[0] === "shape" ? `it is ${item.shape}` : "";
  const like = why ? `, because ${why} like the ${match.name}` : "";
  return `I thought the ${item.name} was ${sentTo}${like}.`;
}

export function* exampleSets(level: SorterLevel): Generator<string[]> {
  function* pick(start: number, chosen: string[]): Generator<string[]> {
    if (chosen.length) yield chosen;
    if (chosen.length === level.slots) return;
    for (let index = start; index < level.pen.length; index += 1) yield* pick(index + 1, [...chosen, level.pen[index]]);
  }
  yield* pick(0, []);
}

/** Every line Pip can say, including each possible explanation, for recording. */
export function sorterNarrationScripts() {
  const lines = new Set<string>([...Object.values(PIP_LINES), ...SORTER_LEVELS.flatMap((level) => [level.pip, level.question.ask])]);
  for (const level of SORTER_LEVELS) {
    for (const set of exampleSets(level)) {
      for (const decision of runBelt(level, set).decisions) if (!decision.correct) lines.add(explain(decision));
    }
  }
  return [...lines].map((text) => ({ id: narrationId("explorers", text), band: "explorers" as const, text }));
}

export type SorterSave = { version: string; stars: Record<string, number> };

export function readSorterSave(raw: unknown): SorterSave {
  const stars: Record<string, number> = {};
  const source = raw && typeof raw === "object" ? (raw as { stars?: Record<string, unknown> }).stars : undefined;
  for (const level of SORTER_LEVELS) {
    const value = source?.[level.id];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3) stars[level.id] = value;
  }
  return { version: SORTER_VERSION, stars };
}

export function sorterUnlocked(save: SorterSave, index: number) {
  return index === 0 || (save.stars[SORTER_LEVELS[index - 1].id] ?? 0) > 0;
}
