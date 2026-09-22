import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";
import { CoursePicks } from "./course-picks";
import type { SelfServeNudgeKind } from "@/lib/self-serve/nudges";
import { workNoun, type CoursePick } from "@/lib/self-serve/upsell";

export function SelfServeNudgeEmail({
  kind,
  courseTitle,
  learnUrl,
  passed,
  total,
  artefactTitle,
  name,
  picks = [],
  base,
  unsubscribeUrl,
}: {
  kind: SelfServeNudgeKind;
  courseTitle: string;
  learnUrl: string;
  passed: number;
  total: number;
  artefactTitle?: string | null;
  name?: string | null;
  picks?: CoursePick[];
  base: string;
  unsubscribeUrl?: string;
}) {
  const work = workNoun(artefactTitle);
  const first = name?.trim().split(/\s+/)[0];

  if (kind === "next") {
    const [lead, ...rest] = picks;
    return (
      <EmailShell
        eyebrow="Your next course"
        heading={first ? `${first}, here is where to go after ${courseTitle}.` : `Where to go after ${courseTitle}.`}
        preheader={lead ? `${lead.title} builds directly on what you have just finished.` : "A course that builds on the one you finished."}
        footerNote={
          unsubscribeUrl
            ? "You are receiving this because you completed a course with Experrt. We send one suggestion per finished course."
            : undefined
        }
        after={
          <>
            <CoursePicks
              picks={rest}
              base={base}
              campaign="next-course"
              heading="Also worth a look"
              intro="Other courses that sit well alongside the one you finished."
            />
            {unsubscribeUrl ? (
              <p style={{ ...emailStyles.footer, marginTop: "28px" }}>
                <a href={unsubscribeUrl} style={{ color: "#BEB3D0" }}>
                  Stop course suggestions
                </a>
              </p>
            ) : null}
          </>
        }
      >
        <p style={emailStyles.paragraph}>
          Three days ago you signed your {work} for <strong style={emailStyles.strong}>{courseTitle}</strong>.
          The learners who get the most from a course usually put it to work, then take the next step
          while the ideas are still fresh.
        </p>
        {lead ? (
          <>
            <p style={emailStyles.paragraph}>
              The natural next step is <strong style={emailStyles.strong}>{lead.title}</strong>. {lead.line}
            </p>
            <p style={emailStyles.lastParagraph}>
              It is {lead.hours}, self-paced, and costs £{lead.priceGbp}. It is saved to the same
              account, and it ends with its own assessment and signed record.
            </p>
            <a
              href={`${base.replace(/\/$/, "")}/learn/${lead.slug}?utm_source=email&utm_medium=email&utm_campaign=next-course`}
              style={emailStyles.button}
            >
              See {lead.title}
            </a>
          </>
        ) : (
          <p style={emailStyles.lastParagraph}>
            Browse the catalogue to choose the course that fits your role.
          </p>
        )}
      </EmailShell>
    );
  }

  if (kind === "sign") {
    return (
      <EmailShell
        eyebrow="One step left"
        heading={`The checks are done. Your ${work} is not signed yet.`}
        preheader={`Sign your ${work} to receive your record for ${courseTitle}.`}
        footerNote="This note is a reminder to finish the course you bought. It does not certify compliance with the EU AI Act or any other regulation."
      >
        <p style={emailStyles.paragraph}>
          Every check on <strong style={emailStyles.strong}>{courseTitle}</strong> has passed. The
          last step is to sign your {work} with your name.
        </p>
        <p style={emailStyles.lastParagraph}>
          Signing creates a record with its own public page that anyone can verify, and a
          certificate you can add to LinkedIn. The record will not say that you are compliant with
          any regulation.
        </p>
        <a href={learnUrl} style={emailStyles.button}>
          Sign and finish
        </a>
      </EmailShell>
    );
  }

  if (kind === "continue") {
    return (
      <EmailShell
        eyebrow="Pick up where you left off"
        heading="Your next check is waiting."
        preheader={`You have passed ${passed} of ${total} checks on ${courseTitle}.`}
        footerNote="This note is a reminder to finish the course you bought."
      >
        <p style={emailStyles.paragraph}>
          You have passed {passed} of {total} checks on{" "}
          <strong style={emailStyles.strong}>{courseTitle}</strong>. Your progress is saved, and the
          next lesson opens as soon as the current check is right.
        </p>
        <p style={emailStyles.lastParagraph}>
          Each lesson is short enough to finish in one sitting. Open the course and finish the check in front of
          you, and you will be one step closer to your {work}.
        </p>
        <a href={learnUrl} style={emailStyles.button}>
          Continue the course
        </a>
      </EmailShell>
    );
  }

  return (
    <EmailShell
      eyebrow="Ready when you are"
      heading="Lesson one is open."
      preheader={`${courseTitle} is ready. The first lesson fits in one sitting.`}
      footerNote="This note is a reminder to start the course you bought."
    >
      <p style={emailStyles.paragraph}>
        Thank you again for choosing <strong style={emailStyles.strong}>{courseTitle}</strong>. The
        first lesson is ready, and it fits in one sitting.
      </p>
      <p style={emailStyles.lastParagraph}>
        Open the course, read the worked example, and complete the check. The feedback on your
        answer shows you what to change before you move on.
      </p>
      <a href={learnUrl} style={emailStyles.button}>
        Open lesson one
      </a>
    </EmailShell>
  );
}
