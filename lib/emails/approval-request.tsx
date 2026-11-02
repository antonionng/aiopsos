import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface ApprovalRequestEmailProps {
  reviewerName: string;
  requesterName: string;
  contentPreview: string;
  approvalsUrl: string;
}

export function ApprovalRequestEmail({
  reviewerName,
  requesterName,
  contentPreview,
  approvalsUrl,
}: ApprovalRequestEmailProps) {
  const preview =
    contentPreview.length > 200 ? `${contentPreview.slice(0, 200)}...` : contentPreview;

  return (
    <EmailShell heading="Approval requested">
      <p style={emailStyles.paragraph}>
        Hi {reviewerName}, {requesterName} has submitted something for you to
        review.
      </p>
      {preview ? (
        <div style={emailStyles.card}>
          <p style={{ ...emailStyles.eyebrow, marginBottom: "8px" }}>Preview</p>
          <p style={{ ...emailStyles.paragraph, margin: 0 }}>{preview}</p>
        </div>
      ) : null}
      <a href={approvalsUrl} style={emailStyles.button}>
        Review now
      </a>
    </EmailShell>
  );
}
