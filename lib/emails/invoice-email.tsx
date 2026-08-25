import * as React from "react";
import { EmailShell, emailStyles, formatDateInZone } from "./academy-shell";

/**
 * Invoice notification. The PDF carries the full detail and payment
 * instructions; this email states the amount and the due date, attaches
 * the document, and stays short - finance inboxes forward these around
 * and the essentials need to survive a glance.
 */

function formatMoney(minorUnits: number, currency: string): string {
  const symbol =
    currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : `${currency} `;
  return `${symbol}${(minorUnits / 100).toFixed(2)}`;
}

export function InvoiceEmail({
  orgName,
  invoiceNumber,
  totalAmount,
  currency,
  dueDate,
  termsDays,
  lines,
  isReminder,
}: {
  orgName: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
  dueDate: string;
  termsDays: number;
  lines: Array<{ description: string; total_amount: number }>;
  isReminder?: boolean;
}) {
  return (
    <EmailShell
      heading={
        isReminder ? `Reminder: invoice ${invoiceNumber} is due` : `Invoice ${invoiceNumber}`
      }
    >
      <p style={emailStyles.paragraph}>
        {isReminder ? (
          <>
            A payment reminder for <strong style={emailStyles.strong}>{orgName}</strong> — the
            invoice below has passed its due date.
          </>
        ) : (
          <>
            An invoice for <strong style={emailStyles.strong}>{orgName}</strong> is attached as a
            PDF, with payment details inside.
          </>
        )}
      </p>
      <div style={{ margin: "24px 0" }}>
        {lines.map((line, i) => (
          <p key={i} style={emailStyles.detailRow}>
            <span style={emailStyles.detailLabel}>{line.description} — </span>
            {formatMoney(line.total_amount, currency)}
          </p>
        ))}
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Total due — </span>
          <strong style={emailStyles.strong}>{formatMoney(totalAmount, currency)}</strong>
        </p>
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Due — </span>
          {formatDateInZone(dueDate, "Europe/London")} (NET {termsDays})
        </p>
      </div>
      <p style={emailStyles.lastParagraph}>
        Please pay by bank transfer quoting{" "}
        <strong style={emailStyles.strong}>{invoiceNumber}</strong> as the reference. Questions
        about this invoice? Just reply to this email.
      </p>
    </EmailShell>
  );
}
