import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendResetPasswordEmail } from "@/lib/email";
import { assessSubmission, HONEYPOT_FIELD, FORM_TIMESTAMP_FIELD } from "@/lib/spam-defence";

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

    // An email address is the only text here, so only the near-zero
    // false-positive layers apply: the honeypot and the time-to-fill check.
    const verdict = assessSubmission({
      honeypot: body[HONEYPOT_FIELD],
      startedAt: body[FORM_TIMESTAMP_FIELD],
    });
    if (verdict.spam) {
      console.warn(
        `[forgot] dropped as spam (${verdict.reasons.join(", ")}) from ${ip}: ${email}`
      );
      return NextResponse.json({ success: true });
    }

    // Per-mailbox cap, on top of the per-IP one: the bots pace one request
    // every few minutes from rotating addresses, which no IP limit sees, and
    // the victim of the flood is the inbox. Silent success past the cap - a
    // reset link from the earlier email still works, and a 429 keyed on the
    // address would leak that the address is being watched.
    const emailRl = rateLimit(
      `forgot-email:${email.toLowerCase()}`,
      RATE_LIMITS.forgotEmail
    );
    if (!emailRl.success) {
      console.warn(`[forgot] per-email cap hit for ${email} from ${ip}`);
      return NextResponse.json({ success: true });
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
