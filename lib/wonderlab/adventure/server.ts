import "server-only";
import { db } from "../server";
import {
  ADVENTURE_VERSION,
  type Adventure,
  type AdventureRecord,
} from "./types";
import { initialAdventure } from "./engine";
export async function loadAdventure(
  childId: string,
  game: Adventure,
): Promise<AdventureRecord> {
  const { data, error } = await db
    .from("wonderlab_adventure_progress")
    .select("*")
    .eq("child_id", childId)
    .eq("mission_slug", game.slug)
    .eq("game_version", ADVENTURE_VERSION)
    .maybeSingle();
  if (error) throw error;
  return (
    data ?? {
      child_id: childId,
      mission_slug: game.slug,
      game_version: ADVENTURE_VERSION,
      revision: 0,
      state: initialAdventure(game),
      completed: false,
      updated_at: "",
    }
  );
}
