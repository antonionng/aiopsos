import { NextResponse } from "next/server";
import {
  apiError,
  assertOrigin,
  readBody,
  requireMission,
  db,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { getAdventure } from "@/lib/wonderlab/adventure/catalog";
import { transition } from "@/lib/wonderlab/adventure/engine";
import { loadAdventure } from "@/lib/wonderlab/adventure/server";
import { ADVENTURE_VERSION } from "@/lib/wonderlab/adventure/types";
export async function GET(req: Request) {
  try {
    const slug = new URL(req.url).searchParams.get("slug") ?? "";
    const { child } = await requireMission(slug);
    const game = getAdventure(slug);
    if (!game) throw new WonderlabError("This game is not available.", 404);
    return NextResponse.json(await loadAdventure(child.id, game), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const b = await readBody(req);
    if (
      typeof b.slug !== "string" ||
      !Number.isSafeInteger(b.revision) ||
      Number(b.revision) < 0
    )
      throw new WonderlabError("Please reload your game checkpoint.");
    const { child } = await requireMission(b.slug);
    const game = getAdventure(b.slug);
    if (!game) throw new WonderlabError("This game is not available.", 404);
    const saved = await loadAdventure(child.id, game);
    if (saved.revision !== b.revision)
      throw new WonderlabError("This game changed in another tab.", 409);
    let state;
    try {
      state = transition(game, saved.state, b.action);
    } catch {
      throw new WonderlabError(
        "That move is not available. Please check your game and try again.",
      );
    }
    const { data, error } = await db.rpc("wonderlab_save_adventure", {
      p_child: child.id,
      p_parent: child.parent_id,
      p_slug: game.slug,
      p_version: ADVENTURE_VERSION,
      p_revision: b.revision,
      p_state: state,
      p_completed: state.completed,
    });
    if (error) {
      if (error.message.includes("Progress conflict"))
        throw new WonderlabError("This game changed in another tab.", 409);
      throw error;
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
