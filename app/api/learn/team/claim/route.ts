import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { checkoutOrigin } from "@/lib/self-serve/commerce";
import { fulfillTeamSession, manageUrl } from "@/lib/self-serve/teams";

export async function GET(req: Request) {
  const origin = checkoutOrigin(req);
  const sessionId = new URL(req.url).searchParams.get("session_id") ?? "";
  try {
    if (sessionId && process.env.STRIPE_SECRET_KEY) {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const team = await fulfillTeamSession(session, { origin });
      if (team?.manage_token) {
        return NextResponse.redirect(`${manageUrl(team, origin)}&welcome=1`);
      }
    }
  } catch (error) {
    console.error("[self-serve] team claim", error);
  }
  return NextResponse.redirect(new URL("/learn?team=retry", origin));
}
