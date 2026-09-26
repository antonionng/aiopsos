import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

const box = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "16px 18px",
  margin: "20px 0 24px",
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function TeamPurchaseEmail({
  name,
  courseTitle,
  seats,
  amountGbp,
  paidAt,
  placesExpire,
  manageUrl,
  base,
}: {
  name?: string | null;
  courseTitle: string;
  seats: number;
  amountGbp: number;
  paidAt?: string | null;
  placesExpire: Date | null;
  manageUrl: string;
  base: string;
}) {
  const first = name?.trim() ? name.trim().split(/\s+/)[0] : null;
  return (
    <EmailShell
      eyebrow="Payment confirmed"
      heading={`${first ? `Thank you, ${first}.` : "Thank you."} Your ${seats} places on ${courseTitle} are ready.`}
      preheader={`Invite your team from one page. Payment of £${amountGbp.toFixed(2)} is confirmed.`}
      footerNote="This receipt confirms payment for course places. It does not certify compliance with the EU AI Act or any other regulation."
    >
      <p style={emailStyles.paragraph}>
        Invite each person by email from your team page. They get their own sign-in, their own
        progress and their own signed record. You can see who has joined and who has finished.
      </p>
      <div style={box}>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Course: </span>
          {courseTitle}
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Places: </span>
          {seats}
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Paid: </span>£{amountGbp.toFixed(2)}
          {formatDate(paidAt) ? ` on ${formatDate(paidAt)}` : ""}
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Access: </span>
          12 months for each person, from the day they accept
        </p>
        {placesExpire ? (
          <p style={emailStyles.detailRow}>
            <span style={emailStyles.detailLabel}>Invite by: </span>
            {formatDate(placesExpire)}
          </p>
        ) : null}
      </div>
      <a href={manageUrl} style={emailStyles.button}>
        Invite your team
      </a>
      <p style={{ ...emailStyles.paragraph, marginTop: "24px" }}>
        Keep this email. The button opens your team page without a password. If you sign in to
        Experrt with this email address, the team also appears in My learning.
      </p>
      <p style={{ ...emailStyles.lastParagraph, fontSize: "12px" }}>
        All sales are final and no refunds are given, including for places that are not used. See
        the course terms of sale at {base}/course-terms. Sold by Neural Network AI FZ-LLC, trading as
        Experrt.
      </p>
    </EmailShell>
  );
}

export function TeamInviteEmail({
  inviteeName,
  buyerName,
  courseTitle,
  promise,
  hours,
  joinUrl,
}: {
  inviteeName?: string | null;
  buyerName?: string | null;
  courseTitle: string;
  promise: string;
  hours: string;
  joinUrl: string;
}) {
  const first = inviteeName?.trim() ? inviteeName.trim().split(/\s+/)[0] : null;
  const from = buyerName?.trim() || "Your organisation";
  return (
    <EmailShell
      eyebrow="You have a place"
      heading={`${first ? `${first}, ` : ""}${from} has given you a place on ${courseTitle}.`}
      preheader="Your place is paid for. Accept it to start your 12 months of access."
      footerNote="You are receiving this because someone bought a course place for you on Experrt."
    >
      <p style={emailStyles.paragraph}>{promise}</p>
      <div style={box}>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Course: </span>
          {courseTitle}
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Time: </span>
          {hours}, at your own pace
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Access: </span>
          12 months from the day you accept
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Cost to you: </span>
          nothing, it is already paid for
        </p>
      </div>
      <a href={joinUrl} style={emailStyles.button}>
        Accept your place
      </a>
      <p style={{ ...emailStyles.lastParagraph, marginTop: "24px" }}>
        When you finish, you sign your work and get a certificate with a public record you can add
        to LinkedIn.
      </p>
    </EmailShell>
  );
}
