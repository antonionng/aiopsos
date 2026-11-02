import * as React from "react";
import { EMAIL_CITRUS, EMAIL_INK, EMAIL_LINE, EMAIL_MUTED } from "@/lib/email-theme";
import { EmailShell, emailStyles } from "./academy-shell";

interface ScoreCardEmailProps {
  name: string;
  orgName: string;
  overallScore: number;
  tierLabel: string;
  dimensions: {
    confidence: number;
    practice: number;
    tools: number;
    responsible: number;
    culture: number;
  };
  resultsUrl: string;
  shareUrl: string;
}

function DimensionBar({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 5) * 100);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
          marginBottom: "4px",
        }}
      >
        <span style={{ color: EMAIL_MUTED }}>{label}</span>
        <span style={{ color: EMAIL_INK, fontWeight: 600 }}>{score.toFixed(1)}</span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          backgroundColor: EMAIL_LINE,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "3px",
            backgroundColor: EMAIL_CITRUS,
          }}
        />
      </div>
    </div>
  );
}

export function ScoreCardEmail({
  name,
  orgName,
  overallScore,
  tierLabel,
  dimensions,
  resultsUrl,
  shareUrl,
}: ScoreCardEmailProps) {
  return (
    <EmailShell heading="Your AI readiness score" eyebrow="Learning check">
      <p style={emailStyles.lastParagraph}>
        Thanks for completing the assessment, {name}. Here is your breakdown
        from {orgName}.
      </p>
      <div style={{ ...emailStyles.card, textAlign: "center" as const }}>
        <p style={emailStyles.score}>
          <span style={emailStyles.scoreMark}>{overallScore.toFixed(1)}</span>
        </p>
        <p
          style={{
            fontSize: "14px",
            color: EMAIL_MUTED,
            margin: 0,
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
          }}
        >
          {tierLabel}
        </p>
      </div>
      <div style={{ marginBottom: "32px" }}>
        <DimensionBar label="Confidence & Skills" score={dimensions.confidence} />
        <DimensionBar label="Daily Practice" score={dimensions.practice} />
        <DimensionBar label="Tools & Access" score={dimensions.tools} />
        <DimensionBar label="Responsible Use" score={dimensions.responsible} />
        <DimensionBar label="Culture & Support" score={dimensions.culture} />
      </div>
      <a href={resultsUrl} style={{ ...emailStyles.button, marginRight: "12px" }}>
        View full results
      </a>
      <a href={shareUrl} style={emailStyles.buttonSecondary}>
        Share your score
      </a>
    </EmailShell>
  );
}
