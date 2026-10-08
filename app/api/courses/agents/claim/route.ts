import { NextResponse } from "next/server";
import { confirmGuestSession } from "@/lib/always-on-agents/guest-checkout";
import { stripeReturnOrigin } from "@/lib/stripe-checkout";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("order") ?? "";
  const session = url.searchParams.get("session_id") ?? "";
  const base = stripeReturnOrigin();
  try { await confirmGuestSession(id, session); }
  catch { return NextResponse.redirect(new URL(`/courses/agents/welcome?order=${encodeURIComponent(id)}&payment=check`, base)); }
  return NextResponse.redirect(new URL(`/courses/agents/welcome?order=${encodeURIComponent(id)}`, base));
}
