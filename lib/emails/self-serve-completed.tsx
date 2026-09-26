import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";
import { CoursePicks } from "./course-picks";
import { workNoun, type CoursePick } from "@/lib/self-serve/upsell";
import { COMPANY } from "@/lib/legal";

const PAPER = "#FFFDF6";
const INK = "#201C29";
const VIOLET = "#7046EB";
const DEEP = "#3B1FA6";
const GOLD = "#C8A64A";
const MUTE = "#66616E";

/**
 * A certificate drawn in table markup, so it survives clients that block
 * images. Script fonts are not available in email, hence the fallbacks.
 */
function CertificateCard({
  name,
  courseTitle,
  certificateRef,
  signedAt,
}: {
  name: string;
  courseTitle: string;
  certificateRef: string;
  signedAt: string;
}) {
  const date = new Date(signedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const script = "'Snell Roundhand', 'Apple Chancery', 'Segoe Script', 'Brush Script MT', cursive";
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        margin: "24px 0",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${DEEP}, ${VIOLET} 45%, #B99CFF 55%, ${VIOLET} 70%, ${DEEP})`,
        backgroundColor: VIOLET,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "10px" }}>
            <table
              role="presentation"
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              style={{ backgroundColor: PAPER, borderRadius: "10px", border: `1px solid ${GOLD}` }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "26px 22px 22px", textAlign: "center", color: INK }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, letterSpacing: "0.3em", color: INK }}>
                      EXPERRT
                    </p>
                    <p
                      style={{
                        margin: "14px 0 0",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.28em",
                        color: VIOLET,
                      }}
                    >
                      CERTIFICATE OF COMPLETION
                    </p>
                    <p style={{ margin: "12px 0 0", fontSize: "12px", fontStyle: "italic", color: MUTE }}>
                      This certifies that
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "26px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        color: DEEP,
                      }}
                    >
                      {name}
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: "12px", fontStyle: "italic", color: MUTE }}>
                      has completed the self-paced course
                    </p>
                    <p style={{ margin: "6px 0 0", fontSize: "16px", fontWeight: 700, lineHeight: 1.3, color: INK }}>
                      {courseTitle}
                    </p>
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: "22px" }}>
                      <tbody>
                        <tr>
                          <td width="50%" style={{ padding: "0 8px 0 0", verticalAlign: "bottom", textAlign: "left" }}>
                            <p style={{ margin: 0, fontFamily: script, fontSize: "22px", lineHeight: 1.1, color: DEEP }}>
                              {name}
                            </p>
                            <p style={{ margin: "4px 0 0", borderTop: `1px solid ${INK}`, paddingTop: "5px", fontSize: "10px", color: MUTE }}>
                              Learner · {date}
                            </p>
                          </td>
                          <td width="50%" style={{ padding: "0 0 0 8px", verticalAlign: "bottom", textAlign: "left" }}>
                            <p style={{ margin: 0, fontFamily: script, fontSize: "22px", lineHeight: 1.1, color: DEEP }}>
                              {COMPANY.manager}
                            </p>
                            <p style={{ margin: "4px 0 0", borderTop: `1px solid ${INK}`, paddingTop: "5px", fontSize: "10px", color: MUTE }}>
                              General Manager, {COMPANY.tradingName}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style={{
                        margin: "18px 0 0",
                        fontFamily: "'SFMono-Regular', Menlo, Consolas, monospace",
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        color: MUTE,
                      }}
                    >
                      REFERENCE {certificateRef}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function SelfServeCompletedEmail({
  name,
  courseTitle,
  artefactTitle,
  certificateRef,
  signedAt,
  verifyUrl,
  certificateUrl,
  pdfUrl,
  linkedInUrl,
  picks = [],
  base,
}: {
  name: string;
  courseTitle: string;
  artefactTitle: string;
  certificateRef: string;
  signedAt: string;
  verifyUrl: string;
  certificateUrl: string;
  pdfUrl: string;
  linkedInUrl: string;
  picks?: CoursePick[];
  base: string;
}) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <EmailShell
      eyebrow="Certificate issued"
      heading={`Congratulations, ${first}. You are Experrt certified.`}
      preheader={`Your certificate for ${courseTitle} is ready, with reference ${certificateRef}. Anyone can verify it online.`}
      footerNote="An Experrt certificate confirms that you completed the course and signed your work. It is not an accredited qualification and does not certify compliance with the EU AI Act or any other regulation."
      after={
        <CoursePicks
          picks={picks}
          base={base}
          campaign="completed"
          heading="Earn your next certificate"
          intro="These courses follow on from the one you have finished. Each one ends with its own assessment and its own Experrt certificate."
        />
      }
    >
      <p style={emailStyles.paragraph}>
        You passed every check, completed the assessment and signed your {workNoun(artefactTitle)}.
        Your certificate for <strong style={{ color: "#FFFEFA" }}>{courseTitle}</strong> is issued and
        has its own public page, so a manager, client or recruiter can confirm it without contacting us.
      </p>
      <CertificateCard
        name={name}
        courseTitle={courseTitle}
        certificateRef={certificateRef}
        signedAt={signedAt}
      />
      <a href={certificateUrl} style={emailStyles.button}>
        See your certificate being signed
      </a>
      <p style={{ ...emailStyles.paragraph, margin: "22px 0 8px" }}>
        <a href={pdfUrl} style={{ color: "#FFFEFA", fontWeight: 600 }}>
          Download the PDF
        </a>
        <span style={{ color: "#BEB3D0" }}> · </span>
        <a href={linkedInUrl} style={{ color: "#FFFEFA", fontWeight: 600 }}>
          Add to LinkedIn
        </a>
        <span style={{ color: "#BEB3D0" }}> · </span>
        <a href={verifyUrl} style={{ color: "#FFFEFA", fontWeight: 600 }}>
          Public record
        </a>
      </p>
      <p style={emailStyles.lastParagraph}>
        On LinkedIn it sits under Licences &amp; certifications, with your reference and a link
        that anyone can use to check it. Your certificate stays yours after your course access ends.
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
