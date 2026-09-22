import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

export function SelfServeReceiptEmail({
  name,
  courseTitle,
  amountGbp,
  learnUrl,
  accountUrl,
  hasAccount,
}: {
  name?: string | null;
  courseTitle: string;
  amountGbp: number;
  learnUrl: string;
  accountUrl: string;
  hasAccount: boolean;
}) {
  const greeting = name?.trim() ? `Thank you, ${name.trim().split(/\s+/)[0]}.` : "Thank you.";
  return (
    <EmailShell
      heading={`${greeting} Your place on ${courseTitle} is open.`}
      footerNote="This receipt confirms payment for the course. It does not certify compliance with the EU AI Act or any other regulation."
    >
      <p style={emailStyles.paragraph}>
        Thank you for buying {courseTitle}. Payment of{" "}
        <strong style={emailStyles.strong}>£{amountGbp.toFixed(2)}</strong> is confirmed, and the
        price on the page is the amount we charged.
      </p>
      <p style={emailStyles.paragraph}>
        {hasAccount
          ? "The course is on your Experrt account. Sign in with this email address on any device and open My courses to carry on where you stopped."
          : "When you open the course, you will be asked to save a password on this email address. That is how you sign back in later, on this device or another, and find the course under My courses."}
      </p>
      <p style={emailStyles.lastParagraph}>
        Each lesson ends with a check, and you stay on the lesson until the check is right. When
        every check has passed, you sign the prompt card you wrote. The record names you and the
        card. It does not say that you are compliant with any regulation.
      </p>
      <a href={learnUrl} style={emailStyles.button}>
        Open the course
      </a>
      <p style={{ ...emailStyles.paragraph, marginTop: "24px" }}>
        You can also sign in at <a href={accountUrl} style={{ color: "#FFFEFA" }}>{accountUrl}</a>.
      </p>
    </EmailShell>
  );
}
