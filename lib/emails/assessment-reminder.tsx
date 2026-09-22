import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface AssessmentReminderEmailProps {
  recipientName: string;
  orgName: string;
  assessmentTitle: string;
  assessUrl: string;
  completedCount: number;
  totalInvited: number;
}

export function AssessmentReminderEmail({
  recipientName,
  orgName,
  assessmentTitle,
  assessUrl,
  completedCount,
  totalInvited,
}: AssessmentReminderEmailProps) {
  const greeting = recipientName || "Hi there";
  const socialProof =
    completedCount > 0
      ? `${completedCount} of ${totalInvited} colleagues have already shared their input.`
      : "Be one of the first to contribute your perspective.";

  return (
    <EmailShell
      heading={`Friendly reminder, ${greeting}.`}
      footerNote={`Sent by ${orgName} via Experrt.`}
    >
      <p style={emailStyles.paragraph}>
        You haven&apos;t completed the{" "}
        <strong style={emailStyles.strong}>{assessmentTitle}</strong> for{" "}
        {orgName} yet.
      </p>
      <p style={emailStyles.paragraph}>{socialProof}</p>
      <p style={emailStyles.lastParagraph}>
        It only takes <strong style={emailStyles.strong}>5 minutes</strong>,
        and your input shapes where the team learns next.
      </p>
      <a href={assessUrl} style={emailStyles.button}>
        Complete assessment
      </a>
    </EmailShell>
  );
}
