import { NextResponse } from "next/server";
import { z } from "zod";
import { guestPurchase, claimGuestPurchase } from "@/lib/always-on-agents/guest-checkout";
import { currentLearner } from "@/lib/self-serve/access";
import { findAccountIdForEmail } from "@/lib/self-serve/records";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
const schema = z.object({ order: z.string().uuid(), name: z.string().trim().min(2).max(120), password: z.string().min(8).max(128) });
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`agent-learner-account:${ip}`, RATE_LIMITS.auth).success) return NextResponse.json({ detail: "Wait a minute before trying again." }, { status: 429 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ detail: "Enter your name and a password of at least eight characters." }, { status: 400 });
    const { order, name, password } = parsed.data;
    const purchase = await guestPurchase(order);
    if (!purchase?.email || purchase.status !== "paid") return NextResponse.json({ detail: "A confirmed payment in this browser is required." }, { status: 403 });
    const signedIn = await currentLearner();
    if (signedIn) return NextResponse.json({ ok: true, next: await claimGuestPurchase(order, signedIn.id) });
    if (await findAccountIdForEmail(purchase.email)) return NextResponse.json({ existing: true, detail: "You already have an Experrt account. Sign in below with the email you used at checkout to open your course." }, { status: 409 });
    const { data, error } = await supabaseAdmin.auth.admin.createUser({ email: purchase.email, password, email_confirm: true, user_metadata: { name } });
    if (error || !data.user) throw new Error("Your sign-in could not be saved. Please retry.");
    const { error: profileError } = await supabaseAdmin.from("user_profiles").upsert({ id: data.user.id, email: purchase.email, name, role: "user" });
    if (profileError) throw profileError;
    const client = await createClient();
    const { error: signInError } = await client.auth.signInWithPassword({ email: purchase.email, password });
    if (signInError) throw signInError;
    return NextResponse.json({ ok: true, next: await claimGuestPurchase(order, data.user.id) });
  } catch (error) {
    console.error("Agent learner account", error);
    return NextResponse.json({ detail: "Your learning account could not be opened. Please retry or sign in with the email you used at checkout." }, { status: 409 });
  }
}
