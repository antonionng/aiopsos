import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { guestBriefSchema } from "@/lib/guest-agent";
import { GUEST_COOKIE, validGuestToken, hashToken, quotaHash, readGuest, guestView, guestError, runGuestAgent, type GuestSession } from "@/lib/guest-agent-server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkInput } from "@/lib/guardrails";

export const maxDuration = 120;
const headers = { "Cache-Control": "no-store" };

export async function GET(req: NextRequest) {
  let token = req.cookies.get(GUEST_COOKIE)?.value;
  try {
    let session = validGuestToken(token) ? await readGuest(token) : null;
    if (session && new Date(session.expires_at).getTime() <= Date.now()) { session = null; token = undefined; }
    // Keep an unused cookie stable, including during the first generation.
    if (!validGuestToken(token)) token = randomBytes(32).toString("hex");
    const response = NextResponse.json(guestView(session), { headers });
    response.cookies.set(GUEST_COOKIE, token!, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 43200, path: "/api/public/learning-agent" });
    return response;
  } catch {
    return NextResponse.json({ error: "The agent is temporarily unavailable. Please try again shortly." }, { status: 503, headers });
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin) return NextResponse.json({ error: "Please use the agent on this website." }, { status: 403, headers });
  const token = req.cookies.get(GUEST_COOKIE)?.value;
  if (!validGuestToken(token)) return NextResponse.json({ error: "Refresh to start your guest session." }, { status: 400, headers });
  const text = await req.text();
  if (text.length > 12000) return NextResponse.json({ error: "Please keep your brief under 2,000 characters." }, { status: 413, headers });
  const parsed = guestBriefSchema.safeParse(await Promise.resolve().then(() => JSON.parse(text)).catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Describe your goal in 10 to 2,000 characters." }, { status: 400, headers });
  const checked = checkInput(parsed.data.brief);
  if (checked.blocked) return NextResponse.json({ error: "Please describe the learning materials you want to create." }, { status: 400, headers });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "The agent is temporarily unavailable. Please try again shortly." }, { status: 503, headers });
  let claimed: GuestSession | null = null;
  try {
    const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      ?? (process.env.NODE_ENV !== "production" ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : null) ?? "unknown";
    const { data, error } = await supabaseAdmin.rpc("guest_agent_claim", {
      p_token: hashToken(token), p_ip: quotaHash(ip), p_brief: checked.redactedText ?? parsed.data.brief,
    });
    if (error) { const failure = guestError(error); return NextResponse.json({ error: failure.error }, { status: failure.status, headers }); }
    claimed = data as GuestSession;
    return NextResponse.json(await runGuestAgent(claimed), { headers });
  } catch {
    if (claimed) await supabaseAdmin.from("guest_agent_sessions").update({ lease: null, lease_until: null, progress: ["This attempt could not finish. Your earlier pack is still available."] }).eq("id", claimed.id).eq("lease", claimed.lease);
    return NextResponse.json({ error: "The agent couldn't finish this attempt. Please retry if you have an attempt remaining. Any earlier pack is still available." }, { status: 503, headers });
  }
}
