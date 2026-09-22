import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";
import type { SelfServeNudgeKind } from "@/lib/self-serve/nudges";

export function SelfServeNudgeEmail({
  kind,
  courseTitle,
  learnUrl,
  passed,
  total,
}: {
  kind: SelfServeNudgeKind;
  courseTitle: string;
  learnUrl: string;
  passed: number;
  total: number;
}) {
  if (kind === "sign") {
    return (
      <EmailShell
        heading="The checks are done. The card is not signed."
        footerNote="This note is a reminder to finish the course you bought. It does not certify compliance with the EU AI Act or any other regulation."
      >
        <p style={emailStyles.paragraph}>
          Every check on <strong style={emailStyles.strong}>{courseTitle}</strong> has passed.
          Sign the prompt card with your name.
        </p>
        <p style={emailStyles.lastParagraph}>
          The record will name you and the card. It will not say that you are compliant with
          any regulation.
        </p>
        <a href={learnUrl} style={emailStyles.button}>
          Sign the card
        </a>
      </EmailShell>
    );
  }

  if (kind === "continue") {
    return (
      <EmailShell
        heading="The next check is still open."
        footerNote="This note is a reminder to finish the course you bought."
      >
        <p style={emailStyles.paragraph}>
          You have passed {passed} of {total} checks on{" "}
          <strong style={emailStyles.strong}>{courseTitle}</strong>. The next lesson stays
          locked until this check is right.
        </p>
        <p style={emailStyles.lastParagraph}>
          Open the course and finish the check in front of you. The link below is the same
          one from your receipt.
        </p>
        <a href={learnUrl} style={emailStyles.button}>
          Continue the course
        </a>
      </EmailShell>
    );
  }

  return (
    <EmailShell
      heading="Lesson one is still open."
      footerNote="This note is a reminder to start the course you bought."
    >
      <p style={emailStyles.paragraph}>
        Thank you for buying <strong style={emailStyles.strong}>{courseTitle}</strong>. A day
        has passed and the first check is still open.
      </p>
      <p style={emailStyles.lastParagraph}>
        Open the course, read the example, and complete the check. You cannot continue until
        that check is right.
      </p>
      <a href={learnUrl} style={emailStyles.button}>
        Open lesson one
      </a>
    </EmailShell>
  );
}
