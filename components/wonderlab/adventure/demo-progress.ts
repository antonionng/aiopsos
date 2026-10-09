"use client";
import { useCallback, useSyncExternalStore } from "react";
import {
  ADVENTURE_VERSION,
  type Action,
  type Adventure,
  type AdventureState,
} from "@/lib/wonderlab/adventure/types";
import { initialAdventure, transition } from "@/lib/wonderlab/adventure/engine";
type Snapshot = { revision: number; state: AdventureState; actions: Action[] };
const cache = new Map<string, Snapshot>();
const event = "wonderlab-adventure-demo";
const key = (game: Adventure) =>
  `wonderlab-demo:${ADVENTURE_VERSION}:${game.slug}`;
function read(game: Adventure): Snapshot {
  const id = key(game),
    cached = cache.get(id);
  if (cached) return cached;
  let state = initialAdventure(game),
    actions: Action[] = [];
  try {
    const raw = sessionStorage.getItem(id);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length > 5000) throw new Error();
      for (const action of parsed) state = transition(game, state, action);
      actions = parsed;
    }
  } catch {
    state = initialAdventure(game);
    actions = [];
  }
  const result = { revision: actions.length, state, actions };
  cache.set(id, result);
  return result;
}
function subscribe(notify: () => void) {
  window.addEventListener(event, notify);
  return () => window.removeEventListener(event, notify);
}
export function useDemoProgress(game: Adventure, enabled: boolean) {
  return useSyncExternalStore(
    subscribe,
    useCallback(() => (enabled ? read(game) : null), [game, enabled]),
    () => null,
  );
}
export function saveDemoMove(game: Adventure, action: Action) {
  const current = read(game);
  const state = transition(game, current.state, action);
  const actions = [...current.actions, action];
  const next = { revision: current.revision + 1, state, actions };
  cache.set(key(game), next);
  try {
    if (actions.length <= 5000)
      sessionStorage.setItem(key(game), JSON.stringify(actions));
  } catch {
    /* Continue in memory if browser storage is unavailable. */
  }
  window.dispatchEvent(new Event(event));
  return next;
}
