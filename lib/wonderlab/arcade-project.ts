import { containsPrivateDetails, restoreArcadeProject, validateArcadeDesign, type SavedArcadeProject } from "./first-person.ts";
import { arcadeLearningSummary, restoreArcadeAdventure, type ArcadeAdventure } from "./arcade-adventure.ts";

export const ARCADE_PROJECT_VERSION = "arcade-apprentice-2026-10-11.1";
export const ARCADE_PROJECT_MISSION = "game-concept-studio";
export type ArcadeProjectSnapshot = {
  project: SavedArcadeProject;
  adventure: ArcadeAdventure;
};
export type FamilyArcadeProject = {
  childId: string;
  revision: number;
  updatedAt: string;
  snapshot: ArcadeProjectSnapshot;
  summary: string[];
};
export const arcadeChildId = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
export function exactArcadeKeys(value: unknown, names: string[]): value is Record<string, unknown> {
  return record(value) && Object.keys(value).length === names.length && names.every((name) => Object.hasOwn(value, name));
}

/** Account saves use the current exact schema. Legacy local saves migrate before upload. */
export function readArcadeSnapshot(value: unknown): ArcadeProjectSnapshot | null {
  if (!exactArcadeKeys(value, ["project", "adventure"])) return null;
  const p = value.project;
  const a = value.adventure;
  if (!exactArcadeKeys(p, ["version", "band", "avatar", "design", "revisions", "playtests"]) ||
    !exactArcadeKeys(p.avatar, ["kind", "colour"]) || !validateArcadeDesign(p.design) ||
    !exactArcadeKeys(a, ["version", "visitor", "creations"]) || !Array.isArray(a.creations) ||
    a.creations.some((entry) => !exactArcadeKeys(entry, ["chapter", "design"]))) return null;
  const project = restoreArcadeProject(p);
  const adventure = restoreArcadeAdventure(a);
  if (!project || !adventure) return null;
  // Account saves are shown to parents and in downloads, so game names must not carry personal details.
  if ([project.design, ...adventure.creations.map((entry) => entry.design)].some((design) => containsPrivateDetails(design.title))) return null;
  return { project, adventure };
}

/** These are saved play reports. They do not establish assessed achievement. */
export function familyArcadeProjects(rows: unknown[], childIds: string[]): FamilyArcadeProject[] {
  const allowed = new Set(childIds);
  return rows.flatMap((row) => {
    if (!record(row) || !arcadeChildId(row.child_id) || !allowed.has(row.child_id) ||
      row.mission_slug !== ARCADE_PROJECT_MISSION || row.game_version !== ARCADE_PROJECT_VERSION ||
      row.completed !== false || !Number.isSafeInteger(row.revision) || Number(row.revision) < 1 ||
      typeof row.updated_at !== "string" || !Number.isFinite(Date.parse(row.updated_at)) ||
      !exactArcadeKeys(row.state, ["version", "project", "adventure"]) || row.state.version !== ARCADE_PROJECT_VERSION) return [];
    const snapshot = readArcadeSnapshot({ project: row.state.project, adventure: row.state.adventure });
    return snapshot ? [{ childId: row.child_id, revision: Number(row.revision), updatedAt: row.updated_at,
      snapshot, summary: arcadeLearningSummary(snapshot.adventure) }] : [];
  });
}

export function arcadeProjectReport(project: FamilyArcadeProject): string {
  return [
    "Arcade Apprentice: saved practice activity",
    "This optional creation belongs to Game Concept Studio. The game reports this play activity; it is not an assessment of your child's ability.",
    `Saved on ${new Date(project.updatedAt).toISOString()}.`,
    "",
    ...(project.summary.length ? project.summary : ["Your child has saved a game design and can continue their adventure."]),
    "",
    "Talk about the creation together: What did you ask the helper to make? What changed when you added a new instruction? Who would enjoy this game?",
    "",
    "Saved design and adventure",
    JSON.stringify(project.snapshot, null, 2),
  ].join("\n");
}
