import { mkdir, readFile, writeFile, rename, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import { narrationScripts } from "../lib/wonderlab/narration-scripts.ts";
import { NARRATION_MODEL, NARRATION_VOICE } from "../lib/wonderlab/narration.ts";
import { recordNarration } from "./wonderlab-realtime-voice.mts";

function encodeMp3(pcm: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!ffmpeg) return reject(new Error("The publishing MP3 encoder is unavailable"));
    const encoder = spawn(ffmpeg as unknown as string, [
      "-hide_banner", "-loglevel", "error", "-f", "s16le", "-ar", "24000",
      "-ac", "1", "-i", "pipe:0", "-codec:a", "libmp3lame", "-b:a", "96k",
      "-f", "mp3", "pipe:1",
    ]);
    const chunks: Buffer[] = [];
    encoder.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    encoder.stderr.resume();
    encoder.on("error", reject);
    encoder.stdin.on("error", reject);
    encoder.on("close", (code) => code === 0
      ? resolve(Buffer.concat(chunks)) : reject(new Error("MP3 encoding failed")));
    encoder.stdin.end(pcm);
  });
}

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
  const apiKey = process.env.OPENAI_API_KEY?.trim();
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
        let recording;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            recording = await recordNarration(apiKey!, script.text, script.band === "explorers");
            break;
          } catch (error) {
            if (attempt === 2) throw error;
            console.log(`Retrying ${script.id} after a recording error.`);
          }
        }
        if (!recording) throw new Error("No recording returned");
        const buffer = await encodeMp3(recording.pcm);
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
  await Promise.all(Array.from({ length: 6 }, () => worker()));
  await writeFile(
    `${manifestFile}.tmp`,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await rename(`${manifestFile}.tmp`, manifestFile);
  console.log(
    JSON.stringify({
      recorded: completed,
      model: NARRATION_MODEL,
      voice: NARRATION_VOICE,
      available: Object.keys(manifest).length,
      failed,
    }),
  );
  if (failed) process.exitCode = 1;
}
