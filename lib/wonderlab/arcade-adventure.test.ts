import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_DESIGN, applyPracticeRequest } from "./first-person.ts";
import { NEW_ADVENTURE, finishArcadeChapter, currentChapter, restoreArcadeAdventure, arcadeLearningSummary, arcadeNarrationScripts, arcadeBrief } from "./arcade-adventure.ts";

test("the festival advances through played creations, not just design choices", () => {
  const played = { collected: 3, keyFound: false, enteredPortal: true };
  assert.equal(finishArcadeChapter(NEW_ADVENTURE, DEFAULT_DESIGN, { ...played, enteredPortal: false }), NEW_ADVENTURE);
  assert.equal(finishArcadeChapter(NEW_ADVENTURE, DEFAULT_DESIGN, { ...played, collected: 2 }), NEW_ADVENTURE);
  const first = finishArcadeChapter(NEW_ADVENTURE, DEFAULT_DESIGN, played);
  assert.equal(currentChapter(first), "key-quest");
  assert.equal(finishArcadeChapter(first, DEFAULT_DESIGN, played), first);
  const keyGame = { ...DEFAULT_DESIGN, challenge: "key" as const };
  assert.equal(finishArcadeChapter(first, keyGame, played), first);
  const second = finishArcadeChapter(first, keyGame, { ...played, keyFound: true });
  assert.equal(currentChapter(second), "visitor-game");
  assert.equal(finishArcadeChapter(second, keyGame, { ...played, keyFound: true }), second);
  const opened = finishArcadeChapter(second, DEFAULT_DESIGN, played);
  assert.equal(currentChapter(opened), "opened");
  assert.equal(finishArcadeChapter(opened, DEFAULT_DESIGN, played), opened);
  assert.equal(arcadeLearningSummary(opened).length, 3);
  assert.deepEqual(restoreArcadeAdventure(opened), opened);
});

test("visitor wishes affect the playable game and saved progress cannot skip chapters", () => {
  const first = finishArcadeChapter({ ...NEW_ADVENTURE, visitor: "nova" }, DEFAULT_DESIGN, { collected: 3, keyFound: false, enteredPortal: true });
  const keyGame = { ...DEFAULT_DESIGN, challenge: "key" as const, target: 5 };
  const second = finishArcadeChapter(first, keyGame, { collected: 5, keyFound: true, enteredPortal: true });
  assert.equal(finishArcadeChapter(second, { ...keyGame, target: 3 }, { collected: 3, keyFound: true, enteredPortal: true }), second);
  assert.equal(finishArcadeChapter(second, keyGame, { collected: 5, keyFound: true, enteredPortal: true }), second);
  const opened = finishArcadeChapter(second, { ...keyGame, collectible: "firefly" }, { collected: 5, keyFound: true, enteredPortal: true });
  assert.equal(currentChapter(opened), "opened");
  assert.equal(restoreArcadeAdventure({ ...opened, visitor: "moss" }), null);
  assert.equal(restoreArcadeAdventure({ ...first, creations: [opened.creations[2]] }), null);
  assert.equal(restoreArcadeAdventure({ ...first, creations: [{ chapter: "first-game", design: { ...DEFAULT_DESIGN, target: 999 } }] }), null);
});

test("only fixed teaching text is published for narration", () => {
  const scripts = arcadeNarrationScripts();
  assert.equal(scripts.length, 20);
  assert.equal(new Set(scripts.map((s) => s.id)).size, scripts.length);
  assert.ok(scripts.every((s) => s.text.length > 30));
});

test("chapter examples can recover an old key game and always change Nova's previous game", () => {
  const previous = { ...DEFAULT_DESIGN, challenge: "key" as const, palette: "sunset" as const, collectible: "firefly" as const, target: 5 };
  const firstDesign = applyPracticeRequest(arcadeBrief(NEW_ADVENTURE, "explorers").hint, previous).design;
  const first = finishArcadeChapter(NEW_ADVENTURE, firstDesign, { collected: firstDesign.target, keyFound: false, enteredPortal: true });
  assert.equal(currentChapter(first), "key-quest");
  const second = finishArcadeChapter({ ...first, visitor: "nova" }, previous, { collected: 5, keyFound: true, enteredPortal: true });
  const finalDesign = applyPracticeRequest(arcadeBrief(second, "inventors").hint, previous).design;
  const opened = finishArcadeChapter(second, finalDesign, { collected: finalDesign.target, keyFound: true, enteredPortal: true });
  assert.equal(currentChapter(opened), "opened");
});
