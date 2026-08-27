import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Facilitators, for the super admin.
 *
 * Migration 021 created the `facilitators` table and every RLS helper that
 * depends on it, but nothing was ever built to put a row in one - they have
 * had to be inserted by hand in the SQL editor. The October tour needs a row
 * per partner trainer before a single cohort can be scheduled, so this is the
 * smallest thing that unblocks it.
 *
 * Facilitation is deliberately an attribute rather than a tenancy role
 * (021's own comment): a facilitator row is what lets one trainer run cohorts
 * for several client organisations without being a member of any of them.
 * That is the whole mechanism the tour uses to model "partners" without the
 * partner tenancy that migration 023 never delivered.
 */

async function requireSuperAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin") return null;
  return profile;
}

export async function GET() {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("facilitators")
    .select(
      "id, user_id, display_name, bio, credentials, active, created_at, user_profiles:user_id(email, name)"
    )
    .order("display_name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { facilitators: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const displayName = String(body?.display_name ?? "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A work email for an existing account is required" },
      { status: 400 }
    );
  }

  // Deliberately does not create an account. A facilitator grants read and
  // grade access across every organisation they run a cohort for, so the
  // person must already exist and be someone you can name - not an address
  // typed into a box.
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, name, email")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      {
        error:
          "No account with that address. The trainer must sign up first - this does not create accounts.",
      },
      { status: 404 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("facilitators")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "That person is already a facilitator", facilitator_id: existing.id },
      { status: 409 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("facilitators")
    .insert({
      user_id: profile.id,
      display_name: displayName || String(profile.name ?? email),
      bio: String(body?.bio ?? ""),
      credentials: Array.isArray(body?.credentials) ? body.credentials : [],
      active: true,
    })
    .select("id, user_id, display_name, active")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ facilitator: data }, { status: 201 });
}
