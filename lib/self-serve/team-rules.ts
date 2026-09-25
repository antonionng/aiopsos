export const TEAM_MIN = 2;
export const TEAM_MAX = 50;
export const TEAM_PURPOSE = "self_serve_team";
export const SEAT_SESSION_PREFIX = "team_seat:";

export type TeamInvite = { email: string; name: string | null };

const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/;

export function clampSeats(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < TEAM_MIN || n > TEAM_MAX) return null;
  return n;
}

export function isTeamCheckout(metadata: Record<string, string> | null | undefined): boolean {
  return metadata?.purpose === TEAM_PURPOSE;
}

export function isSeatPurchase(stripeSessionId: string | null | undefined): boolean {
  return Boolean(stripeSessionId?.startsWith(SEAT_SESSION_PREFIX));
}

/**
 * One person per line, or separated by commas or semicolons. Each entry is an
 * email address on its own, "Name <email>", or "Name, email" on one line.
 * Returns the people it could read, once each, and the entries it could not.
 */
export function parseInvites(text: string): { invites: TeamInvite[]; rejected: string[] } {
  const invites: TeamInvite[] = [];
  const rejected: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of text.split(/\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const angled = line.match(/^(.*?)<\s*([^>]+)\s*>$/);
    const entries = angled
      ? [{ name: angled[1].replace(/[,"]/g, "").trim(), email: angled[2].trim() }]
      : splitPlain(line);
    for (const entry of entries) {
      const email = entry.email.toLowerCase();
      if (!EMAIL.test(email)) {
        rejected.push(entry.raw ?? entry.email);
        continue;
      }
      if (seen.has(email)) continue;
      seen.add(email);
      invites.push({ email, name: entry.name ? entry.name.slice(0, 120) : null });
    }
  }
  return { invites, rejected };
}

function splitPlain(line: string): { email: string; name: string; raw?: string }[] {
  const parts = line
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const emails = parts.filter((part) => part.includes("@"));
  if (emails.length === 1 && parts.length === 2) {
    const name = parts.find((part) => !part.includes("@")) ?? "";
    return [{ email: emails[0], name }];
  }
  return parts.map((part) => ({ email: part, name: "", raw: part }));
}
