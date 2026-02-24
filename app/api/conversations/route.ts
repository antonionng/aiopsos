import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");

  let query = supabase
    .from("conversations")
    .select("*, messages(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const conversations = (data ?? []).map((c) => ({
    ...c,
    message_count:
      (c.messages as unknown as { count: number }[])?.[0]?.count ?? 0,
    messages: undefined,
  }));

  return NextResponse.json({ conversations });
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
  const { model = "gpt-4o-mini", project_id } = body;

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      org_id: profile.org_id,
      model,
      title: "New conversation",
      project_id: project_id || null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ conversation });
}
