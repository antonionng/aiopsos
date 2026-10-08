import { missions as firstRelease } from "./versions/2026-10-05.ts";
import { missions as clearCopyRelease } from "./versions/2026-10-07.ts";
import type { Mission } from "./types.ts";

// Keep every purchased version here when introducing a new catalogue release.
// Resolve only the stored version: newer answer keys must not change saved work.
const releases: Record<string, Mission[]> = {
  "2026-10-05.1": firstRelease,
  "2026-10-07.1": clearCopyRelease,
};
export function getMissionForVersion(slug: string, version: string) {
  if (!Object.hasOwn(releases, version)) return undefined;
  return releases[version].find((mission) => mission.slug === slug);
}
