import { NextResponse } from "next/server";
import { checkoutOrigin } from "@/lib/self-serve/commerce";
import { acceptSeat } from "@/lib/self-serve/teams";

export async function GET(req: Request) {
  const origin = checkoutOrigin(req);
  const token = new URL(req.url).searchParams.get("t") ?? "";
  if (!token) return NextResponse.redirect(new URL("/learn", origin));
  try {
    const result = await acceptSeat(token);
    if ("purchase" in result && result.purchase?.access_token) {
      const claim = new URL("/api/learn/claim", origin);
      claim.searchParams.set("slug", result.purchase.course_slug);
      claim.searchParams.set("access", result.purchase.access_token);
      return NextResponse.redirect(claim);
    }
    const reason = "error" in result ? result.error : "missing";
    return NextResponse.redirect(new URL(`/learn?place=${reason}`, origin));
  } catch (error) {
    console.error("[self-serve] team join", error);
    return NextResponse.redirect(new URL("/learn?place=failed", origin));
  }
}
