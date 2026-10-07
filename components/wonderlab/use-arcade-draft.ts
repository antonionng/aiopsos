"use client";
import { useCallback, useSyncExternalStore } from "react";
import {
  readArcadeDraft,
  type CoachedGame,
} from "@/lib/wonderlab/arcade-coaching";

const drafts = new Map<string, string>();
const eventName = "wonderlab-arcade-draft";
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  return () => window.removeEventListener(eventName, callback);
}
function keyFor(type: CoachedGame, round: number) {
  return `wonderlab-arcade-draft-v1:${type}:${round}`;
}
export function useArcadeDraft<T extends CoachedGame>(type: T, round: number) {
  const key = keyFor(type, round);
  const get = useCallback(() => {
    if (drafts.has(key)) return drafts.get(key)!;
    try {
      return sessionStorage.getItem(key) ?? "null";
    } catch {
      return "null";
    }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, get, () => "null");
  type Choice = T extends "creature"
    ? import("@/lib/wonderlab/games").Feature[]
    : T extends "prompt"
      ? number[]
      : (import("@/lib/wonderlab/games").Verdict | null)[];
  const set = (value: Choice) => {
    const json = JSON.stringify(value);
    drafts.set(key, json);
    try {
      sessionStorage.setItem(key, json);
    } catch {
      /* Keep playing in memory. */
    }
    window.dispatchEvent(new Event(eventName));
  };
  return [readArcadeDraft(type, raw) as Choice, set] as const;
}
export function clearArcadeDrafts(type: CoachedGame) {
  for (let round = 0; round < 3; round++) {
    const key = keyFor(type, round);
    drafts.delete(key);
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* Keep playing in memory. */
    }
    drafts.set(key, "null");
  }
  window.dispatchEvent(new Event(eventName));
}
