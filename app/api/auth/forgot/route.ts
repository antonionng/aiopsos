import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendResetPasswordEmail } from "@/lib/email";

/**
 * Branded password reset. The client used to call Supabase's
 * resetPasswordForEmail directly, which sends Supabase's generic email from
 * mail.app.supabase.io; generateLink returns the same recovery URL without
 * sending anything, and the branded email goes out via Resend instead.
 *
 * Always answers success: whether an account exists for an email address is
 * not something this endpoint should disclose.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
    const rl = rateLimit(`forgot:${ip}`, RATE_LIMITS.auth);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(rl) }
      );
    }

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${req.nextUrl.origin}/auth/callback?next=/reset-password`,
      },
    });

    if (!error && data?.properties?.action_link) {
      try {
        await sendResetPasswordEmail(email, data.properties.action_link);
      } catch (emailError) {
        console.error("Reset email failed:", emailError);
        return NextResponse.json(
          { error: "We could not send the reset email. Please try again." },
          { status: 500 }
        );
      }
    }
    // Unknown email falls through to the same success response on purpose.

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
