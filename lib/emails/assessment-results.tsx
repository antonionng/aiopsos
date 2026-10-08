import * as React from "react";
import type { DimensionScores } from "../types";

interface AssessmentResultsEmailProps {
  name: string;
  scores: DimensionScores;
  overall: number;
  tierLabel: string;
  resultsUrl: string;
}

const LABELS: Record<keyof DimensionScores, string> = {
  confidence: "Confidence & Skills",
  practice: "Daily Practice",
  tools: "Tools & Access",
  responsible: "Responsible Use",
  culture: "Culture & Support",
};

export function AssessmentResultsEmail({
  name,
  scores,
  overall,
  tierLabel,
  resultsUrl,
}: AssessmentResultsEmailProps) {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        backgroundColor: "#201C29",
        color: "#FFFEFA",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "40px",
            color: "#ffffff",
          }}
        >
          Experrt
        </p>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: "0 0 8px",
            color: "#ffffff",
          }}
        >
          Your AI Maturity Results
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#D5C7FF",
            margin: "0 0 32px",
          }}
        >
          Hi {name}, here&apos;s a summary of your assessment.
        </p>

        {/* Overall score */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "16px",
            textAlign: "center" as const,
          }}
        >
          <p
            style={{
              fontSize: "42px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              margin: "0 0 4px",
            }}
          >
            {overall.toFixed(1)}
            <span style={{ fontSize: "18px", color: "#D5C7FF" }}> / 5</span>
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#D5C7FF",
              margin: 0,
            }}
          >
            {tierLabel}
          </p>
        </div>

        {/* Dimension scores */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "32px",
          }}
        >
          <tbody>
            {(Object.keys(scores) as (keyof DimensionScores)[]).map((dim) => (
              <tr key={dim}>
                <td
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "14px",
                    color: "#D5C7FF",
                  }}
                >
                  {LABELS[dim]}
                </td>
                <td
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ffffff",
                    textAlign: "right" as const,
                  }}
                >
                  {scores[dim].toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <a
          href={resultsUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#E4F477",
            color: "#201C29",
            fontSize: "14px",
            fontWeight: 600,
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          View Full Results
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "40px 0 20px",
          }}
        />

        <p
          style={{
            fontSize: "12px",
            color: "#BEB3D0",
            margin: 0,
          }}
        >
          Experrt. Stay curious. Get unstoppable.
        </p>
      </div>
    </div>
  );
}
