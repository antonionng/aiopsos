import { mkdir, readFile, writeFile, rename, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { narrationScripts } from "../lib/wonderlab/narration-scripts.ts";

const root = process.cwd();
const directory = resolve(root, "public/audio/wonderlab");
const manifestFile = resolve(root, "lib/wonderlab/narration-manifest.json");
const scripts = narrationScripts();
const dryRun = process.argv.includes("--dry-run");
const limitFlag = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitFlag ? Number(limitFlag.split("=")[1]) : scripts.length;
if (!Number.isInteger(limit) || limit < 1) throw new Error("Invalid limit");
let manifest: Record<string, string> = {};
try {
  manifest = JSON.parse(await readFile(manifestFile, "utf8"));
} catch {
  /* First generation. */
}
const pending = [];
for (const script of scripts) {
  const filename = `${script.id}.mp3`;
  try {
    if ((await stat(resolve(directory, filename))).size > 1000) {
      manifest[script.id] = `/audio/wonderlab/${filename}`;
      continue;
    }
  } catch {
    /* Missing authored clip. */
  }
  pending.push(script);
}
console.log(
  JSON.stringify({
    scripts: scripts.length,
    pending: pending.length,
    characters: pending.reduce((sum, script) => sum + script.text.length, 0),
    dryRun,
  }),
);
if (!dryRun) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    throw new Error(
      "OPENAI_API_KEY is required in the publishing environment.",
    );
  await mkdir(directory, { recursive: true });
  const queue = pending.slice(0, limit);
  let completed = 0;
  let failed = false;
  async function worker() {
    while (queue.length && !failed) {
      const script = queue.shift()!;
      try {
        const young = script.band === "explorers";
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini-tts",
            voice: "marin",
            input: script.text,
            instructions: `You are the warm, friendly narrator of Wonderlab, an illustrated learning game. Speak in a natural British English accent, with clear diction and gentle enthusiasm. ${young ? "Address a child aged four to six. Use an unhurried pace, short natural pauses between instructions and playful warmth, without baby talk." : "Be encouraging and conversational, with a steady pace. Do not sound babyish, theatrical or like an advertisement."} Read only the supplied words, exactly as written.`,
            response_format: "mp3",
          }),
          signal: AbortSignal.timeout(90000),
        });
        if (!response.ok)
          throw new Error(`Speech API returned ${response.status}`);
        if (!response.headers.get("content-type")?.startsWith("audio/"))
          throw new Error("Expected an audio response");
        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length < 1000) throw new Error("Audio response was empty");
        const filename = `${script.id}.mp3`;
        await writeFile(resolve(directory, `${filename}.tmp`), buffer);
        await rename(
          resolve(directory, `${filename}.tmp`),
          resolve(directory, filename),
        );
        manifest[script.id] = `/audio/wonderlab/${filename}`;
        completed++;
        if (completed % 10 === 0 || !queue.length)
          console.log(`Recorded ${completed} clips; ${queue.length} waiting.`);
      } catch (error) {
        failed = true;
        console.error(
          error instanceof Error
            ? error.message
            : "Narration generation failed",
        );
      }
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  await writeFile(
    `${manifestFile}.tmp`,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await rename(`${manifestFile}.tmp`, manifestFile);
  console.log(
    JSON.stringify({
      recorded: completed,
      available: Object.keys(manifest).length,
      failed,
    }),
  );
  if (failed) process.exitCode = 1;
}
