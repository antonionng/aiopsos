import * as React from "react";
import { EmailShell, emailStyles, formatDateInZone } from "./academy-shell";

function formatMoney(minorUnits: number, currency: string): string {
  const symbol =
    currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : `${currency} `;
  return `${symbol}${(minorUnits / 100).toFixed(2)}`;
}

export function InvoicePaidEmail({
  orgName,
  invoiceNumber,
  totalAmount,
  currency,
  billingUrl,
}: {
  orgName: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
  billingUrl: string;
}) {
  return (
    <EmailShell heading={`Payment received for ${invoiceNumber}`}>
      <p style={emailStyles.paragraph}>
        We have marked invoice <strong style={emailStyles.strong}>{invoiceNumber}</strong> for{" "}
        <strong style={emailStyles.strong}>{orgName}</strong> as paid.
      </p>
      <p style={emailStyles.detailRow}>
        <span style={emailStyles.detailLabel}>Amount: </span>
        {formatMoney(totalAmount, currency)}
      </p>
      <p style={emailStyles.lastParagraph}>
        Any credits or cohort places on that invoice are now applied.
      </p>
      <a href={billingUrl} style={emailStyles.button}>
        View billing
      </a>
    </EmailShell>
  );
}

export function InvoiceVoidedEmail({
  orgName,
  invoiceNumber,
  totalAmount,
  currency,
}: {
  orgName: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
}) {
  return (
    <EmailShell heading={`Invoice ${invoiceNumber} has been voided`}>
      <p style={emailStyles.paragraph}>
        Please do not pay invoice{" "}
        <strong style={emailStyles.strong}>{invoiceNumber}</strong> for {orgName}. It has been
        cancelled.
      </p>
      <p style={emailStyles.lastParagraph}>
        The amount was {formatMoney(totalAmount, currency)}. If you have already sent a transfer,
        reply to this email and we will sort it out.
      </p>
    </EmailShell>
  );
}

export function CreditsAddedEmail({
  credits,
  description,
  balance,
  billingUrl,
}: {
  credits: number;
  description: string;
  balance: number | null;
  billingUrl: string;
}) {
  return (
    <EmailShell heading="AI credits have been added">
      <p style={emailStyles.paragraph}>
        <strong style={emailStyles.strong}>{credits.toLocaleString()} credits</strong> are now on
        your organisation wallet.
      </p>
      <p style={emailStyles.paragraph}>{description}</p>
      {balance !== null && (
        <p style={emailStyles.detailRow}>
          <span style={emailStyles.detailLabel}>Balance: </span>
          {balance.toLocaleString()} credits
        </p>
      )}
      <p style={emailStyles.lastParagraph}>AI features stay available while the balance lasts.</p>
      <a href={billingUrl} style={emailStyles.button}>
        View billing
      </a>
    </EmailShell>
  );
}

export function CreditsAdjustedEmail({
  credits,
  description,
  balance,
  billingUrl,
}: {
  credits: number;
  description: string;
  balance: number | null;
  billingUrl: string;
}) {
  const added = credits > 0;
  return (
    <EmailShell heading={added ? "Your credit balance was increased" : "Your credit balance was reduced"}>
      <p style={emailStyles.paragraph}>
        An Experrt admin {added ? "added" : "removed"}{" "}
        <strong style={emailStyles.strong}>{Math.abs(credits).toLocaleString()} credits</strong>.
      </p>
      <p style={emailStyles.paragraph}>{description}</p>
      {balance !== null && (
        <p style={emailStyles.lastParagraph}>
          Balance now: <strong style={emailStyles.strong}>{balance.toLocaleString()}</strong> credits.
        </p>
      )}
      <a href={billingUrl} style={emailStyles.button}>
        View billing
      </a>
    </EmailShell>
  );
}

export function CohortPaidEmail({
  cohortTitle,
  billingUrl,
}: {
  cohortTitle: string;
  billingUrl: string;
}) {
  return (
    <EmailShell heading={`${cohortTitle} is paid`}>
      <p style={emailStyles.paragraph}>
        Payment for <strong style={emailStyles.strong}>{cohortTitle}</strong> has been received.
        The cohort is marked paid.
      </p>
      <p style={emailStyles.lastParagraph}>
        Enrolments and sessions are unchanged. This note is only about the fee.
      </p>
      <a href={billingUrl} style={emailStyles.button}>
        View billing
      </a>
    </EmailShell>
  );
}

export function PaymentFailedEmail({
  purposeLabel,
  billingUrl,
}: {
  purposeLabel: string;
  billingUrl: string;
}) {
  return (
    <EmailShell heading="A payment did not go through">
      <p style={emailStyles.paragraph}>
        We could not take payment for{" "}
        <strong style={emailStyles.strong}>{purposeLabel}</strong>. Nothing was added to your
        account.
      </p>
      <p style={emailStyles.lastParagraph}>
        You can try again from billing. If the charge appears on a statement, reply to this email.
      </p>
      <a href={billingUrl} style={emailStyles.button}>
        Try again
      </a>
    </EmailShell>
  );
}

export function CreditsRefundedEmail({
  credits,
  description,
  billingUrl,
}: {
  credits: number;
  description: string;
  billingUrl: string;
}) {
  return (
    <EmailShell heading="A credit purchase was refunded">
      <p style={emailStyles.paragraph}>
        <strong style={emailStyles.strong}>{credits.toLocaleString()} credits</strong> were removed
        from the wallet because the payment was refunded.
      </p>
      <p style={emailStyles.lastParagraph}>{description}</p>
      <a href={billingUrl} style={emailStyles.button}>
        View billing
      </a>
    </EmailShell>
  );
}

export function TrialEndingEmail({
  orgName,
  endsOn,
  ended,
  billingUrl,
}: {
  orgName: string;
  endsOn: string;
  ended: boolean;
  billingUrl: string;
}) {
  const when = formatDateInZone(endsOn, "Europe/London");
  return (
    <EmailShell heading={ended ? "Your Experrt trial has ended" : "Your Experrt trial is ending"}>
      <p style={emailStyles.paragraph}>
        {ended ? (
          <>
            The trial for <strong style={emailStyles.strong}>{orgName}</strong> ended on {when}.
          </>
        ) : (
          <>
            The trial for <strong style={emailStyles.strong}>{orgName}</strong> ends on {when}.
          </>
        )}
      </p>
      <p style={emailStyles.lastParagraph}>
        Paid features pause when a trial lapses. Talk to us if you want to keep the workspace
        running for your team.
      </p>
      <a href={billingUrl} style={emailStyles.button}>
        Review your plan
      </a>
    </EmailShell>
  );
}
