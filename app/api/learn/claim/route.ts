import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import { ACCESS_COOKIE, checkoutOrigin, cookieOptions } from "@/lib/self-serve/commerce";
import {
  findPaidPurchase,
  fulfillSelfServeSession,
} from "@/lib/self-serve/records";

export async function GET(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.redirect(new URL("/", checkoutOrigin(req)));
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const sessionId = url.searchParams.get("session_id") ?? "";
  const access = url.searchParams.get("access") ?? "";
  const origin = checkoutOrigin(req);
  const courseUrl = new URL(`/learn/${slug || "prompt-engineering-for-professional-work"}`, origin);

  try {
    if (sessionId && process.env.STRIPE_SECRET_KEY) {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const purchase = await fulfillSelfServeSession(session, { origin });
      if (purchase?.access_token && purchase.status === "paid") {
        const response = NextResponse.redirect(courseUrl);
        response.cookies.set(ACCESS_COOKIE, purchase.access_token, cookieOptions());
        return response;
      }
    }

    if (access && slug) {
      const purchase = await findPaidPurchase(access, slug);
      if (purchase?.access_token) {
        const response = NextResponse.redirect(courseUrl);
        response.cookies.set(ACCESS_COOKIE, purchase.access_token, cookieOptions());
        return response;
      }
    }
  } catch (error) {
    console.error("[self-serve] claim", error);
  }

  courseUrl.searchParams.set("pay", "retry");
  return NextResponse.redirect(courseUrl);
}
