import { NextRequest, NextResponse } from "next/server";
import { sendContactAlert } from "@/lib/email";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { assessSubmission, HONEYPOT_FIELD, FORM_TIMESTAMP_FIELD } from "@/lib/spam-defence";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many messages from this connection. Please try again shortly." },
        { status: 429, headers: getRateLimitHeaders(rl) }
      );
    }

    const body = await req.json();
    const { name, email, message } = body;

    // Silent bot check: honeypot, time-to-fill, and the character shape of the
    // text. See lib/spam-defence.ts for why each layer is weighted as it is.
    const verdict = assessSubmission({
      name,
      email,
      message,
      honeypot: body[HONEYPOT_FIELD],
      startedAt: body[FORM_TIMESTAMP_FIELD],
    });

    if (verdict.spam) {
      // Answer exactly as a success would, so a bot cannot tell it was caught
      // and start probing for the rule it tripped. Logged so a false positive
      // is recoverable rather than invisible.
      console.warn(
        `[contact] dropped as spam (${verdict.reasons.join(", ")}) from ${ip}: ` +
          `${JSON.stringify({ name, email, message }).slice(0, 300)}`
      );
      return NextResponse.json({ success: true });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[contact] RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    // React templates escape content themselves, so the hand-rolled HTML
    // escaping the old inline version needed is gone with it.
    await sendContactAlert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
