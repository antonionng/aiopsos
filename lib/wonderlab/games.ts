export type Direction = "up" | "right" | "down" | "left";
export type Point = readonly [number, number];
export type RescueLevel = {
  title: string;
  instruction: string;
  start: Point;
  goal: Point;
  bridge: number;
  key?: Point;
};
export const rescueLevels: RescueLevel[] = [
  {
    title: "Help Pip cross the river.",
    instruction:
      "Help Pip reach the treehouse. Tap the arrows to build a route, then press Go. The bridge is the only safe way across the river.",
    start: [0, 2],
    goal: [4, 2],
    bridge: 2,
  },
  {
    title: "Help Pip find the key before going home.",
    instruction:
      "The treehouse is locked! Send Pip to collect the key first, then cross the bridge to reach the door.",
    start: [0, 2],
    goal: [4, 1],
    bridge: 0,
    key: [1, 0],
  },
  {
    title: "Plan a new route to Pip’s home.",
    instruction:
      "The bridge has moved. Build a new route across it and bring Pip home. Check the whole route before pressing Go.",
    start: [0, 3],
    goal: [4, 0],
    bridge: 1,
  },
];
export function runRoute(level: RescueLevel, commands: Direction[]) {
  let position: Point = level.start,
    hasKey = !level.key;
  const steps: Point[] = [];
  const delta: Record<Direction, Point> = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  };
  for (const command of commands) {
    const next: Point = [
      position[0] + delta[command][0],
      position[1] + delta[command][1],
    ];
    if (next[0] < 0 || next[0] > 4 || next[1] < 0 || next[1] > 3)
      return {
        steps,
        won: false,
        failedStep: steps.length,
        message:
          "That step goes off the island. Change the arrows so Pip stays on the squares.",
      };
    if (next[0] === 2 && next[1] !== level.bridge)
      return {
        steps,
        won: false,
        failedStep: steps.length,
        message:
          "There’s water in the way! Guide Pip to the wooden bridge before crossing the river.",
      };
    position = next;
    steps.push(position);
    if (
      level.key &&
      position[0] === level.key[0] &&
      position[1] === level.key[1]
    )
      hasKey = true;
  }
  const atHome = position[0] === level.goal[0] && position[1] === level.goal[1];
  return {
    steps,
    won: atHome && hasKey,
    failedStep: null,
    message:
      atHome && hasKey
        ? "You did it! Pip followed your steps all the way home. Clear instructions made the difference."
        : atHome
          ? "Pip reached the door, but needs the key. Add a visit to the key before going home."
          : "Pip followed your arrows but hasn’t reached home yet. Add or change a step, then try your route again.",
  };
}
export type Feature =
  "boots" | "leaf" | "helmet" | "signal" | "widefeet" | "shade";
export const features: { id: Feature; label: string; symbol: string }[] = [
  { id: "boots", label: "Rain boots", symbol: "♧" },
  { id: "leaf", label: "Leaf disguise", symbol: "❧" },
  { id: "helmet", label: "Space helmet", symbol: "◉" },
  { id: "signal", label: "Star signal", symbol: "★" },
  { id: "widefeet", label: "Wide sand feet", symbol: "≋" },
  { id: "shade", label: "Sun shade", symbol: "☂" },
];
export const habitats: {
  title: string;
  name: string;
  instruction: string;
  needs: [Feature, Feature];
  jobs: [string, string];
  feedback: string;
}[] = [
  {
    title: "Design a creature for the rainforest.",
    name: "rainforest",
    instruction:
      "Our explorer needs a creature that can walk through puddles and hide among leaves. Fit two useful features, then send it out to explore.",
    needs: ["boots", "leaf"],
    jobs: ["Walk through puddles", "Hide among leaves"],
    feedback:
      "Rain boots handle the puddles. A leaf disguise helps it blend into the forest. Your description matched the job!",
  },
  {
    title: "Change your creature for a moon adventure.",
    name: "moon",
    instruction:
      "Your creature has a new job on our pretend moon. It needs a space helmet and a star-shaped signal so the explorer can find it. Replace its forest features with two that fit this job.",
    needs: ["helmet", "signal"],
    jobs: ["Wear a space helmet", "Show a star-shaped signal"],
    feedback:
      "You changed the requirements for a new setting. The helmet and star signal match the moon mission.",
  },
  {
    title: "Help your creature explore the desert.",
    name: "desert",
    instruction:
      "Now design for soft sand and strong sunshine. Choose two features that help your creature walk on sand and stay in the shade.",
    needs: ["widefeet", "shade"],
    jobs: ["Walk on soft sand", "Stay in the shade"],
    feedback:
      "Wide feet spread its weight on the sand, and a shade blocks the sunshine. You checked what this job needed instead of reusing the last answer.",
  },
];
export function checkCreature(round: number, selected: Feature[]) {
  const habitat = habitats[round];
  const missing = habitat.needs.filter((id) => !selected.includes(id));
  return {
    won: selected.length === 2 && missing.length === 0,
    message: missing.length
      ? `This creature still needs ${missing.map((id) => features.find((f) => f.id === id)!.label.toLowerCase()).join(" and ")}. Change its features and test again.`
      : habitat.feedback,
  };
}
export const arcadeGames = [
  {
    slug: "robot-rescue",
    band: "explorers",
    ages: "4–6",
    name: "Robot Rescue",
    type: "route",
    badge: "Route explorer",
    pitch:
      "Help Pip get home by choosing arrows, watching the route and fixing any steps that go wrong.",
    learning:
      "You practised clear, ordered instructions and fixed a route when it didn’t work.",
  },
  {
    slug: "creature-creator",
    band: "inventors",
    ages: "7–10",
    name: "Creature Creator",
    type: "creature",
    badge: "Creature inventor",
    pitch:
      "Build a creature, test its equipment and adapt it to three different worlds.",
    learning:
      "You described what a task needed, tested the result and improved your design.",
  },
  {
    slug: "prompt-repair-shop",
    band: "creators",
    ages: "11–13",
    name: "Prompt Repair Shop",
    type: "prompt",
    badge: "Prompt mechanic",
    pitch:
      "Practise giving AI clear instructions by choosing what a sign should say and checking the machine’s example draft.",
    learning:
      "You gave a clear audience, useful facts and a limit, then checked what came back.",
  },
  {
    slug: "brief-builder",
    band: "studio",
    ages: "14–16",
    name: "Launch Studio",
    type: "evidence",
    badge: "Sharp-eyed editor",
    pitch:
      "Check an example AI poster against the organiser’s notes so you can correct mistakes and remove invented claims before sharing it.",
    learning:
      "You compared a draft with its brief and sources, corrected errors and removed unsupported claims.",
  },
] as const;
export type ArcadeGame = (typeof arcadeGames)[number];
export const getArcadeGame = (slug: string) =>
  arcadeGames.find((game) => game.slug === slug);

export const promptRounds = [
  {
    name: "Write a clear sign for museum visitors.",
    instruction:
      "The museum needs a short sign for visitors aged 8–10. It must use only the fact card and stay under 60 words. Fit one instruction into each slot, then test the machine.",
    fact: "The Moon reflects sunlight. It travels around Earth.",
    slots: [
      {
        label: "Audience",
        choices: [
          "Space scientists",
          "Visitors aged 8–10",
          "No audience given",
        ],
        correct: 1,
      },
      {
        label: "Source",
        choices: [
          "Invent exciting facts",
          "Use the fact card only",
          "No source given",
        ],
        correct: 1,
      },
      {
        label: "Length",
        choices: ["A long essay", "No length limit", "Under 60 words"],
        correct: 2,
      },
    ],
    output:
      "The Moon reflects light from the Sun. It travels around Earth. When you look up at the Moon, the light you see is reflected sunlight.",
  },
  {
    name: "Help new gardeners care for a plant.",
    instruction:
      "A garden needs a sign for new gardeners. Use the supplied plant facts, with no extra claims, in under 40 words. Repair the instructions for this new job.",
    fact: "This plant needs sunlight. Water it when the soil feels dry.",
    slots: [
      {
        label: "Audience",
        choices: ["New gardeners", "Expert botanists", "Space scientists"],
        correct: 0,
      },
      {
        label: "Source",
        choices: [
          "Invent a watering timetable",
          "Use any facts you like",
          "Use the plant fact card only",
        ],
        correct: 2,
      },
      {
        label: "Length",
        choices: ["Under 40 words", "A 500-word article", "No length limit"],
        correct: 0,
      },
    ],
    output:
      "Give this plant sunlight. Feel the soil before watering. If it feels dry, it is time to water the plant.",
  },
  {
    name: "Write a sign for first-time workshop visitors.",
    instruction:
      "The skate workshop needs a sign for first-time visitors aged 11–13. Choose instructions that use only the event card and keep the sign under 50 words. Check which details have changed from the previous job.",
    fact: "The workshop starts Saturday at 10 am in the sports hall. Bring a helmet.",
    slots: [
      {
        label: "Audience",
        choices: [
          "Professional athletes",
          "No audience given",
          "First-time visitors aged 11–13",
        ],
        correct: 2,
      },
      {
        label: "Source",
        choices: [
          "Use the event card only",
          "Add a celebrity guest",
          "Guess the ticket price",
        ],
        correct: 0,
      },
      {
        label: "Length",
        choices: ["A full-page essay", "Under 50 words", "No length limit"],
        correct: 1,
      },
    ],
    output:
      "Trying the skate workshop for the first time? Meet in the sports hall on Saturday at 10 am. Bring a helmet.",
  },
];
export function checkPrompt(round: number, selected: number[]) {
  const level = promptRounds[round];
  const wrong = level.slots.findIndex(
    (slot, i) => selected[i] !== slot.correct,
  );
  return {
    won: wrong < 0,
    failedSlot: wrong < 0 ? null : wrong,
    message:
      wrong < 0
        ? "The instructions match the job. Now check the draft against the fact card: a clear prompt still needs a careful reader."
        : `The ${level.slots[wrong].label.toLowerCase()} instruction does not match the job described above. Change that instruction and test the machine again.`,
    output:
      wrong < 0
        ? level.output
        : wrong === 0
          ? "This example draft uses specialist language intended for researchers. It would be difficult for the requested readers to understand. Change the audience instruction to help the machine write for them."
          : wrong === 1
            ? "“A celebrity is visiting and every visitor gets a free gift!” This example draft adds promises that are not in the fact card. Change the instruction about which facts the machine should use."
            : "This example draft continues across several pages. A visitor needs a short sign, so change the length instruction to match the word limit in the job.",
  };
}
export const evidenceRounds = [
  {
    name: "Check the design-club poster before sharing it.",
    instruction:
      "You are checking an example AI draft for a design-club poster. Each highlighted statement is a claim you can check. Read the organiser’s notes, then select each statement and decide whether to keep, correct or remove it.",
    source:
      "The design club meets on Saturday at 2 pm in the library. The organiser has not confirmed a price or refreshments.",
    heading: "DESIGN CLUB",
    claims: [
      {
        text: "The club meets on Sunday at 2 pm.",
        action: "correct",
        fixed: "The club meets on Saturday at 2 pm.",
        why: "The source says Saturday, not Sunday.",
      },
      {
        text: "Meet in the library.",
        action: "keep",
        fixed: "Meet in the library.",
        why: "The source confirms the venue.",
      },
      {
        text: "Everyone will get free pizza!",
        action: "remove",
        fixed: "",
        why: "The source makes no promise about food. A confident claim needs evidence.",
      },
    ],
  },
  {
    name: "Check the facts in a new exhibition poster.",
    instruction:
      "You now have an exhibition poster and a different set of organiser’s notes. Check each statement using these notes. Keep what matches, correct what conflicts and remove a promise that has no supporting information.",
    source:
      "The youth exhibition opens Friday at 4 pm in the studio. Visitors can view 12 projects. No visitor review or award has been supplied.",
    heading: "FUTURE / MADE",
    claims: [
      {
        text: "This exhibition has won an award.",
        action: "remove",
        fixed: "",
        why: "No award is recorded in the source.",
      },
      {
        text: "Visit the studio on Friday at 4 pm.",
        action: "keep",
        fixed: "Visit the studio on Friday at 4 pm.",
        why: "The day, time and place all match the source.",
      },
      {
        text: "You can explore 20 projects.",
        action: "correct",
        fixed: "You can explore 12 projects.",
        why: "The source confirms 12 projects.",
      },
    ],
  },
  {
    name: "Review a podcast poster before its release.",
    instruction:
      "You’re the final reviewer for a fictional podcast launch. Verify all three claims before approving the poster. A polished design doesn’t make a claim true.",
    source:
      "The first Makers Podcast episode is available on Tuesday. It runs for 15 minutes and features two student designers. No named expert is quoted in the notes.",
    heading: "MAKERS / ON AIR",
    claims: [
      {
        text: "The first episode lasts 50 minutes.",
        action: "correct",
        fixed: "The first episode lasts 15 minutes.",
        why: "The source gives a 15-minute running time.",
      },
      {
        text: "An expert says, ‘This is the best show this year.’",
        action: "remove",
        fixed: "",
        why: "The source contains no expert quotation. Don’t present invented praise as evidence.",
      },
      {
        text: "The episode is available on Tuesday.",
        action: "keep",
        fixed: "The episode is available on Tuesday.",
        why: "The source supports this release day.",
      },
    ],
  },
];
export type Verdict = "keep" | "correct" | "remove";
export function checkEvidence(round: number, actions: (Verdict | null)[]) {
  const level = evidenceRounds[round];
  const wrong = level.claims.findIndex(
    (claim, i) => actions[i] !== claim.action,
  );
  return {
    won: wrong < 0,
    failedClaim: wrong < 0 ? null : wrong,
    message:
      wrong < 0
        ? "Your edits match the organiser’s notes. You kept the confirmed facts, corrected a mistake and removed an invented claim. Checking each statement helped you decide what was safe to include."
        : `Check claim ${wrong + 1} again. ${level.claims[wrong].why}`,
  };
}
