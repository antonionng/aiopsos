import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { narrationScripts } from "./narration-scripts.ts";
import { narrationId } from "./narration.ts";
import {
  rescueLevels,
  runRoute,
  checkCreature,
  habitats,
  features,
} from "./games.ts";

test("published authored narration has a complete local MP3 library", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("./narration-manifest.json", import.meta.url), "utf8"),
  );
  const scripts = narrationScripts();
  assert.ok(scripts.length > 300);
  assert.equal(
    new Set(scripts.map((script) => script.id)).size,
    scripts.length,
  );
  for (const script of scripts) {
    assert.ok(script.text.length < 4096);
    assert.equal(manifest[script.id], `/audio/wonderlab/${script.id}.mp3`);
    const bytes = readFileSync(
      new URL(`../../public${manifest[script.id]}`, import.meta.url),
    );
    assert.ok(bytes.length > 1000, `Missing audio: ${script.id}`);
    assert.ok(
      bytes.subarray(0, 3).toString() === "ID3" ||
        (bytes[0] === 255 && (bytes[1] & 224) === 224),
      `Invalid MP3: ${script.id}`,
    );
  }
});

test("recordings cover route failures and every supported creature selection", () => {
  const ids = new Set(narrationScripts().map((script) => script.id));
  for (const commands of [
    [],
    ["left"],
    ["up", "right", "right"],
    ["right", "right", "right", "right"],
  ] as const) {
    const result = runRoute(rescueLevels[0], [...commands]);
    assert.ok(ids.has(narrationId("explorers", result.message)));
  }
  assert.ok(
    ids.has(
      narrationId(
        "explorers",
        runRoute({ ...rescueLevels[0], key: [1, 0] }, [
          "right",
          "right",
          "right",
          "right",
        ]).message,
      ),
    ),
  );
  habitats.forEach((_, round) => {
    features.forEach((a) =>
      features.forEach((b) => {
        if (a.id !== b.id)
          assert.ok(
            ids.has(
              narrationId(
                "inventors",
                checkCreature(round, [a.id, b.id]).message,
              ),
            ),
          );
      }),
    );
  });
});

test("a changed script or age band cannot reuse an outdated recording", () => {
  assert.equal(
    narrationId("explorers", " Hello   Pip. "),
    narrationId("explorers", "Hello Pip."),
  );
  assert.notEqual(
    narrationId("explorers", "Hello Pip."),
    narrationId("studio", "Hello Pip."),
  );
  assert.notEqual(
    narrationId("explorers", "Hello Pip."),
    narrationId("explorers", "Goodbye Pip."),
  );
});
