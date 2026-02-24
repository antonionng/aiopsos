import { NextResponse } from "next/server";
import { stripe, getStripeCustomerPortalUrl } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation found" }, { status: 400 });
  }

  const { data: org } = await supabase
    .from("organisations")
    .select("stripe_customer_id")
    .eq("id", profile.org_id)
    .single();

  if (!org?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found. Subscribe first." }, { status: 400 });
  }

  const baseUrl = getStripeCustomerPortalUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
