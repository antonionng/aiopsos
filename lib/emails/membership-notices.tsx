import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  user: "Member",
};

export function roleLabel(role: string): string {
  return ROLE_LABEL[role] ?? role;
}

export function RoleChangedEmail({
  name,
  orgName,
  role,
  dashboardUrl,
}: {
  name: string;
  orgName: string;
  role: string;
  dashboardUrl: string;
}) {
  const greeting = name?.split(" ")[0] || "Hi";
  return (
    <EmailShell heading={`${greeting}, your role in ${orgName} has changed`}>
      <p style={emailStyles.paragraph}>
        You are now a <strong style={emailStyles.strong}>{roleLabel(role)}</strong> on Experrt.
      </p>
      <p style={emailStyles.lastParagraph}>
        Sign in to see the tools that come with that role.
      </p>
      <a href={dashboardUrl} style={emailStyles.button}>
        Open Experrt
      </a>
    </EmailShell>
  );
}

export function MemberRemovedEmail({
  name,
  orgName,
}: {
  name: string;
  orgName: string;
}) {
  const greeting = name?.split(" ")[0] || "Hi";
  return (
    <EmailShell heading={`${greeting}, your access to ${orgName} has ended`}>
      <p style={emailStyles.paragraph}>
        An admin removed you from <strong style={emailStyles.strong}>{orgName}</strong> on
        Experrt. You will not be able to sign in to that workspace.
      </p>
      <p style={emailStyles.lastParagraph}>
        If this was a surprise, reply to this email and we will help you sort it out.
      </p>
    </EmailShell>
  );
}

export function CohortCancelledEmail({
  recipientName,
  cohortTitle,
  learningUrl,
}: {
  recipientName: string;
  cohortTitle: string;
  learningUrl: string;
}) {
  const greeting = recipientName || "Hi there";
  return (
    <EmailShell heading={`${greeting}, ${cohortTitle} has been cancelled`}>
      <p style={emailStyles.paragraph}>
        You no longer need to attend{" "}
        <strong style={emailStyles.strong}>{cohortTitle}</strong>. Session reminders for it will
        stop.
      </p>
      <p style={emailStyles.lastParagraph}>
        Anything you have already completed stays on your learning record.
      </p>
      <a href={learningUrl} style={emailStyles.button}>
        View your learning
      </a>
    </EmailShell>
  );
}

export function CertificateRevokedEmail({
  recipientName,
  courseTitle,
  verifyUrl,
  reason,
}: {
  recipientName: string;
  courseTitle: string;
  verifyUrl: string;
  reason?: string;
}) {
  const greeting = recipientName || "Hi there";
  return (
    <EmailShell
      heading={`${greeting}, your certificate for ${courseTitle} has been withdrawn`}
      footerNote="A withdrawn certificate should no longer be relied on. The public link now says so."
    >
      <p style={emailStyles.paragraph}>
        The certificate of completion for{" "}
        <strong style={emailStyles.strong}>{courseTitle}</strong> has been withdrawn. Anyone who
        opens the verification link will see that it is no longer valid.
      </p>
      {reason ? (
        <p style={emailStyles.paragraph}>
          Note: {reason}
        </p>
      ) : null}
      <p style={emailStyles.lastParagraph}>
        If you think this was a mistake, reply to this email.
      </p>
      <a href={verifyUrl} style={emailStyles.button}>
        View the verification page
      </a>
    </EmailShell>
  );
}
