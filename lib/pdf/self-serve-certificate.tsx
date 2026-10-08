import * as React from "react";
import { join } from "node:path";
import QRCode from "qrcode";
import {
  Document,
  Font,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  renderToBuffer,
} from "@react-pdf/renderer";
import { COMPANY } from "@/lib/legal";
import { verifyUrl } from "@/lib/self-serve/share-links";
import type { SignedRecord } from "@/lib/self-serve/records";

const FONTS = join(process.cwd(), "public/fonts");

Font.register({ family: "Signature", src: join(FONTS, "mrs-saint-delafield.ttf") });
Font.register({ family: "Grotesk", src: join(FONTS, "space-grotesk-bold.ttf"), fontWeight: 700 });
Font.registerHyphenationCallback((word) => [word]);

const INK = "#201c29";
const VIOLET = "#7046eb";
const DEEP = "#3b1fa6";
const CITRUS = "#e4f477";
const GOLD = "#c8a64a";
const PAPER = "#fffdf6";
const MUTE = "#66616e";

// A4 landscape in points.
const W = 842;
const H = 595;

const styles = StyleSheet.create({
  page: { backgroundColor: PAPER, color: INK, fontFamily: "Helvetica", fontSize: 10 },
  frame: { position: "absolute", top: 0, left: 0 },
  body: {
    position: "absolute",
    top: 66,
    left: 70,
    right: 70,
    bottom: 50,
    alignItems: "center",
  },
  head: { width: "100%", flexDirection: "row", justifyContent: "flex-start" },
  seal: { position: "absolute", top: -22, right: -24 },
  brand: { fontFamily: "Grotesk", fontWeight: 700, fontSize: 16, letterSpacing: 3 },
  eyebrow: {
    marginTop: 18,
    fontFamily: "Grotesk",
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: 4,
    color: VIOLET,
  },
  certifies: { marginTop: 18, fontSize: 11, fontFamily: "Helvetica-Oblique", color: MUTE },
  name: { marginTop: 6, fontFamily: "Grotesk", fontWeight: 700, fontSize: 40, color: DEEP },
  title: {
    marginTop: 6,
    fontFamily: "Grotesk",
    fontWeight: 700,
    fontSize: 20,
    textAlign: "center",
    maxWidth: 520,
  },
  line: { marginTop: 10, fontSize: 10, color: MUTE, textAlign: "center", maxWidth: 480, lineHeight: 1.5 },
  signs: { marginTop: 64, width: "100%", flexDirection: "row", justifyContent: "space-between" },
  sign: { width: 250 },
  sigText: { fontFamily: "Signature", fontSize: 40, color: DEEP, height: 50, paddingTop: 4 },
  rule: { height: 1, backgroundColor: INK, marginTop: 2 },
  signName: { marginTop: 6, fontFamily: "Helvetica-Bold", fontSize: 10 },
  signRole: { marginTop: 2, fontSize: 8.5, color: MUTE },
  foot: {
    position: "absolute",
    left: 70,
    right: 70,
    bottom: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  mono: { fontFamily: "Courier", fontSize: 8, letterSpacing: 1, color: MUTE },
  qr: { width: 58, height: 58 },
  // Second page: the signed work.
  workPage: { padding: 56, backgroundColor: PAPER, color: INK, fontSize: 11, lineHeight: 1.5 },
  workEyebrow: { fontFamily: "Grotesk", fontWeight: 700, fontSize: 9, letterSpacing: 3, color: VIOLET },
  workTitle: { marginTop: 8, fontFamily: "Grotesk", fontWeight: 700, fontSize: 22, marginBottom: 14 },
  row: { borderTopWidth: 1, borderTopColor: "#dedce1", paddingVertical: 9 },
  label: { fontSize: 8, letterSpacing: 1, color: MUTE },
  value: { fontSize: 11, marginTop: 3 },
  disclaimer: { fontSize: 8, color: MUTE, lineHeight: 1.5, marginTop: 14 },
});

const oneLine = (text: string) => text.trim().replace(/\s+/g, "\u00a0");

function Frame() {
  const rings = Array.from({ length: 9 }, (_, i) => 30 + i * 11);
  return (
    <Svg style={styles.frame} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="band" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={DEEP} />
          <Stop offset="0.45" stopColor={VIOLET} />
          <Stop offset="0.52" stopColor="#b99cff" />
          <Stop offset="0.6" stopColor={VIOLET} />
          <Stop offset="1" stopColor={DEEP} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={W} height={H} fill="url(#band)" />
      <Rect x="14" y="14" width={W - 28} height={H - 28} rx="10" fill={PAPER} />
      {rings.map((r) => (
        <Circle key={`a${r}`} cx="14" cy="14" r={r * 1.6} fill="none" stroke={VIOLET} strokeOpacity={0.07} strokeWidth={0.8} />
      ))}
      {rings.map((r) => (
        <Circle key={`b${r}`} cx={W - 14} cy={H - 14} r={r * 1.6} fill="none" stroke={VIOLET} strokeOpacity={0.07} strokeWidth={0.8} />
      ))}
      <Rect x="26" y="26" width={W - 52} height={H - 52} rx="6" fill="none" stroke={GOLD} strokeOpacity={0.55} strokeWidth={1} />
      <Rect x="32" y="32" width={W - 64} height={H - 64} rx="4" fill="none" stroke={GOLD} strokeOpacity={0.3} strokeWidth={0.6} />
    </Svg>
  );
}

function Seal() {
  return (
    <Svg width={78} height={78} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="96" fill={INK} />
      <Circle cx="100" cy="100" r="84" fill="none" stroke={CITRUS} strokeWidth={2} strokeDasharray="4 6" />
      <Circle cx="100" cy="100" r="62" fill={CITRUS} />
      <Path d="M74 102 L92 120 L128 80" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SelfServeCertificateDocument({
  record,
  qr,
}: {
  record: SignedRecord;
  qr: string;
}) {
  const signed = new Date(record.signedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lines = record.artefactFields
    .map((field) => ({ label: field.label, value: (record.artefact?.[field.id] ?? "").trim() }))
    .filter((line) => line.value);
  const nameSize = record.signedName.length > 26 ? 30 : 40;
  const sigSize = (text: string) => Math.max(18, Math.min(40, Math.floor(240 / (text.length * 0.34))));
  const sigStyle = (text: string) => {
    const size = sigSize(text);
    return [styles.sigText, { fontSize: size, paddingTop: 4 + (40 - size) * 0.7 }];
  };

  return (
    <Document title={`${record.title} - ${record.signedName}`} author="Experrt">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Frame />
        <View style={styles.body}>
          <View style={styles.head}>
            <Text style={styles.brand}>EXPERRT</Text>
          </View>
          <View style={styles.seal}>
            <Seal />
          </View>
          <Text style={styles.eyebrow}>CERTIFICATE OF COMPLETION</Text>
          <Text style={styles.certifies}>This certifies that</Text>
          <Text style={[styles.name, { fontSize: nameSize }]}>{record.signedName}</Text>
          <Text style={styles.certifies}>has completed the self-paced course</Text>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.line}>{record.recordLine}</Text>
          <View style={styles.signs}>
            <View style={styles.sign}>
              <Text style={sigStyle(record.signedName)}>
                {oneLine(record.signedName)}
              </Text>
              <View style={styles.rule} />
              <Text style={styles.signName}>{record.signedName}</Text>
              <Text style={styles.signRole}>Learner · signed {signed}</Text>
            </View>
            <View style={styles.sign}>
              <Text style={sigStyle(COMPANY.manager)}>
                {oneLine(COMPANY.manager)}
              </Text>
              <View style={styles.rule} />
              <Text style={styles.signName}>{COMPANY.manager}</Text>
              <Text style={styles.signRole}>General Manager, {COMPANY.tradingName}</Text>
            </View>
          </View>
        </View>
        <View style={styles.foot}>
          <View>
            <Text style={styles.mono}>REFERENCE {record.ref}</Text>
            <Text style={[styles.mono, { marginTop: 3 }]}>VERIFY AT EXPERRT.COM/VERIFY/{record.ref}</Text>
          </View>
          <Image src={qr} style={styles.qr} />
        </View>
      </Page>
      <Page size="A4" style={styles.workPage}>
        <Text style={styles.workEyebrow}>THE SIGNED WORK</Text>
        <Text style={styles.workTitle}>{record.artefactTitle || record.title}</Text>
        {lines.map((line) => (
          <View key={line.label} style={styles.row} wrap={false}>
            <Text style={styles.label}>{line.label.toUpperCase()}</Text>
            <Text style={styles.value}>{line.value}</Text>
          </View>
        ))}
        <Text style={styles.disclaimer}>
          This record confirms that the named person completed the course and signed the work
          above. It is not an accredited qualification and does not certify compliance with the EU
          AI Act or any other regulation.
        </Text>
        <Text style={styles.disclaimer}>{record.disclaimer}</Text>
        <Text style={[styles.mono, { marginTop: 18 }]}>REFERENCE {record.ref}</Text>
      </Page>
    </Document>
  );
}

export async function renderSelfServeCertificate(record: SignedRecord) {
  const qr = await QRCode.toDataURL(verifyUrl(record.ref), {
    margin: 0,
    width: 240,
    color: { dark: INK, light: "#00000000" },
  });
  return renderToBuffer(<SelfServeCertificateDocument record={record} qr={qr} />);
}
