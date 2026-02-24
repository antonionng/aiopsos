import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, title, model, created_at")
    .eq("share_token", token)
    .maybeSingle();

  if (!conv) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, model, created_at")
    .eq("conversation_id", conv.id)
    .order("created_at", { ascending: true });

  return new Response(
    JSON.stringify({
      conversation: conv,
      messages: messages ?? [],
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
