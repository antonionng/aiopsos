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
    return NextResponse.json({ files: [] });
  }

  const { data: files } = await supabase
    .from("knowledge_base_files")
    .select("*, departments(name)")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ files: files ?? [] });
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

  if (!profile?.org_id || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const departmentId = formData.get("department_id") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const storagePath = `${profile.org_id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("knowledge-base")
    .upload(storagePath, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: record, error: insertError } = await supabase
    .from("knowledge_base_files")
    .insert({
      org_id: profile.org_id,
      department_id: departmentId || null,
      filename: file.name,
      storage_path: storagePath,
      file_size: file.size,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ file: record });
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

  if (!profile?.org_id || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();

  const { data: file } = await supabase
    .from("knowledge_base_files")
    .select("storage_path, org_id")
    .eq("id", id)
    .single();

  if (!file || file.org_id !== profile.org_id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await supabase.storage.from("knowledge-base").remove([file.storage_path]);
  await supabase.from("knowledge_base_files").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
