import "server-only";
import { db, requireMission, WonderlabError } from "./server";
import {
  ARCADE_PROJECT_MISSION, ARCADE_PROJECT_VERSION, arcadeChildId,
  exactArcadeKeys, familyArcadeProjects, readArcadeSnapshot,
} from "./arcade-project";

const MAX_REVISION = 2_147_483_646;

export async function loadArcadeProject() {
  let child;
  try {
    ({ child } = await requireMission(ARCADE_PROJECT_MISSION));
  } catch (error) {
    if (!(error instanceof WonderlabError) || ![401, 403].includes(error.status)) throw error;
    return { mode: "local" as const, child: null, revision: 0, snapshot: null,
      reason: "You can keep this game on this device. A grown-up can open an eligible family profile to save this optional Game Concept Studio project to your account." };
  }
  const { data, error } = await db.from("wonderlab_adventure_progress")
    .select("child_id,mission_slug,game_version,revision,state,completed,updated_at")
    .eq("child_id", child.id).eq("mission_slug", ARCADE_PROJECT_MISSION)
    .eq("game_version", ARCADE_PROJECT_VERSION).maybeSingle();
  if (error) throw error;
  const saved = data ? familyArcadeProjects([data], [child.id])[0] : null;
  if (data && !saved) throw new WonderlabError("Your saved arcade project needs restoring. Keep your local copy and ask your grown-up to contact Experrt.", 409);
  return { mode: "family" as const, child: { id: child.id, nickname: child.nickname, band: child.band },
    revision: saved?.revision ?? 0, snapshot: saved?.snapshot ?? null,
    reason: "Your family can see this saved Game Concept Studio project and a summary of the play activity reported by the game." };
}

export async function saveArcadeProject(body: Record<string, unknown>) {
  if (!exactArcadeKeys(body, ["childId", "revision", "snapshot"]) || !arcadeChildId(body.childId) ||
    !Number.isSafeInteger(body.revision) || Number(body.revision) < 0 || Number(body.revision) > MAX_REVISION)
    throw new WonderlabError("Open your profile and save your current arcade project.");
  const snapshot = readArcadeSnapshot(body.snapshot);
  if (!snapshot) throw new WonderlabError("This arcade project could not be saved. Keep your local copy and try again.");
  const { child } = await requireMission(ARCADE_PROJECT_MISSION);
  if (child.id !== body.childId) throw new WonderlabError("Your active profile changed. Open the correct profile before saving this project.", 403);
  const { data, error } = await db.rpc("wonderlab_save_adventure", {
    p_child: child.id, p_parent: child.parent_id, p_slug: ARCADE_PROJECT_MISSION,
    p_version: ARCADE_PROJECT_VERSION, p_revision: body.revision,
    p_state: { version: ARCADE_PROJECT_VERSION, ...snapshot },
    // The browser reports practice activity. It never awards mission completion.
    p_completed: false,
  });
  if (error) {
    if (error.message.includes("Progress conflict")) throw new WonderlabError("This project changed on another device. Keep your local copy, then load your family save before saving again.", 409);
    if (error.message.includes("Profile unavailable") || error.message.includes("Access unavailable"))
      throw new WonderlabError("This profile cannot save right now. Your local game is still available. Ask your grown-up to check your access.", 403);
    throw error;
  }
  const saved = familyArcadeProjects([data], [child.id])[0];
  if (!saved) throw new WonderlabError("We could not confirm your family save. Keep your local copy and reload your family save before trying again.", 503);
  return { childId: child.id, revision: saved.revision, snapshot: saved.snapshot, savedAt: saved.updatedAt };
}
