import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin)
    return NextResponse.json({ error: "Open your invitation on this site to continue." }, { status: 403, headers });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`accept-invite:${ip}`, { limit: 10, windowMs: 60000 }).success)
    return NextResponse.json({ error: "Please wait before trying again." }, { status: 429, headers });
  const parsed = z.object({ token: z.string().min(32).max(256), workspace: z.string().uuid() }).strict().safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "This invitation link is incomplete." }, { status: 400, headers });
  const supabase = await createClient();
  const { data: current } = await supabase.auth.getUser();
  if (current.user) return NextResponse.json({ error: "You are already signed in. Sign out before accepting an invitation for a new account." }, { status: 409, headers });
  const { error } = await supabase.auth.verifyOtp({ token_hash: parsed.data.token, type: "invite" });
  if (error) return NextResponse.json({ error: "This invitation has expired or has already been used. Ask your administrator for a new invitation." }, { status: 400, headers });
  const { data: access, error: accessError } = await supabase.rpc("current_workspace_access", { p_expected_org: parsed.data.workspace });
  if (accessError || access !== true) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "This invitation no longer grants workspace access. Contact your administrator." }, { status: 403, headers });
  }
  return NextResponse.json({ next: "/reset-password" }, { headers });
}
