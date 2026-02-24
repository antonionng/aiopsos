import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canUpdateOrganisation } from "@/lib/can-update-org";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .maybeSingle();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const formOrgId = formData.get("org_id") as string | null;
  const isSuperAdmin = profile?.role === "super_admin";
  const targetOrgId = isSuperAdmin
    ? (formOrgId || profile?.org_id || null)
    : profile?.org_id ?? null;

  if (isSuperAdmin) {
    if (!targetOrgId)
      return NextResponse.json(
        { error: "No organisation specified. Provide org_id for super admin." },
        { status: 400 }
      );
  } else {
    const canUpdate =
      profile?.org_id &&
      (await canUpdateOrganisation(supabase, profile));
    if (!canUpdate)
      return NextResponse.json(
        { error: "Only admins or managers can upload the organisation logo." },
        { status: 403 }
      );
  }

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json(
      { error: "File too large (max 5 MB)" },
      { status: 413 }
    );

  if (!file.type.startsWith("image/"))
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 }
    );

  const ext = file.name.split(".").pop() ?? "png";
  const storagePath = `${targetOrgId}/logo.${ext}`;
  const client = isSuperAdmin ? supabaseAdmin : supabase;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await client.storage
    .from("logos")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError)
    return NextResponse.json(
      { error: "Upload failed", detail: uploadError.message },
      { status: 500 }
    );

  const {
    data: { publicUrl },
  } = client.storage.from("logos").getPublicUrl(storagePath);

  const url = `${publicUrl}?t=${Date.now()}`;

  const { error: dbError } = await client
    .from("organisations")
    .update({ logo_url: url })
    .eq("id", targetOrgId);

  if (dbError)
    return NextResponse.json(
      { error: "Failed to save logo URL", detail: dbError.message },
      { status: 500 }
    );

  return NextResponse.json({ url });
}
