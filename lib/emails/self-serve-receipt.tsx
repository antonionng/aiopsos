import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";
import { CoursePicks } from "./course-picks";
import { workNoun, type CoursePick } from "@/lib/self-serve/upsell";
import { accessEndsAt } from "@/lib/self-serve/entitlement";

export function SelfServeReceiptEmail({
  name,
  courseTitle,
  amountGbp,
  learnUrl,
  accountUrl,
  hasAccount,
  artefactTitle,
  paidAt,
  picks = [],
  base,
}: {
  name?: string | null;
  courseTitle: string;
  amountGbp: number;
  learnUrl: string;
  accountUrl: string;
  hasAccount: boolean;
  artefactTitle?: string | null;
  paidAt?: string | null;
  picks?: CoursePick[];
  base: string;
}) {
  const greeting = name?.trim() ? `Thank you, ${name.trim().split(/\s+/)[0]}.` : "Thank you.";
  const finalWork = workNoun(artefactTitle);
  const when = paidAt
    ? new Date(paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const ends = accessEndsAt(paidAt);
  const until = ends
    ? ends.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;
  return (
    <EmailShell
      eyebrow="Payment confirmed"
      heading={`${greeting} Your place on ${courseTitle} is open.`}
      preheader={`Payment of £${amountGbp.toFixed(2)} is confirmed. Open the course whenever you are ready.`}
      footerNote="This receipt confirms payment for the course. It does not certify compliance with the EU AI Act or any other regulation."
      after={<CoursePicks picks={picks} base={base} campaign="receipt" />}
    >
      <p style={emailStyles.paragraph}>
        Thank you for choosing {courseTitle}. Your payment is confirmed and the course is ready for
        you now.
      </p>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "12px",
          padding: "16px 18px",
          margin: "20px 0 24px",
        }}
      >
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Course: </span>
          {courseTitle}
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Amount paid: </span>
          <strong style={emailStyles.strong}>£{amountGbp.toFixed(2)}</strong>
        </p>
        {when ? (
          <p style={emailStyles.detailRow}>
            <span style={emailStyles.detailLabel}>Date: </span>
            {when}
          </p>
        ) : null}
        <p style={{ ...emailStyles.detailRow, margin: 0 }}>
          <span style={emailStyles.detailLabel}>Access: </span>
          {until ? `12 months, until ${until}` : "12 months from payment"}
        </p>
      </div>
      <p style={emailStyles.paragraph}>
        {hasAccount
          ? "The course is saved to your Experrt account. Sign in with this email address on any device and open My courses to carry on where you stopped."
          : "When you open the course, you will be asked to save a password on this email address. That is how you sign back in later, on this device or another, and find the course under My courses."}
      </p>
      <p style={emailStyles.lastParagraph}>
        Each lesson ends with a check that gives feedback on your answer, and the next lesson opens
        once the check is right. The course finishes with an assessment and your {finalWork}, which
        you sign to receive a record anyone can verify online.
      </p>
      <a href={learnUrl} style={emailStyles.button}>
        Open the course
      </a>
      <p style={{ ...emailStyles.paragraph, marginTop: "24px" }}>
        You can also sign in at <a href={accountUrl} style={{ color: "#FFFEFA" }}>{accountUrl}</a>.
        Reply to this email if anything is not working and we will help.
      </p>
      <p style={{ ...emailStyles.paragraph, fontSize: "13px" }}>
        All sales are final and no refunds are given. Your purchase is covered by the course terms of
        sale at{" "}
        <a href={`${base}/course-terms`} style={{ color: "#FFFEFA" }}>
          {base.replace(/^https?:\/\//, "")}/course-terms
        </a>
        . Sold by Neural Network AI FZ-LLC, trading as Experrt.
      </p>
    </EmailShell>
  );
}
