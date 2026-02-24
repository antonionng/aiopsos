import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const searchTerm = `%${q}%`;

  // Search messages belonging to user's conversations
  const { data: matches, error } = await supabase
    .from("messages")
    .select(
      "id, content, role, conversation_id, conversations!inner(id, title, user_id)"
    )
    .eq("conversations.user_id", user.id)
    .ilike("content", searchTerm)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return new Response(
      JSON.stringify({ error: "Search failed", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Deduplicate by conversation, keep first (most recent) match
  const seen = new Set<string>();
  const results: Array<{
    conversation_id: string;
    title: string;
    snippet: string;
    role: string;
  }> = [];

  for (const m of matches ?? []) {
    if (seen.has(m.conversation_id)) continue;
    seen.add(m.conversation_id);

    const conv = m.conversations as unknown as { title: string };
    const idx = m.content.toLowerCase().indexOf(q.toLowerCase());
    const start = Math.max(0, idx - 40);
    const end = Math.min(m.content.length, idx + q.length + 60);
    const snippet =
      (start > 0 ? "…" : "") +
      m.content.slice(start, end) +
      (end < m.content.length ? "…" : "");

    results.push({
      conversation_id: m.conversation_id,
      title: conv.title,
      snippet,
      role: m.role,
    });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
}
