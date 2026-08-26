import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendConfirmWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
    const rl = rateLimit(`auth:${ip}`, RATE_LIMITS.auth);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(rl) }
      );
    }

    const body = await req.json();
    const { name, email, password, orgName } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the account WITHOUT triggering Supabase's own confirmation
    // email: generateLink creates the (unconfirmed) user and hands back the
    // confirmation URL, and we send the one branded email ourselves. Two
    // emails per signup was a bug, not a feature.
    const origin = req.nextUrl.origin;
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        data: { name, org_name: orgName },
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });

    if (linkError || !linkData?.user) {
      const message = linkError?.message ?? "Failed to create account";
      if (/already|registered|exists/i.test(message)) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const userId = linkData.user.id;
    const confirmUrl = linkData.properties?.action_link;

    const { data: org, error: orgError } = await supabaseAdmin
      .from("organisations")
      .insert({ name: orgName || "My Organisation" })
      .select("id")
      .single();

    if (orgError || !org) {
      console.error("Organisation creation failed:", orgError?.message);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: "Failed to create organisation" },
        { status: 500 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: userId,
        email,
        name,
        org_id: org.id,
        role: "admin",
      });

    if (profileError) {
      console.error("Profile upsert failed:", profileError.message);
      await supabaseAdmin.from("organisations").delete().eq("id", org.id);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    const { error: ownerError } = await supabaseAdmin
      .from("organisations")
      .update({ owner_id: userId })
      .eq("id", org.id);

    if (ownerError) {
      console.error("Failed to set org owner:", ownerError.message);
    }

    // The email IS the activation path. If it cannot be sent, roll the
    // account back entirely so a retry starts clean instead of hitting
    // "email already exists" on an account that never got its link.
    try {
      if (!confirmUrl) throw new Error("generateLink returned no action_link");
      await sendConfirmWelcomeEmail(email, name, orgName || null, confirmUrl);
    } catch (emailError) {
      console.error("Confirm email failed:", emailError);
      await supabaseAdmin.from("user_profiles").delete().eq("id", userId);
      await supabaseAdmin.from("organisations").delete().eq("id", org.id);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: "We could not send your confirmation email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, needs_confirmation: true });
  } catch (err) {
    console.error("Register route error:", err);
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }
}
