import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { accessEndsAt } from "@/lib/self-serve/entitlement";
import { progressForPurchases, purchasesForUser } from "@/lib/self-serve/records";
import { emailPattern } from "@/lib/self-serve/teams";

export const dynamic = "force-dynamic";

function unauthorised() {
  return NextResponse.json({ detail: "Sign in first." }, { status: 401 });
}

/** Everything held about the learner, as a download (UK GDPR right of access). */
export async function GET() {
  const user = await currentLearner();
  if (!user) return unauthorised();
  const purchases = await purchasesForUser(user.id, user.email);
  const progress = await progressForPurchases(purchases.map((row) => row.id));
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("name, email, created_at")
    .eq("id", user.id)
    .maybeSingle();
  const { data: reviews } = purchases.length
    ? await supabaseAdmin
        .from("self_serve_reviews")
        .select("course_slug, display_name, role, rating, body, status, created_at, updated_at")
        .in("purchase_id", purchases.map((row) => row.id))
    : { data: [] };

  const body = {
    exported_at: new Date().toISOString(),
    controller: "Neural Network AI FZ-LLC (Experrt), hello@experrt.com",
    account: {
      id: user.id,
      email: user.email,
      name: profile?.name ?? user.user_metadata?.name ?? null,
      created_at: profile?.created_at ?? user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
    },
    purchases: purchases.map((row) => ({
      course: getSelfServeCourse(row.course_slug)?.title ?? row.course_slug,
      amount: row.amount / 100,
      currency: row.currency,
      paid_at: row.paid_at,
      access_ends_at: accessEndsAt(row.paid_at)?.toISOString() ?? null,
      name_at_checkout: row.buyer_name,
      email_at_checkout: row.email,
      stripe_checkout_session: row.stripe_session_id,
      progress: progress.get(row.id) ?? null,
    })),
    reviews: reviews ?? [],
  };
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="experrt-my-data.json"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function PATCH(req: Request) {
  const user = await currentLearner();
  if (!user) return unauthorised();
  const body = (await req.json().catch(() => ({}))) as { name?: unknown; marketing?: unknown };

  if (typeof body.name === "string") {
    const name = body.name.trim().slice(0, 120);
    if (name.length < 2) {
      return NextResponse.json({ detail: "Enter your name as you want it on your records." }, { status: 400 });
    }
    await supabaseAdmin.from("user_profiles").update({ name }).eq("id", user.id);
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, name },
    });
  }

  if (typeof body.marketing === "boolean" && user.email) {
    const ids = (await purchasesForUser(user.id, user.email)).map((row) => row.id);
    if (ids.length) {
      await supabaseAdmin
        .from("self_serve_purchases")
        .update({ marketing_opt_out_at: body.marketing ? null : new Date().toISOString() })
        .in("id", ids);
    }
  }
  return NextResponse.json({ ok: true });
}

/**
 * Closes a learner account. Progress, signed records and the sign-in are erased. Payment rows
 * stay, stripped of name and email, because sales records must be kept for tax.
 */
export async function DELETE(req: Request) {
  const user = await currentLearner();
  if (!user) return unauthorised();
  const body = (await req.json().catch(() => ({}))) as { confirm?: unknown };
  if (body.confirm !== "DELETE") {
    return NextResponse.json({ detail: "Type DELETE to confirm." }, { status: 400 });
  }

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.org_id) {
    return NextResponse.json(
      {
        detail:
          "This sign-in also belongs to an organisation on the Experrt AI LMS. Email hello@experrt.com and we will close it for you.",
      },
      { status: 409 }
    );
  }

  const ids = (await purchasesForUser(user.id, user.email)).map((row) => row.id);
  if (ids.length) {
    await supabaseAdmin.from("self_serve_reviews").delete().in("purchase_id", ids);
    const { error: progressError } = await supabaseAdmin
      .from("self_serve_progress")
      .delete()
      .in("purchase_id", ids);
    if (progressError) {
      console.error("[learn] delete progress", progressError);
      return NextResponse.json({ detail: "We could not close your account. Email hello@experrt.com." }, { status: 500 });
    }
    await supabaseAdmin
      .from("self_serve_purchases")
      .update({
        email: null,
        buyer_name: null,
        user_id: null,
        access_token: null,
        marketing_opt_out_at: new Date().toISOString(),
      })
      .in("id", ids);
  }
  await supabaseAdmin
    .from("self_serve_teams")
    .update({ buyer_email: null, buyer_name: null, user_id: null })
    .or(`user_id.eq.${user.id}${user.email ? `,buyer_email.ilike.${emailPattern(user.email)}` : ""}`);
  await supabaseAdmin.from("user_profiles").delete().eq("id", user.id);
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[learn] delete user", error);
    return NextResponse.json({ detail: "We could not close your account. Email hello@experrt.com." }, { status: 500 });
  }
  const supabase = await createClient();
  await supabase.auth.signOut().catch(() => undefined);
  return NextResponse.json({ ok: true });
}
