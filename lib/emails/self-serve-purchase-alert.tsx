import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

export function SelfServePurchaseAlertEmail({
  email,
  courseTitle,
  amountGbp,
  stripeSessionId,
}: {
  email: string;
  courseTitle: string;
  amountGbp: number;
  stripeSessionId: string;
}) {
  return (
    <EmailShell heading={`Self-serve purchase: ${courseTitle}`} footerNote="Sent by Experrt.">
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Buyer: </span>
        {email}
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Course: </span>
        {courseTitle}
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Paid: </span>
        £{amountGbp.toFixed(2)}
      </p>
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
