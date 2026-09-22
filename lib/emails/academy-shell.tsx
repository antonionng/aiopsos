import * as React from "react";
import { EMAIL_BRAND, EMAIL_BRAND_FOREGROUND } from "@/lib/email-theme";
import { getPublicSiteUrl } from "@/lib/site";

/**
 * Shared shell for Experrt transactional emails.
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
    backgroundColor: "#201C29",
    color: "#FFFEFA",
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
    color: "#D5C7FF",
    margin: "0 0 8px",
  },
  lastParagraph: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#D5C7FF",
    margin: "0 0 32px",
  },
  strong: { color: "#cccccc" },
  button: {
    display: "inline-block",
    backgroundColor: EMAIL_BRAND,
    color: EMAIL_BRAND_FOREGROUND,
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
  footer: { fontSize: "12px", color: "#BEB3D0", margin: 0 },
  detailRow: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#cccccc",
    margin: "0 0 4px",
  },
  detailLabel: { color: "#BEB3D0" },
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

const SITE = getPublicSiteUrl().replace(/\/$/, "");

const FOOTER_LINKS = [
  { label: "Courses", href: `${SITE}/learn` },
  { label: "My courses", href: `${SITE}/learn/my-courses` },
  { label: "Contact", href: `${SITE}/contact` },
];

/**
 * Hidden inbox preview text. Without it, clients show the first words of the
 * body, which for these emails is the logo's alt text.
 */
function Preheader({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "none",
        overflow: "hidden",
        lineHeight: "1px",
        opacity: 0,
        maxHeight: 0,
        maxWidth: 0,
      }}
    >
      {text}
    </div>
  );
}

export function EmailShell({
  heading,
  children,
  footerNote,
  preheader,
  eyebrow,
  after,
}: {
  heading: string;
  children: React.ReactNode;
  footerNote?: string;
  preheader?: string;
  eyebrow?: string;
  /** Rendered below the main card, above the footer. */
  after?: React.ReactNode;
}) {
  return (
    <div style={styles.page}>
      {preheader ? <Preheader text={preheader} /> : null}
      <div style={styles.inner}>
        <a href={SITE} style={{ display: "inline-block", marginBottom: "36px" }}>
          <img
            src={`${SITE}/experrt-logo.png`}
            alt="Experrt"
            width={120}
            height={27}
            style={{ display: "block", border: 0, color: "#ffffff", fontWeight: 700 }}
          />
        </a>
        <div style={{ height: "4px", width: "48px", backgroundColor: EMAIL_BRAND, borderRadius: "2px", marginBottom: "20px" }} />
        {eyebrow ? (
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: EMAIL_BRAND,
              margin: "0 0 10px",
            }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 style={styles.heading}>{heading}</h1>
        {children}
        {after}
        <hr style={styles.rule} />
        <p style={{ ...styles.footer, marginBottom: "12px" }}>
          {FOOTER_LINKS.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 ? <span style={{ color: "#5E5670" }}>{"  ·  "}</span> : null}
              <a href={link.href} style={{ color: "#FFFEFA", textDecoration: "none" }}>
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </p>
        <p style={styles.footer}>
          {footerNote ?? "Stay curious. Get unstoppable. Learning for people with big ideas."}
        </p>
        <p style={{ ...styles.footer, marginTop: "12px" }}>Experrt · experrt.com</p>
      </div>
    </div>
  );
}
