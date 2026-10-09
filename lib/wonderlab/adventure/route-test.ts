import { neighbours } from "./engine.ts";
import type { ForgeLevel } from "./types.ts";

export type RouteTest = {
  goal: number;
  path: number[];
  gap: number | null;
  reached: boolean;
};

/** Prefer an existing connection. For a broken route, stop before its first gap.
 * The diagnostic search never places a piece or submits an unbuilt path. */
export function planRouteTest(
  level: ForgeLevel,
  tiles: number[],
  goal: number,
): RouteTest {
  const built = new Set([level.start, ...level.goals, ...tiles]);
  const queue = [{ path: [level.start], missing: 0 }];
  const seen = new Set<number>();
  while (queue.length) {
    queue.sort(
      (a, b) => a.missing - b.missing || a.path.length - b.path.length,
    );
    const current = queue.shift()!;
    const cell = current.path.at(-1)!;
    if (seen.has(cell)) continue;
    seen.add(cell);
    if (cell === goal) {
      const firstGap = current.path.findIndex((n) => !built.has(n));
      return firstGap < 0
        ? { goal, path: current.path, gap: null, reached: true }
        : {
            goal,
            path: current.path.slice(0, firstGap),
            gap: current.path[firstGap],
            reached: false,
          };
    }
    for (const next of neighbours(level, cell)) {
      if (seen.has(next) || level.rocks.includes(next)) continue;
      queue.push({
        path: [...current.path, next],
        missing: current.missing + (built.has(next) ? 0 : 1),
      });
    }
  }
  return { goal, path: [level.start], gap: null, reached: false };
}
