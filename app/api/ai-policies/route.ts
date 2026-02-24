import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function getCallerProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", user.id)
    .maybeSingle();

  return profile ? { ...profile, userId: user.id } : null;
}

export async function GET() {
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const isAdmin = ["admin", "super_admin"].includes(caller.role);

  let query = supabaseAdmin
    .from("ai_policies")
    .select("*")
    .eq("org_id", caller.org_id)
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ policies: data ?? [], role: caller.role });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["admin", "super_admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Only admins can create policies" }, { status: 403 });
  }

  const body = await req.json();
  const { title, content, category, status } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const policyStatus = status === "published" ? "published" : "draft";

  const { data, error } = await supabaseAdmin
    .from("ai_policies")
    .insert({
      org_id: caller.org_id,
      title,
      content: content ?? "",
      category: category ?? "general",
      status: policyStatus,
      created_by: caller.userId,
      published_at: policyStatus === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ policy: data }, { status: 201 });
}
