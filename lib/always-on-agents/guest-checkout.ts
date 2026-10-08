import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { LearningError } from "@/lib/lms/server";
export const AGENT_CHECKOUT_COOKIE = "experrt_agent_checkout";
export const guestHash = (token: string) => createHash("sha256").update(token).digest("hex");
export async function guestToken(create = false) {
  const jar = await cookies();
  let token = jar.get(AGENT_CHECKOUT_COOKIE)?.value ?? "";
  if (!/^[a-f0-9]{64}$/.test(token)) token = "";
  if (!token && create) {
    token = randomBytes(32).toString("hex");
    jar.set(AGENT_CHECKOUT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 400 });
  }
  return token;
}
export async function guestPurchase(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  const token = await guestToken();
  if (!token) return null;
  const { data, error } = await supabaseAdmin.from("agent_course_guest_checkouts").select("id,course_slug,title,status,email,buyer_name,order_id,stripe_session_id").eq("id", id).eq("token_hash", guestHash(token)).maybeSingle();
  if (error) throw new LearningError("Your purchase could not be loaded. Please retry.", 503);
  return data;
}
export async function applyGuestPayment(params: { eventId: string; paymentId: string; type: string; amount: number; currency: string; sessionId?: string; intentId?: string | null; email?: string | null; name?: string | null }) {
  const { error } = await supabaseAdmin.rpc("agent_course_guest_payment", { p_event: params.eventId, p_payment: params.paymentId, p_type: params.type, p_amount: params.amount, p_currency: params.currency, p_session: params.sessionId ?? null, p_intent: params.intentId ?? null, p_email: params.email ?? null, p_name: params.name ?? null });
  if (error) throw new Error(error.message);
}
export async function confirmGuestSession(id: string, sessionId: string) {
  const purchase = await guestPurchase(id);
  if (!purchase || purchase.stripe_session_id !== sessionId) throw new LearningError("Open checkout in the browser you used to buy the course.", 403);
  const session: Stripe.Checkout.Session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "paid" && session.metadata?.purpose === "agent_course" && session.metadata.payment_id && session.amount_total && session.currency) {
    await applyGuestPayment({ eventId: `return_${session.id}`, paymentId: session.metadata.payment_id, type: "captured", amount: session.amount_total, currency: session.currency, sessionId: session.id, intentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id, email: session.customer_details?.email ?? session.customer_email, name: session.customer_details?.name });
  }
  return guestPurchase(id);
}
export async function claimGuestPurchase(id: string, userId: string) {
  const { data, error } = await supabaseAdmin.rpc("agent_course_guest_claim", { p_guest: id, p_hash: guestHash(await guestToken()), p_actor: userId });
  if (error) throw new LearningError(error.message, error.code === "42501" ? 403 : 409);
  return `/courses/agents/learn/${data}`;
}
