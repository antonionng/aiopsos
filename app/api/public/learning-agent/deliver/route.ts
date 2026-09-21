import { NextRequest, NextResponse } from "next/server";
import { guestContactSchema } from "@/lib/guest-agent";
import { GUEST_COOKIE, validGuestToken, hashToken, quotaHash, guestError, type GuestSession } from "@/lib/guest-agent-server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deliverGuestPack } from "@/lib/guest-agent-delivery";

export const maxDuration = 60;
const headers = { "Cache-Control": "no-store" };
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin) return NextResponse.json({ error: "Please use the contact form on this website." }, { status: 403, headers });
  const token = req.cookies.get(GUEST_COOKIE)?.value;
  if (!validGuestToken(token)) return NextResponse.json({ error: "Create your learning pack first." }, { status: 400, headers });
  const text = await req.text();
  if (text.length > 4000) return NextResponse.json({ error: "Please check your contact details." }, { status: 413, headers });
  const parsed = guestContactSchema.safeParse(await Promise.resolve().then(() => JSON.parse(text)).catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter your name, a valid email and permission to send your pack." }, { status: 400, headers });
  try {
    const { data, error } = await supabaseAdmin.rpc("guest_agent_contact", {
      p_token: hashToken(token), p_contact: parsed.data, p_mailbox: quotaHash(parsed.data.email),
    });
    if (error) { const failure = guestError(error); return NextResponse.json({ error: failure.error }, { status: failure.status, headers }); }
    await deliverGuestPack(data as GuestSession);
    return NextResponse.json({ delivered: true }, { headers });
  } catch {
    return NextResponse.json({ error: "We couldn't complete both emails yet. Retry with the same details; emails already accepted won't be sent again." }, { status: 503, headers });
  }
}
