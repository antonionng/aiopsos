import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  createStripeCheckout,
  CheckoutExpiredError,
  stripeReturnOrigin,
} from "./stripe-checkout";

export async function billingStripeCheckout(params: {
  userId: string;
  orgId: string;
  purpose: "credit_pack" | "cohort";
  itemId: string;
  title: string;
  successPath: string;
  cancelPath: string;
}) {
  const origin = stripeReturnOrigin();
  const { data: payment, error } = await supabaseAdmin.rpc(
    "academy_reserve_stripe_payment",
    {
      p_actor: params.userId,
      p_org: params.orgId,
      p_purpose: params.purpose,
      p_item: params.itemId,
    },
  );
  if (error)
    throw new Error(
      ["PGRST202", "42P01"].includes(error.code)
        ? "Stripe payments need the database update before checkout can start."
        : error.message,
    );
  try {
    const session = await createStripeCheckout({
      paymentId: payment.payment_id,
      purpose: params.purpose,
      title: payment.checkout_title ?? params.title,
      amount: payment.amount,
      currency: payment.currency,
      sessionId: payment.stripe_session_id,
      successUrl: origin + params.successPath,
      cancelUrl: origin + params.cancelPath,
    });
    const { error: saveError } = await supabaseAdmin
      .from("mooov_payments")
      .update({ hosted_url: session.url, stripe_session_id: session.id })
      .eq("id", payment.id)
      .eq("provider", "stripe");
    if (saveError)
      throw new Error(
        "Checkout could not be saved. Please retry the same payment.",
      );
    return session.url;
  } catch (error) {
    if (error instanceof CheckoutExpiredError) {
      const { error: updateError } = await supabaseAdmin
        .from("mooov_payments")
        .update({ status: "voided" })
        .eq("id", payment.id)
        .eq("status", "pending");
      if (updateError)
        throw new Error("Expired checkout could not be updated. Please retry.");
    }
    throw error;
  }
}
