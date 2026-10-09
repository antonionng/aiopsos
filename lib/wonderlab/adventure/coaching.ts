import { planRouteTest } from "./route-test.ts";
import type { Adventure, AdventureState, Level, RoundState } from "./types.ts";

// All guidance is reviewed game content. No learner writing is used in a prompt.
export const coachLines = {
  forge: {
    start:
      "You are designing the route. I will test it for you. Add paths and bridges, then send the courier and watch where it can go.",
    working:
      "Your changes become instructions for the builder. Test them to see whether the courier can reach every destination.",
    hint: "Look for a break between the paths. Water needs a bridge, and the route must connect all the way to the destination.",
    why: "Clear instructions are useful with AI, but you still need to test the result. This builder follows fixed rules; it is not a real AI model. A successful route checks your design, not an AI's reliability.",
    solved:
      "Your route passed the test. What did you change that made it work? Keep that idea in mind when you check an AI's next suggestion.",
  },
  signal: {
    start:
      "We need to check a draft before anyone relies on it. Open a building, read its note and collect the evidence you find there.",
    working:
      "You have the clues. Connect each statement to the note that checks it, then decide whether to keep, repair or remove it.",
    hint: "Find one exact detail in a statement, such as a time or a promise. Does its source support that detail, contradict it or say nothing about it?",
    why: "AI can produce a confident answer that is wrong. Checking a statement against an actual source helps you decide what you can safely use.",
    solved:
      "You checked the draft against its sources. Pick one of your edits and explain which evidence helped you decide.",
  },
  launch: {
    start:
      "You are running the project. Give each job a suitable helper and a place in the schedule, then run the plan to see what happens.",
    working:
      "Check the order of your jobs. A check must happen after the work it checks, and two jobs cannot use the same space at once.",
    hint: "Start with the job that prepares the work. Put its check after it finishes. Use a person for physical work and approval, and a calculator for fixed sums.",
    why: "AI can suggest a polished plan without noticing practical problems. You are learning to choose appropriate tools and test whether a plan actually works.",
    solved:
      "Your plan works within the requirements. Which decision made it more reliable, and what would you still ask a person to check?",
  },
  lab: {
    start:
      "The sorter may have learnt a misleading pattern. Try different examples, then test it on creatures it has not seen.",
    working:
      "Changing the examples can change the prediction. Test the sorter and compare its guesses with the field notes.",
    hint: "The notes link shape to behaviour. Try examples that separate shape from colour so the sorter cannot rely on colour alone.",
    why: "Some AI systems learn patterns from examples. A pattern can be misleading, so we test unfamiliar cases. This small simulation cannot prove that a real AI is reliable.",
    solved:
      "The sorter handled these test cases. That is useful evidence, but it does not mean it will always be right. What else would you test?",
  },
} as const;

export function coachPhase(
  level: Level,
  state: RoundState,
): "start" | "working" | "solved" {
  if (state.solved) return "solved";
  if (level.kind === "signal")
    return state.visited.length === level.sources.length ? "working" : "start";
  return state.moves || state.attempts ? "working" : "start";
}

export function coachContext(game: Adventure, state: AdventureState) {
  const level = game.levels[state.round];
  const round = state.rounds[state.round];
  if (!level || !round) throw new Error("This challenge has finished.");
  let observation = `The learner is at the ${coachPhase(level, round)} stage.`;
  if (level.kind === "forge") {
    const broken = level.goals
      .map((goal) => planRouteTest(level, round.instructions, goal))
      .find((test) => !test.reached);
    observation += broken
      ? broken.gap !== null && level.water.includes(broken.gap)
        ? " The current construction has an unbridged water gap."
        : " The current construction does not connect every destination."
      : " The construction connects all destinations; it still needs a test if not already tested.";
    if (round.instructions.length > level.budget)
      observation += " The construction exceeds its piece budget.";
  }
  return `${game.name}. ${game.learning}\n${level.mission}\n${observation}\nReviewed hint: ${coachLines[level.kind].hint}\nAI connection: ${coachLines[level.kind].why}`;
}
