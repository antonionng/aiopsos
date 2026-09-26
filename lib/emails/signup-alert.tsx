import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

export function SignupAlertEmail({
  name,
  email,
  organisationName,
}: {
  name: string;
  email: string;
  organisationName?: string | null;
}) {
  return (
    <EmailShell
      eyebrow="Owner alert"
      heading={`${name || email} signed up to the AI LMS.`}
      footerNote="Sent to the Experrt owner inbox. The account is active once the email address is confirmed."
    >
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Name: </span>
        {name || "Not given"}
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Email: </span>
        {email}
      </p>
      <p style={emailStyles.lastParagraph}>
        <span style={emailStyles.detailLabel}>Organisation: </span>
        {organisationName || "Not given"}
      </p>
      <a href={`mailto:${email}`} style={emailStyles.button}>
        Reply to the new user
      </a>
    </EmailShell>
  );
}
