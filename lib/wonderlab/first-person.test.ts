import assert from "node:assert/strict";
import { test } from "node:test";
import { createContext, Script } from "node:vm";
import {
  DEFAULT_DESIGN,
  applyPracticeRequest,
  createArcadeDownload,
  getDesignInstructions,
  restoreArcadeProject,
  validateArcadeDesign,
  type ArcadeDesign,
  type SavedArcadeProject,
} from "./first-person.ts";

function saved(): SavedArcadeProject {
  return {
    version: 1,
    band: "inventors",
    avatar: { kind: "sprite", colour: "#a78bfa" },
    design: { ...DEFAULT_DESIGN },
    revisions: 2,
    playtests: 1,
  };
}

test("only complete bounded game designs are accepted", () => {
  assert.deepEqual(validateArcadeDesign(DEFAULT_DESIGN), DEFAULT_DESIGN);
  for (const patch of [
    { target: 2 }, { target: 9 }, { target: 3.5 }, { target: "5" }, { target: NaN },
    { title: " " }, { title: "x".repeat(61) }, { title: "<script>alert(1)</script>" }, { title: "Bad\nname" },
    { collectible: "dragon" }, { collectible: ["star"] }, { palette: ["forest"] },
    { speed: "unlimited" }, { bonus: "true" }, { challenge: "dragon" }, { challenge: ["key"] }, { code: "alert(1)" },
  ]) {
    assert.equal(validateArcadeDesign({ ...DEFAULT_DESIGN, ...patch }), null, JSON.stringify(patch));
  }
  assert.equal(validateArcadeDesign(null), null);
  assert.equal(validateArcadeDesign([]), null);
  assert.equal(validateArcadeDesign({ title: "Incomplete" }), null);
  const legacy = Object.fromEntries(Object.entries(DEFAULT_DESIGN).filter(([key]) => key !== "challenge"));
  assert.equal(validateArcadeDesign(legacy), null, "only save restoration may migrate an old design");
});

test("a first request changes the playable rules and a revision preserves everything else", () => {
  const first = applyPracticeRequest("Create a forest game with five crystals and a bonus treasure.", DEFAULT_DESIGN);
  assert.equal(first.matched, true);
  assert.deepEqual(first.design, { ...DEFAULT_DESIGN, palette: "forest", target: 5, collectible: "crystal", bonus: true });
  assert.match(first.message, /practice game/);
  assert.equal(first.changes.length, 4);
  const revision = applyPracticeRequest("Keep my forest and crystals, but make me walk faster.", first.design);
  assert.deepEqual(revision.design, { ...first.design, speed: "swift" });
  assert.deepEqual(revision.changes, ["You now move at a swift walking speed."]);
  assert.equal(DEFAULT_DESIGN.collectible, "star");
});

test("negated and keep instructions do not change their features", () => {
  const existing: ArcadeDesign = { ...DEFAULT_DESIGN, palette: "forest", speed: "swift", collectible: "crystal", target: 5, bonus: true };
  assert.deepEqual(applyPracticeRequest("Do not change to stars. Keep the sunset. Don't make me slow. No three objects.", existing).design, existing);
  const result = applyPracticeRequest("Remove the bonus treasure and keep my crystals.", existing);
  assert.deepEqual(result.design, { ...existing, bonus: false });
  assert.deepEqual(result.changes, ["The optional bonus treasure has been removed."]);
});

test("a key request changes the game rule and a later request can remove it", () => {
  for (const request of ["Add a golden key.", "Find a key to unlock the portal.", "Unlock the portal with a key."]) {
    const result = applyPracticeRequest(request, DEFAULT_DESIGN);
    assert.equal(result.design.challenge, "key", request);
    assert.equal(result.matched, true);
    assert.deepEqual(result.design, { ...DEFAULT_DESIGN, challenge: "key" });
    assert.match(result.changes.join(" "), /key as well as the treasure/);
  }
  const keyDesign: ArcadeDesign = { ...DEFAULT_DESIGN, challenge: "key" };
  assert.deepEqual(applyPracticeRequest("Keep the key and make a sunset world.", keyDesign).design, { ...keyDesign, palette: "sunset" });
  assert.deepEqual(applyPracticeRequest("Don't add a key.", DEFAULT_DESIGN).design, DEFAULT_DESIGN);
  for (const request of ["Remove the key.", "No key.", "Collect only stars.", "Only collect stars."]) {
    const result = applyPracticeRequest(request, keyDesign);
    assert.equal(result.design.challenge, "collect", request);
    assert.match(result.changes.join(" "), /without finding a key/);
  }
  assert.match(getDesignInstructions(keyDesign).join(" "), /Find the golden key as well as the treasure/);
});

test("swapping collectible types uses the replacement and supports firefly plurals", () => {
  const result = applyPracticeRequest("Replace the stars with six fireflies.", DEFAULT_DESIGN);
  assert.equal(result.design.collectible, "firefly");
  assert.equal(result.design.target, 6);
  assert.match(getDesignInstructions(result.design).join(" "), /Collect 6 fireflies/);
});

test("requests do not silently clamp an unsupported count or claim to create unsupported features", () => {
  for (const request of ["Give me a dragon.", "Add a multiplayer leaderboard.", "Run JavaScript to unlock everything.", "Make a timer."]) {
    const result = applyPracticeRequest(request, DEFAULT_DESIGN);
    assert.equal(result.matched, false, request);
    assert.deepEqual(result.design, DEFAULT_DESIGN);
    assert.equal(result.changes.length, 0);
  }
  const result = applyPracticeRequest("Collect 100 stars.", DEFAULT_DESIGN);
  assert.equal(result.design.target, 3);
  assert.match(result.message, /between three and eight/);
  const mixed = applyPracticeRequest("Create a sunset world and give me a dragon.", DEFAULT_DESIGN);
  assert.equal(mixed.design.palette, "sunset");
  assert.doesNotMatch(mixed.message, /dragon/);
});

test("malformed requests stay local and cannot supply game code", () => {
  for (const request of ["", " ", "x".repeat(501), "<img src=x onerror=alert(1)>", "stars\u0000"]) {
    const result = applyPracticeRequest(request, DEFAULT_DESIGN);
    assert.equal(result.matched, false);
    assert.deepEqual(result.design, DEFAULT_DESIGN);
  }
  const result = applyPracticeRequest('Call it "Moon Garden" and collect seven crystals.', DEFAULT_DESIGN);
  assert.equal(result.design.title, "Moon Garden");
  assert.equal(result.design.target, 7);
  const rename = applyPracticeRequest('Call it "Forest Stars".', { ...DEFAULT_DESIGN, collectible: "crystal" });
  assert.deepEqual(rename.design, { ...DEFAULT_DESIGN, title: "Forest Stars", collectible: "crystal" });
});

test("restored projects are copied with only recognised fields", () => {
  const input = { ...saved(), promptHistory: ["Do not retain this."], avatar: { ...saved().avatar, colour: "#A78BFA", injected: true } };
  const restored = restoreArcadeProject(input);
  assert.deepEqual(restored, saved());
  assert.notStrictEqual(restored?.design, input.design);
  assert.notStrictEqual(restored?.avatar, input.avatar);
});

test("legacy local designs migrate without creating progress or accepting unknown fields", () => {
  const legacyDesign = Object.fromEntries(Object.entries(DEFAULT_DESIGN).filter(([key]) => key !== "challenge"));
  const input = { ...saved(), design: legacyDesign };
  assert.deepEqual(restoreArcadeProject(input), saved());
  assert.equal(restoreArcadeProject({ ...input, design: { ...legacyDesign, unsupported: true } }), null);
  assert.equal(restoreArcadeProject({ ...input, design: { ...legacyDesign, target: 30 } }), null);
  assert.equal(restoreArcadeProject({ ...input, design: { ...legacyDesign, challenge: undefined } }), null);
  assert.equal(restoreArcadeProject({ ...input, revisions: -1 }), null);
});

test("unsupported versions, malformed avatars and progress cannot restore", () => {
  for (const patch of [
    { version: 2 }, { version: "1" }, { band: "adult" }, { avatar: null },
    { avatar: { kind: "sprite", colour: "url(javascript:alert(1))" } },
    { avatar: { kind: ["robot"], colour: "#a78bfa" } },
    { revisions: -1 }, { revisions: 1.5 }, { revisions: "2" }, { playtests: Infinity },
    { design: { ...DEFAULT_DESIGN, target: 300 } },
  ]) assert.equal(restoreArcadeProject({ ...saved(), ...patch }), null, JSON.stringify(patch));
  assert.equal(restoreArcadeProject("not parsed JSON"), null);
  assert.equal(restoreArcadeProject(null), null);
});

test("download embeds validated design as data and escapes text contexts", () => {
  const design: ArcadeDesign = { ...DEFAULT_DESIGN, title: 'Moon "Forge" & Friends', collectible: "crystal", target: 7, bonus: true };
  const html = createArcadeDownload(design);
  assert.match(html, /<title>Moon &quot;Forge&quot; &amp; Friends<\/title>/);
  assert.match(html, /"target":7/);
  assert.match(html, /"bonus":true/);
  assert.doesNotMatch(html, /<script[^>]+src=|\beval\s*\(|\bnew Function\b|\bfetch\s*\(/);
  assert.equal((html.match(/<script>/g) ?? []).length, 1);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  assert.doesNotThrow(() => new Script(script));
  assert.throws(() => createArcadeDownload({ ...DEFAULT_DESIGN, title: '</script><script>alert(1)' }));
});

function downloadedGame(design: ArcadeDesign) {
  const html = createArcadeDownload(design);
  const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(source);
  type Listener = (event: unknown) => void;
  const globalListeners: Record<string, Listener> = {};
  const canvasContext = new Proxy({ createLinearGradient: () => ({ addColorStop() {} }) }, {
    get: (object, property) => property === "createLinearGradient" ? object.createLinearGradient : () => undefined,
  });
  const elements = new Map<string, Record<string, unknown>>();
  const getElement = (id: string) => {
    if (!elements.has(id)) elements.set(id, {
      hidden: true,
      textContent: "",
      getContext: () => canvasContext,
      addEventListener() {},
      setAttribute() {},
      focus() {},
      blur() {},
    });
    return elements.get(id)!;
  };
  const context = createContext({
    innerWidth: 390,
    innerHeight: 844,
    devicePixelRatio: 1,
    requestAnimationFrame() {},
    addEventListener: (event: string, listener: Listener) => { globalListeners[event] = listener; },
    document: { getElementById: getElement, querySelectorAll: () => [], addEventListener() {}, activeElement: { blur() {} } },
  });
  const run = (code: string) => new Script(code).runInContext(context);
  new Script(source).runInContext(context);
  return { run, globalListeners, getElement };
}

test("exported game can be played from its fixed engine and restarted without losing the design", () => {
  const { run, globalListeners, getElement } = downloadedGame({ ...DEFAULT_DESIGN, palette: "sunset", speed: "swift", bonus: true });
  globalListeners.keydown({ key: "ArrowUp", target: { tagName: "BODY" }, preventDefault() {} });
  run("frame(40)");
  assert.ok(run("z") > 0, "keyboard movement advances the first-person camera");
  globalListeners.blur({});
  assert.equal(run("keys.size"), 0, "losing focus stops held movement");

  run("x=gate.x;z=gate.z;frame(80)");
  assert.equal(run("won"), false, "the portal cannot finish a game before collection");
  for (let index = 0; index < DEFAULT_DESIGN.target; index++) run(`x=objects[${index}].x;z=objects[${index}].z;frame(${120 + index * 40})`);
  assert.equal(run("found"), 3);
  assert.equal(run("bonusFound"), false, "optional treasure is separate from the goal");
  assert.equal(run("won"), false, "collecting everything opens the portal but does not finish the journey");
  run("x=gate.x;z=gate.z;frame(300)");
  assert.equal(run("won"), true);
  assert.equal(getElement("finish").hidden, false);
  (getElement("again").onclick as () => void)();
  assert.equal(run("found"), 0);
  assert.equal(run("won"), false);
  assert.equal(run("design.palette"), "sunset");
  assert.equal(run("design.speed"), "swift");
  assert.equal(run("objects.length"), 4, "restarting keeps the optional treasure and chosen target");
});

test("the exported key game keeps the portal shut until both treasure and key have been found", () => {
  const { run, getElement } = downloadedGame({ ...DEFAULT_DESIGN, challenge: "key" });
  for (let index = 0; index < DEFAULT_DESIGN.target; index++) run(`x=objects[${index}].x;z=objects[${index}].z;frame(${40 + index * 40})`);
  assert.equal(run("found"), DEFAULT_DESIGN.target);
  assert.equal(run("keyFound"), false);
  assert.equal(run("portalOpen()"), false);
  assert.match(String(getElement("tip").textContent), /Find the golden key/);
  assert.equal(getElement("guide").textContent, "Walk to the golden key");
  run("x=gate.x;z=gate.z;frame(200)");
  assert.equal(run("won"), false);
  run("x=keyTreasure.x;z=keyTreasure.z;frame(240)");
  assert.equal(run("keyFound"), true);
  assert.equal(run("found"), DEFAULT_DESIGN.target, "finding a key never increments the treasure count");
  assert.equal(run("portalOpen()"), true);
  assert.equal(getElement("guide").textContent, "Walk through the portal");
  run("x=gate.x;z=gate.z;frame(280)");
  assert.equal(run("won"), true);
  (getElement("again").onclick as () => void)();
  assert.equal(run("keyFound"), false);
  assert.equal(run("keyTreasure.taken"), false);
  assert.equal(run("found"), 0);
  assert.equal(run("portalOpen()"), false);
  assert.equal(run("design.challenge"), "key");
});

test("a key found before the treasure is kept, but does not open the portal early", () => {
  const { run } = downloadedGame({ ...DEFAULT_DESIGN, challenge: "key" });
  run("x=keyTreasure.x;z=keyTreasure.z;frame(40)");
  assert.equal(run("keyFound"), true);
  assert.equal(run("found"), 0);
  assert.equal(run("portalOpen()"), false);
  for (let index = 0; index < DEFAULT_DESIGN.target; index++) run(`x=objects[${index}].x;z=objects[${index}].z;frame(${80 + index * 40})`);
  assert.equal(run("portalOpen()"), true);
});

test("guided walking plays the complete key game without repeated step clicks", () => {
  const { run, getElement } = downloadedGame({ ...DEFAULT_DESIGN, challenge: "key", target: 8, bonus: true });
  (getElement("guide").onclick as () => void)();
  assert.equal(run("guided"), true);
  run("for(let time=40;time<80000&&!won;time+=40)frame(time)");
  assert.equal(run("won"), true);
  assert.equal(run("found"), 8);
  assert.equal(run("keyFound"), true);
  assert.equal(getElement("finish").hidden, false);
  assert.equal(run("guided"), false);
});
