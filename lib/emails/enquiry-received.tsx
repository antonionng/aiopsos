import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface EnquiryReceivedEmailProps {
  recipientName: string;
  courseTitle: string | null;
}

/** Confirmation to the person who enquired. */
export function EnquiryReceivedEmail({
  recipientName,
  courseTitle,
}: EnquiryReceivedEmailProps) {
  const greeting = recipientName || "Hi there";

  return (
    <EmailShell heading={`${greeting}, thanks — we have your enquiry.`}>
      <p style={emailStyles.paragraph}>
        {courseTitle
          ? `You asked about ${courseTitle}.`
          : "You asked about training for your team."}
      </p>

      <p style={emailStyles.paragraph}>
        A real person reads these. We will come back to you within one working
        day with dates, what the session would cover for your team specifically,
        and what it costs.
      </p>

      <p style={emailStyles.lastParagraph}>
        If it is easier to talk it through, just reply to this email.
      </p>
    </EmailShell>
  );
}

interface EnquiryAlertEmailProps {
  name: string;
  email: string;
  organisationName: string;
  courseTitle: string | null;
  seats: number | null;
  message: string;
  source: string;
}

/** The alert to us. Everything needed to reply without opening the dashboard. */
export function EnquiryAlertEmail({
  name,
  email,
  organisationName,
  courseTitle,
  seats,
  message,
  source,
}: EnquiryAlertEmailProps) {
  return (
    <EmailShell
      heading={courseTitle ? `Enquiry: ${courseTitle}` : "New training enquiry"}
      footerNote="Sent by Experrt."
    >
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>From: </span>
        {name} &lt;{email}&gt;
      </p>
      {organisationName && (
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Organisation: </span>
          {organisationName}
        </p>
      )}
      {seats !== null && (
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Approximate seats: </span>
          {seats}
        </p>
      )}
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Came from: </span>
        {source.replace(/_/g, " ")}
      </p>

      {message && (
        <p style={{ ...emailStyles.lastParagraph, marginTop: "16px" }}>
          {message}
        </p>
      )}

      <a href={`mailto:${email}`} style={emailStyles.button}>
        Reply to {name.split(" ")[0] || "them"}
      </a>
    </EmailShell>
  );
}
