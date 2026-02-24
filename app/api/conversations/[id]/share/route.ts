import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, share_token, user_id")
    .eq("id", id)
    .maybeSingle();

  if (!conv || conv.user_id !== user.id) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (conv.share_token) {
    return new Response(
      JSON.stringify({ share_token: conv.share_token }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const shareToken = randomUUID().replace(/-/g, "").slice(0, 20);

  const { error } = await supabase
    .from("conversations")
    .update({ share_token: shareToken, shared_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to share", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ share_token: shareToken }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const { error } = await supabase
    .from("conversations")
    .update({ share_token: null, shared_at: null })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to un-share", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
