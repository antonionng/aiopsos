import * as React from "react";
import { EmailShell, emailStyles, formatInZone } from "./academy-shell";

interface SessionReminderEmailProps {
  recipientName: string;
  sessionTitle: string;
  cohortTitle: string;
  startsAt: string;
  timezone: string;
  location: string | null;
  joinUrl: string | null;
  learningUrl: string;
}

export function SessionReminderEmail({
  recipientName,
  sessionTitle,
  cohortTitle,
  startsAt,
  timezone,
  location,
  joinUrl,
  learningUrl,
}: SessionReminderEmailProps) {
  const greeting = recipientName || "Hi there";

  return (
    <EmailShell heading={`${greeting}, ${sessionTitle} is tomorrow.`}>
      <p style={emailStyles.paragraph}>
        Part of <strong style={emailStyles.strong}>{cohortTitle}</strong>.
      </p>

      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>When: </span>
        {formatInZone(startsAt, timezone)}
      </p>

      {location && (
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Where: </span>
          {location}
        </p>
      )}

      <p style={emailStyles.lastParagraph}>
        Attendance is recorded for this session.
      </p>

      <a href={joinUrl || learningUrl} style={emailStyles.button}>
        {joinUrl ? "Join the session" : "View your sessions"}
      </a>
    </EmailShell>
  );
}
