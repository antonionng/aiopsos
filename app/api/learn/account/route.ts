import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendSelfServeAccountAlert, sendSelfServeWelcome } from "@/lib/email";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import { checkoutOrigin } from "@/lib/self-serve/commerce";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { cookiePurchase, currentLearner } from "@/lib/self-serve/access";
import {
  findAccountIdForEmail,
  linkPurchasesToUser,
  ownedCourseSlugs,
} from "@/lib/self-serve/records";

const MIN_PASSWORD = 8;

/**
 * Saves a sign-in on the email the buyer gave Stripe. The access cookie from
 * checkout is the proof of purchase; no organisation is created.
 */
export async function POST(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { rateLimit, RATE_LIMITS } = await import("@/lib/rate-limit");
  if (!rateLimit(`learn-account:${ip}`, RATE_LIMITS.auth).success) {
    return NextResponse.json(
      { detail: "Too many attempts. Wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: { name?: unknown; password?: unknown };
  try {
    body = (await req.json()) as { name?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ detail: "The form could not be read." }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const password = typeof body.password === "string" ? body.password : "";

  const purchase = await cookiePurchase();
  if (!purchase?.email) {
    return NextResponse.json(
      { detail: "Open the course from your receipt email first, then save your sign-in." },
      { status: 401 }
    );
  }
  const email = purchase.email.trim().toLowerCase();
  const courseTitle = getSelfServeCourse(purchase.course_slug)?.title ?? null;
  const accountUrl = `${checkoutOrigin(req)}/learn/my-courses`;

  const signedIn = await currentLearner();
  if (signedIn) {
    await linkPurchasesToUser(signedIn.id, signedIn.email);
    if (!purchase.user_id) {
      await supabaseAdmin
        .from("self_serve_purchases")
        .update({ user_id: signedIn.id, account_linked_at: new Date().toISOString() })
        .eq("id", purchase.id)
        .is("user_id", null);
    }
    return NextResponse.json({ ok: true, next: `/learn/${purchase.course_slug}` });
  }

  const existingId = await findAccountIdForEmail(email);
  if (existingId) {
    return NextResponse.json(
      {
        existing: true,
        detail: `There is already an Experrt account on ${email}. Sign in with that password, and the course will be on your account.`,
      },
      { status: 409 }
    );
  }

  if (name.length < 2) {
    return NextResponse.json({ detail: "Enter your name as you want it on your record." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { detail: `Choose a password of at least ${MIN_PASSWORD} characters.` },
      { status: 400 }
    );
  }

  const created = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (created.error || !created.data.user) {
    console.error("[self-serve] create learner", created.error);
    return NextResponse.json(
      { detail: "We could not save your sign-in. Try again in a moment." },
      { status: 500 }
    );
  }
  const userId = created.data.user.id;

  await supabaseAdmin.from("user_profiles").upsert(
    { id: userId, email, name, role: "user" },
    { onConflict: "id" }
  );
  await linkPurchasesToUser(userId, email);

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) console.error("[self-serve] sign in after create", signInError);

  try {
    await sendSelfServeWelcome({
      email,
      name,
      courseSlug: purchase.course_slug,
      courseTitle,
      accountUrl,
      owned: await ownedCourseSlugs(email),
    });
  } catch (error) {
    console.error("[self-serve] welcome mail", error);
  }
  try {
    await sendSelfServeAccountAlert({ email, name, courseTitle });
  } catch (error) {
    console.error("[self-serve] account alert", error);
  }

  return NextResponse.json({ ok: true, next: `/learn/${purchase.course_slug}` });
}
