import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PROFILE_FIELDS =
  "id, email, name, role, org_id, department_id, job_title, bio, skills, preferences, avatar_url";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select(PROFILE_FIELDS)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[profile] GET failed:", profileError.message, profileError.details);
  }

  if (!profile) {
    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email ?? "",
        name: user.user_metadata?.name ?? "",
        role: "user",
        org_id: null,
        department_id: null,
        job_title: "",
        bio: "",
        skills: "",
        preferences: {},
        avatar_url: null,
      },
    });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const allowed = ["name", "job_title", "bio", "skills", "preferences", "avatar_url"];

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id)
    .select(PROFILE_FIELDS)
    .single();

  if (error) {
    console.error("[profile] PATCH failed:", error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
