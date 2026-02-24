import * as React from "react";

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

function DimensionBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
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
        <span style={{ color: "#aaaaaa" }}>{label}</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          backgroundColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "3px",
            backgroundColor: "#ffffff",
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
          Your AI Readiness Score
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 24px",
          }}
        >
          Thanks for completing the assessment, {name}. Here&apos;s your
          breakdown from {orgName}.
        </p>

        {/* Score highlight */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "32px 24px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "56px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              margin: "0 0 4px",
              color: "#ffffff",
            }}
          >
            {overallScore.toFixed(1)}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#888888",
              margin: "0",
              textTransform: "uppercase" as const,
              letterSpacing: "0.05em",
            }}
          >
            {tierLabel}
          </p>
        </div>

        {/* Dimension bars */}
        <div style={{ marginBottom: "32px" }}>
          <DimensionBar label="Confidence & Skills" score={dimensions.confidence} />
          <DimensionBar label="Daily Practice" score={dimensions.practice} />
          <DimensionBar label="Tools & Access" score={dimensions.tools} />
          <DimensionBar label="Responsible Use" score={dimensions.responsible} />
          <DimensionBar label="Culture & Support" score={dimensions.culture} />
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <a
            href={resultsUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#ffffff",
              color: "#0d0d0d",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            View Full Results
          </a>
          <a
            href={shareUrl}
            style={{
              display: "inline-block",
              backgroundColor: "transparent",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Share Your Score
          </a>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "40px 0 20px",
          }}
        />

        <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>
          AIOPSOS — The enterprise AI control layer.
        </p>
      </div>
    </div>
  );
}
