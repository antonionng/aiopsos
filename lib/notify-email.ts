/**
 * Where Experrt contact-form and course-enquiry alerts are delivered.
 *
 * NOTIFY_EMAIL can override this for preview or local work. A missing env
 * must still reach production ops at ag@experrt.com, not the From address
 * and not a leftover personal inbox.
 */
export const DEFAULT_NOTIFY_EMAIL = "ag@experrt.com";

export function getNotifyEmail(): string {
  const configured = process.env.NOTIFY_EMAIL?.trim();
  if (!configured) return DEFAULT_NOTIFY_EMAIL;
  if (configured.toLowerCase().endsWith("@kumohr.com")) {
    return DEFAULT_NOTIFY_EMAIL;
  }
  return configured;
}
