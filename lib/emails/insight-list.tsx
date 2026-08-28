import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

/**
 * The two emails behind the insights list.
 *
 * Neither of them sells a course. The list was offered as "one email when a
 * new insight goes up", and an email that arrives promising an article and
 * opens with a pitch is the fastest way to train people to unsubscribe.
 */

const linkStyle: React.CSSProperties = {
  color: "#cccccc",
  textDecoration: "underline",
};

const unsubscribeStyle: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: 1.6,
  color: "#555555",
  margin: "24px 0 0",
};

export function InsightConfirmEmail({ confirmUrl }: { confirmUrl: string }) {
  return (
    <EmailShell heading="One click and you are on the list">
      <p style={emailStyles.paragraph}>
        Someone, we assume you, asked for the Experrt insights list at this
        address. Confirm it and you will get one email when a new briefing goes
        up. Usually weekly, often less.
      </p>

      <p style={emailStyles.lastParagraph}>
        If it was not you, ignore this. Nothing is sent to an address that has
        not confirmed.
      </p>

      <a href={confirmUrl} style={emailStyles.button}>
        Confirm subscription
      </a>
    </EmailShell>
  );
}

export function InsightNewArticleEmail({
  title,
  dek,
  topic,
  readingMinutes,
  articleUrl,
  unsubscribeUrl,
}: {
  title: string;
  dek: string;
  topic: string;
  readingMinutes: number;
  articleUrl: string;
  unsubscribeUrl: string;
}) {
  return (
    <EmailShell heading={title}>
      <p style={emailStyles.paragraph}>{dek}</p>

      <p style={emailStyles.lastParagraph}>
        <span style={emailStyles.strong}>{topic}</span> &middot;{" "}
        {readingMinutes} min read
      </p>

      <a href={articleUrl} style={emailStyles.button}>
        Read the briefing
      </a>

      <p style={unsubscribeStyle}>
        You are getting this because you confirmed the Experrt insights list.{" "}
        <a href={unsubscribeUrl} style={linkStyle}>
          Unsubscribe
        </a>
        .
      </p>
    </EmailShell>
  );
}
