import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface AssessmentInviteEmailProps {
  recipientName: string;
  orgName: string;
  assessmentTitle: string;
  assessUrl: string;
}

export function AssessmentInviteEmail({
  recipientName,
  orgName,
  assessmentTitle,
  assessUrl,
}: AssessmentInviteEmailProps) {
  const greeting = recipientName || "Hi there";

  return (
    <EmailShell
      heading={`${greeting}, we need your input.`}
      footerNote={`Sent by ${orgName} via Experrt.`}
    >
      <p style={emailStyles.paragraph}>
        {orgName} is looking at learning priorities across the organisation
        with the <strong style={emailStyles.strong}>{assessmentTitle}</strong>.
      </p>
      <p style={emailStyles.paragraph}>
        Your answers help show where to start: confidence, daily practice,
        tools, responsible use, and culture.
      </p>
      <p style={emailStyles.lastParagraph}>
        It takes about <strong style={emailStyles.strong}>5 minutes</strong>.
      </p>
      <a href={assessUrl} style={emailStyles.button}>
        Take the assessment
      </a>
    </EmailShell>
  );
}
