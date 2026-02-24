import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";

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

    const supabase = await createClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, org_name: orgName },
      },
    });

    if (signUpError || !authData.user) {
      return NextResponse.json(
        { error: signUpError?.message || "Failed to create account" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identities = (authData.user as any).identities;
    if (Array.isArray(identities) && identities.length === 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const { data: org, error: orgError } = await supabaseAdmin
      .from("organisations")
      .insert({ name: orgName || "My Organisation" })
      .select("id")
      .single();

    if (orgError || !org) {
      console.error("Organisation creation failed:", orgError?.message);
      return NextResponse.json(
        { error: "Failed to create organisation" },
        { status: 500 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: authData.user.id,
        email,
        name,
        org_id: org.id,
        role: "admin",
      });

    if (profileError) {
      console.error("Profile upsert failed:", profileError.message);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      console.error("Post-signup sign-in failed:", signInError.message);
    }

    sendWelcomeEmail(email, name, orgName);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register route error:", err);
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }
}
