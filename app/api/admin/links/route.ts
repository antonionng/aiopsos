import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

async function getAdminProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) return null;
  return profile;
}

export async function GET() {
  const supabase = await createClient();
  const profile = await getAdminProfile(supabase);
  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: links } = await supabase
    .from("assessment_links")
    .select("*, pending_responses(count)")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ links: links ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const profile = await getAdminProfile(supabase);
  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const slug = body.token
    || randomBytes(6).toString("hex");

  const { data, error } = await supabase
    .from("assessment_links")
    .insert({
      org_id: profile.org_id,
      created_by: profile.id,
      token: slug,
      title: body.title || "AI Readiness Assessment",
      description: body.description || "",
      active: true,
      expires_at: body.expires_at || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This link slug is already taken. Choose a different one." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ link: data });
}
