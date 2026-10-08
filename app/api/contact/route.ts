import { NextRequest, NextResponse, after } from "next/server";
import { contactSchema, formatContactEnquiry } from "@/lib/contact-enquiry";
import { sendContactAlert } from "@/lib/email";
import { captureInbound } from "@/lib/inbound-capture";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { assessSubmission, HONEYPOT_FIELD, FORM_TIMESTAMP_FIELD } from "@/lib/spam-defence";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);
  if (!rl.success) return NextResponse.json({ error: "Too many messages. Please try again shortly." }, { status: 429, headers: getRateLimitHeaders(rl) });
  const raw = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Please enter your name, a valid email and a message under 5,000 characters." }, { status: 400 });
  const input = parsed.data;
  const verdict = assessSubmission({ ...input, honeypot: raw[HONEYPOT_FIELD], startedAt: raw[FORM_TIMESTAMP_FIELD] });
  if (verdict.spam) return NextResponse.json({ success: true });
  try {
    const message = formatContactEnquiry(input);
    const result = await captureInbound({ request_id: input.request_id, name: input.name, email: input.email, message, organisation_name: input.organisation_name, source: "contact", marketing_consent: false });
    if (result.created) after(async () => {
      try { await sendContactAlert({ name: input.name, email: input.email, message: `${input.organisation_name ? `Organisation: ${input.organisation_name}\n\n` : ""}${message}` }); }
      catch { console.error("[contact] enquiry saved; notification failed", input.request_id); }
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "We couldn't save your message. Please try again, or email ag@experrt.com." }, { status: 503 });
  }
}
