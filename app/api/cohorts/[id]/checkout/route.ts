import { NextRequest, NextResponse } from "next/server";
import { getStripe, getStripeCustomerPortalUrl } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";

export const dynamic = "force-dynamic";

/**
 * Pay for a cohort.
 *
 * Pricing is per cohort, not per seat: a facilitator, a date and a seat limit
 * are a fixed cost regardless of whether ten or twelve people sit in the
 * room. So this is a one-off `payment`, separate from the org's seat
 * subscription, and uses inline `price_data` rather than a catalogue Price -
 * training is quoted per engagement and rarely twice at the same number.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, org_id, title, price_amount, currency, paid_at, courses:course_id(title)")
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!cohort.org_id || cohort.org_id !== actor.orgId) {
    return NextResponse.json(
      { error: "Only the organisation that owns this cohort can pay for it" },
      { status: 403 }
    );
  }

  if (cohort.paid_at) {
    return NextResponse.json({ error: "This cohort is already paid" }, { status: 409 });
  }

  if (!cohort.price_amount || cohort.price_amount <= 0) {
    return NextResponse.json(
      { error: "This cohort has no price set" },
      { status: 400 }
    );
  }

  const { data: org } = await supabase
    .from("organisations")
    .select("stripe_customer_id, name")
    .eq("id", cohort.org_id)
    .single();

  const stripe = getStripe();
  let customerId = org?.stripe_customer_id;

  if (!customerId) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("id", actor.userId)
      .maybeSingle();

    const customer = await stripe.customers.create({
      email: profile?.email ?? undefined,
      name: org?.name ?? undefined,
      metadata: { org_id: cohort.org_id },
    });
    customerId = customer.id;

    await supabase
      .from("organisations")
      .update({ stripe_customer_id: customerId })
      .eq("id", cohort.org_id);
  }

  const course = cohort.courses as unknown as { title: string } | null;
  const baseUrl = getStripeCustomerPortalUrl();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: cohort.currency.toLowerCase(),
          unit_amount: cohort.price_amount,
          product_data: {
            name: course?.title ?? cohort.title,
            description: `Facilitated cohort: ${cohort.title}`,
          },
        },
      },
    ],
    success_url: `${baseUrl}/dashboard/cohorts/${id}?paid=1`,
    cancel_url: `${baseUrl}/dashboard/cohorts/${id}`,
    // The webhook keys off cohort_id. `plan` is deliberately absent so the
    // subscription branch of the webhook ignores this session entirely.
    metadata: { org_id: cohort.org_id, cohort_id: id },
  });

  await supabase
    .from("cohorts")
    .update({ stripe_session_id: session.id })
    .eq("id", id);

  return NextResponse.json({ url: session.url });
}
