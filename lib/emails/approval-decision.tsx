import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface ApprovalDecisionEmailProps {
  requesterName: string;
  reviewerName: string;
  decision: "approved" | "rejected";
  comment?: string;
  dashboardUrl: string;
}

export function ApprovalDecisionEmail({
  requesterName,
  reviewerName,
  decision,
  comment,
  dashboardUrl,
}: ApprovalDecisionEmailProps) {
  const isApproved = decision === "approved";

  return (
    <EmailShell heading={isApproved ? "Request approved" : "Request declined"}>
      <p style={emailStyles.lastParagraph}>
        Hi {requesterName}, {reviewerName} has{" "}
        {isApproved ? "approved" : "declined"} your request.
      </p>
      <div
        style={{
          ...emailStyles.card,
          borderLeft: `3px solid ${isApproved ? "#0f766e" : "#ae4326"}`,
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: isApproved ? "#0f766e" : "#ae4326",
            margin: 0,
          }}
        >
          {isApproved ? "Approved" : "Declined"}
        </p>
        {comment ? (
          <p style={{ ...emailStyles.paragraph, margin: "8px 0 0" }}>
            &ldquo;{comment}&rdquo;
          </p>
        ) : null}
      </div>
      <a href={dashboardUrl} style={emailStyles.button}>
        Go to your dashboard
      </a>
    </EmailShell>
  );
}
