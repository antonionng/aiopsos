import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

/**
 * The ONE email a new signup receives: welcome and confirmation combined.
 * Supabase's own confirmation email is bypassed (the account is created via
 * admin.generateLink, which sends nothing), so this is both the greeting
 * and the activation step - the amber button IS the confirmation link.
 */
export function ConfirmWelcomeEmail({
  name,
  organisationName,
  confirmUrl,
}: {
  name: string;
  organisationName?: string | null;
  confirmUrl: string;
}) {
  const greeting = name?.split(" ")[0] || "Hi";

  return (
    <EmailShell
      heading={
        organisationName
          ? `${greeting}, welcome to ${organisationName} on Experrt.`
          : `${greeting}, welcome to Experrt.`
      }
    >
      <p style={emailStyles.paragraph}>
        One click and you are in: confirm your email address and you will land
        straight on your dashboard.
      </p>

      <p style={emailStyles.lastParagraph}>
        From there you can run a readiness assessment, see recommended
        training, and invite your team.
      </p>

      <a href={confirmUrl} style={emailStyles.button}>
        Confirm email and get started
      </a>

      <p style={{ ...emailStyles.paragraph, marginTop: "24px", fontSize: "12px" }}>
        If you did not create this account, you can ignore this email and
        nothing will happen.
      </p>
    </EmailShell>
  );
}

/** Branded password-reset email; the link comes from admin.generateLink. */
export function ResetPasswordEmail({
  resetUrl,
}: {
  resetUrl: string;
}) {
  return (
    <EmailShell heading="Reset your Experrt password">
      <p style={emailStyles.lastParagraph}>
        Someone - hopefully you - asked to reset the password for this
        account. The link below is valid once and expires shortly.
      </p>

      <a href={resetUrl} style={emailStyles.button}>
        Choose a new password
      </a>

      <p style={{ ...emailStyles.paragraph, marginTop: "24px", fontSize: "12px" }}>
        If this was not you, ignore this email - your password stays as it is.
      </p>
    </EmailShell>
  );
}
