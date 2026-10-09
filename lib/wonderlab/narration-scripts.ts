import { adventures } from "./adventure/catalog.ts";
import { arcadeCoaching, finalDiscoveries } from "./arcade-coaching.ts";
import { rescueCoaching } from "./rescue-coach.ts";
import { missions } from "./catalog.ts";
import { demonstrations } from "./game-demonstrations.ts";
import {
  gameGuides,
  guideNarration,
  missionPurpose,
} from "./learning-guide.ts";
import {
  arcadeGames,
  rescueLevels,
  habitats,
  promptRounds,
  evidenceRounds,
  runRoute,
  checkCreature,
  checkPrompt,
  checkEvidence,
} from "./games.ts";
import type { Feature, Verdict } from "./games.ts";
import type { Band } from "./types.ts";
import { narrationId } from "./narration.ts";

// Build-time only. Never accepts names, saved work, generated output or user input.
export function narrationScripts() {
  const scripts = new Map<string, { id: string; band: Band; text: string }>();
  function add(band: Band, text: string) {
    const id = narrationId(band, text);
    const existing = scripts.get(id);
    if (existing && existing.text !== text)
      throw new Error("Narration ID collision");
    scripts.set(id, { id, band, text });
  }
  for (const text of Object.values(rescueCoaching)) add("explorers", text);
  for (const game of arcadeGames) {
    if (game.type !== "route") {
      const coach = arcadeCoaching[game.type];
      const discovery = finalDiscoveries[game.type];
      for (const text of [
        coach.plan,
        coach.ready,
        coach.repair,
        discovery.instruction,
        discovery.source,
        ...discovery.choices.map((choice) => choice.feedback),
      ])
        add(game.band, text);
    }
    const levels =
      game.type === "route"
        ? rescueLevels
        : game.type === "creature"
          ? habitats
          : game.type === "prompt"
            ? promptRounds
            : evidenceRounds;
    for (const level of levels) add(game.band, level.instruction);
    add(game.band, game.learning);
    for (const line of demonstrations[game.type]) add(game.band, line);
    add(game.band, guideNarration(game.type));
    add(game.band, gameGuides[game.type].discovery);
    add(
      game.band,
      `You earned the ${game.badge} sticker. ${gameGuides[game.type].discovery}`,
    );
  }
  for (const commands of [
    [],
    ["left"],
    ["up", "right", "right"],
    ["right", "right", "right", "right"],
  ] as const) {
    add("explorers", runRoute(rescueLevels[0], [...commands]).message);
  }
  add(
    "explorers",
    runRoute({ ...rescueLevels[0], key: [1, 0] }, [
      "right",
      "right",
      "right",
      "right",
    ]).message,
  );
  for (let round = 0; round < 3; round++) {
    const [a, b] = habitats[round].needs;
    for (const selected of [[], [a], [b], [a, b]] as Feature[][])
      add("inventors", checkCreature(round, selected).message);
    const correct = promptRounds[round].slots.map((slot) => slot.correct);
    add("creators", checkPrompt(round, correct).message);
    for (let i = 0; i < 3; i++) {
      const incorrect = [...correct];
      incorrect[i] = -1;
      add("creators", checkPrompt(round, incorrect).message);
    }
    const verdicts = evidenceRounds[round].claims.map(
      (claim) => claim.action as Verdict,
    );
    add("studio", checkEvidence(round, verdicts).message);
    for (let i = 0; i < 3; i++) {
      const incorrect: (Verdict | null)[] = [...verdicts];
      incorrect[i] = null;
      add("studio", checkEvidence(round, incorrect).message);
    }
  }
  for (const mission of missions) {
    add(mission.band, missionPurpose(mission));
    for (const activity of mission.activities) {
      add(
        mission.band,
        `${activity.title.replace(/[.!?]+$/, "")}. ${activity.intro} ${activity.instruction}`,
      );
      add(mission.band, activity.feedback);
      add(mission.band, `Try another idea. ${activity.hint}`);
    }
    add(mission.band, mission.project.prompt);
  }
  for (const game of adventures) for (const level of game.levels) add(game.band, level.mission);
  return [...scripts.values()];
}
