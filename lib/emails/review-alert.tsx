import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

export function ReviewAlertEmail({
  courseTitle,
  displayName,
  email,
  rating,
  body,
  hideUrl,
  pageUrl,
}: {
  courseTitle: string;
  displayName: string;
  email: string;
  rating: number;
  body: string;
  hideUrl: string | null;
  pageUrl: string;
}) {
  return (
    <EmailShell heading={`New review: ${courseTitle}`} footerNote="Sent by Experrt.">
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>From: </span>
        {displayName} &lt;{email}&gt;
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Rating: </span>
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </p>
      <p style={{ ...emailStyles.paragraph, marginTop: "16px", whiteSpace: "pre-wrap" as const }}>
        {body}
      </p>
      <p style={emailStyles.lastParagraph}>
        It is live on the course page now. If it breaks the rules for reviews, hide it with the
        button below. Hiding does not tell the learner.
      </p>
      <a href={pageUrl} style={emailStyles.button}>
        See it on the course page
      </a>
      {hideUrl ? (
        <p style={{ ...emailStyles.lastParagraph, marginTop: "16px" }}>
          <a href={hideUrl}>Hide this review</a>
        </p>
      ) : null}
    </EmailShell>
  );
}
