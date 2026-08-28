import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

/**
 * One person's training record as a dated PDF - the individual-level
 * companion to the evidence pack. Rendered from a payload assembled by the
 * export route at generation time and stamped with that moment, so the
 * document says when it was true.
 */

export interface TrainingRecordPayload {
  generated_at: string;
  organisation: string;
  member: {
    name: string;
    email: string;
    job_title: string | null;
    department: string | null;
  };
  stats: {
    enrolments: number;
    completed: number;
    attendance_pct: number | null;
    certificates: number;
  };
  maturity: { scores: Record<string, number>; submitted_at: string } | null;
  training_needs: { needs: Record<string, number>; submitted_at: string } | null;
  timeline: {
    cohort_title: string;
    course_title: string | null;
    facilitator: string | null;
    status: string;
    starts_on: string | null;
    ends_on: string | null;
    sessions: { title: string; attendance: string | null }[];
    grades: { score: number; max_score: number; feedback: string; graded_by: string | null; graded_at: string }[];
    certificate: { public_ref: string; issued_at: string; revoked: boolean } | null;
  }[];
}

const AMBER = "#b45309";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#1a1a1a",
    fontFamily: "Helvetica",
  },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  docTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "right" },
  stamp: { fontSize: 8, color: AMBER, textAlign: "right", letterSpacing: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  name: { fontSize: 15, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  subtle: { fontSize: 9, color: "#555555" },
  statRow: { flexDirection: "row", gap: 18, marginTop: 12, marginBottom: 20 },
  statValue: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  statLabel: { fontSize: 7.5, color: "#888888", letterSpacing: 0.5 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 6,
    color: AMBER,
  },
  cohortBlock: {
    borderLeftWidth: 2,
    borderLeftColor: "#dddddd",
    paddingLeft: 10,
    marginBottom: 12,
  },
  cohortTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  line: { fontSize: 9 },
  feedback: { fontSize: 8.5, color: "#444444", fontStyle: "italic" as const, marginTop: 1 },
  cert: { fontSize: 9, color: AMBER, marginTop: 3 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    fontSize: 7.5,
    color: "#888888",
    borderTopWidth: 0.5,
    borderTopColor: "#dddddd",
    paddingTop: 6,
  },
  scoresRow: { flexDirection: "row", gap: 14, marginBottom: 4 },
  scoreItem: { fontSize: 9 },
});

function fmtDate(iso: string | null): string {
  if (!iso) return " - ";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function TrainingRecordDocument({ payload }: { payload: TrainingRecordPayload }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>experrt</Text>
          <View>
            <Text style={styles.docTitle}>Training Record</Text>
            <Text style={styles.stamp}>GENERATED {fmtDate(payload.generated_at).toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.name}>{payload.member.name}</Text>
        <Text style={styles.subtle}>
          {[payload.member.job_title, payload.member.department, payload.organisation]
            .filter(Boolean)
            .join("  ·  ")}
        </Text>

        <View style={styles.statRow}>
          <View>
            <Text style={styles.statValue}>{payload.stats.enrolments}</Text>
            <Text style={styles.statLabel}>ENROLMENTS</Text>
          </View>
          <View>
            <Text style={styles.statValue}>{payload.stats.completed}</Text>
            <Text style={styles.statLabel}>COMPLETED</Text>
          </View>
          <View>
            <Text style={styles.statValue}>
              {payload.stats.attendance_pct === null ? " - " : `${payload.stats.attendance_pct}%`}
            </Text>
            <Text style={styles.statLabel}>ATTENDANCE</Text>
          </View>
          <View>
            <Text style={styles.statValue}>{payload.stats.certificates}</Text>
            <Text style={styles.statLabel}>CERTIFICATES</Text>
          </View>
        </View>

        {payload.maturity && (
          <View>
            <Text style={styles.sectionTitle}>AI READINESS ({fmtDate(payload.maturity.submitted_at)})</Text>
            <View style={styles.scoresRow}>
              {Object.entries(payload.maturity.scores).map(([k, v]) => (
                <Text key={k} style={styles.scoreItem}>
                  {k}: {v.toFixed(1)}
                </Text>
              ))}
            </View>
          </View>
        )}

        {payload.training_needs && (
          <View>
            <Text style={styles.sectionTitle}>
              TRAINING NEEDS ({fmtDate(payload.training_needs.submitted_at)})
            </Text>
            <View style={styles.scoresRow}>
              {Object.entries(payload.training_needs.needs).map(([k, v]) => (
                <Text key={k} style={styles.scoreItem}>
                  {k}: {Number(v).toFixed(1)}
                </Text>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>TRAINING HISTORY</Text>
        {payload.timeline.length === 0 && (
          <Text style={styles.line}>No enrolments on record.</Text>
        )}
        {payload.timeline.map((t, i) => (
          <View key={i} style={styles.cohortBlock} wrap={false}>
            <Text style={styles.cohortTitle}>
              {t.cohort_title}
              {t.course_title ? `  ·  ${t.course_title}` : ""}
            </Text>
            <Text style={styles.subtle}>
              {fmtDate(t.starts_on)} – {fmtDate(t.ends_on)}
              {t.facilitator ? `  ·  Facilitated by ${t.facilitator}` : ""}  ·  {t.status}
            </Text>
            {t.sessions.length > 0 && (
              <Text style={styles.line}>
                Attendance:{" "}
                {t.sessions
                  .map((sess) => `${sess.title}: ${sess.attendance ?? "not recorded"}`)
                  .join("  ·  ")}
              </Text>
            )}
            {t.grades.map((g, gi) => (
              <View key={gi}>
                <Text style={styles.line}>
                  Grade {g.score}/{g.max_score}
                  {g.graded_by ? ` - ${g.graded_by}` : ""} ({fmtDate(g.graded_at)})
                </Text>
                {g.feedback ? <Text style={styles.feedback}>“{g.feedback}”</Text> : null}
              </View>
            ))}
            {t.certificate && (
              <Text style={styles.cert}>
                Certificate {t.certificate.public_ref}
                {t.certificate.revoked ? " (revoked)" : ""} - issued {fmtDate(t.certificate.issued_at)} - verify at
                experrt.com/verify/{t.certificate.public_ref}
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Training records held by {payload.organisation} on Experrt. Grades and
          attendance are entered by the facilitator; this document reports
          measures taken and records held - it is not a claim of regulatory
          compliance. Certificates verify at experrt.com/verify.
        </Text>
      </Page>
    </Document>
  );
}

export function renderTrainingRecordPdf(payload: TrainingRecordPayload) {
  return renderToBuffer(<TrainingRecordDocument payload={payload} />);
}
