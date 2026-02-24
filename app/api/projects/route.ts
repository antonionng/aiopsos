import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .select("*, conversations(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const projects = (data ?? []).map((p) => ({
    ...p,
    conversation_count:
      (p.conversations as unknown as { count: number }[])?.[0]?.count ?? 0,
    conversations: undefined,
  }));

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id)
    return NextResponse.json(
      { error: "No organisation found" },
      { status: 400 }
    );

  const body = await req.json();
  const {
    name,
    description = "",
    instructions = "",
    color = "#6366f1",
  } = body;

  if (!name?.trim())
    return NextResponse.json(
      { error: "Project name is required" },
      { status: 400 }
    );

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      org_id: profile.org_id,
      name: name.trim(),
      description,
      instructions,
      color,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ project });
}
