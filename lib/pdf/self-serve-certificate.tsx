import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { SignedRecord } from "@/lib/self-serve/records";

const CARD_LINES = [
  ["role", "Role"],
  ["context", "Context"],
  ["constraints", "Constraints"],
  ["output", "Output"],
] as const;

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontSize: 11,
    lineHeight: 1.5,
    color: "#201c29",
    backgroundColor: "#fffefa",
    fontFamily: "Helvetica",
  },
  brand: { fontSize: 12, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 36 },
  eyebrow: { fontSize: 9, letterSpacing: 2, color: "#66616e", marginBottom: 10 },
  title: { fontSize: 26, fontFamily: "Helvetica-Bold", lineHeight: 1.2, marginBottom: 18 },
  name: { fontSize: 18, marginBottom: 6 },
  date: { fontSize: 11, color: "#66616e", marginBottom: 28 },
  artefact: {
    borderTopWidth: 1,
    borderTopColor: "#dedce1",
    paddingTop: 16,
    marginBottom: 24,
  },
  artefactTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 10 },
  label: { fontSize: 8, letterSpacing: 1, color: "#66616e", marginTop: 8 },
  value: { fontSize: 11, marginTop: 3 },
  disclaimer: { fontSize: 8, color: "#66616e", lineHeight: 1.5, marginTop: 16 },
  ref: { fontSize: 10, letterSpacing: 2, marginTop: 20, fontFamily: "Helvetica-Bold" },
});

export function SelfServeCertificateDocument({ record }: { record: SignedRecord }) {
  const signed = new Date(record.signedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lines = CARD_LINES.map(([id, label]) => ({
    label,
    value: (record.artefact?.[id] ?? "").trim(),
  })).filter((line) => line.value);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>EXPERRT</Text>
        <Text style={styles.eyebrow}>COMPLETED</Text>
        <Text style={styles.title}>{record.title}</Text>
        <Text style={styles.name}>{record.signedName}</Text>
        <Text style={styles.date}>{signed}</Text>
        {lines.length > 0 ? (
          <View style={styles.artefact}>
            <Text style={styles.artefactTitle}>The prompt card</Text>
            {lines.map((line) => (
              <View key={line.label}>
                <Text style={styles.label}>{line.label.toUpperCase()}</Text>
                <Text style={styles.value}>{line.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <Text style={styles.disclaimer}>
          This record confirms that the named person completed the course and signed the
          prompt card above. It does not certify compliance with the EU AI Act or any other
          regulation.
        </Text>
        <Text style={styles.ref}>{record.ref}</Text>
        <Text style={styles.disclaimer}>{record.disclaimer}</Text>
      </Page>
    </Document>
  );
}

export function renderSelfServeCertificate(record: SignedRecord) {
  return renderToBuffer(<SelfServeCertificateDocument record={record} />);
}
