import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resourceAccessError } from "@/lib/workspace-resource-access";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to download." }, { status: 401 });
  const { data: profile } = await client.from("user_profiles").select("org_id").eq("id", user.id).single();
  const denied = await resourceAccessError(client, profile?.org_id);
  if (denied) return denied;
  const { id } = await context.params;
  const { data: file } = await client.from("knowledge_base_files").select("filename,storage_path").eq("id", id).eq("org_id", profile!.org_id).maybeSingle();
  if (!file) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const { data, error } = await supabaseAdmin.storage.from("knowledge-base").download(file.storage_path);
  if (error || !data) return NextResponse.json({ error: "Document could not be downloaded. Please retry." }, { status: 503 });
  const changed = await resourceAccessError(client, profile!.org_id);
  if (changed) return changed;
  return new Response(data, { headers: {
    "Content-Type": "application/octet-stream", "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
  } });
}
