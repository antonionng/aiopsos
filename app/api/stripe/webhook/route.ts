import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.org_id;
      const planName = session.metadata?.plan;

      if (orgId && planName) {
        const { data: planRow } = await supabaseAdmin
          .from("subscription_plans")
          .select("id")
          .eq("name", planName)
          .single();

        await supabaseAdmin
          .from("organisations")
          .update({
            stripe_customer_id: session.customer as string,
            subscription_plan_id: planRow?.id,
            subscription_status: "active",
          })
          .eq("id", orgId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: org } = await supabaseAdmin
        .from("organisations")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (org) {
        const status = subscription.status === "active" ? "active"
          : subscription.status === "past_due" ? "past_due"
          : subscription.status === "canceled" ? "canceled"
          : "incomplete";

        await supabaseAdmin
          .from("organisations")
          .update({ subscription_status: status })
          .eq("id", org.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabaseAdmin
        .from("organisations")
        .update({ subscription_status: "canceled" })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "invoice.paid": {
      break;
    }
  }

  return NextResponse.json({ received: true });
}
