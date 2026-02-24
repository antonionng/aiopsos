import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ personas: [] });
  }

  const { data: personas } = await supabase
    .from("model_personas")
    .select("*")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ personas: personas ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id || profile.role !== "admin") {
    return NextResponse.json({ error: "Only admins can create personas" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, system_prompt, department_type, icon } = body;

  const { data: persona, error } = await supabase
    .from("model_personas")
    .insert({
      org_id: profile.org_id,
      name,
      description: description || "",
      system_prompt,
      department_type: department_type || null,
      icon: icon || "bot",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ persona });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id || profile.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete personas" }, { status: 403 });
  }

  const { id } = await req.json();
  await supabase
    .from("model_personas")
    .delete()
    .eq("id", id)
    .eq("org_id", profile.org_id);

  return NextResponse.json({ success: true });
}
