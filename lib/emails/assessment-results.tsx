import * as React from "react";
import type { DimensionScores } from "../types";
import { EmailShell, emailStyles } from "./academy-shell";
import { EMAIL_LINE, EMAIL_MUTED, EMAIL_INK } from "@/lib/email-theme";

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
    <EmailShell heading="Your learning priorities" eyebrow="Assessment results">
      <p style={emailStyles.lastParagraph}>
        Hi {name}, here is a summary of what you shared.
      </p>

      <div style={{ ...emailStyles.card, textAlign: "center" as const }}>
        <p style={emailStyles.score}>
          <span style={emailStyles.scoreMark}>{overall.toFixed(1)}</span>
          <span style={emailStyles.scoreDenom}> / 5</span>
        </p>
        <p style={{ fontSize: "14px", fontWeight: 600, color: EMAIL_MUTED, margin: 0 }}>
          {tierLabel}
        </p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
        <tbody>
          {(Object.keys(scores) as (keyof DimensionScores)[]).map((dim) => (
            <tr key={dim}>
              <td
                style={{
                  padding: "12px 0",
                  borderBottom: `1px solid ${EMAIL_LINE}`,
                  fontSize: "14px",
                  color: EMAIL_MUTED,
                }}
              >
                {LABELS[dim]}
              </td>
              <td
                style={{
                  padding: "12px 0",
                  borderBottom: `1px solid ${EMAIL_LINE}`,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: EMAIL_INK,
                  textAlign: "right" as const,
                }}
              >
                {scores[dim].toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <a href={resultsUrl} style={emailStyles.button}>
        View full results
      </a>
    </EmailShell>
  );
}
