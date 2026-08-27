/**
 * Participant packs: shared rules for the cohort workspace.
 *
 * Files live in a private `cohort-workspace` bucket with no storage.objects
 * policies at all, so nothing but the service role can reach an object
 * directly. Every read is brokered by an API route that checks
 * `academy_can_read_material` and then mints a short-lived signed URL. In a
 * cohort holding several companies, a leaked object path would otherwise
 * cross a company boundary, and URL obscurity is not an access control.
 */

export const MATERIALS_BUCKET = "cohort-workspace";

/**
 * 50MB. These are handouts supporting a live session - slide decks,
 * worksheets, a reading pack. The platform records that training happened;
 * it is deliberately not video hosting or a SCORM player, and a cap is the
 * cheapest way to keep it that way.
 */
export const MAX_MATERIAL_BYTES = 50 * 1024 * 1024;

/** Work handed in. Smaller: a document, a photo of a whiteboard, a slide. */
export const MAX_SUBMISSION_BYTES = 25 * 1024 * 1024;

/**
 * What a trainer may hand out and a delegate may hand in.
 *
 * An allow-list rather than a block-list: this bucket is served back to
 * other people in the room, so "anything that is not an executable" is the
 * wrong default. Office formats, PDFs, images, plain text and archives cover
 * what actually changes hands in a classroom.
 */
export const ALLOWED_MATERIAL_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/msword",
  "application/vnd.ms-excel",
  "application/zip",
  "text/plain",
  "text/csv",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export function isAllowedMaterialType(mimeType: string): boolean {
  return (ALLOWED_MATERIAL_TYPES as readonly string[]).includes(mimeType);
}

/** How long a brokered download link stays valid, in seconds. */
export const SIGNED_URL_TTL = 300;

/**
 * Strip a filename down to something safe to put in a storage path.
 *
 * Storage keys are not a security boundary here - access is decided before a
 * URL is ever minted - but a path traversal or a stray slash still turns one
 * object into an unreachable or misfiled one.
 */
export function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 120);
  return cleaned || "file";
}

/**
 * Where an object lives. Prefixed by what it belongs to, so the bucket stays
 * legible when someone has to go looking in the Supabase console.
 */
export function materialStoragePath(
  scope: { cohortId?: string | null; courseId?: string | null },
  filename: string,
  unique: string
): string {
  const folder = scope.cohortId
    ? `cohorts/${scope.cohortId}`
    : `courses/${scope.courseId}`;
  return `${folder}/${unique}-${safeFilename(filename)}`;
}

export function submissionStoragePath(
  enrolmentId: string,
  filename: string,
  unique: string
): string {
  return `submissions/${enrolmentId}/${unique}-${safeFilename(filename)}`;
}

/** Human-readable size, for a list a trainer scans on a phone. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
