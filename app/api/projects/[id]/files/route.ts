import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const storagePath = `${projectId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(storagePath, file);

  if (uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: record, error: insertError } = await supabase
    .from("project_files")
    .insert({
      project_id: projectId,
      filename: file.name,
      storage_path: storagePath,
      file_size: file.size,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ file: record });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { file_id } = await req.json();

  const { data: file } = await supabase
    .from("project_files")
    .select("storage_path, project_id")
    .eq("id", file_id)
    .single();

  if (!file || file.project_id !== projectId)
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  // Verify project ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!project)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await supabase.storage.from("project-files").remove([file.storage_path]);
  await supabase.from("project_files").delete().eq("id", file_id);

  return NextResponse.json({ success: true });
}
