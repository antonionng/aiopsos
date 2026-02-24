import * as React from "react";

interface AssessmentInviteEmailProps {
  recipientName: string;
  orgName: string;
  assessmentTitle: string;
  assessUrl: string;
}

export function AssessmentInviteEmail({
  recipientName,
  orgName,
  assessmentTitle,
  assessUrl,
}: AssessmentInviteEmailProps) {
  const greeting = recipientName || "Hi there";

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        backgroundColor: "#0d0d0d",
        color: "#ececec",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "40px",
            color: "#ffffff",
          }}
        >
          AIOPSOS
        </p>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: "0 0 16px",
            color: "#ffffff",
          }}
        >
          {greeting}, we need your input.
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 8px",
          }}
        >
          {orgName} is measuring AI readiness across the organisation with
          the <strong style={{ color: "#cccccc" }}>{assessmentTitle}</strong>.
        </p>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 8px",
          }}
        >
          Your answers help shape our AI strategy and uncover where the biggest
          opportunities lie. It covers five dimensions: confidence, daily
          practice, tools, responsible use, and culture.
        </p>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 32px",
          }}
        >
          It takes about <strong style={{ color: "#cccccc" }}>5 minutes</strong>.
        </p>

        <a
          href={assessUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#ffffff",
            color: "#0d0d0d",
            fontSize: "14px",
            fontWeight: 600,
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Take Assessment
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "40px 0 20px",
          }}
        />

        <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>
          Sent by {orgName} via AIOPSOS — the enterprise AI control layer.
        </p>
      </div>
    </div>
  );
}
