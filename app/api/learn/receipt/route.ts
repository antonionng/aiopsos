import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { currentLearner } from "@/lib/self-serve/access";
import { purchasesForUser } from "@/lib/self-serve/records";

/** Sends the learner to Stripe's own receipt for one of their purchases. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = new URL("/learn/account?receipt=missing", url.origin);
  const user = await currentLearner();
  if (!user) return NextResponse.redirect(new URL("/learn/my-courses", url.origin));

  const id = url.searchParams.get("id") ?? "";
  const owned = (await purchasesForUser(user.id, user.email)).some((row) => row.id === id);
  if (!owned) return NextResponse.redirect(back);

  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select("stripe_payment_intent_id")
    .eq("id", id)
    .maybeSingle();
  const intentId = data?.stripe_payment_intent_id as string | undefined;
  if (!intentId) return NextResponse.redirect(back);

  try {
    const intent = await getStripe().paymentIntents.retrieve(intentId, { expand: ["latest_charge"] });
    const charge = intent.latest_charge;
    const receiptUrl = charge && typeof charge !== "string" ? charge.receipt_url : null;
    if (receiptUrl) return NextResponse.redirect(receiptUrl);
  } catch (error) {
    console.error("[learn] receipt lookup", error);
  }
  return NextResponse.redirect(back);
}
