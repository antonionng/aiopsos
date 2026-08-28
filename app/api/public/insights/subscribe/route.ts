import { NextRequest, NextResponse } from "next/server";
import { insightSubscribeSchema, validateBody } from "@/lib/validations";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { subscribe } from "@/lib/insight-subscribers";
import { sendInsightConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Joining the insights list.
 *
 * Open to anonymous visitors by definition. Rate limited on the public
 * budget, because an unauthenticated write that triggers an outbound email
 * is the one people try to abuse: without the limit this endpoint mails
 * arbitrary addresses on demand.
 *
 * The response is deliberately identical whether the address was new,
 * pending, or already confirmed. Different replies would turn this into a
 * way to ask "is this person on the Experrt list", which is not a question
 * an anonymous caller gets to have answered.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`insight-subscribe:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) {
    return NextResponse.json(
      {
        error:
          "Too many sign-ups from this connection. Please try again shortly.",
      },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const validation = validateBody(
    insightSubscribeSchema,
    await req.json().catch(() => null)
  );
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data;
  const result = await subscribe(
    input.email,
    input.source,
    input.source_slug ?? null
  );

  if (result.kind === "error") {
    console.error("[insights] subscribe failed", result.message);
    return NextResponse.json(
      { error: "Could not save that address. Please try again." },
      { status: 500 }
    );
  }

  // A failed send must not fail the request. The row is already saved, and
  // a second attempt from the same person re-sends the confirmation with a
  // fresh token rather than colliding.
  if (result.kind === "confirmation_sent") {
    try {
      await sendInsightConfirmationEmail(result.email, result.confirmToken);
    } catch (error) {
      console.error("[insights] confirmation email failed", error);
    }
  }

  return NextResponse.json({ ok: true });
}
