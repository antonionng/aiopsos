/**
 * Pure helpers for provisioning a training day.
 *
 * A tour day is one cohort holding delegates from several companies, and each
 * company needs its own organisation and its own QR link so a delegate lands
 * in their own employer's tenant (lib/assess-claim.ts attaches a response to
 * the *link's* org). At 30+ companies that cannot be done by hand, and there
 * is no cohort UI at all, so app/api/super-admin/tour/route.ts drives it.
 *
 * The parts that are worth testing are here, away from the database.
 */

/** IANA zones for the October 2026 tour, offered by the provisioning screen. */
export const TOUR_TIMEZONES = [
  { id: "Asia/Kuala_Lumpur", label: "Malaysia (Kuala Lumpur, UTC+8)" },
  { id: "Asia/Jakarta", label: "Indonesia, western (Jakarta, UTC+7)" },
  { id: "Asia/Makassar", label: "Indonesia, central (Makassar, UTC+8)" },
  { id: "Europe/London", label: "United Kingdom (London)" },
] as const;

/**
 * A readable, URL-safe fragment. Deliberately not a generic slugify: it also
 * collapses the punctuation that turns up in company names - "Acme (M) Sdn.
 * Bhd." - into something a delegate can read off a printed QR card.
 */
export function slugFragment(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

/**
 * The token behind /assess/<token> for one company on one day.
 *
 * Readable on purpose. These get printed on registration cards and read aloud
 * in a room, so `acme-kl-oct14` beats eight hex characters. Uniqueness is
 * enforced by the unique index on assessment_links.token; the caller retries
 * with an attempt number when it collides.
 */
export function assessmentLinkToken(
  companyName: string,
  venue: string,
  eventDate: string,
  attempt = 0
): string {
  const parts = [slugFragment(companyName), slugFragment(venue), monthDay(eventDate)]
    .filter(Boolean);
  const base = parts.join("-");
  return attempt === 0 ? base : `${base}-${attempt + 1}`;
}

/** "2026-10-14" -> "oct14". Returns "" for anything unparseable. */
export function monthDay(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate ?? "");
  if (!match) return "";
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  const month = months[Number(match[2]) - 1];
  if (!month) return "";
  return `${month}${Number(match[3])}`;
}

/**
 * Company names as typed by whoever built the delegate list, matched loosely
 * enough that "Acme Sdn Bhd", "ACME  Sdn. Bhd." and "acme sdn bhd" resolve to
 * one organisation.
 *
 * Deliberately conservative: it normalises case, whitespace and punctuation,
 * and nothing else. It does NOT strip company suffixes - "Acme Holdings" and
 * "Acme Trading" are different companies, and silently merging two tenants is
 * far worse than creating one duplicate that a human can spot and fix.
 */
export function normaliseCompanyName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,'"()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface CompanyRow {
  name: string;
  industry?: string;
  contact_email?: string;
  seats?: number;
}

/**
 * Parse the attending-companies CSV.
 *
 * Header-sniffed like the two parsers already in the codebase
 * (components/assessment/csv-upload.tsx and the cohort enrol route), because
 * whoever assembles a delegate list will not produce a fixed column order.
 * A file with no recognisable header is treated as one company name per line,
 * which is the other thing people actually paste.
 */
export function parseCompanyCsv(text: string): CompanyRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const nameCol = headers.findIndex((h) => h.includes("company") || h === "name" || h.includes("organisation") || h.includes("organization"));
  const hasHeader = nameCol >= 0;

  const industryCol = hasHeader ? headers.findIndex((h) => h.includes("industry") || h.includes("sector")) : -1;
  const emailCol = hasHeader ? headers.findIndex((h) => h.includes("email")) : -1;
  const seatsCol = hasHeader ? headers.findIndex((h) => h.includes("seat") || h.includes("delegate") || h.includes("headcount")) : -1;

  const rows = hasHeader ? lines.slice(1) : lines;
  const out: CompanyRow[] = [];
  const seen = new Set<string>();

  for (const line of rows) {
    const cells = splitCsvLine(line);
    const name = (cells[hasHeader ? nameCol : 0] ?? "").trim();
    if (!name) continue;

    const key = normaliseCompanyName(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const seats = seatsCol >= 0 ? Number((cells[seatsCol] ?? "").trim()) : NaN;

    out.push({
      name,
      industry: industryCol >= 0 ? (cells[industryCol] ?? "").trim() || undefined : undefined,
      contact_email: emailCol >= 0 ? (cells[emailCol] ?? "").trim().toLowerCase() || undefined : undefined,
      seats: Number.isFinite(seats) && seats > 0 ? Math.floor(seats) : undefined,
    });
  }

  return out;
}

/** Minimal RFC 4180 split: honours quoted cells containing commas. */
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

/**
 * Seats for the whole room, not one company.
 *
 * cohorts.seat_limit defaults to 12 and the enrol route enforces it inside a
 * loop, so an undersized limit does not fail loudly - it returns "full"
 * partway through a bulk enrol, having already seated some of the room. The
 * headroom is for the delegates who turn up without being on the list.
 */
export function suggestedSeatLimit(companies: CompanyRow[]): number {
  const stated = companies.reduce((total, c) => total + (c.seats ?? 0), 0);
  if (stated <= 0) return Math.max(12, companies.length * 4);
  return Math.min(500, Math.ceil(stated * 1.2) + 2);
}
