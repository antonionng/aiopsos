import type { Action, ForgeLevel } from "./types.ts";

export type DeliveryMode = "editing" | "running" | "blocked" | "delivered";
export type RouteEdit = {
  intent: "add" | "remove" | "repair";
  cell: number;
};

/** Keep the legacy toggle event behind explicit, idempotent editing intents. */
export function routeEditAction(
  level: ForgeLevel,
  pieces: number[],
  mode: DeliveryMode,
  edit: RouteEdit,
  gap: number | null = null,
): Action | null {
  const { cell, intent } = edit;
  if (
    !Number.isInteger(cell) ||
    cell < 0 ||
    cell >= level.width * level.height ||
    cell === level.start ||
    level.goals.includes(cell) ||
    level.rocks.includes(cell)
  )
    return null;
  if (mode === "running" || mode === "delivered") return null;
  if (mode === "blocked" && (intent !== "repair" || cell !== gap)) return null;
  if (mode === "editing" && intent === "repair") return null;
  const exists = pieces.includes(cell);
  if (intent === "remove" ? !exists : exists) return null;
  return { type: "tile", cell };
}
