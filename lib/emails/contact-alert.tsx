import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface ContactAlertEmailProps {
  name: string;
  email: string;
  organisation?: string;
  message: string;
}

/**
 * The contact-form alert to us, on the same shell as every other Experrt
 * email. Everything needed to reply without opening anything else.
 */
export function ContactAlertEmail({
  name,
  email,
  organisation,
  message,
}: ContactAlertEmailProps) {
  return (
    <EmailShell heading={`Contact form: ${name}`} footerNote="Sent by Experrt.">
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>From: </span>
        {name} &lt;{email}&gt;
      </p>
      {organisation ? (
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Organisation: </span>
          {organisation}
        </p>
      ) : null}

      <p style={{ ...emailStyles.lastParagraph, marginTop: "16px", whiteSpace: "pre-wrap" as const }}>
        {message}
      </p>

      <a href={`mailto:${email}`} style={emailStyles.button}>
        Reply to {name.split(" ")[0] || "them"}
      </a>
    </EmailShell>
  );
}
