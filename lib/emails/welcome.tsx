import * as React from "react";
import type { DimensionScores } from "../types";
import { EMAIL_INK, EMAIL_LINE, EMAIL_MUTED } from "@/lib/email-theme";
import { EmailShell, emailStyles } from "./academy-shell";

interface WelcomeEmailProps {
  name: string;
  orgName?: string;
  dashboardUrl: string;
  logoUrl?: string;
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
  logoUrl,
  scores,
  overall,
  tierLabel,
  insights,
}: WelcomeEmailProps) {
  const hasScores = scores && overall !== undefined && tierLabel;
  const baseUrl = dashboardUrl.replace(/\/dashboard$/, "");
  const firstName = name.split(" ")[0];

  const steps = [
    {
      step: "1",
      title: "Explore your dashboard",
      desc: "See recommendations and your full results.",
      url: `${baseUrl}/dashboard`,
    },
    {
      step: "2",
      title: "Generate your AI policy",
      desc: "Create a usage policy shaped around your organisation.",
      url: `${baseUrl}/dashboard/settings`,
    },
    {
      step: "3",
      title: "Invite your team",
      desc: "See readiness across the organisation and track progress.",
      url: `${baseUrl}/dashboard/links`,
    },
  ];

  return (
    <EmailShell
      heading={
        hasScores
          ? `Thanks for completing your assessment, ${firstName}`
          : orgName
            ? `Thanks for joining ${orgName}`
            : "Welcome to Experrt"
      }
      eyebrow={hasScores ? "Your learning check" : "You're in"}
      orgLogoUrl={logoUrl}
      orgName={orgName}
    >
      <p style={emailStyles.lastParagraph}>
        {hasScores
          ? orgName
            ? `Your results for ${orgName} are ready. Here is how you scored.`
            : "Your results are ready. Here is how you scored."
          : orgName
            ? `You're now part of ${orgName} on Experrt. Here is where to start.`
            : "You're on Experrt. Here is where to start."}
      </p>

      {hasScores && (
        <>
          <div style={{ ...emailStyles.card, textAlign: "center" as const }}>
            <p style={emailStyles.eyebrow}>Your score</p>
            <p style={emailStyles.score}>
              <span style={emailStyles.scoreMark}>{overall!.toFixed(1)}</span>
              <span style={emailStyles.scoreDenom}> / 5</span>
            </p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: EMAIL_INK, margin: "8px 0 0" }}>
              {tierLabel}
            </p>
          </div>

          <div style={emailStyles.card}>
            <p style={{ ...emailStyles.eyebrow, marginBottom: "12px" }}>Dimensions</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {(Object.keys(scores!) as (keyof DimensionScores)[]).map((dim, i, all) => (
                  <tr key={dim}>
                    <td
                      style={{
                        padding: "10px 0",
                        borderBottom: i < all.length - 1 ? `1px solid ${EMAIL_LINE}` : "none",
                        fontSize: "14px",
                        color: EMAIL_MUTED,
                      }}
                    >
                      {LABELS[dim]}
                    </td>
                    <td
                      style={{
                        padding: "10px 0",
                        borderBottom: i < all.length - 1 ? `1px solid ${EMAIL_LINE}` : "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: EMAIL_INK,
                        textAlign: "right" as const,
                      }}
                    >
                      {scores![dim].toFixed(1)}
                      <span style={{ color: EMAIL_MUTED, fontWeight: 400 }}> / 5</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {insights && insights.length > 0 && (
            <div style={emailStyles.card}>
              <p style={{ ...emailStyles.eyebrow, marginBottom: "12px" }}>What stood out</p>
              {insights.map((insight, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: EMAIL_MUTED,
                    margin: i < insights.length - 1 ? "0 0 10px" : 0,
                  }}
                >
                  {insight}
                </p>
              ))}
            </div>
          )}
        </>
      )}

      <p style={{ fontSize: "18px", fontWeight: 600, color: EMAIL_INK, margin: "0 0 12px" }}>
        What to do next
      </p>
      {steps.map(({ step, title, desc, url }) => (
        <a
          key={step}
          href={url}
          style={{
            display: "block",
            backgroundColor: "#f7f6f3",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "8px",
            textDecoration: "none",
            border: `1px solid ${EMAIL_LINE}`,
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: 600, color: EMAIL_INK, margin: "0 0 2px" }}>
            {step}. {title}
          </p>
          <p style={{ fontSize: "13px", lineHeight: 1.5, color: EMAIL_MUTED, margin: 0 }}>{desc}</p>
        </a>
      ))}

      <div style={{ marginTop: "24px" }}>
        <a href={dashboardUrl} style={emailStyles.button}>
          {hasScores ? "View your full results" : "Open your dashboard"}
        </a>
      </div>
    </EmailShell>
  );
}
