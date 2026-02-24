import { NextResponse } from "next/server";
import { stripe, getStripeCustomerPortalUrl } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { stripeCheckoutSchema, validateBody } = await import("@/lib/validations");
  const validation = validateBody(stripeCheckoutSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { priceId, plan } = validation.data;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, email")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation found" }, { status: 400 });
  }

  const { data: org } = await supabase
    .from("organisations")
    .select("stripe_customer_id, seat_count, name")
    .eq("id", profile.org_id)
    .single();

  let customerId = org?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      name: org?.name ?? undefined,
      metadata: { org_id: profile.org_id, plan },
    });
    customerId = customer.id;

    await supabase
      .from("organisations")
      .update({ stripe_customer_id: customerId })
      .eq("id", profile.org_id);
  }

  const baseUrl = getStripeCustomerPortalUrl();
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    currency: "gbp",
    line_items: [
      {
        price: priceId,
        quantity: org?.seat_count ?? 5,
      },
    ],
    success_url: `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/billing`,
    metadata: { org_id: profile.org_id, plan },
  });

  return NextResponse.json({ url: session.url });
}
