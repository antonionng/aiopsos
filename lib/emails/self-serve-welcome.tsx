import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";
import { CoursePicks } from "./course-picks";
import type { CoursePick } from "@/lib/self-serve/upsell";

export function SelfServeWelcomeEmail({
  name,
  email,
  courseTitle,
  accountUrl,
  picks = [],
  base,
}: {
  name?: string | null;
  email: string;
  courseTitle?: string | null;
  accountUrl: string;
  picks?: CoursePick[];
  base: string;
}) {
  const first = name?.trim().split(/\s+/)[0];
  return (
    <EmailShell
      eyebrow="Account created"
      heading={first ? `Welcome to Experrt, ${first}.` : "Welcome to Experrt."}
      preheader="Your sign-in is saved. Come back to your courses on any device."
      after={
        <CoursePicks
          picks={picks}
          base={base}
          campaign="welcome"
          heading="When you are ready for the next course"
        />
      }
    >
      <p style={emailStyles.paragraph}>
        Thank you for signing up. Your sign-in is saved on {email}. Use that email address and the
        password you chose to come back on any device.
      </p>
      <p style={emailStyles.lastParagraph}>
        {courseTitle
          ? `${courseTitle} is on your account. My courses shows each course you have bought, the lesson you stopped at, and your signed record when you finish.`
          : "My courses shows each course you have bought, the lesson you stopped at, and your signed record when you finish."}{" "}
        If you forget the password, choose Forgot password on the sign-in page and we will email you a
        link.
      </p>
      <a href={accountUrl} style={emailStyles.button}>
        Open My courses
      </a>
    </EmailShell>
  );
}

export function SelfServeAccountAlertEmail({
  name,
  email,
  courseTitle,
}: {
  name?: string | null;
  email: string;
  courseTitle?: string | null;
}) {
  return (
    <EmailShell
      eyebrow="Owner alert"
      heading={`${name?.trim() || email} created a learner account.`}
      footerNote="Sent to the Experrt owner inbox."
    >
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Name: </span>
        {name?.trim() || "Not given"}
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Email: </span>
        {email}
      </p>
      <p style={emailStyles.lastParagraph}>
        <span style={emailStyles.detailLabel}>Course: </span>
        {courseTitle ?? "None linked yet"}
      </p>
      <a href={`mailto:${email}`} style={emailStyles.button}>
        Reply to the learner
      </a>
    </EmailShell>
  );
}
