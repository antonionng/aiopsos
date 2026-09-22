import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import {
  checkoutOrigin,
  courseAmountPence,
  playablePaidCourse,
  SELF_SERVE_PURPOSE,
} from "@/lib/self-serve/commerce";
import { insertPendingPurchase } from "@/lib/self-serve/records";

export async function POST(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.json({ detail: "This course is not available yet." }, { status: 404 });
  }

  let slug = "";
  try {
    const body = (await req.json()) as { slug?: string };
    slug = typeof body.slug === "string" ? body.slug : "";
  } catch {
    return NextResponse.json({ detail: "Choose a course to buy." }, { status: 400 });
  }

  const course = playablePaidCourse(slug);
  if (!course) {
    return NextResponse.json(
      { detail: "This course is not available to purchase yet." },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { detail: "Card checkout is not connected on this environment yet." },
      { status: 503 }
    );
  }

  const origin = checkoutOrigin(req);
  const amount = courseAmountPence(course.priceGbp);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      billing_address_collection: "auto",
      success_url: `${origin}/api/learn/claim?slug=${encodeURIComponent(course.slug)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/learn/${course.slug}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: amount,
            product_data: {
              name: course.title,
              description: course.promise,
            },
          },
        },
      ],
      metadata: {
        purpose: SELF_SERVE_PURPOSE,
        course_slug: course.slug,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { detail: "Checkout could not be opened. Try again in a moment." },
        { status: 502 }
      );
    }

    try {
      await insertPendingPurchase({
        courseSlug: course.slug,
        amount,
        currency: "GBP",
        stripeSessionId: session.id,
      });
    } catch (error) {
      console.error("[self-serve] pending purchase", error);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[self-serve] checkout", error);
    return NextResponse.json(
      { detail: "Checkout could not be opened. Try again in a moment." },
      { status: 502 }
    );
  }
}
