import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Audit trail for the events an auditor actually asks about.
 *
 * The bias here is towards recording *changes made after the fact*:
 * attendance edited once a session has ended, and grades changed after they
 * were first entered. Those are exactly what someone reviewing a funded
 * training claim looks for, so both carry the previous value.
 *
 * Writes go through the service-role client and never throw. An audit write
 * failing must not roll back the thing being audited - a lost log line is
 * recoverable, a half-applied register is not. Failures are logged instead.
 */

export const AUDIT_ACTIONS = {
  COHORT_CREATED: "cohort.created",
  COHORT_UPDATED: "cohort.updated",
  COHORT_CANCELLED: "cohort.cancelled",
  ENROLMENT_CREATED: "enrolment.created",
  ENROLMENT_UPDATED: "enrolment.updated",
  ENROLMENT_WITHDRAWN: "enrolment.withdrawn",
  ATTENDANCE_RECORDED: "attendance.recorded",
  /** Attendance changed after the session had already ended. */
  ATTENDANCE_AMENDED: "attendance.amended",
  GRADE_CREATED: "grade.created",
  /** A grade changed after it was first entered. */
  GRADE_AMENDED: "grade.amended",
  CERTIFICATE_ISSUED: "certificate.issued",
  CERTIFICATE_REVOKED: "certificate.revoked",
  EVIDENCE_PACK_GENERATED: "evidence_pack.generated",
  INVOICE_CREATED: "invoice.created",
  INVOICE_SENT: "invoice.sent",
  /** Money was acknowledged received - the event an auditor traces first. */
  INVOICE_MARKED_PAID: "invoice.marked_paid",
  INVOICE_VOIDED: "invoice.voided",
  BILLING_METHOD_CHANGED: "billing_method.changed",
  /** A super admin moved a wallet by hand, outside purchase/usage. */
  CREDITS_ADJUSTED: "credits.adjusted",
  /** Staff opened an individual's training record - itself a record. */
  MEMBER_RECORD_VIEWED: "member_record.viewed",
  /** Staff exported an individual's training record as PDF. */
  MEMBER_RECORD_EXPORTED: "member_record.exported",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export interface AuditEntry {
  orgId: string;
  userId: string | null;
  action: AuditAction;
  metadata?: Record<string, unknown>;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  if (!entry.orgId) return;

  const { error } = await supabaseAdmin.from("audit_logs").insert({
    org_id: entry.orgId,
    user_id: entry.userId,
    action: entry.action,
    metadata: entry.metadata ?? {},
  });

  if (error) {
    console.error(`audit: failed to record ${entry.action}`, error.message);
  }
}

/** Batches one action across many subjects, e.g. a whole register at once. */
export async function logAuditBatch(entries: AuditEntry[]): Promise<void> {
  const rows = entries
    .filter((e) => e.orgId)
    .map((e) => ({
      org_id: e.orgId,
      user_id: e.userId,
      action: e.action,
      metadata: e.metadata ?? {},
    }));

  if (rows.length === 0) return;

  const { error } = await supabaseAdmin.from("audit_logs").insert(rows);
  if (error) {
    console.error("audit: failed to record batch", error.message);
  }
}

/**
 * Shapes a before/after pair for an amendment. Only the fields that actually
 * changed are recorded, so the log stays readable when one field moves.
 */
export function diffForAudit(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): { changed: string[]; previous: Record<string, unknown>; next: Record<string, unknown> } {
  const changed: string[] = [];
  const previous: Record<string, unknown> = {};
  const next: Record<string, unknown> = {};

  for (const key of Object.keys(after)) {
    if (before[key] !== after[key]) {
      changed.push(key);
      previous[key] = before[key] ?? null;
      next[key] = after[key] ?? null;
    }
  }

  return { changed, previous, next };
}
