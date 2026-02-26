import * as React from "react";
import { DIMENSION_LABELS, DIMENSIONS } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

interface AdminAssessmentCompletedEmailProps {
  adminName: string;
  respondentName: string;
  respondentEmail: string;
  department?: string;
  overallScore: number;
  tierLabel: string;
  orgName: string;
  resultsUrl: string;
  logoUrl?: string;
  dimensionScores?: DimensionScores;
  respondentRole?: string;
  toolsUsed?: string[];
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
  logoUrl,
  dimensionScores,
  respondentRole,
  toolsUsed,
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
        {/* Header branding — org logo or name */}
        <div style={{ marginBottom: "40px" }}>
          {logoUrl ? (
            <img src={logoUrl} alt={orgName} style={{ height: "32px", maxWidth: "180px", objectFit: "contain" }} />
          ) : (
            <p
              style={{
                fontSize: "16px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {orgName}
            </p>
          )}
        </div>

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
          New assessment completed for {orgName}
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 24px",
          }}
        >
          Hi {adminName}, here are the details for {respondentName}.
        </p>

        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid rgba(255,255,255,0.06)",
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
              {respondentRole && (
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: "13px",
                      color: "#888888",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    Role
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
                    {respondentRole}
                  </td>
                </tr>
              )}
              {toolsUsed && toolsUsed.length > 0 && (
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: "13px",
                      color: "#888888",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    Tools used
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
                    {toolsUsed.join(", ")}
                  </td>
                </tr>
              )}
              {dimensionScores &&
                DIMENSIONS.map((dim) => (
                  <tr key={dim}>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#888888",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {DIMENSION_LABELS[dim]}
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
                      {Number(dimensionScores[dim]).toFixed(1)} / 5
                    </td>
                  </tr>
                ))}
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
            fontSize: "15px",
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: "10px",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          View All Results →
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "40px 0 20px",
          }}
        />

        <p style={{ fontSize: "12px", color: "#444444", margin: 0, textAlign: "center" }}>
          Powered by AIOPSOS
        </p>
      </div>
    </div>
  );
}
