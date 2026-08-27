import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  LITERACY_DISCLAIMER,
} from "@/lib/constants";
import type { CertificateSnapshot } from "@/lib/types";

/**
 * The certificate, rendered.
 *
 * Every value comes from `certificates.snapshot`, frozen at the moment of
 * issue. Nothing is read from a live table, so a certificate downloaded a
 * year later says exactly what it said on the day - which is the whole point
 * of the snapshot, and the reason the catalogue can be edited freely.
 *
 * Two pages, because it does two jobs. The first is the thing a delegate
 * wants to hold and show an employer. The second is the record a levy or
 * reimbursement scheme audits: the attendance and grade actually achieved,
 * next to the thresholds that applied, and what was covered.
 *
 * WORDING. This documents that a named person attended and passed a course.
 * It must never say, or imply, that the holder or their employer is
 * compliant with the EU AI Act or anything else - no certificate establishes
 * that, and overclaiming here is the largest legal risk in the product.
 * LITERACY_DISCLAIMER is the sanctioned wording and appears on both pages.
 */

export interface CertificateMeta {
  publicRef: string;
  issuedAt: string;
  verifyUrl: string;
}

const styles = StyleSheet.create({
  certPage: {
    paddingTop: 44,
    paddingBottom: 40,
    paddingHorizontal: 56,
    fontSize: 10,
    color: "#1a1a1a",
    fontFamily: "Helvetica",
  },
  recordPage: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#1a1a1a",
    fontFamily: "Helvetica",
  },
  frame: {
    borderWidth: 1,
    borderColor: "#1a1a1a",
    paddingVertical: 30,
    paddingHorizontal: 36,
    height: "100%",
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#777777",
    textAlign: "center",
    marginBottom: 18,
  },
  kicker: { fontSize: 11, color: "#555555", textAlign: "center", marginBottom: 6 },
  name: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  participantOrg: {
    fontSize: 11,
    color: "#555555",
    textAlign: "center",
    marginBottom: 18,
  },
  courseTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  courseMeta: { fontSize: 10, color: "#555555", textAlign: "center", marginBottom: 22 },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },
  signatureBlock: { width: "45%" },
  signatureRule: {
    borderTopWidth: 0.75,
    borderTopColor: "#1a1a1a",
    marginBottom: 4,
    paddingTop: 2,
  },
  signatureLabel: { fontSize: 8, color: "#777777", letterSpacing: 1 },
  signatureValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  verifyBox: {
    marginTop: 22,
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    paddingTop: 10,
    alignItems: "center",
  },
  ref: { fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: 2 },
  small: { fontSize: 7.5, color: "#888888", textAlign: "center", marginTop: 4 },
  disclaimer: {
    fontSize: 7,
    color: "#888888",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 1.4,
  },

  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
  },
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  muted: { color: "#666666" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dddddd",
    paddingVertical: 4,
  },
  headRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 3,
    marginTop: 6,
  },
  cell: { flex: 1, paddingRight: 6 },
  cellNarrow: { width: 90, paddingRight: 6, textAlign: "right" },
  bold: { fontFamily: "Helvetica-Bold" },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  callout: {
    borderWidth: 0.5,
    borderColor: "#999999",
    padding: 10,
    marginTop: 14,
    backgroundColor: "#f6f6f6",
  },
});

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "12 - 14 October 2026", or a single date when the cohort ran for one day. */
function formatRange(startsOn: string | null, endsOn: string | null): string {
  const start = formatDate(startsOn);
  const end = formatDate(endsOn);
  if (!start) return end;
  if (!end || start === end) return start;
  return `${start} - ${end}`;
}

function CertificateDocument({
  snapshot,
  meta,
}: {
  snapshot: CertificateSnapshot;
  meta: CertificateMeta;
}) {
  // Older certificates predate the split and carry the participant's employer
  // in issued_by_org, so it is not a safe fallback for who delivered the
  // training. Leaving the line off entirely beats printing the wrong company.
  const deliveredBy = snapshot.delivered_by_org ?? null;
  const level = COURSE_LEVEL_LABELS[snapshot.course_level] ?? snapshot.course_level;
  const mode = DELIVERY_MODE_LABELS[snapshot.delivery_mode] ?? snapshot.delivery_mode;

  const docTitle = `Certificate ${meta.publicRef} - ${snapshot.participant_name}`;
  const dateRange = formatRange(snapshot.starts_on, snapshot.ends_on);
  const courseMeta = dateRange
    ? `${level} · ${mode} · ${dateRange}`
    : `${level} · ${mode}`;

  return (
    <Document title={docTitle} author={deliveredBy ?? "Experrt"}>
      <Page size="A4" orientation="landscape" style={styles.certPage}>
        <View style={styles.frame}>
          <Text style={styles.eyebrow}>CERTIFICATE OF COMPLETION</Text>

          <Text style={styles.kicker}>This certifies that</Text>
          <Text style={styles.name}>{snapshot.participant_name}</Text>
          {snapshot.participant_org ? (
            <Text style={styles.participantOrg}>{snapshot.participant_org}</Text>
          ) : (
            <View style={{ marginBottom: 18 }} />
          )}

          <Text style={styles.kicker}>
            attended and passed the facilitated course
          </Text>
          <Text style={styles.courseTitle}>{snapshot.course_title}</Text>
          <Text style={styles.courseMeta}>{courseMeta}</Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureRule} />
              <Text style={styles.signatureLabel}>FACILITATED BY</Text>
              <Text style={styles.signatureValue}>
                {snapshot.facilitator_name ?? "—"}
              </Text>
              {snapshot.facilitator_credentials.length > 0 && (
                <Text style={{ fontSize: 8, color: "#777777" }}>
                  {snapshot.facilitator_credentials
                    .map((c) => c.title)
                    .join(" · ")}
                </Text>
              )}
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureRule} />
              <Text style={styles.signatureLabel}>DELIVERED BY</Text>
              <Text style={styles.signatureValue}>{deliveredBy ?? "—"}</Text>
              <Text style={{ fontSize: 8, color: "#777777" }}>
                Issued {formatDate(meta.issuedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.verifyBox}>
            <Text style={styles.ref}>{meta.publicRef}</Text>
            <Text style={styles.small}>
              Verify this certificate at {meta.verifyUrl}
            </Text>
            <Text style={styles.disclaimer}>{LITERACY_DISCLAIMER}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.recordPage}>
        <Text style={styles.h1}>Training record</Text>
        <Text style={styles.muted}>
          {snapshot.participant_name}
          {snapshot.participant_org ? ` · ${snapshot.participant_org}` : ""}
        </Text>
        <Text style={styles.muted}>
          {snapshot.course_title} · {snapshot.cohort_title}
        </Text>

        <Text style={styles.sectionTitle}>What was achieved</Text>
        <View style={styles.headRow}>
          <Text style={[styles.cell, styles.bold]}>Measure</Text>
          <Text style={[styles.cellNarrow, styles.bold]}>Achieved</Text>
          <Text style={[styles.cellNarrow, styles.bold]}>Required</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Attendance</Text>
          <Text style={styles.cellNarrow}>{snapshot.attendance_pct}%</Text>
          <Text style={styles.cellNarrow}>{snapshot.pass_attendance_pct}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Assessed work</Text>
          <Text style={styles.cellNarrow}>
            {snapshot.grade_pct === null ? "Not graded" : `${snapshot.grade_pct}%`}
          </Text>
          <Text style={styles.cellNarrow}>{snapshot.pass_grade_pct}%</Text>
        </View>

        {snapshot.learning_outcomes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Learning outcomes</Text>
            {snapshot.learning_outcomes.map((outcome, i) => (
              <View style={styles.bullet} key={i}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{outcome}</Text>
              </View>
            ))}
          </>
        )}

        {snapshot.modules.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Modules covered</Text>
            {snapshot.modules.map((m) => (
              <View key={m.position} wrap={false} style={{ marginBottom: 6 }}>
                <Text style={styles.bold}>
                  {m.position}. {m.title}
                </Text>
                {m.outcomes.map((outcome, i) => (
                  <View style={styles.bullet} key={i}>
                    <Text style={styles.bulletDot}>·</Text>
                    <Text style={styles.bulletText}>{outcome}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        <View style={styles.callout}>
          <Text>{LITERACY_DISCLAIMER}</Text>
          <Text style={{ marginTop: 6 }}>
            Certificate {meta.publicRef}, issued {formatDate(meta.issuedAt)}.
            Current status is always the one shown at {meta.verifyUrl}.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/** Render one certificate to a PDF buffer. */
export function renderCertificatePdf(
  snapshot: CertificateSnapshot,
  meta: CertificateMeta
): Promise<Buffer> {
  return renderToBuffer(<CertificateDocument snapshot={snapshot} meta={meta} />);
}
