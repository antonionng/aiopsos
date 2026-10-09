import { test } from "node:test";
import assert from "node:assert/strict";
import {
  QUEST_CONFIG,
  QUEST_VERSION,
  createQuestState,
  questPlanProblems,
  questNarration,
  reduceQuest,
  restoreQuest,
  type QuestAction,
  type QuestBand,
  type QuestState,
} from "./quest.ts";

const bands: QuestBand[] = ["explorers", "inventors", "creators", "studio"];

function prepared(band: QuestBand): QuestState {
  let state = createQuestState(band);
  state = reduceQuest(state, { type: "explore", id: "keeper" });
  state = reduceQuest(state, { type: "explore", id: "guide" });
  for (const id of QUEST_CONFIG[band].requiredSources) {
    state = reduceQuest(state, { type: "explore", id });
    state = reduceQuest(state, { type: "collect", id });
  }
  return reduceQuest(state, { type: "explore", id: "console" });
}

test("a learner must explore and collect the evidence before a successful machine test", () => {
  let state = createQuestState("explorers");
  const forgedCollection = reduceQuest(state, { type: "collect", id: "water" });
  assert.strictEqual(forgedCollection, state);
  state = reduceQuest(state, { type: "explore", id: "console" });
  state = reduceQuest(state, { type: "explore", id: "keeper" });
  state = reduceQuest(state, { type: "explore", id: "guide" });
  state = reduceQuest(state, {
    type: "set-plan",
    choices: QUEST_CONFIG.explorers.correctPlan,
  });
  const result = reduceQuest(state, { type: "test" });
  assert.equal(result.successful, false);
  assert.equal(result.attempts, 0);
  assert.match(result.lastFeedback, /care cards/);
});

test("machine failures explain world consequences and preserve the player's chosen instructions", () => {
  const state = prepared("creators");
  const failed = reduceQuest(state, { type: "test" });
  assert.equal(failed.successful, false);
  assert.equal(failed.attempts, 1);
  assert.deepEqual(failed.plan, state.plan);
  assert.deepEqual(
    questPlanProblems(failed).map((problem) => problem.group),
    ["water", "light", "soil"],
  );
  assert.match(failed.lastFeedback, /too much water/);
  assert.match(failed.lastFeedback, /bright sunshine/);
  assert.match(failed.lastFeedback, /cannot leave the pot/);

  let repaired = reduceQuest(failed, {
    type: "set-plan",
    choices: ["water-small", "light-shade", "soil-hold"],
  });
  repaired = reduceQuest(repaired, { type: "test" });
  assert.equal(repaired.successful, false);
  assert.deepEqual(
    questPlanProblems(repaired).map((problem) => problem.group),
    ["soil"],
  );
});

test("every age band requires a fresh world test and permits retrying it before earning a reward", () => {
  for (const band of bands) {
    const config = QUEST_CONFIG[band];
    let state = prepared(band);
    state = reduceQuest(state, {
      type: "set-plan",
      choices: config.correctPlan,
    });
    state = reduceQuest(state, { type: "test" });
    assert.equal(state.successful, true, band);
    assert.equal(state.stage, "transfer");
    assert.deepEqual(state.earned, []);
    assert.deepEqual(state.transferPlan, config.correctPlan);

    // Copying the earlier successful answer fails when the plant's needs change.
    state = reduceQuest(state, { type: "transfer", choice: "test" });
    assert.equal(state.transferComplete, false);
    assert.match(state.lastFeedback, /sunbell/);
    assert.deepEqual(state.earned, []);

    for (const choice of config.transfer.correctPlan)
      state = reduceQuest(state, { type: "transfer", choice });
    state = reduceQuest(state, { type: "transfer", choice: "test" });
    assert.equal(state.transferComplete, true, band);
    assert.equal(state.stage, "complete");
    assert.deepEqual(state.earned, ["moonflower"]);
    assert.strictEqual(
      reduceQuest(state, { type: "transfer", choice: "test" }),
      state,
    );
  }
});

test("tapping a selected setting again never erases it or adds a second reward", () => {
  let state = prepared("inventors");
  state = reduceQuest(state, {
    type: "set-plan",
    choices: QUEST_CONFIG.inventors.correctPlan,
  });
  state = reduceQuest(state, { type: "test" });
  state = reduceQuest(state, { type: "transfer", choice: "water-large" });
  const selected = [...state.transferPlan];
  state = reduceQuest(state, { type: "transfer", choice: "water-large" });
  assert.deepEqual(state.transferPlan, selected);
  assert.equal(
    state.transferPlan.filter((id) => id.startsWith("water-")).length,
    1,
  );
});

test("unknown locations, conflicting controls and out-of-sequence reward actions do not progress the quest", () => {
  const state = prepared("studio");
  assert.strictEqual(
    reduceQuest(state, { type: "explore", id: "hidden-reward" }),
    state,
  );
  assert.strictEqual(
    reduceQuest(state, { type: "collect", id: "console" }),
    state,
  );
  assert.strictEqual(
    reduceQuest(state, {
      type: "set-plan",
      choices: ["water-small", "water-large"],
    }),
    state,
  );
  assert.strictEqual(
    reduceQuest(state, { type: "set-plan", choices: ["auto-win"] }),
    state,
  );
  assert.strictEqual(
    reduceQuest(state, { type: "transfer", choice: "test" }),
    state,
  );
  assert.strictEqual(
    reduceQuest(state, { type: "transfer", choice: "moonflower" }),
    state,
  );
});

test("age four to six uses two requirements and never requires an unseen drainage setting", () => {
  const config = QUEST_CONFIG.explorers;
  assert.equal(config.requiredSources.length, 2);
  assert.equal(new Set(config.options.map((option) => option.group)).size, 2);
  assert.ok(
    config.transfer.correctPlan.every((id) =>
      config.options.some((option) => option.id === id),
    ),
  );
  for (const band of bands.slice(1))
    assert.equal(
      new Set(QUEST_CONFIG[band].options.map((option) => option.group)).size,
      3,
    );
});

test("saved action logs resume the same quest but cannot import another age band's progress or forged rewards", () => {
  const actions: QuestAction[] = [
    { type: "explore", id: "keeper" },
    { type: "explore", id: "guide" },
    { type: "explore", id: "water" },
    { type: "collect", id: "water" },
    { type: "explore", id: "sun" },
    { type: "collect", id: "sun" },
    { type: "explore", id: "console" },
    { type: "set-plan", choices: ["water-small", "light-shade"] },
    { type: "test" },
    { type: "transfer", choice: "water-large" },
  ];
  const saved = { version: QUEST_VERSION, band: "explorers", actions };
  const expected = actions.reduce(reduceQuest, createQuestState("explorers"));
  assert.deepEqual(restoreQuest("explorers", saved), expected);
  assert.deepEqual(
    restoreQuest("creators", saved),
    createQuestState("creators"),
  );
  assert.deepEqual(
    restoreQuest("explorers", { ...saved, version: "old" }),
    createQuestState("explorers"),
  );
  assert.deepEqual(
    restoreQuest("explorers", {
      ...expected,
      earned: ["moonflower"],
      transferComplete: true,
    }),
    createQuestState("explorers"),
  );
  assert.deepEqual(
    restoreQuest("explorers", {
      ...saved,
      actions: [{ type: "set-plan", choices: "auto-win" }],
    }),
    createQuestState("explorers"),
  );
});

test("the task and prepared AI answer must be encountered before a test can count", () => {
  let state = createQuestState("explorers");
  for (const id of QUEST_CONFIG.explorers.requiredSources) {
    state = reduceQuest(state, { type: "explore", id });
    state = reduceQuest(state, { type: "collect", id });
  }
  state = reduceQuest(state, { type: "explore", id: "console" });
  state = reduceQuest(state, {
    type: "set-plan",
    choices: QUEST_CONFIG.explorers.correctPlan,
  });
  state = reduceQuest(state, { type: "test" });
  assert.equal(state.successful, false);
  assert.match(state.lastFeedback, /prepared AI answer/);
  state = reduceQuest(state, { type: "explore", id: "keeper" });
  assert.equal(reduceQuest(state, { type: "test" }).successful, false);
  state = reduceQuest(state, { type: "explore", id: "guide" });
  assert.equal(reduceQuest(state, { type: "test" }).successful, true);
});

test("narration includes task, evidence, machine errors and new-plant feedback at each age level", () => {
  for (const band of bands) {
    const lines = questNarration(band);
    const config = QUEST_CONFIG[band];
    assert.ok(lines.includes(config.dialogue.guide));
    assert.ok(lines.includes(config.transfer.question));
    assert.ok(lines.includes(config.transfer.feedback));
    let state = reduceQuest(prepared(band), { type: "test" });
    assert.ok(lines.includes(state.lastFeedback));
    state = reduceQuest(state, {
      type: "set-plan",
      choices: config.correctPlan,
    });
    state = reduceQuest(state, { type: "test" });
    state = reduceQuest(state, { type: "transfer", choice: "test" });
    assert.ok(lines.includes(state.lastFeedback));
    assert.equal(new Set(lines).size, lines.length);
  }
});
