import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { resubscribeByToken } from "@/lib/insight-subscribers";

export const dynamic = "force-dynamic";

/**
 * Undo for an unsubscribe.
 *
 * The unsubscribe link takes effect on load, which is the one-click
 * behaviour Gmail and Outlook expect. The cost of that is the reader whose
 * mail client prefetched the link and removed them from a list they wanted.
 * This route is their way back, and it needs no confirmation email because
 * the token in hand already proves they hold the address.
 *
 * POST rather than GET on purpose: the same prefetching that caused the
 * problem must not be able to undo a deliberate unsubscribe.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`insight-resubscribe:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";

  const result = await resubscribeByToken(token);
  if (!result) {
    return NextResponse.json({ error: "That link is no longer valid." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
