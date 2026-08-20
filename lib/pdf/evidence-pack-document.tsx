import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { EvidencePackPayload } from "@/lib/evidence-pack";

/**
 * The evidence pack, rendered.
 *
 * Every value comes from the frozen `payload`. Nothing is read from a live
 * table and nothing is computed here beyond formatting, which is what makes a
 * regenerated pack for a past period identical to the original. The document
 * creation date is taken from the payload rather than the clock for the same
 * reason.
 */

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
  coverTitle: { fontSize: 26, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  coverSubtitle: { fontSize: 12, color: "#555555", marginBottom: 32 },
  coverMeta: { fontSize: 10, color: "#333333", marginBottom: 4 },
  sectionNumber: { fontSize: 8, color: "#888888", marginBottom: 2, letterSpacing: 1 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 18,
  },
  subTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 4 },
  body: { marginBottom: 6 },
  muted: { color: "#666666" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#dddddd", paddingVertical: 4 },
  headRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 3, marginTop: 6 },
  cell: { flex: 1, paddingRight: 6 },
  cellNarrow: { width: 62, paddingRight: 6, textAlign: "right" },
  bold: { fontFamily: "Helvetica-Bold" },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  callout: {
    borderWidth: 0.5,
    borderColor: "#999999",
    padding: 10,
    marginTop: 10,
    backgroundColor: "#f6f6f6",
  },
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>–</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View wrap>
      <Text style={styles.sectionNumber}>SECTION {number}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Footer({ payload }: { payload: EvidencePackPayload }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        {payload.organisation.name} — AI literacy measures, {payload.period.start} to{" "}
        {payload.period.end}
      </Text>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

function formatDate(iso: string): string {
  // Fixed format, not locale-dependent, so the output does not vary by host.
  const [y, m, d] = iso.slice(0, 10).split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

export function EvidencePackDocument({ payload }: { payload: EvidencePackPayload }) {
  return (
    <Document
      title={`AI literacy measures — ${payload.organisation.name} — ${payload.period.start} to ${payload.period.end}`}
      author="AIOPSOS"
      subject="Record of AI literacy measures and supporting evidence"
      creationDate={new Date(payload.generated_at)}
    >
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverTitle}>Record of AI literacy measures</Text>
        <Text style={styles.coverSubtitle}>
          {payload.organisation.name}
        </Text>

        <Text style={styles.coverMeta}>
          Reporting period: {formatDate(payload.period.start)} to{" "}
          {formatDate(payload.period.end)}
        </Text>
        <Text style={styles.coverMeta}>
          Generated: {formatDate(payload.generated_at)}
        </Text>
        {payload.organisation.industry ? (
          <Text style={styles.coverMeta}>Industry: {payload.organisation.industry}</Text>
        ) : null}
        {payload.organisation.location ? (
          <Text style={styles.coverMeta}>Location: {payload.organisation.location}</Text>
        ) : null}

        <View style={styles.callout}>
          <Text style={styles.bold}>What this document is</Text>
          <Text style={{ marginTop: 4 }}>
            This is a record of the measures {payload.organisation.name} has taken
            to support AI literacy among its staff, and the evidence for them:
            who was assessed, what gap that found, what training was delivered,
            by whom, who attended, how they were graded, and what changed in
            observed practice afterwards.
          </Text>
          <Text style={{ marginTop: 6 }}>
            It does not certify compliance with the EU AI Act or any other
            regulation. Section 7 sets out how each figure was derived and what
            it does not show. Read it before relying on anything here.
          </Text>
        </View>

        <Footer payload={payload} />
      </Page>

      {/* Sections 1-2 */}
      <Page size="A4" style={styles.page}>
        <Section number="1" title="Scope">
          <Text style={styles.body}>
            {payload.scope.declaration || "No scope declaration was provided."}
          </Text>
          <Text style={styles.subTitle}>AI systems reported in use by staff</Text>
          {payload.scope.declared_systems.length === 0 ? (
            <Text style={[styles.body, styles.muted]}>
              No tools were reported in the assessment responses.
            </Text>
          ) : (
            payload.scope.declared_systems.map((system) => (
              <Bullet key={system}>{system}</Bullet>
            ))
          )}
          <Text style={[styles.body, styles.muted, { marginTop: 6 }]}>
            Self-reported by {payload.scope.assessment_respondents} assessment
            respondents.
          </Text>
        </Section>

        <Section number="2" title="Role-based needs analysis">
          <Text style={styles.body}>
            Each department was scored across five dimensions, and training was
            matched to its weakest dimensions and the role most of its
            respondents hold.
          </Text>

          <View style={styles.headRow}>
            <Text style={[styles.cell, styles.bold]}>Department</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Staff</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Assessed</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Score</Text>
            <Text style={[styles.cell, styles.bold]}>Maturity tier</Text>
          </View>
          {payload.needs_analysis.by_department.map((d) => (
            <View style={styles.row} key={d.department}>
              <Text style={styles.cell}>{d.department}</Text>
              <Text style={styles.cellNarrow}>{d.headcount}</Text>
              <Text style={styles.cellNarrow}>{d.respondents}</Text>
              <Text style={styles.cellNarrow}>{d.overall.toFixed(1)}</Text>
              <Text style={styles.cell}>{d.tier.label}</Text>
            </View>
          ))}

          <Text style={styles.subTitle}>Why each department was assigned its training</Text>
          {payload.needs_analysis.by_department.map((d) => (
            <View key={`why-${d.department}`} style={{ marginBottom: 8 }}>
              <Text style={styles.bold}>
                {d.department} — pitched at {d.dominant_role}
              </Text>
              {d.assigned_courses.length === 0 ? (
                <Text style={styles.muted}>
                  No catalogue course matched this department&apos;s weakest dimensions.
                </Text>
              ) : (
                d.assigned_courses.map((c) => (
                  <Bullet key={c.title}>
                    {c.title} ({c.level}) — {c.because}
                  </Bullet>
                ))
              )}
            </View>
          ))}
        </Section>

        <Footer payload={payload} />
      </Page>

      {/* Sections 3-4 */}
      <Page size="A4" style={styles.page}>
        <Section number="3" title="Measures taken">
          <Text style={styles.body}>
            {payload.measures.cohorts.length} cohort
            {payload.measures.cohorts.length === 1 ? "" : "s"} delivered,{" "}
            {payload.measures.total_participants} participants,{" "}
            {payload.measures.total_facilitated_hours} facilitated hours. All
            training was delivered live by a facilitator.
          </Text>

          {payload.measures.cohorts.map((c) => (
            <View key={c.title} style={{ marginBottom: 10 }}>
              <Text style={styles.bold}>{c.title}</Text>
              <Text style={styles.muted}>
                {c.course} ({c.level}) · {c.delivery_mode.replace("_", " ")} ·{" "}
                {c.starts_on ? formatDate(c.starts_on) : "date not set"}
                {c.ends_on && c.ends_on !== c.starts_on
                  ? ` to ${formatDate(c.ends_on)}`
                  : ""}{" "}
                · {c.sessions} sessions · {c.enrolled} enrolled
              </Text>
              {c.facilitator ? (
                <Text>
                  Facilitator: {c.facilitator}
                  {c.facilitator_credentials.length > 0
                    ? ` — ${c.facilitator_credentials
                        .map(
                          (cr) =>
                            `${cr.title}${cr.issuer ? `, ${cr.issuer}` : ""}${
                              cr.year ? ` (${cr.year})` : ""
                            }`
                        )
                        .join("; ")}`
                    : ""}
                </Text>
              ) : (
                <Text style={styles.muted}>No facilitator recorded.</Text>
              )}
              {c.module_outcomes.length > 0 && (
                <View style={{ marginTop: 3 }}>
                  {c.module_outcomes.slice(0, 6).map((o, i) => (
                    <Bullet key={`${c.title}-${i}`}>{o}</Bullet>
                  ))}
                </View>
              )}
            </View>
          ))}
        </Section>

        <Section number="4" title="Records">
          <Text style={styles.body}>
            Mean attendance {payload.records.attendance_summary.mean_attendance_pct}%
            across {payload.records.attendance_summary.sessions_recorded} recorded
            session attendances. {payload.records.submissions} submissions.{" "}
            {payload.records.certificates_issued} certificates issued.
          </Text>

          <Text style={styles.subTitle}>Grade distribution</Text>
          <View style={styles.headRow}>
            <Text style={[styles.cell, styles.bold]}>Band</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Participants</Text>
          </View>
          {payload.records.grade_distribution.map((g) => (
            <View style={styles.row} key={g.band}>
              <Text style={styles.cell}>{g.band}</Text>
              <Text style={styles.cellNarrow}>{g.count}</Text>
            </View>
          ))}
        </Section>

        <Footer payload={payload} />
      </Page>

      {/* Sections 5-6 */}
      <Page size="A4" style={styles.page}>
        <Section number="5" title="Observed practice after training">
          <Text style={styles.body}>
            Self-reported scores from before the period, set against what staff
            actually did on the platform during it.
          </Text>

          <View style={styles.headRow}>
            <Text style={[styles.cell, styles.bold]}>Department</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Pre-score</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Active</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>% staff</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Sessions</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Features</Text>
          </View>
          {payload.observed_practice.departments.map((d) => (
            <View style={styles.row} key={`obs-${d.department}`}>
              <Text style={styles.cell}>{d.department}</Text>
              <Text style={styles.cellNarrow}>
                {d.pre_training_scores
                  ? (
                      (d.pre_training_scores.confidence +
                        d.pre_training_scores.practice +
                        d.pre_training_scores.tools +
                        d.pre_training_scores.responsible +
                        d.pre_training_scores.culture) /
                      5
                    ).toFixed(1)
                  : "—"}
              </Text>
              {d.suppressed ? (
                <Text style={[styles.cell, styles.muted]}>Withheld — group too small</Text>
              ) : (
                <>
                  <Text style={styles.cellNarrow}>{d.active_users}</Text>
                  <Text style={styles.cellNarrow}>
                    {d.active_user_pct === null ? "—" : `${d.active_user_pct}%`}
                  </Text>
                  <Text style={styles.cellNarrow}>{d.sessions_per_active_user}</Text>
                  <Text style={styles.cellNarrow}>{d.distinct_endpoints}</Text>
                </>
              )}
            </View>
          ))}

          <View style={styles.callout}>
            <Text>{payload.observed_practice.note}</Text>
          </View>
        </Section>

        <Section number="6" title="Governance artefacts">
          <Text style={styles.subTitle}>AI policies</Text>
          {payload.governance.policies.length === 0 ? (
            <Text style={[styles.body, styles.muted]}>No AI policy on record.</Text>
          ) : (
            payload.governance.policies.map((p) => (
              <Bullet key={p.title}>
                {p.title} — {p.status}
                {p.published_at ? `, published ${formatDate(p.published_at)}` : ""}
              </Bullet>
            ))
          )}
          <Text style={[styles.body, { marginTop: 8 }]}>
            {payload.governance.approval_requests_in_period} approval request
            {payload.governance.approval_requests_in_period === 1 ? "" : "s"} were
            raised during the period.
          </Text>
        </Section>

        <Footer payload={payload} />
      </Page>

      {/* Section 7 */}
      <Page size="A4" style={styles.page}>
        <Section number="7" title="Methodology and limitations">
          {payload.methodology.map((line, i) => (
            <View key={i} style={{ marginBottom: 7 }}>
              <Text>{line}</Text>
            </View>
          ))}
        </Section>

        <Footer payload={payload} />
      </Page>

      {/* Appendix */}
      <Page size="A4" style={styles.page}>
        <Section number="A" title="Appendix: individual records">
          <Text style={[styles.body, styles.muted]}>
            One row per enrolment. Aggregate figures appear in section 4.
          </Text>
          <View style={styles.headRow}>
            <Text style={[styles.cell, styles.bold]}>Participant</Text>
            <Text style={[styles.cell, styles.bold]}>Cohort</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Attend.</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Grade</Text>
            <Text style={[styles.cellNarrow, styles.bold]}>Status</Text>
          </View>
          {payload.records.appendix.map((r, i) => (
            <View style={styles.row} key={i} wrap={false}>
              <Text style={styles.cell}>{r.participant}</Text>
              <Text style={styles.cell}>{r.cohort}</Text>
              <Text style={styles.cellNarrow}>{r.attendance_pct}%</Text>
              <Text style={styles.cellNarrow}>
                {r.grade_pct === null ? "—" : `${r.grade_pct}%`}
              </Text>
              <Text style={styles.cellNarrow}>{r.status}</Text>
            </View>
          ))}
        </Section>

        <Footer payload={payload} />
      </Page>
    </Document>
  );
}

/** Render a stored payload to a PDF buffer. */
export function renderEvidencePackPdf(
  payload: EvidencePackPayload
): Promise<Buffer> {
  return renderToBuffer(<EvidencePackDocument payload={payload} />);
}
