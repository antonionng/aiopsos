import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import { checkoutOrigin, courseAmountPence, playablePaidCourse } from "@/lib/self-serve/commerce";
import { currentLearner } from "@/lib/self-serve/access";
import { clampSeats, TEAM_MAX, TEAM_MIN, TEAM_PURPOSE } from "@/lib/self-serve/team-rules";
import { insertPendingTeam } from "@/lib/self-serve/teams";

export async function POST(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.json({ detail: "This course is not available yet." }, { status: 404 });
  }
  const body = (await req.json().catch(() => ({}))) as { slug?: unknown; seats?: unknown };
  const course = playablePaidCourse(typeof body.slug === "string" ? body.slug : "");
  if (!course) {
    return NextResponse.json({ detail: "This course is not available to purchase yet." }, { status: 400 });
  }
  const seats = clampSeats(body.seats);
  if (!seats) {
    return NextResponse.json(
      { detail: `Choose between ${TEAM_MIN} and ${TEAM_MAX} places. For more, email hello@experrt.com.` },
      { status: 400 }
    );
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ detail: "Card checkout is not connected on this environment yet." }, { status: 503 });
  }

  const origin = checkoutOrigin(req);
  const unit = courseAmountPence(course.priceGbp);
  const learner = await currentLearner();

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      ...(learner?.email ? { customer_email: learner.email } : {}),
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },
      tax_id_collection: { enabled: true },
      custom_text: {
        submit: {
          message: `${seats} places. Each person gets 12 months of access from the day they accept their invitation. All sales are final and no refunds are given, including for unused places. By paying you agree to the course terms of sale at ${origin}/course-terms.`,
        },
      },
      success_url: `${origin}/api/learn/team/claim?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/learn/${course.slug}`,
      line_items: [
        {
          quantity: seats,
          price_data: {
            currency: "gbp",
            unit_amount: unit,
            product_data: {
              name: `${course.title}, team place`,
              description: "One place for one person, 12 months of access from acceptance.",
            },
          },
        },
      ],
      metadata: {
        purpose: TEAM_PURPOSE,
        course_slug: course.slug,
        seats: String(seats),
        unit_amount: String(unit),
        ...(learner ? { user_id: learner.id } : {}),
      },
    });
    if (!session.url) {
      return NextResponse.json({ detail: "Checkout could not be opened. Try again in a moment." }, { status: 502 });
    }
    await insertPendingTeam({
      courseSlug: course.slug,
      seats,
      unitAmount: unit,
      stripeSessionId: session.id,
      userId: learner?.id,
    }).catch((error) => console.error("[self-serve] pending team", error));
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[self-serve] team checkout", error);
    return NextResponse.json({ detail: "Checkout could not be opened. Try again in a moment." }, { status: 502 });
  }
}
