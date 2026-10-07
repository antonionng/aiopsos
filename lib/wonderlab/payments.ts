import "server-only";
import type Stripe from "stripe";
import { fulfilMembershipEvent } from "./memberships";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin as db } from "@/lib/supabase/admin";
export const WONDERLAB_PURPOSE = "wonderlab_mission";
const id = (v: string | { id: string } | null) =>
  typeof v === "string" ? v : (v?.id ?? null);
export async function fulfilWonderlabEvent(
  event: Stripe.Event,
): Promise<boolean> {
  if (await fulfilMembershipEvent(event)) return true;
  if (
    [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ].includes(event.type)
  ) {
    const payload = event.data.object as Stripe.Checkout.Session;
    if (payload.metadata?.purpose !== WONDERLAB_PURPOSE) return false;
    const session = await getStripe().checkout.sessions.retrieve(payload.id);
    if (
      session.metadata?.purpose !== WONDERLAB_PURPOSE ||
      !session.metadata.order_id
    )
      throw new Error("Wonderlab payment metadata missing");
    if (session.payment_status !== "paid") return true;
    const { error } = await db.rpc("wonderlab_payment_event", {
      p_event: event.id,
      p_order: session.metadata.order_id,
      p_kind: "paid",
      p_amount: session.amount_total,
      p_currency: session.currency,
      p_session: session.id,
      p_intent: id(session.payment_intent),
    });
    if (error) throw error;
    return true;
  }
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    if (!charge.payment_intent) return false;
    // The payment-intent metadata also supports a refund arriving before capture.
    const intent = await getStripe().paymentIntents.retrieve(
      id(charge.payment_intent)!,
    );
    if (intent.metadata.purpose !== WONDERLAB_PURPOSE) return false;
    if (charge.amount_refunded < charge.amount) return true;
    const { error } = await db.rpc("wonderlab_payment_event", {
      p_event: event.id,
      p_order: intent.metadata.order_id,
      p_kind: "refunded",
      p_amount: charge.amount,
      p_currency: charge.currency,
      p_session: null,
      p_intent: intent.id,
    });
    if (error) throw error;
    return true;
  }
  return false;
}
