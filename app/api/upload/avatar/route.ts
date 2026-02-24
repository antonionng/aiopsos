import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

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
  const storagePath = `${user.id}/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("avatars")
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
  } = supabase.storage.from("avatars").getPublicUrl(storagePath);

  const url = `${publicUrl}?t=${Date.now()}`;

  const { error: dbError } = await supabase
    .from("user_profiles")
    .update({ avatar_url: url })
    .eq("id", user.id);

  if (dbError)
    return NextResponse.json(
      { error: "Failed to save avatar URL", detail: dbError.message },
      { status: 500 }
    );

  return NextResponse.json({ url });
}
