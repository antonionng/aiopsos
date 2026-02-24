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
    return NextResponse.json({ prompts: [] });
  }

  const { data: prompts } = await supabase
    .from("saved_prompts")
    .select("*")
    .or(`user_id.eq.${user.id},and(is_shared.eq.true,org_id.eq.${profile.org_id})`)
    .order("created_at", { ascending: false });

  return NextResponse.json({ prompts: prompts ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation" }, { status: 400 });
  }

  const { title, content, is_shared } = await req.json();

  const { data: prompt, error } = await supabase
    .from("saved_prompts")
    .insert({
      user_id: user.id,
      org_id: profile.org_id,
      title,
      content,
      is_shared: is_shared ?? false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ prompt });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  const { id } = await req.json();

  const { data: prompt } = await supabase
    .from("saved_prompts")
    .select("user_id, org_id")
    .eq("id", id)
    .single();

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = prompt.user_id === user.id;
  const isSameOrg = profile?.org_id && prompt.org_id === profile.org_id;
  if (!isOwner && !isSameOrg) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await supabase.from("saved_prompts").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
