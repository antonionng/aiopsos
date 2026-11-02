import * as React from "react";
import { DIMENSION_LABELS, DIMENSIONS } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";
import { DetailRows, EmailShell, emailStyles } from "./academy-shell";

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
    <EmailShell
      heading={`New assessment completed for ${orgName}`}
      orgLogoUrl={logoUrl}
      orgName={orgName}
    >
      <p style={emailStyles.lastParagraph}>
        Hi {adminName}, here are the details for {respondentName}.
      </p>
      <DetailRows
        rows={[
          { label: "Respondent", value: respondentName },
          { label: "Email", value: respondentEmail },
          department ? { label: "Department", value: department } : null,
          respondentRole ? { label: "Role", value: respondentRole } : null,
          toolsUsed && toolsUsed.length > 0
            ? { label: "Tools used", value: toolsUsed.join(", ") }
            : null,
          ...(dimensionScores
            ? DIMENSIONS.map((dim) => ({
                label: DIMENSION_LABELS[dim],
                value: `${Number(dimensionScores[dim]).toFixed(1)} / 5`,
              }))
            : []),
          { label: "Overall score", value: `${overallScore.toFixed(1)} / 5` },
          { label: "Maturity tier", value: tierLabel },
        ]}
      />
      <a href={resultsUrl} style={emailStyles.button}>
        View all results
      </a>
    </EmailShell>
  );
}
