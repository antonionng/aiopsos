import "server-only";
import { randomUUID } from "node:crypto";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin as db } from "@/lib/supabase/admin";
import { missions } from "./catalog";
import {
  MEMBERSHIP_PURPOSE,
  stripeId,
  validateMembershipSubscription,
  membershipInvoicePeriod,
} from "./membership-rules";
export async function syncMembership(
  eventId: string,
  created: number,
  subscription: Stripe.Subscription,
  invoice?: Stripe.Invoice,
  refunded = false,
) {
  const membershipId = validateMembershipSubscription(subscription);
  const period = invoice
    ? membershipInvoicePeriod(invoice, subscription.id)
    : null;
  const { error } = await db.rpc("wonderlab_membership_event", {
    p_event: eventId,
    p_membership: membershipId,
    p_created: created,
    p_subscription: subscription.id,
    p_customer: stripeId(subscription.customer),
    p_state: subscription.status,
    p_cancel: subscription.cancel_at_period_end,
    p_ended: subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null,
    p_invoice: invoice?.id ?? null,
    p_kind: invoice ? (refunded ? "refunded" : "paid") : null,
    p_start: period?.start ?? null,
    p_end: period?.end ?? null,
    p_amount: invoice?.amount_paid ?? null,
    p_currency: invoice?.currency ?? null,
    p_catalog: missions.map((m) => ({ slug: m.slug, version: m.version })),
  });
  if (error) throw error;
}
export async function fulfilMembershipEvent(
  event: Stripe.Event,
): Promise<boolean> {
  const stripe = getStripe();
  if (event.type.startsWith("checkout.session.")) {
    const payload = event.data.object as Stripe.Checkout.Session;
    if (payload.metadata?.purpose !== MEMBERSHIP_PURPOSE) return false;
    const session = await stripe.checkout.sessions.retrieve(payload.id);
    const subscriptionId = stripeId(session.subscription);
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (
        subscription.metadata.membership_id !== session.metadata?.membership_id
      )
        throw new Error("Membership checkout mismatch");
      // Checkout redirects and sessions never grant access. Only invoice.paid does.
      await syncMembership(event.id, event.created, subscription);
    }
    return true;
  }
  if (event.type.startsWith("customer.subscription.")) {
    const payload = event.data.object as Stripe.Subscription;
    if (payload.metadata.purpose !== MEMBERSHIP_PURPOSE) return false;
    const subscription = await stripe.subscriptions.retrieve(payload.id);
    await syncMembership(event.id, event.created, subscription);
    return true;
  }
  if (event.type.startsWith("invoice.")) {
    const payload = event.data.object as Stripe.Invoice;
    const subscriptionId = stripeId(
      payload.parent?.subscription_details?.subscription,
    );
    if (!subscriptionId) return false;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.metadata.purpose !== MEMBERSHIP_PURPOSE) return false;
    const invoice =
      event.type === "invoice.paid"
        ? await stripe.invoices.retrieve(payload.id)
        : undefined;
    if (invoice && invoice.status !== "paid")
      throw new Error("Invoice not paid");
    await syncMembership(event.id, event.created, subscription, invoice);
    return true;
  }
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const intentId = stripeId(charge.payment_intent);
    if (!intentId) return false;
    const payments = await stripe.invoicePayments.list({
      payment: { type: "payment_intent", payment_intent: intentId },
      limit: 10,
    });
    for (const payment of payments.data) {
      const invoice = await stripe.invoices.retrieve(
        stripeId(payment.invoice)!,
      );
      const subId = stripeId(
        invoice.parent?.subscription_details?.subscription,
      );
      if (!subId) continue;
      const subscription = await stripe.subscriptions.retrieve(subId);
      if (subscription.metadata.purpose !== MEMBERSHIP_PURPOSE) continue;
      if (charge.amount_refunded >= charge.amount)
        await syncMembership(
          event.id,
          event.created,
          subscription,
          invoice,
          true,
        );
      return true;
    }
  }
  return false;
}
export async function cancelMembership(parentId: string, membershipId: string) {
  const { data: membership, error } = await db
    .from("wonderlab_memberships")
    .select("*")
    .eq("id", membershipId)
    .eq("parent_id", parentId)
    .single();
  if (error || !membership?.stripe_subscription_id)
    throw new Error("Membership unavailable");
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(
    membership.stripe_subscription_id,
  );
  if (validateMembershipSubscription(subscription) !== membership.id)
    throw new Error("Membership mismatch");
  if (!["canceled", "incomplete_expired"].includes(subscription.status)) {
    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
    await syncMembership(
      `cancel-${randomUUID()}`,
      Math.floor(Date.now() / 1000),
      updated,
    );
  }
}
