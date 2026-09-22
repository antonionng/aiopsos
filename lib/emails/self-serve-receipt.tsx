import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

export function SelfServeReceiptEmail({
  courseTitle,
  amountGbp,
  learnUrl,
}: {
  courseTitle: string;
  amountGbp: number;
  learnUrl: string;
}) {
  return (
    <EmailShell
      heading={`Your place on ${courseTitle}`}
      footerNote="This receipt confirms payment for the course. It does not certify compliance with the EU AI Act or any other regulation."
    >
      <p style={emailStyles.paragraph}>
        Payment of <strong style={emailStyles.strong}>£{amountGbp.toFixed(2)}</strong> is
        confirmed. The price on the page is the amount charged. Open the course from the
        button below. The link is for you. Keep it.
      </p>
      <p style={emailStyles.lastParagraph}>
        Work through each lesson and complete the check before you continue. When every
        check has passed, sign the prompt card. The record will name you and the card. It
        will not say that you are compliant with any regulation.
      </p>
      <a href={learnUrl} style={emailStyles.button}>
        Open the course
      </a>
    </EmailShell>
  );
}
