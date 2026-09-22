import * as React from "react";
import {
  EMAIL_BRAND,
  EMAIL_BRAND_FOREGROUND,
  EMAIL_CARD,
  EMAIL_CITRUS,
  EMAIL_FOOTER,
  EMAIL_INK,
  EMAIL_LINE,
  EMAIL_MUTED,
  EMAIL_PAPER,
  EMAIL_VIOLET,
  emailLogoUrl,
} from "@/lib/email-theme";

/**
 * Shared shell for every Experrt email.
 *
 * Cream paper, ink type, a citrus action and the live wordmark on an ink
 * header — the same pairing as www.experrt.com. Email clients ignore the
 * site's CSS, so the colours are inlined from lib/email-theme.ts.
 */

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

const styles = {
  page: {
    fontFamily,
    backgroundColor: EMAIL_PAPER,
    color: EMAIL_INK,
    padding: "32px 16px",
    margin: 0,
  },
  inner: {
    maxWidth: "560px",
    margin: "0 auto",
    backgroundColor: EMAIL_CARD,
    border: `1px solid ${EMAIL_LINE}`,
    borderRadius: "16px",
    overflow: "hidden" as const,
  },
  header: {
    backgroundColor: EMAIL_INK,
    padding: "22px 32px",
  },
  logo: {
    display: "block" as const,
    height: "28px",
    width: "125px",
    border: 0,
  },
  accent: {
    height: "4px",
    backgroundColor: EMAIL_CITRUS,
    lineHeight: "4px",
    fontSize: "0",
  },
  body: {
    padding: "32px 32px 28px",
  },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "1.7px",
    fontWeight: 700,
    lineHeight: 1.5,
    color: EMAIL_VIOLET,
    margin: "0 0 12px",
    textTransform: "uppercase" as const,
  },
  heading: {
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
    margin: "0 0 16px",
    color: EMAIL_INK,
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: EMAIL_MUTED,
    margin: "0 0 8px",
  },
  lastParagraph: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: EMAIL_MUTED,
    margin: "0 0 32px",
  },
  strong: { color: EMAIL_INK },
  button: {
    display: "inline-block",
    backgroundColor: EMAIL_BRAND,
    color: EMAIL_BRAND_FOREGROUND,
    fontSize: "14px",
    fontWeight: 600,
    padding: "13px 22px",
    borderRadius: "7px",
    textDecoration: "none",
  },
  buttonSecondary: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: EMAIL_INK,
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 22px",
    borderRadius: "7px",
    textDecoration: "none",
    border: `1px solid ${EMAIL_LINE}`,
  },
  rule: {
    border: "none",
    borderTop: `1px solid ${EMAIL_LINE}`,
    margin: "32px 0 16px",
  },
  footer: { fontSize: "12px", color: EMAIL_MUTED, margin: "0 0 4px", lineHeight: 1.5 },
  footerQuiet: { fontSize: "11px", color: "#77717d", margin: 0 },
  detailRow: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: EMAIL_INK,
    margin: "0 0 4px",
  },
  detailLabel: { color: EMAIL_MUTED },
  card: {
    backgroundColor: "#f7f6f3",
    borderRadius: "12px",
    padding: "20px 20px",
    margin: "0 0 24px",
    border: `1px solid ${EMAIL_LINE}`,
  },
  link: {
    color: EMAIL_VIOLET,
    textDecoration: "underline",
  },
  score: {
    fontSize: "48px",
    fontWeight: 700,
    letterSpacing: "-0.04em",
    color: EMAIL_INK,
    margin: "0 0 6px",
    lineHeight: 1,
  },
  scoreMark: {
    backgroundColor: EMAIL_CITRUS,
    color: EMAIL_INK,
    padding: "0 8px",
    borderRadius: "6px",
  },
  scoreDenom: {
    fontSize: "18px",
    color: EMAIL_MUTED,
    fontWeight: 500,
  },
} as const;

export const emailStyles = styles;

export function DetailRows({
  rows,
}: {
  rows: Array<{ label: string; value: React.ReactNode } | null | false | undefined>;
}) {
  const visible = rows.filter(
    (row): row is { label: string; value: React.ReactNode } => Boolean(row)
  );

  return (
    <div style={styles.card}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {visible.map((row, i) => (
            <tr key={row.label}>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "13px",
                  color: EMAIL_MUTED,
                  borderTop: i === 0 ? "none" : `1px solid ${EMAIL_LINE}`,
                }}
              >
                {row.label}
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: EMAIL_INK,
                  textAlign: "right" as const,
                  borderTop: i === 0 ? "none" : `1px solid ${EMAIL_LINE}`,
                }}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
  eyebrow,
  children,
  footerNote,
  orgLogoUrl,
  orgName,
}: {
  heading: string;
  eyebrow?: string;
  children: React.ReactNode;
  footerNote?: string;
  /** Optional organisation mark, shown under the Experrt wordmark. */
  orgLogoUrl?: string;
  orgName?: string;
}) {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <img
            src={emailLogoUrl()}
            alt="Experrt"
            width={125}
            height={28}
            style={styles.logo}
          />
        </div>
        <div style={styles.accent}>&nbsp;</div>
        <div style={styles.body}>
          {orgLogoUrl ? (
            <img
              src={orgLogoUrl}
              alt={orgName || "Organisation"}
              style={{
                height: "32px",
                maxWidth: "180px",
                objectFit: "contain" as const,
                marginBottom: "24px",
                display: "block",
              }}
            />
          ) : null}
          {eyebrow ? <p style={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 style={styles.heading}>{heading}</h1>
          {children}
          <hr style={styles.rule} />
          <p style={styles.footer}>{footerNote ?? EMAIL_FOOTER}</p>
          <p style={styles.footerQuiet}>Keep learning. Keep moving.</p>
        </div>
      </div>
    </div>
  );
}
