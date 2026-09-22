import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface InviteEmailProps {
  name: string;
  inviterName: string;
  loginUrl: string;
}

export function InviteEmail({ name, inviterName, loginUrl }: InviteEmailProps) {
  return (
    <EmailShell heading={`You're invited, ${name}.`}>
      <p style={emailStyles.paragraph}>
        {inviterName} has invited you to join their team on Experrt, the
        learning platform for courses, teams and progress.
      </p>
      <p style={emailStyles.lastParagraph}>
        Sign in to see your learning space and get started.
      </p>
      <a href={loginUrl} style={emailStyles.button}>
        Sign in
      </a>
    </EmailShell>
  );
}
