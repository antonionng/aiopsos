import { NextResponse } from "next/server";
import {
  apiError,
  assertOrigin,
  readBody,
  requireParent,
  db,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { launchStatus } from "@/lib/wonderlab/flags";
import { getStripe } from "@/lib/stripe";
import {
  MEMBERSHIP_PURPOSE,
  MEMBERSHIP_PRICE_PENCE,
} from "@/lib/wonderlab/membership-rules";
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const user = await requireParent();
    const b = await readBody(req);
    const launch = launchStatus();
    if (!launch.commerce)
      throw new WonderlabError(
        "Memberships are not open yet. You can try the free games.",
        503,
      );
    if (
      b.acceptedTerms !== launch.terms ||
      b.immediateAccess !== true ||
      b.ukResident !== true
    )
      throw new WonderlabError(
        "Confirm the monthly membership terms and immediate access request.",
      );
    const { data: child, error: ce } = await db
      .from("wonderlab_children")
      .select("*")
      .eq("id", b.childId)
      .eq("parent_id", user.id)
      .is("deletion_requested_at", null)
      .maybeSingle();
    if (ce) throw ce;
    if (!child)
      throw new WonderlabError("Choose one of your child profiles.", 404);
    const { data: grants, error: grantError } = await db
      .from("wonderlab_orders")
      .select("id")
      .eq("parent_id", user.id)
      .eq("child_id", child.id)
      .eq("state", "granted");
    if (grantError) throw grantError;
    if (grants?.length)
      throw new WonderlabError(
        "This child already has complimentary lifetime access. No subscription is needed.",
        409,
      );
    const findMembership = () =>
      db
        .from("wonderlab_memberships")
        .select("*")
        .eq("child_id", child.id)
        .eq("parent_id", user.id)
        .in("state", [
          "pending",
          "incomplete",
          "trialing",
          "active",
          "past_due",
          "unpaid",
          "paused",
        ])
        .maybeSingle();
    let { data: membership, error: me } = await findMembership();
    if (me) throw me;
    if (!membership) {
      const inserted = await db
        .from("wonderlab_memberships")
        .insert({
          parent_id: user.id,
          child_id: child.id,
          terms_version: launch.terms,
        })
        .select("*")
        .single();
      if (inserted.error?.code === "23505") {
        const retry = await findMembership();
        membership = retry.data;
        me = retry.error;
      } else {
        membership = inserted.data;
        me = inserted.error;
      }
      if (me) throw me;
    }
    if (!membership) throw new Error("Membership missing");
    if (membership.state !== "pending" || membership.stripe_subscription_id)
      throw new WonderlabError(
        "This child already has a membership. Manage it in your family area.",
        409,
      );
    if (membership.terms_version !== launch.terms)
      throw new WonderlabError(
        "The membership terms have changed. Please contact Experrt to reset this pending checkout.",
        409,
      );
    const stripe = getStripe();
    if (membership.stripe_session_id) {
      const existing = await stripe.checkout.sessions.retrieve(
        membership.stripe_session_id,
      );
      if (existing.status === "open" && existing.url)
        return NextResponse.json({ url: existing.url });
      if (existing.status === "complete")
        throw new WonderlabError(
          "Payment confirmation is on its way. Refresh your family area.",
          409,
        );
    }
    const origin = process.env.NEXT_PUBLIC_APP_URL;
    if (!origin) throw new WonderlabError("Checkout is being configured.", 503);
    const metadata = {
      purpose: MEMBERSHIP_PURPOSE,
      membership_id: membership.id,
    };
    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: user.email,
        success_url: `${origin}/wonderlab/family?payment=return`,
        cancel_url: `${origin}/wonderlab/family`,
        billing_address_collection: "required",
        metadata,
        subscription_data: { metadata },
        custom_text: {
          submit: {
            message:
              "£20 per month for one child. All 24 Wonderlab courses included. Renews monthly until cancelled. Cancel in your family area; access continues until the end of the paid month.",
          },
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "gbp",
              unit_amount: MEMBERSHIP_PRICE_PENCE,
              recurring: { interval: "month" },
              tax_behavior: "inclusive",
              product_data: {
                name: "Wonderlab membership · one child",
                description:
                  "All 24 game-based courses. £20 per month, final consumer price.",
              },
            },
          },
        ],
      },
      {
        idempotencyKey: `wonderlab-membership-${membership.id}-${membership.stripe_session_id ?? "first"}`,
      },
    );
    if (!session.url) throw new Error("Checkout URL missing");
    const { error } = await db
      .from("wonderlab_memberships")
      .update({ stripe_session_id: session.id })
      .eq("id", membership.id);
    if (error) throw error;
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return apiError(e);
  }
}
