import type Stripe from "stripe";
export const MEMBERSHIP_PURPOSE = "wonderlab_membership";
export const MEMBERSHIP_PRICE_PENCE = 2000;
export const stripeId = (v: string | { id: string } | null | undefined) =>
  typeof v === "string" ? v : (v?.id ?? null);
export function validateMembershipSubscription(
  subscription: Stripe.Subscription,
) {
  const item = subscription.items.data[0];
  if (
    subscription.metadata.purpose !== MEMBERSHIP_PURPOSE ||
    !subscription.metadata.membership_id ||
    subscription.items.data.length !== 1 ||
    item.quantity !== 1 ||
    item.price.currency !== "gbp" ||
    item.price.unit_amount !== MEMBERSHIP_PRICE_PENCE ||
    item.price.recurring?.interval !== "month" ||
    item.price.recurring.interval_count !== 1
  ) {
    throw new Error("Unexpected Wonderlab membership subscription");
  }
  return subscription.metadata.membership_id;
}
export function membershipInvoicePeriod(
  invoice: Stripe.Invoice,
  subscriptionId: string,
) {
  const line = invoice.lines.data[0];
  if (
    stripeId(invoice.parent?.subscription_details?.subscription) !==
      subscriptionId ||
    invoice.lines.has_more ||
    invoice.lines.data.length !== 1 ||
    !line ||
    invoice.currency !== "gbp" ||
    invoice.total !== MEMBERSHIP_PRICE_PENCE ||
    invoice.amount_paid !== MEMBERSHIP_PRICE_PENCE ||
    line.amount !== MEMBERSHIP_PRICE_PENCE ||
    line.period.end <= line.period.start ||
    line.period.end - line.period.start > 32 * 86400
  ) {
    throw new Error("Unexpected Wonderlab membership invoice");
  }
  return {
    start: new Date(line.period.start * 1000).toISOString(),
    end: new Date(line.period.end * 1000).toISOString(),
  };
}
