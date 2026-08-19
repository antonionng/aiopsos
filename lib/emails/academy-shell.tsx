import * as React from "react";

/**
 * Shared shell for the academy emails.
 *
 * The existing transactional emails each repeat their inline styles, which is
 * fine for one-offs but would mean three more copies of the same 120 lines
 * here. This keeps the identical dark shell in one place; the styles are the
 * same values the older emails use, so nothing looks different in an inbox.
 */

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
    backgroundColor: "#0d0d0d",
    color: "#ececec",
    padding: "48px 24px",
  },
  inner: { maxWidth: "480px", margin: "0 auto" },
  brand: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: "40px",
    color: "#ffffff",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
    margin: "0 0 16px",
    color: "#ffffff",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#888888",
    margin: "0 0 8px",
  },
  lastParagraph: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#888888",
    margin: "0 0 32px",
  },
  strong: { color: "#cccccc" },
  button: {
    display: "inline-block",
    backgroundColor: "#ffffff",
    color: "#0d0d0d",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
  },
  rule: {
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    margin: "40px 0 20px",
  },
  footer: { fontSize: "12px", color: "#555555", margin: 0 },
  detailRow: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#cccccc",
    margin: "0 0 4px",
  },
  detailLabel: { color: "#666666" },
} as const;

export const emailStyles = styles;

/**
 * Render an instant in the cohort's own timezone.
 *
 * Cohorts run across the UK, the GCC and Southeast Asia simultaneously and
 * can cross a DST boundary mid-course, so a reminder that renders in the
 * server's zone will tell somebody the wrong hour. The zone is always the
 * cohort's, never the reader's locale or the server's.
 */
export function formatInZone(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    // An invalid IANA name must not stop the email going out.
    return new Date(iso).toUTCString();
  }
}

export function formatDateInZone(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toDateString();
  }
}

export function EmailShell({
  heading,
  children,
  footerNote,
}: {
  heading: string;
  children: React.ReactNode;
  footerNote?: string;
}) {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <p style={styles.brand}>AIOPSOS</p>
        <h1 style={styles.heading}>{heading}</h1>
        {children}
        <hr style={styles.rule} />
        <p style={styles.footer}>
          {footerNote ??
            "Sent via AIOPSOS - workforce AI assessment, facilitated training, and the records that evidence it."}
        </p>
      </div>
    </div>
  );
}
