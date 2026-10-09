import type { Adventure, AdventureState } from "./types.ts";
/** A readable private keepsake containing the learner's decisions and checks. */
export function creationText(game: Adventure, state: AdventureState): string {
  const lines = [
    `WONDERLAB: ${game.name}`,
    `Mission sticker: ${game.reward}`,
    "",
    game.learning,
    "",
  ];
  for (let i = 0; i < game.levels.length; i++) {
    const level = game.levels[i],
      s = state.rounds[i];
    lines.push(`CHALLENGE ${i + 1}: ${level.title}`, level.mission, "");
    if (level.kind === "signal")
      for (const c of level.claims) {
        const decision = s.decisions[c.id];
        lines.push(
          decision === "remove"
            ? `Removed: ${c.text}`
            : decision === "repair"
              ? `Repaired: ${c.repair}`
              : `Kept: ${c.text}`,
          `Checked against: ${level.sources.find((source) => source.id === s.links[c.id])?.text ?? "No source connected."}`,
          "",
        );
      }
    if (level.kind === "forge") {
      lines.push(
        "My world (S = start, X = machinery, ~ = water, = = bridge, + = path, numbered destinations):",
      );
      for (let y = 0; y < level.height; y++)
        lines.push(
          Array.from({ length: level.width }, (_, x) => {
            const n = y * level.width + x;
            return n === level.start
              ? "S"
              : level.goals.includes(n)
                ? String(level.goals.indexOf(n) + 1)
                : level.rocks.includes(n)
                  ? "X"
                  : s.tiles.includes(n)
                    ? level.water.includes(n)
                      ? "="
                      : "+"
                    : level.water.includes(n)
                      ? "~"
                      : "·";
          }).join(" "),
        );
      lines.push(
        `Tested destinations: ${s.testedGoals.map((n) => level.goalNames[level.goals.indexOf(n)]).join(", ")}.`,
        `Pieces used: ${s.tiles.length} of ${level.budget}.`,
      );
    }
    if (level.kind === "launch")
      for (const t of level.tasks) {
        const p = s.schedule[t.id];
        lines.push(
          `${t.name}: slots ${p.slot + 1} to ${p.slot + t.duration}, ${level.resources[p.resource]}, helper: ${p.helper}.`,
        );
      }
    if (level.kind === "lab")
      lines.push(
        `Examples I selected: ${level.examples
          .filter((e) => s.examples.includes(e.id))
          .map((e) => `${e.colour} ${e.shape} (${e.label})`)
          .join(", ")}.`,
      );
    lines.push(
      "",
      `Game checks: ${s.solved ? "Met" : "Still exploring"}.`,
      `Tests or fabrications: ${s.attempts}.`,
      `My reflection: ${s.reflection}`,
      "",
    );
  }
  lines.push(
    "This sticker celebrates the work completed in this game. It is not a professional qualification.",
  );
  return lines.join("\n");
}
