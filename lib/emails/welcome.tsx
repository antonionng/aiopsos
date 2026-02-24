import * as React from "react";
import type { DimensionScores } from "../types";

interface WelcomeEmailProps {
  name: string;
  orgName?: string;
  dashboardUrl: string;
  scores?: DimensionScores;
  overall?: number;
  tierLabel?: string;
  insights?: string[];
}

const LABELS: Record<keyof DimensionScores, string> = {
  confidence: "Confidence & Skills",
  practice: "Daily Practice",
  tools: "Tools & Access",
  responsible: "Responsible Use",
  culture: "Culture & Support",
};

export function WelcomeEmail({
  name,
  orgName,
  dashboardUrl,
  scores,
  overall,
  tierLabel,
  insights,
}: WelcomeEmailProps) {
  const hasScores = scores && overall !== undefined && tierLabel;
  const baseUrl = dashboardUrl.replace(/\/dashboard$/, "");

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        backgroundColor: "#0d0d0d",
        color: "#ececec",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <p
          style={{
            fontSize: "16px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "40px",
            color: "#ffffff",
          }}
        >
          AIOPSOS
        </p>

        {/* Welcome header */}
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: "0 0 8px",
            color: "#ffffff",
          }}
        >
          Welcome to AIOPSOS, {name.split(" ")[0]}.
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 32px",
          }}
        >
          {orgName
            ? `You've joined ${orgName} on AIOPSOS — the enterprise AI control layer. Here's everything you need to get started.`
            : "You're now on AIOPSOS — the enterprise AI control layer. Here's everything you need to get started."}
        </p>

        {/* Score section — only if assessment data is available */}
        {hasScores && (
          <>
            {/* Overall score card */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "16px",
                textAlign: "center" as const,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  color: "#666666",
                  margin: "0 0 12px",
                }}
              >
                Your AI Readiness Score
              </p>
              <p
                style={{
                  fontSize: "52px",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                  margin: "0 0 6px",
                  lineHeight: 1,
                }}
              >
                {overall!.toFixed(1)}
                <span style={{ fontSize: "20px", color: "#666666" }}> / 5</span>
              </p>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  marginTop: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#cccccc",
                    margin: 0,
                  }}
                >
                  {tierLabel}
                </p>
              </div>
            </div>

            {/* Dimension breakdown */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  color: "#666666",
                  margin: "0 0 16px",
                }}
              >
                Dimension Breakdown
              </p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {(Object.keys(scores!) as (keyof DimensionScores)[]).map((dim, i) => (
                    <tr key={dim}>
                      <td
                        style={{
                          padding: "10px 0",
                          borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          fontSize: "14px",
                          color: "#aaaaaa",
                        }}
                      >
                        {LABELS[dim]}
                      </td>
                      <td
                        style={{
                          padding: "10px 0",
                          borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#ffffff",
                          textAlign: "right" as const,
                        }}
                      >
                        {scores![dim].toFixed(1)}
                        <span style={{ color: "#666666", fontWeight: 400 }}> / 5</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Insights */}
            {insights && insights.length > 0 && (
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "32px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                    color: "#666666",
                    margin: "0 0 16px",
                  }}
                >
                  Key Insights
                </p>
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: i < insights.length - 1 ? "12px" : "0",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        marginTop: "7px",
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.5,
                        color: "#aaaaaa",
                        margin: 0,
                      }}
                    >
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* What to do next */}
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: "0 0 20px",
            }}
          >
            What to do next
          </p>

          {[
            {
              step: "1",
              title: "Explore your dashboard",
              desc: "See personalised recommendations and your full results breakdown.",
              url: `${baseUrl}/dashboard`,
            },
            {
              step: "2",
              title: "Generate your AI policy",
              desc: "Create a compliant AI usage policy tailored to your organisation.",
              url: `${baseUrl}/dashboard/settings`,
            },
            {
              step: "3",
              title: "Invite your team",
              desc: "Benchmark AI readiness across your organisation and track progress.",
              url: `${baseUrl}/dashboard/links`,
            },
          ].map(({ step, title, desc, url }) => (
            <a
              key={step}
              href={url}
              style={{
                display: "block",
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "8px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  {step}
                </span>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#ffffff",
                      margin: "0 0 2px",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.5,
                      color: "#777777",
                      margin: 0,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA button */}
        <div style={{ textAlign: "center" as const, marginBottom: "40px" }}>
          <a
            href={dashboardUrl}
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
            Go to Your Dashboard →
          </a>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "0 0 20px",
          }}
        />

        <p
          style={{
            fontSize: "12px",
            color: "#444444",
            margin: 0,
            textAlign: "center" as const,
          }}
        >
          AIOPSOS — The enterprise AI control layer.
        </p>
      </div>
    </div>
  );
}
