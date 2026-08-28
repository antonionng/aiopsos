import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

/**
 * Low-balance warning. Sent once, when a debit crosses the threshold -
 * the ask is one click to the billing page, so keep it to that.
 */
export function LowCreditsEmail({
  balance,
  billingUrl,
}: {
  balance: number;
  billingUrl: string;
}) {
  return (
    <EmailShell heading="Your AI credits are running low">
      <p style={emailStyles.paragraph}>
        Your organisation has{" "}
        <strong style={emailStyles.strong}>{balance.toLocaleString()} credits</strong> left. When
        the balance reaches zero, AI features pause for everyone until it&apos;s topped up.
      </p>
      <p style={emailStyles.lastParagraph}>
        Topping up takes a minute - pick a credit pack on the billing page.
      </p>
      <a href={billingUrl} style={emailStyles.button}>
        Top up credits
      </a>
    </EmailShell>
  );
}
