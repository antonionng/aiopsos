import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { learningCheckSchema, scoreLearningCheck } from "@/lib/learning-check";
import { captureInbound } from "@/lib/inbound-capture";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { sendContactAlert } from "@/lib/email";
import { HONEYPOT_FIELD } from "@/lib/spam-defence";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`learning-check:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) return NextResponse.json({ error: "Please wait a moment before trying again." }, { status: 429, headers: getRateLimitHeaders(rl) });
  const raw = await req.json().catch(() => null);
  if (raw?.[HONEYPOT_FIELD]) return NextResponse.json({ error: "We couldn't save this submission." }, { status: 400 });
  const parsed = learningCheckSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Check your name, email and consent, and answer every question." }, { status: 400 });
  const input = parsed.data;
  let assessment;
  try { assessment = scoreLearningCheck(input.categories, input.answers); }
  catch { return NextResponse.json({ error: "Please answer every question before viewing your results." }, { status: 400 }); }
  const message = `Learning check: ${input.scope}\nSelf-reported learning needs, not a qualification.\n${assessment.scores.map(s => `${s.key}: ${s.score.toFixed(1)} / 5`).join("\n")}\nMarketing opt-in: ${input.marketing_consent ? "Yes" : "No"}`;
  try {
    const result = await captureInbound({ request_id: input.request_id, name: input.name, email: input.email,
      organisation_name: input.organisation_name, message, source: "learning_check", marketing_consent: input.marketing_consent,
      assessment_data: { ...assessment, scope: input.scope } });
    if (result.created) after(async () => {
      try { await sendContactAlert({ name: input.name, email: input.email, message }); }
      catch { console.error("[learning-check] lead saved; notification failed", input.request_id); }
    });
    return NextResponse.json({ success: true, scores: assessment.scores }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "We couldn't save your details. Please try again." }, { status: 503 });
  }
}
