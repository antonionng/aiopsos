import * as React from "react";

interface RoadmapReadyEmailProps {
  name: string;
  orgName: string;
  phaseCount: number;
  roadmapUrl: string;
}

export function RoadmapReadyEmail({
  name,
  orgName,
  phaseCount,
  roadmapUrl,
}: RoadmapReadyEmailProps) {
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
          Your 90-Day Roadmap is Ready
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 8px",
          }}
        >
          Hi {name}, your AI adoption roadmap for {orgName} has been generated.
        </p>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#888888",
            margin: "0 0 32px",
          }}
        >
          The roadmap includes {phaseCount} phases with tailored milestones and
          deliverables based on your assessment results.
        </p>

        <a
          href={roadmapUrl}
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
          View Roadmap
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
