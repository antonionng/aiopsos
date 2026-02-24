import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const conversationId = formData.get("conversation_id") as string | null;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!conversationId) {
    return new Response(
      JSON.stringify({ error: "conversation_id required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const maxSize = 20 * 1024 * 1024; // 20 MB
  if (file.size > maxSize) {
    return new Response(
      JSON.stringify({ error: "File too large (max 20 MB)" }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const storagePath = `${user.id}/${conversationId}/${randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("chat-attachments")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return new Response(
      JSON.stringify({ error: "Upload failed", detail: uploadError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("chat-attachments").getPublicUrl(storagePath);

  const { data: attachment, error: dbError } = await supabase
    .from("message_attachments")
    .insert({
      conversation_id: conversationId,
      filename: file.name,
      storage_path: storagePath,
      file_type: file.type,
      file_size: file.size,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (dbError) {
    return new Response(
      JSON.stringify({ error: "DB insert failed", detail: dbError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      id: attachment.id,
      url: publicUrl,
      filename: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
