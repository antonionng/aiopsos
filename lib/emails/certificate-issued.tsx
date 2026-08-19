import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface CertificateIssuedEmailProps {
  recipientName: string;
  courseTitle: string;
  attendancePct: number;
  gradePct: number | null;
  verifyUrl: string;
  disclaimer: string;
}

export function CertificateIssuedEmail({
  recipientName,
  courseTitle,
  attendancePct,
  gradePct,
  verifyUrl,
  disclaimer,
}: CertificateIssuedEmailProps) {
  const greeting = recipientName || "Hi there";

  return (
    <EmailShell
      heading={`${greeting}, you have completed ${courseTitle}.`}
      footerNote={disclaimer}
    >
      <p style={emailStyles.paragraph}>
        Your certificate of completion has been issued.
      </p>

      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Attendance: </span>
        {attendancePct}%
      </p>

      {gradePct !== null && (
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Grade: </span>
          {gradePct}%
        </p>
      )}

      <p style={emailStyles.lastParagraph}>
        The link below is public, so an employer or auditor can check the
        certificate without needing an account.
      </p>

      <a href={verifyUrl} style={emailStyles.button}>
        View and verify
      </a>
    </EmailShell>
  );
}
