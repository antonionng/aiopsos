import "server-only";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { applyGuestPayment } from "@/lib/always-on-agents/guest-checkout";

function intentId(value: string | { id: string } | null) {
  return typeof value === "string" ? value : (value?.id ?? null);
}
async function applyPayment(params: {
  eventId: string;
  type: "captured" | "refunded" | "failed" | "voided";
  purpose: string;
  paymentId: string;
  amount: number;
  currency: string;
  sessionId?: string;
  intentId?: string | null;
  email?: string | null;
  name?: string | null;
}) {
  if (params.purpose === "agent_course") {
    const { data: guest, error: guestError } = await supabaseAdmin.from("agent_course_guest_checkouts").select("id").eq("payment_id", params.paymentId).maybeSingle();
    if (guestError) throw new Error("Guest purchase lookup failed.");
    if (guest) { await applyGuestPayment(params); return; }
    const { data: order, error: lookupError } = await supabaseAdmin
      .from("agent_course_orders")
      .select(
        "amount,currency,payment_provider,stripe_session_id,stripe_intent_id",
      )
      .eq("payment_id", params.paymentId)
      .maybeSingle();
    if (lookupError || !order)
      throw new Error("Course payment could not be found.");
    if (order.payment_provider !== "stripe")
      throw new Error("Course payment provider does not match.");
    if (
      (order.stripe_session_id &&
        params.sessionId &&
        order.stripe_session_id !== params.sessionId) ||
      (order.stripe_intent_id &&
        params.intentId &&
        order.stripe_intent_id !== params.intentId)
    )
      throw new Error(
        "Stripe payment identity does not match the course order.",
      );
    const { error } = await supabaseAdmin.rpc("agent_course_payment_event", {
      p_event: params.eventId,
      p_type: "payment." + params.type,
      p_payment: params.paymentId,
      p_amount: params.amount,
      p_currency: params.currency.toUpperCase(),
      p_state: params.type,
    });
    if (error) throw new Error(error.message);
    const { error: saveError } = await supabaseAdmin
      .from("agent_course_orders")
      .update({
        ...(params.sessionId ? { stripe_session_id: params.sessionId } : {}),
        ...(params.intentId ? { stripe_intent_id: params.intentId } : {}),
      })
      .eq("payment_id", params.paymentId);
    if (saveError) throw new Error(saveError.message);
  } else if (["credit_pack", "cohort"].includes(params.purpose)) {
    const { error } = await supabaseAdmin.rpc("academy_stripe_payment_event", {
      p_event: params.eventId,
      p_type: params.type,
      p_payment: params.paymentId,
      p_amount: params.amount,
      p_currency: params.currency,
      p_session: params.sessionId ?? null,
      p_intent: params.intentId ?? null,
    });
    if (error) throw new Error(error.message);
  } else throw new Error("Unknown Stripe payment purpose.");
}

/** Returns false for historic subscription/cohort events handled by the legacy branch. */
export async function fulfilStripePayment(
  event: Stripe.Event,
): Promise<boolean> {
  if (
    [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
      "checkout.session.async_payment_failed",
      "checkout.session.expired",
    ].includes(event.type)
  ) {
    const payload = event.data.object as Stripe.Checkout.Session;
    if (!payload.metadata?.payment_id || !payload.metadata?.purpose)
      return false;
    // Retrieve the authoritative session before fulfilling, including delayed payment events.
    const session = await getStripe().checkout.sessions.retrieve(payload.id);
    const paymentId = session.metadata?.payment_id;
    const purpose = session.metadata?.purpose;
    if (
      !paymentId ||
      !purpose ||
      session.amount_total === null ||
      !session.currency
    )
      throw new Error("Stripe Checkout payment details are missing.");
    const type =
      event.type === "checkout.session.expired"
        ? "voided"
        : event.type === "checkout.session.async_payment_failed"
          ? "failed"
          : "captured";
    if (type === "captured" && session.payment_status !== "paid") return true;
    await applyPayment({
      eventId: event.id,
      type,
      paymentId,
      purpose,
      amount: session.amount_total,
      currency: session.currency,
      sessionId: session.id,
      intentId: intentId(session.payment_intent),
      email: session.customer_details?.email ?? session.customer_email,
      name: session.customer_details?.name,
    });
    return true;
  }
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    if (!charge.refunded || charge.amount_refunded < charge.amount) return true;
    const id = intentId(charge.payment_intent);
    const metadata = charge.metadata?.payment_id
      ? charge.metadata
      : id
        ? (await getStripe().paymentIntents.retrieve(id)).metadata
        : null;
    if (!metadata?.payment_id || !metadata?.purpose) return false;
    await applyPayment({
      eventId: event.id,
      type: "refunded",
      paymentId: metadata.payment_id,
      purpose: metadata.purpose,
      amount: charge.amount,
      currency: charge.currency,
      intentId: id,
    });
    return true;
  }
  return false;
}
