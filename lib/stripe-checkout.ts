import { getStripe } from "./stripe.ts";

export class CheckoutExpiredError extends Error {}
export async function createStripeCheckout(params: {
  paymentId: string;
  purpose: "agent_course" | "credit_pack" | "cohort";
  title: string;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  sessionId?: string | null;
  termsUrl?: string;
}) {
  const stripe = getStripe();
  if (!Number.isSafeInteger(params.amount) || params.amount <= 0)
    throw new Error("A valid payment amount is required.");
  const metadata = { payment_id: params.paymentId, purpose: params.purpose };
  const session = params.sessionId
    ? await stripe.checkout.sessions.retrieve(params.sessionId)
    : await stripe.checkout.sessions.create(
        {
          mode: "payment",
          ...(params.termsUrl ? { customer_creation: "always" as const, allow_promotion_codes: false, custom_text: { submit: { message: `Includes 12 months of course access from payment confirmation. By paying you agree to the course terms at ${params.termsUrl}. After payment, save your sign-in to open your lessons and assessment.` } } } : {}),
          adaptive_pricing: { enabled: false },
          payment_method_types: ["card"],
          client_reference_id: params.paymentId,
          metadata,
          payment_intent_data: { metadata },
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: params.currency.toLowerCase(),
                unit_amount: params.amount,
                product_data: { name: params.title },
              },
            },
          ],
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
        },
        { idempotencyKey: params.paymentId },
      );
  if (
    session.metadata?.payment_id !== params.paymentId ||
    session.metadata?.purpose !== params.purpose ||
    session.amount_total !== params.amount ||
    session.currency?.toLowerCase() !== params.currency.toLowerCase()
  )
    throw new Error("The checkout session does not match this payment.");
  if (session.status === "expired")
    throw new CheckoutExpiredError(
      "This checkout has expired. Please try again to open a new payment page.",
    );
  if (!session.url)
    throw new Error(
      "The payment is already processing or complete. Refresh your payment status before trying again.",
    );
  return session;
}

export function stripeReturnOrigin() {
  const value = process.env.NEXT_PUBLIC_APP_URL;
  if (!value) throw new Error("Payment checkout needs NEXT_PUBLIC_APP_URL.");
  const url = new URL(value);
  if (
    url.username ||
    url.password ||
    (url.protocol !== "https:" &&
      !(
        process.env.NODE_ENV !== "production" &&
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      ))
  )
    throw new Error("Payment checkout needs a secure return address.");
  return url.origin;
}
