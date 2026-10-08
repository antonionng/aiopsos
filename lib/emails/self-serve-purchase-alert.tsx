import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

function row(label: string, value: React.ReactNode) {
  return (
    <p style={emailStyles.detailRow}>
      <span style={emailStyles.detailLabel}>{label}: </span>
      {value}
    </p>
  );
}

export function SelfServePurchaseAlertEmail({
  email,
  name,
  courseTitle,
  amountGbp,
  paidAt,
  hasAccount,
  stripeSessionId,
}: {
  email: string;
  name?: string | null;
  courseTitle: string;
  amountGbp: number;
  paidAt?: string | null;
  hasAccount: boolean;
  stripeSessionId: string;
}) {
  const when = paidAt
    ? new Date(paidAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/London" })
    : "Just now";
  return (
    <EmailShell
      eyebrow="Owner alert · New sale"
      heading={`${name?.trim() || email} bought ${courseTitle}.`}
      footerNote="Sent to the Experrt owner inbox."
    >
      {row("Buyer", name?.trim() || "No name given at checkout")}
      {row("Email", email)}
      {row("Course", courseTitle)}
      {row("Paid", `£${amountGbp.toFixed(2)}`)}
      {row("When", `${when} (UK time)`)}
      {row(
        "Account",
        hasAccount
          ? "Already has an Experrt account on this email."
          : "No account yet. They will be asked to save a sign-in before lesson one."
      )}
      <p style={emailStyles.lastParagraph}>
        <span style={emailStyles.detailLabel}>Stripe session: </span>
        {stripeSessionId}
      </p>
      <a href={`mailto:${email}`} style={emailStyles.button}>
        Reply to the buyer
      </a>
    </EmailShell>
  );
}
