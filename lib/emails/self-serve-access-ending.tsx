import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

export function SelfServeAccessEndingEmail({
  name,
  courseTitle,
  endsOn,
  kind,
  passed,
  total,
  learnUrl,
  renewUrl,
  priceGbp,
}: {
  name?: string | null;
  courseTitle: string;
  endsOn: string;
  kind: "month" | "week";
  passed: number;
  total: number;
  learnUrl: string;
  renewUrl: string;
  priceGbp: number;
}) {
  const first = name?.trim() ? name.trim().split(/\s+/)[0] : null;
  const left = Math.max(0, total - passed);
  const when = kind === "week" ? "in a week" : "in a month";
  return (
    <EmailShell
      eyebrow={kind === "week" ? "One week left" : "One month left"}
      heading={`${first ? `${first}, your` : "Your"} access to ${courseTitle} ends ${when}.`}
      preheader={`Access ends on ${endsOn}. ${left ? `${left} lesson${left === 1 ? "" : "s"} to go.` : "Sign your record to finish."}`}
      footerNote="You are receiving this because you bought a course on Experrt. It is a service email about your access."
    >
      <p style={emailStyles.paragraph}>
        Your 12 months of access end on <strong style={emailStyles.strong}>{endsOn}</strong>.{" "}
        {passed > 0
          ? `You have passed ${passed} of ${total} lessons${left ? `, so ${left} to go` : ", so all that is left is to sign your record"}.`
          : "You have not started yet, and the course takes an afternoon or two."}{" "}
        Finish and sign before then and your certificate stays yours for good.
      </p>
      <a href={learnUrl} style={{ ...emailStyles.button, margin: "16px 0 24px" }}>
        {passed > 0 ? "Carry on where you stopped" : "Start the course"}
      </a>
      <p style={emailStyles.lastParagraph}>
        Need longer? You can buy another 12 months for £{priceGbp} once access ends, and every lesson
        you have passed carries over: <a href={renewUrl}>{renewUrl.replace(/^https?:\/\//, "")}</a>
      </p>
    </EmailShell>
  );
}
