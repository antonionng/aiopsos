import type { Band } from "./types.ts";

// Bump when the narrator or delivery changes. Files are immutable, authored assets.
export const NARRATION_VERSION = "marin-realtime21-v2";
export const NARRATION_MODEL = "gpt-realtime-2.1-mini";
export const NARRATION_VOICE = "marin";
export function narrationId(band: Band, text: string): string {
  const input = `${band}:${text.trim().replace(/\s+/g, " ")}`;
  let a = 2166136261;
  let b = 5381;
  for (let i = 0; i < input.length; i++) {
    a = Math.imul(a ^ input.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ input.charCodeAt(i);
  }
  return `${NARRATION_VERSION}-${(a >>> 0).toString(16)}-${(b >>> 0).toString(16)}`;
}
