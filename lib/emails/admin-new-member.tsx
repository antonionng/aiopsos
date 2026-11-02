import * as React from "react";
import { DetailRows, EmailShell, emailStyles } from "./academy-shell";

interface AdminNewMemberEmailProps {
  adminName: string;
  memberName: string;
  memberEmail: string;
  department?: string;
  orgName: string;
  teamUrl: string;
}

export function AdminNewMemberEmail({
  adminName,
  memberName,
  memberEmail,
  department,
  orgName,
  teamUrl,
}: AdminNewMemberEmailProps) {
  return (
    <EmailShell heading="New team member">
      <p style={emailStyles.lastParagraph}>
        Hi {adminName}, someone has joined {orgName} via an assessment link.
      </p>
      <DetailRows
        rows={[
          { label: "Name", value: memberName },
          { label: "Email", value: memberEmail },
          department ? { label: "Department", value: department } : null,
        ]}
      />
      <a href={teamUrl} style={emailStyles.button}>
        Manage team
      </a>
    </EmailShell>
  );
}
