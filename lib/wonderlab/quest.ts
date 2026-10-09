export const QUEST_VERSION = "garden-quest-2026-10-09.1";

export type QuestBand = "explorers" | "inventors" | "creators" | "studio";
export type QuestStage = "explore" | "build" | "transfer" | "complete";
export type QuestPlace =
  "keeper" | "guide" | "seed" | "sun" | "water" | "console";
export type QuestGroup = "water" | "light" | "soil";
export type QuestState = {
  version: string;
  band: QuestBand;
  stage: QuestStage;
  visited: string[];
  evidence: string[];
  plan: string[];
  transferPlan: string[];
  attempts: number;
  successful: boolean;
  transferComplete: boolean;
  earned: string[];
  lastFeedback: string;
};
export type QuestAction =
  | { type: "explore"; id: string }
  | { type: "collect"; id: string }
  | { type: "set-plan"; choices: string[] }
  | { type: "test" }
  | { type: "transfer"; choice: string }
  | { type: "restart" };
export type QuestSave = {
  version: string;
  band: QuestBand;
  actions: QuestAction[];
};
export type QuestOption = {
  id: string;
  group: QuestGroup;
  label: string;
  description: string;
};
export type QuestConfig = {
  title: string;
  intro: string;
  goal: string;
  instructions: string;
  initialPlan: string[];
  options: QuestOption[];
  correctPlan: string[];
  requiredSources: string[];
  sources: { id: QuestPlace; title: string; text: string }[];
  dialogue: Record<QuestPlace, string>;
  transfer: {
    question: string;
    options: { id: string; label: string }[];
    correct: string;
    correctPlan: string[];
    feedback: string;
  };
  reward: { title: string; description: string };
  parentOutcome: string;
};

const options: QuestOption[] = [
  {
    id: "water-small",
    group: "water",
    label: "Use one cup of water.",
    description: "Give the moonflower a small drink.",
  },
  {
    id: "water-large",
    group: "water",
    label: "Use three cups of water.",
    description: "Give the moonflower a large drink.",
  },
  {
    id: "light-shade",
    group: "light",
    label: "Open the shade sail.",
    description: "Keep the bright afternoon sun off the moonflower.",
  },
  {
    id: "light-sun",
    group: "light",
    label: "Fold the shade sail away.",
    description: "Let the bright afternoon sun reach the moonflower.",
  },
  {
    id: "soil-drain",
    group: "soil",
    label: "Open the pot's drain.",
    description: "Let spare water leave the pot.",
  },
  {
    id: "soil-hold",
    group: "soil",
    label: "Close the pot's drain.",
    description: "Keep spare water inside the pot.",
  },
];

const commonDialogue: Record<QuestPlace, string> = {
  keeper:
    "I am Rowan, the garden keeper. Our moonflower has closed its petals. Please find out what it needs before you switch on the garden machine.",
  guide:
    "Here is a prepared example of an AI answer: ‘Every flower needs lots of water and bright sunshine.’ It sounds certain, but it may be wrong. Check the moonflower's own care cards before you use it.",
  seed: "The moonflower's seed packet explains how its roots grow. Read the packet and keep its care card so you can check the machine's instructions.",
  sun: "Look at the shade sail beside the moonflower. Its care card tells you whether this flower needs shade or bright sunshine.",
  water:
    "The water station has a measuring cup. Its care card tells you how much water the moonflower needs in this game.",
  console:
    "This machine follows the instructions you choose. Use your care cards to repair the prepared AI advice, then run the machine once and watch what changes.",
};

const sources: QuestConfig["sources"] = [
  {
    id: "seed",
    title: "The seed packet explains how to care for the roots.",
    text: "This fictional moonflower needs its pot's drain to stay open. Water left around its roots stops its petals opening.",
  },
  {
    id: "sun",
    title: "The light card tells you where the flower can grow.",
    text: "This fictional moonflower needs shade during the bright afternoon. Open the shade sail so its petals can open.",
  },
  {
    id: "water",
    title: "The water card tells you how much to give.",
    text: "This fictional moonflower needs one cup of water in this game. Three cups are too much.",
  },
];

const standardTransfer: QuestConfig["transfer"] = {
  question:
    "A new plant arrives. Its packet says: ‘Give this sunbell three cups of water, bright sunshine and an open drain.’ The prepared AI advice says to copy the moonflower's settings. Change the machine's controls to match this new plant, then run it again.",
  options: options.map(({ id, label }) => ({ id, label })),
  correct: "test",
  correctPlan: ["water-large", "light-sun", "soil-drain"],
  feedback:
    "You checked the new plant's packet and changed the instructions to match it. Advice that worked once still needs checking when the task changes.",
};

export const QUEST_CONFIG: Record<QuestBand, QuestConfig> = {
  explorers: {
    title: "Help the moonflower bloom.",
    intro:
      "You are helping Rowan in a make-believe garden. Pip has a robot's answer for you, but one flower needs different care. You can look at the clues and help it bloom. Play with a grown-up who can read with you.",
    goal: "Find out what the flower needs, then tell the machine how to help it.",
    instructions:
      "Tap Rowan to begin. Tap the water cup and the shade sail to find two clues. Then tap the garden machine to try your idea.",
    initialPlan: ["water-large", "light-sun"],
    options: options.filter((option) => option.group !== "soil"),
    correctPlan: ["water-small", "light-shade"],
    requiredSources: ["sun", "water"],
    sources: [
      {
        id: "seed",
        title: "This is our make-believe flower.",
        text: "This moonflower grows in our game. It has its own care clues. Your grown-up can help you read them.",
      },
      {
        id: "sun",
        title: "Our flower needs shade.",
        text: "The sunshine is too bright for our moonflower. Open its shade sail.",
      },
      {
        id: "water",
        title: "Our flower needs one cup.",
        text: "Give our moonflower one cup of water. Three cups are too much.",
      },
    ],
    dialogue: {
      ...commonDialogue,
      keeper:
        "Hello! I am Rowan. Can you help my flower open? Find the water cup and the shade sail. They have clues to help you.",
      guide:
        "Here is a pretend AI answer: ‘Give every flower lots of water and sunshine.’ AI is a computer tool that can make guesses and mistakes. Let's look at our flower's clues before we try that.",
      seed: "This is the moonflower's packet. Our flower needs special care. Look for its water and shade clues with your grown-up.",
      sun: "Our flower is too hot in the bright sun. Open the shade sail to help it. Keep this clue so you can use it at the machine.",
      water:
        "Our flower needs one cup of water. Keep this clue so you can tell the machine how much to give.",
      console:
        "Choose how much water to give and whether to open the shade sail. Then press the button to watch the machine do it for you.",
    },
    transfer: {
      question:
        "Here comes a new make-believe flower! Its picture card shows three cups of water and bright sunshine. Change the water and shade controls, then run the machine to help it.",
      options: options
        .filter((option) => option.group !== "soil")
        .map(({ id, label }) => ({ id, label })),
      correct: "test",
      correctPlan: ["water-large", "light-sun"],
      feedback:
        "You looked at the new clue and changed your instructions. We check a robot's answer to see whether it fits the thing we are helping.",
    },
    reward: {
      title: "Your moonflower is ready for the garden.",
      description:
        "You helped the flower by looking at its clues. You can keep this moonflower in your quest garden.",
    },
    parentOutcome:
      "Your child practises checking a computer's answer against visible clues and giving two clear instructions. A new flower lets them practise changing their instructions when the evidence changes.",
  },
  inventors: {
    title: "Restore the moonflower garden.",
    intro:
      "Rowan's garden machine has followed a prepared AI answer, but the moonflower will not bloom. Explore the garden, collect its three care cards and repair the instructions. You will see the result in the garden when you test your plan.",
    goal: "Use three care cards to repair the AI advice and make the garden machine help the flower.",
    instructions:
      "Meet Rowan, then explore the seed packet, water station and shade sail. Keep their care cards and use them at the garden machine.",
    initialPlan: ["water-large", "light-sun", "soil-hold"],
    options,
    correctPlan: ["water-small", "light-shade", "soil-drain"],
    requiredSources: ["seed", "sun", "water"],
    sources,
    dialogue: commonDialogue,
    transfer: standardTransfer,
    reward: {
      title: "You have restored a corner of the garden.",
      description:
        "Your moonflower records the plan you tested. You checked the care cards and adapted your instructions for a different flower.",
    },
    parentOutcome:
      "Your child practises comparing a confident AI answer with supplied evidence, repairing three instructions and checking the result. The final plant asks them to apply the same checking habit to a new problem.",
  },
  creators: {
    title: "Investigate the silent greenhouse.",
    intro:
      "You are investigating a greenhouse where an automated machine follows unreliable advice. Its prepared AI answer sounds convincing, but the plant records tell a different story. Explore the greenhouse, collect the records and build a plan you can test.",
    goal: "Identify where the AI advice conflicts with the plant records, then test corrected instructions.",
    instructions:
      "Speak to Rowan and inspect Pip's prepared AI answer. Explore the three evidence stations. Use what you find to set the machine's water, light and drainage instructions.",
    initialPlan: ["water-large", "light-sun", "soil-hold"],
    options,
    correctPlan: ["water-small", "light-shade", "soil-drain"],
    requiredSources: ["seed", "sun", "water"],
    sources,
    dialogue: {
      ...commonDialogue,
      keeper:
        "I am Rowan, the greenhouse keeper. The machine works, but its care plan does not match this plant. Inspect the records and find out which instructions need changing.",
      guide:
        "This is a prepared example of an AI answer: ‘Moonflowers open fastest in full afternoon sun. Give three cups of water and close the drain to preserve moisture.’ The answer claims certainty without supporting evidence. Compare each instruction with the plant records.",
      console:
        "Set one instruction for water, one for light and one for drainage. Run the machine to check the result. The machine follows fixed rules; it does not understand or check the AI advice for you.",
    },
    transfer: standardTransfer,
    reward: {
      title: "The greenhouse has a tested care plan.",
      description:
        "You have earned a moonflower for your garden by checking the evidence, testing a repair and adapting your plan to another plant.",
    },
    parentOutcome:
      "Your child practises recognising confident but unsupported AI advice, comparing individual claims with supplied sources and testing revised instructions. A fresh plant checks whether they use the evidence again instead of copying the earlier answer.",
  },
  studio: {
    title: "Bring the research garden back online.",
    intro:
      "You are responsible for a research garden with a limited water supply. A prepared AI recommendation prioritises fast growth but ignores the plant's care limits. Investigate the evidence and commission a working plan before the garden reopens.",
    goal: "Test an AI recommendation against plant requirements and a resource limit before putting it into use.",
    instructions:
      "Inspect Rowan's brief, Pip's recommendation and all three evidence stations. Decide how much water to use, how to control the light and whether the pot should drain. Test the complete plan and adapt it when a new plant arrives.",
    initialPlan: ["water-large", "light-sun", "soil-hold"],
    options,
    correctPlan: ["water-small", "light-shade", "soil-drain"],
    requiredSources: ["seed", "sun", "water"],
    sources: [
      sources[0],
      {
        id: "sun",
        title: "The light trial sets a limit on the recommendation.",
        text: "In this fictional trial, the moonflower opened under the shade sail. Under bright afternoon sun its petals stayed closed. Extra light did not improve the result.",
      },
      {
        id: "water",
        title: "The water trial records the useful amount.",
        text: "In this fictional trial, one cup supported the moonflower. Three cups stopped its petals opening and used water reserved for other plants. Use only the amount this plant needs.",
      },
    ],
    dialogue: {
      ...commonDialogue,
      keeper:
        "I am Rowan. We need a care plan that helps the moonflower and avoids wasting water reserved for the rest of the garden. The AI recommendation has not been checked against our trials.",
      guide:
        "This is a prepared AI recommendation: ‘Maximise light and water to accelerate growth. Close the drain to retain all available moisture.’ It sounds efficient, but it ignores the plant trial results. Check the recommendation against the actual requirements before implementing it.",
      console:
        "Choose a water, light and drainage instruction supported by the records. Test the complete plan. This demonstration machine follows fixed rules, so a successful test shows that these instructions fit this simulation, not that AI is always reliable.",
    },
    transfer: {
      ...standardTransfer,
      question:
        "A sunbell arrives with a different trial record: it requires three cups, bright sunshine and an open drain. Rowan confirms that three cups are now available for it. The prepared AI recommendation reuses your moonflower plan. Reconfigure the machine to fit the new evidence and resource limit, then test it.",
    },
    reward: {
      title: "Your research garden can reopen.",
      description:
        "Your moonflower marks a completed investigation. You checked the recommendation, tested a constrained plan and changed it when the requirements changed.",
    },
    parentOutcome:
      "Your teenager practises evaluating an AI recommendation against evidence and resource constraints, then testing the resulting instructions. The second plant asks them to reconsider a previously successful plan when its assumptions change.",
  },
};

const places: QuestPlace[] = [
  "keeper",
  "guide",
  "seed",
  "sun",
  "water",
  "console",
];
const rewardId = "moonflower";

export function createQuestState(band: QuestBand): QuestState {
  return {
    version: QUEST_VERSION,
    band,
    stage: "explore",
    visited: [],
    evidence: [],
    plan: [...QUEST_CONFIG[band].initialPlan],
    transferPlan: [],
    attempts: 0,
    successful: false,
    transferComplete: false,
    earned: [],
    lastFeedback: QUEST_CONFIG[band].instructions,
  };
}

export function questPlanProblems(
  state: QuestState,
): { group: QuestGroup; message: string }[] {
  const config = QUEST_CONFIG[state.band];
  const messages: Record<QuestGroup, string> = {
    water:
      "The moonflower has too much water. Its water card asks for one cup. Change the water instruction and try again.",
    light:
      "The moonflower is still in bright sunshine. Its light card asks for shade. Open the shade sail and try again.",
    soil: "Water cannot leave the pot. The seed packet says its roots need an open drain. Change the drain instruction and try again.",
  };
  return config.correctPlan.flatMap((id) => {
    if (state.plan.includes(id)) return [];
    const option = config.options.find((candidate) => candidate.id === id)!;
    const hasChoice = state.plan.some(
      (choice) =>
        config.options.find((candidate) => candidate.id === choice)?.group ===
        option.group,
    );
    return [
      {
        group: option.group,
        message: hasChoice
          ? messages[option.group]
          : `Choose a ${option.group} instruction from the care cards before you run the machine.`,
      },
    ];
  });
}

/** This is a local, authored prototype. Its state does not grant paid access or report assessed achievement. */
export function reduceQuest(
  state: QuestState,
  action: QuestAction,
): QuestState {
  if (action.type === "restart") return createQuestState(state.band);
  const config = QUEST_CONFIG[state.band];
  if (action.type === "explore") {
    if (!places.includes(action.id as QuestPlace)) return state;
    return {
      ...state,
      visited: state.visited.includes(action.id)
        ? state.visited
        : [...state.visited, action.id],
      lastFeedback: config.dialogue[action.id as QuestPlace],
    };
  }
  if (action.type === "collect") {
    const source = config.sources.find(
      (candidate) => candidate.id === action.id,
    );
    if (
      !source ||
      !state.visited.includes(action.id) ||
      state.evidence.includes(action.id)
    )
      return state;
    const evidence = [...state.evidence, action.id];
    const ready = config.requiredSources.every((id) => evidence.includes(id));
    return {
      ...state,
      evidence,
      stage: ready && state.stage === "explore" ? "build" : state.stage,
      lastFeedback: ready
        ? "You have the care cards you need. Go to the garden machine and use the clues to change its instructions."
        : "You have kept this care card. Explore the other clue stations so you can check the whole plan.",
    };
  }
  if (action.type === "set-plan") {
    if (state.successful || !state.visited.includes("console")) return state;
    if (
      !Array.isArray(action.choices) ||
      !action.choices.every((id) =>
        config.options.some((option) => option.id === id),
      )
    )
      return state;
    const groups = action.choices.map(
      (id) => config.options.find((option) => option.id === id)!.group,
    );
    if (new Set(groups).size !== groups.length) return state;
    return {
      ...state,
      plan: [...action.choices],
      lastFeedback:
        "Your instructions are ready to test. Run the machine once and watch it carry out the whole plan.",
    };
  }
  if (action.type === "test") {
    if (state.successful || !state.visited.includes("console")) return state;
    if (!state.visited.includes("keeper") || !state.visited.includes("guide")) {
      return {
        ...state,
        lastFeedback:
          "Meet Rowan to hear the task, then ask Pip to show you the prepared AI answer. You are checking that answer against the flower's care cards.",
      };
    }
    const missing = config.requiredSources.filter(
      (id) => !state.evidence.includes(id),
    );
    if (missing.length) {
      return {
        ...state,
        lastFeedback:
          "Find and keep the missing care cards before testing. They tell you how to check the prepared AI answer.",
      };
    }
    const problems = questPlanProblems(state);
    if (problems.length) {
      return {
        ...state,
        stage: "build",
        attempts: state.attempts + 1,
        lastFeedback: problems.map((problem) => problem.message).join(" "),
      };
    }
    return {
      ...state,
      attempts: state.attempts + 1,
      successful: true,
      transferPlan: [...state.plan],
      stage: "transfer",
      lastFeedback:
        "Your instructions match the care cards, and the moonflower has opened. A new flower is arriving. Check its own card before you reuse your plan.",
    };
  }
  if (action.type === "transfer") {
    if (!state.successful || state.transferComplete) return state;
    if (action.choice !== "test") {
      const option = config.options.find(
        (candidate) => candidate.id === action.choice,
      );
      if (!option) return state;
      const otherSettings = state.transferPlan.filter(
        (id) =>
          config.options.find((candidate) => candidate.id === id)?.group !==
          option.group,
      );
      return {
        ...state,
        transferPlan: [...otherSettings, option.id],
        lastFeedback:
          "You changed the machine's instructions for the new flower. Run the machine to check whether they match its care card.",
      };
    }
    const missing = config.transfer.correctPlan.filter(
      (id) => !state.transferPlan.includes(id),
    );
    if (missing.length)
      return {
        ...state,
        attempts: state.attempts + 1,
        lastFeedback: missing
          .map((id) => {
            if (id === "water-large")
              return "The sunbell needs three cups of water. Change the water control, then run the machine again.";
            if (id === "light-sun")
              return "The sunbell needs bright sunshine. Fold the shade sail away, then run the machine again.";
            return "The sunbell needs its drain open. Open the drain, then run the machine again.";
          })
          .join(" "),
      };
    return {
      ...state,
      attempts: state.attempts + 1,
      stage: "complete",
      transferComplete: true,
      earned: state.earned.includes(rewardId)
        ? state.earned
        : [...state.earned, rewardId],
      lastFeedback: config.transfer.feedback,
    };
  }
  return state;
}

function isQuestAction(value: unknown): value is QuestAction {
  if (!value || typeof value !== "object") return false;
  const action = value as Record<string, unknown>;
  if (action.type === "test" || action.type === "restart") return true;
  if (action.type === "explore" || action.type === "collect")
    return typeof action.id === "string" && action.id.length <= 24;
  if (action.type === "transfer")
    return typeof action.choice === "string" && action.choice.length <= 24;
  if (action.type === "set-plan")
    return (
      Array.isArray(action.choices) &&
      action.choices.length <= 3 &&
      action.choices.every((id) => typeof id === "string" && id.length <= 24)
    );
  return false;
}

/** Restore by replaying bounded actions, never by trusting saved completion or reward fields. */
export function restoreQuest(band: QuestBand, value: unknown): QuestState {
  const fresh = createQuestState(band);
  if (!value || typeof value !== "object") return fresh;
  const save = value as Partial<QuestSave>;
  if (
    save.version !== QUEST_VERSION ||
    save.band !== band ||
    !Array.isArray(save.actions) ||
    save.actions.length > 2000 ||
    !save.actions.every(isQuestAction)
  )
    return fresh;
  return save.actions.reduce(reduceQuest, fresh);
}

/** All authored speech reachable through the controls, including explanatory retry feedback. */
export function questNarration(band: QuestBand): string[] {
  const config = QUEST_CONFIG[band];
  const lines = new Set<string>([
    config.intro,
    config.goal,
    config.instructions,
    ...Object.values(config.dialogue),
    ...config.sources.map((source) => source.text),
    config.transfer.question,
    config.transfer.feedback,
    config.reward.description,
  ]);
  const remember = (state: QuestState, action: QuestAction) => {
    const next = reduceQuest(state, action);
    lines.add(next.lastFeedback);
    return next;
  };
  let prepared = createQuestState(band);
  prepared = remember(prepared, { type: "explore", id: "console" });
  remember(prepared, { type: "test" });
  prepared = remember(prepared, { type: "explore", id: "keeper" });
  prepared = remember(prepared, { type: "explore", id: "guide" });
  remember(prepared, { type: "test" });
  for (const source of config.sources) {
    prepared = remember(prepared, { type: "explore", id: source.id });
    prepared = remember(prepared, { type: "collect", id: source.id });
  }
  const groups = [...new Set(config.options.map((option) => option.group))];
  let plans: string[][] = [[]];
  for (const group of groups) {
    const choices = config.options
      .filter((option) => option.group === group)
      .map((option) => option.id);
    plans = plans.flatMap((plan) => [
      plan,
      ...choices.map((choice) => [...plan, choice]),
    ]);
  }
  for (const choices of plans) {
    const configured = remember(prepared, { type: "set-plan", choices });
    remember(configured, { type: "test" });
  }
  const configured = remember(prepared, {
    type: "set-plan",
    choices: config.correctPlan,
  });
  const transfer = remember(configured, { type: "test" });
  for (const choices of plans.filter((plan) => plan.length === groups.length)) {
    let changed = transfer;
    for (const choice of choices)
      changed = remember(changed, { type: "transfer", choice });
    remember(changed, { type: "transfer", choice: "test" });
  }
  return [...lines];
}
