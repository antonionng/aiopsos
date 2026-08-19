import * as React from "react";
import { EmailShell, emailStyles, formatDateInZone } from "./academy-shell";

interface CohortEnrolmentEmailProps {
  recipientName: string;
  cohortTitle: string;
  courseTitle: string;
  startsOn: string | null;
  timezone: string;
  learningUrl: string;
}

export function CohortEnrolmentEmail({
  recipientName,
  cohortTitle,
  courseTitle,
  startsOn,
  timezone,
  learningUrl,
}: CohortEnrolmentEmailProps) {
  const greeting = recipientName || "Hi there";

  return (
    <EmailShell heading={`${greeting}, you have a place on ${courseTitle}.`}>
      <p style={emailStyles.paragraph}>
        You have been enrolled on{" "}
        <strong style={emailStyles.strong}>{cohortTitle}</strong>.
      </p>

      {startsOn && (
        <p style={emailStyles.paragraph}>
          It starts on{" "}
          <strong style={emailStyles.strong}>
            {formatDateInZone(startsOn, timezone)}
          </strong>{" "}
          ({timezone}).
        </p>
      )}

      <p style={emailStyles.paragraph}>
        The course is delivered live by a facilitator. Your session times, joining
        links and any work to submit are on your learning page.
      </p>

      <p style={emailStyles.lastParagraph}>
        Attendance is taken at each session, so please let your facilitator know
        in advance if you cannot make one.
      </p>

      <a href={learningUrl} style={emailStyles.button}>
        View your sessions
      </a>
    </EmailShell>
  );
}
