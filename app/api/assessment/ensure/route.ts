import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Return the organisation's active assessment, creating one if there is none.
 *
 * Employees used to hit a wall here: every "Take assessment" call to action
 * in the product led to "Your admin hasn't created an assessment yet", with
 * no way forward and nothing they could do about it. Meanwhile the public
 * link flow creates an active assessment automatically on first signup, so
 * the same organisation could have assessed strangers but not its own staff.
 *
 * Any member of the organisation may call this. An assessment is an org-level
 * container with no content of its own - the questions are the same for
 * everyone - so creating one on demand costs nothing and unblocks the person
 * who is actually trying to be assessed.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation" }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from("assessments")
    .select("id")
    .eq("org_id", profile.org_id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ assessment_id: existing.id, created: false });
  }

  const { data: created, error } = await supabaseAdmin
    .from("assessments")
    .insert({
      org_id: profile.org_id,
      created_by: user.id,
      title: "AI Readiness Assessment",
      status: "active",
    })
    .select("id")
    .single();

  if (error || !created) {
    return NextResponse.json(
      { error: error?.message ?? "Could not start an assessment" },
      { status: 500 }
    );
  }

  return NextResponse.json({ assessment_id: created.id, created: true }, { status: 201 });
}
