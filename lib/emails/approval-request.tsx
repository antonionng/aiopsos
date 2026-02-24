import * as React from "react";

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
          Approval Requested
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 24px",
          }}
        >
          Hi {reviewerName}, {requesterName} has submitted content for your
          review.
        </p>

        {contentPreview && (
          <div
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              borderLeft: "3px solid #888888",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                color: "#555555",
                margin: "0 0 8px",
              }}
            >
              Preview
            </p>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#bbbbbb",
                margin: 0,
              }}
            >
              {contentPreview.length > 200
                ? contentPreview.slice(0, 200) + "..."
                : contentPreview}
            </p>
          </div>
        )}

        <a
          href={approvalsUrl}
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
          Review Now
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "40px 0 20px",
          }}
        />

        <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>
          AIOPSOS -- The enterprise AI control layer.
        </p>
      </div>
    </div>
  );
}
