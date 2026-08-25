import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { InvoicePayload } from "@/lib/invoices";

/**
 * The invoice, rendered.
 *
 * Every value comes from the frozen `payload` (same doctrine as the
 * evidence pack): nothing is read from a live table and nothing is
 * computed beyond formatting, so regenerating an invoice produces exactly
 * the document the customer was sent.
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  docTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", textAlign: "right" },
  docNumber: { fontSize: 10, color: "#555555", textAlign: "right" },
  metaBlock: { marginBottom: 4 },
  metaLabel: { fontSize: 8, color: "#888888", letterSpacing: 1, marginBottom: 2 },
  metaValue: { fontSize: 10 },
  columns: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  headRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 3,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dddddd",
    paddingVertical: 5,
  },
  cellDesc: { flex: 1, paddingRight: 6 },
  cellQty: { width: 40, textAlign: "right", paddingRight: 6 },
  cellAmount: { width: 80, textAlign: "right" },
  bold: { fontFamily: "Helvetica-Bold" },
  totalsBlock: { alignItems: "flex-end", marginTop: 10 },
  totalRow: { flexDirection: "row", width: 220, justifyContent: "space-between", paddingVertical: 2 },
  grandTotal: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 4,
    paddingTop: 4,
  },
  payBox: {
    borderWidth: 0.5,
    borderColor: "#999999",
    padding: 12,
    marginTop: 28,
    backgroundColor: "#f6f6f6",
  },
  payTitle: { fontFamily: "Helvetica-Bold", marginBottom: 4, fontSize: 10 },
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

function formatDate(iso: string): string {
  // Fixed format, not locale-dependent, so the output does not vary by host.
  const [y, m, d] = iso.slice(0, 10).split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

function formatMoney(minorUnits: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : `${currency} `;
  return `${symbol}${(minorUnits / 100).toFixed(2)}`;
}

const BANK_LABELS: Record<string, string> = {
  account_name: "Account name",
  sort_code: "Sort code",
  account_number: "Account number",
  iban: "IBAN",
  bic: "BIC",
  reference_hint: "Reference",
};

export function InvoiceDocument({ payload }: { payload: InvoicePayload }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>Experrt</Text>
          <View>
            <Text style={styles.docTitle}>Invoice</Text>
            <Text style={styles.docNumber}>{payload.invoice_number}</Text>
          </View>
        </View>

        <View style={styles.columns}>
          <View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>BILLED TO</Text>
              <Text style={[styles.metaValue, styles.bold]}>{payload.org.name}</Text>
              {payload.org.billing_email ? (
                <Text style={styles.metaValue}>{payload.org.billing_email}</Text>
              ) : null}
              {payload.org.po_reference ? (
                <Text style={styles.metaValue}>PO: {payload.org.po_reference}</Text>
              ) : null}
            </View>
          </View>
          <View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>ISSUE DATE</Text>
              <Text style={styles.metaValue}>{formatDate(payload.issue_date)}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>DUE DATE</Text>
              <Text style={styles.metaValue}>
                {formatDate(payload.due_date)} (NET {payload.terms_days})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headRow}>
          <Text style={[styles.cellDesc, styles.bold]}>Description</Text>
          <Text style={[styles.cellQty, styles.bold]}>Qty</Text>
          <Text style={[styles.cellAmount, styles.bold]}>Amount</Text>
        </View>
        {payload.lines.map((line, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.cellDesc}>{line.description}</Text>
            <Text style={styles.cellQty}>{line.quantity}</Text>
            <Text style={styles.cellAmount}>
              {formatMoney(line.total_amount, payload.currency)}
            </Text>
          </View>
        ))}

        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatMoney(payload.subtotal_amount, payload.currency)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.bold}>Total due</Text>
            <Text style={styles.bold}>
              {formatMoney(payload.total_amount, payload.currency)}
            </Text>
          </View>
        </View>

        <View style={styles.payBox}>
          <Text style={styles.payTitle}>How to pay</Text>
          <Text>
            Please pay by bank transfer by {formatDate(payload.due_date)}, quoting{" "}
            {payload.invoice_number} as the payment reference.
          </Text>
          {Object.entries(payload.bank_details)
            .filter(([, v]) => v)
            .map(([key, value]) => (
              <Text key={key}>
                {BANK_LABELS[key] ?? key}: {value}
              </Text>
            ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>
            Experrt — {payload.invoice_number} — issued {formatDate(payload.issue_date)}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(payload: InvoicePayload): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument payload={payload} />);
}
