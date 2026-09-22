import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";
import { CoursePicks } from "./course-picks";
import { workNoun, type CoursePick } from "@/lib/self-serve/upsell";

export function SelfServeCompletedEmail({
  name,
  courseTitle,
  artefactTitle,
  certificateRef,
  verifyUrl,
  certificateUrl,
  linkedInUrl,
  picks = [],
  base,
}: {
  name: string;
  courseTitle: string;
  artefactTitle: string;
  certificateRef: string;
  verifyUrl: string;
  certificateUrl: string;
  linkedInUrl: string;
  picks?: CoursePick[];
  base: string;
}) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <EmailShell
      eyebrow="Course complete"
      heading={`Well done, ${first}. ${courseTitle} is complete.`}
      preheader={`Your signed record ${certificateRef} is live and can be verified by anyone.`}
      footerNote="The record confirms that you completed the course and signed your work. It does not certify compliance with the EU AI Act or any other regulation."
      after={
        <CoursePicks
          picks={picks}
          base={base}
          campaign="completed"
          heading="Build on what you have just learned"
          intro="These courses follow on from the one you have finished. Each one ends with its own assessment and signed record."
        />
      }
    >
      <p style={emailStyles.paragraph}>
        You passed every check, completed the assessment and signed your{" "}
        {workNoun(artefactTitle)}. Your record now has its own public page, so a manager, client
        or recruiter can confirm it without contacting us.
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
          <span style={emailStyles.detailLabel}>Record: </span>
          <strong style={emailStyles.strong}>{certificateRef}</strong>
        </p>
        <p style={{ ...emailStyles.detailRow, margin: 0 }}>
          <span style={emailStyles.detailLabel}>Verify at: </span>
          <a href={verifyUrl} style={{ color: "#FFFEFA" }}>
            {verifyUrl.replace(/^https?:\/\//, "")}
          </a>
        </p>
      </div>
      <p style={emailStyles.lastParagraph}>
        Add the record to your LinkedIn profile so it sits with your other qualifications, or
        download the certificate as a PDF from your certificate page.
      </p>
      <a href={linkedInUrl} style={emailStyles.button}>
        Add to LinkedIn
      </a>
      <p style={{ ...emailStyles.paragraph, marginTop: "20px" }}>
        <a href={certificateUrl} style={{ color: "#FFFEFA" }}>
          Open your certificate
        </a>
      </p>
    </EmailShell>
  );
}

export function SelfServeCompletedAlertEmail({
  name,
  email,
  courseTitle,
  certificateRef,
  verifyUrl,
}: {
  name: string;
  email: string;
  courseTitle: string;
  certificateRef: string;
  verifyUrl: string;
}) {
  return (
    <EmailShell
      eyebrow="Owner alert"
      heading={`${name} completed ${courseTitle}.`}
      footerNote="Sent to the Experrt owner inbox."
    >
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Learner: </span>
        {name} ({email})
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Course: </span>
        {courseTitle}
      </p>
      <p style={emailStyles.lastParagraph}>
        <span style={emailStyles.detailLabel}>Record: </span>
        {certificateRef}
      </p>
      <a href={verifyUrl} style={emailStyles.button}>
        View the public record
      </a>
    </EmailShell>
  );
}
