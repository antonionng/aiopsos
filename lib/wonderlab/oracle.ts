/**
 * Autocomplete Oracle (ages 11 to 16): a tiny next-word predictor. It counts which word followed
 * each word in the text it has read, then always writes the most common next word. That is a
 * simplified version of how text generators work, and it shows why fluent text can be false.
 */

export const ORACLE_VERSION = "autocomplete-oracle-2026-10-17.1";
const END = "∎";

export type Prediction = { word: string; count: number; share: number };
export type Step = { after: string; options: Prediction[]; chosen: string };

function words(sentence: string) {
  return sentence.toLowerCase().replace(/[^a-z'_ ]/g, "").split(/\s+/).filter(Boolean);
}

/** Counts of next words after each word. Ties go to the word the model read first. */
export function train(sentences: string[]) {
  const counts = new Map<string, Map<string, { count: number; first: number }>>();
  let order = 0;
  for (const sentence of sentences) {
    const list = [...words(sentence), END];
    for (let index = 0; index < list.length - 1; index += 1) {
      const after = list[index];
      const next = list[index + 1];
      const row = counts.get(after) ?? new Map();
      const cell = row.get(next) ?? { count: 0, first: order++ };
      cell.count += 1;
      row.set(next, cell);
      counts.set(after, row);
    }
  }
  return counts;
}

export type Model = ReturnType<typeof train>;

export function predict(model: Model, after: string): Prediction[] {
  const row = model.get(after.toLowerCase());
  if (!row) return [];
  const total = [...row.values()].reduce((sum, cell) => sum + cell.count, 0);
  return [...row.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].first - b[1].first)
    .map(([word, cell]) => ({ word, count: cell.count, share: cell.count / total }));
}

/** Greedy generation: always take the most likely next word, up to a length limit. */
export function generate(model: Model, prompt: string, limit = 8) {
  const start = words(prompt);
  const steps: Step[] = [];
  let last = start[start.length - 1];
  const out = [...start];
  while (out.length < start.length + limit) {
    const options = predict(model, last);
    if (!options.length) break;
    const chosen = options[0].word;
    steps.push({ after: last, options, chosen });
    if (chosen === END) break;
    out.push(chosen);
    last = chosen;
  }
  return { text: out.join(" "), steps, stopped: steps.at(-1)?.chosen === END };
}

export const isEnd = (word: string) => word === END;

// Level 1: choose what the Oracle reads so it writes a target sentence.
export type FeedLevel = { id: string; title: string; prompt: string; target: string; slots: number; cards: string[]; intro: string; lesson: string };

export const FEED_LEVELS: FeedLevel[] = [
  {
    id: "feed-moon",
    title: "Make it say something silly",
    prompt: "my",
    target: "my cat ate the moon",
    slots: 3,
    cards: [
      "my cat ate the fish",
      "we looked at the moon",
      "the moon is bright tonight",
      "my dog ate the bone",
      "a cat sat on the moon",
      "the fish swam away",
    ],
    intro: "The Oracle has never read anything. Choose three sentences for it to read, then it will try to finish the word “my”. Make it write: “my cat ate the moon”.",
    lesson: "The Oracle wrote a sentence that none of its training sentences contained. It stitched it together from word pairs it had seen, and it only ever looked at the last word. Text generators work in a far bigger version of this way, which is why they can produce fluent sentences that nobody wrote and nobody checked.",
  },
];

// Level 2: spot the confident mistakes by checking the source library.
export const LIBRARY = [
  "paris is the capital of france",
  "lisbon is the capital of portugal",
  "the capital of france is paris",
  "madrid is the capital of spain",
  "spiders have eight legs",
  "ants have six legs",
  "dogs have four legs",
  "bees can see ultraviolet light",
];

export const HUNT_PROMPTS = ["berlin is", "rome is the", "madrid is", "insects have", "spiders have", "dogs have", "bees can", "owls have"];

/** What a statement really is, according to the source library. Unknown claims are not supported. */
export function supportedByLibrary(statement: string) {
  const text = statement.toLowerCase().trim();
  return LIBRARY.includes(text);
}

// Level 3: choose when the Oracle should say "I don't know".
export const QUIZ_TRAINING = [
  "the capital of france is paris",
  "the capital of france is paris",
  "the capital of france is paris",
  "the capital of spain is madrid",
  "the capital of spain is madrid",
  "the capital of italy is rome",
  "the capital of italy is rome",
  "the capital of italy is milan",
  "the capital of peru is lima",
  "the capital of peru is cusco",
  "the capital of peru is cusco",
];

export const QUIZ_QUESTIONS = [
  { country: "france", answer: "paris" },
  { country: "spain", answer: "madrid" },
  { country: "italy", answer: "rome" },
  { country: "peru", answer: "lima" },
];

/** The Oracle's answer for a quiz question: the most common word after "<country> is". */
export function quizAnswer(model: Model, country: string) {
  // Train on a two-word context so each country gets its own answer.
  const row = predict(model, `${country}_is`);
  return row[0] ? { word: row[0].word, share: row[0].share, options: row } : null;
}

/** A model that looks at "<country> is" together, so the capitals do not blur into one. */
export function trainQuiz(sentences: string[]) {
  return train(sentences.map((sentence) => sentence.replace(/ (\w+) is (\w+)$/, " $1_is $2")));
}

export const SCORE = { right: 1, wrong: -2, pass: 0 };

export function quizScore(threshold: number) {
  const model = trainQuiz(QUIZ_TRAINING);
  const rows = QUIZ_QUESTIONS.map((question) => {
    const result = quizAnswer(model, question.country);
    const confident = result !== null && result.share >= threshold;
    const outcome: "right" | "wrong" | "pass" = !confident ? "pass" : result!.word === question.answer ? "right" : "wrong";
    return { ...question, result, outcome };
  });
  return { rows, total: rows.reduce((sum, row) => sum + SCORE[row.outcome], 0) };
}
