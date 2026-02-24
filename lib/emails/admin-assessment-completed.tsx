import * as React from "react";

interface AdminAssessmentCompletedEmailProps {
  adminName: string;
  respondentName: string;
  respondentEmail: string;
  department?: string;
  overallScore: number;
  tierLabel: string;
  orgName: string;
  resultsUrl: string;
}

export function AdminAssessmentCompletedEmail({
  adminName,
  respondentName,
  respondentEmail,
  department,
  overallScore,
  tierLabel,
  orgName,
  resultsUrl,
}: AdminAssessmentCompletedEmailProps) {
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
          New Assessment Completed
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 24px",
          }}
        >
          Hi {adminName}, a new AI readiness assessment has been submitted for{" "}
          {orgName}.
        </p>

        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    color: "#888888",
                  }}
                >
                  Respondent
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    textAlign: "right" as const,
                  }}
                >
                  {respondentName}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    color: "#888888",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Email
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    textAlign: "right" as const,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {respondentEmail}
                </td>
              </tr>
              {department && (
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: "13px",
                      color: "#888888",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    Department
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#ffffff",
                      textAlign: "right" as const,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {department}
                  </td>
                </tr>
              )}
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    color: "#888888",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Overall Score
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#ffffff",
                    textAlign: "right" as const,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {overallScore.toFixed(1)} / 5
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    color: "#888888",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Maturity Tier
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    textAlign: "right" as const,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {tierLabel}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <a
          href={resultsUrl}
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
          View All Results
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
