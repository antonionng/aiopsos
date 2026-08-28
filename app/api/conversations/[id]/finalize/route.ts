import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getLanguageModel } from "@/lib/model-router";
import { createClient } from "@/lib/supabase/server";
import { meterTokenUsage } from "@/lib/meter";

/**
 * Called once, after a turn finishes streaming.
 *
 * It does two jobs that both need the persisted rows to exist, so they share
 * one round trip:
 *
 *  1. Title the thread from its first exchange.
 *  2. Hand back the real `messages.id` values.
 *
 * (2) is what makes feedback work. `message_feedback.message_id` is a foreign
 * key to `messages(id)`, but during streaming the client only knows the AI
 * SDK's own generated ids - so a thumbs-up on a just-streamed reply used to
 * fail the insert and get swallowed by an empty catch. The client reconciles
 * its local ids against these before any feedback can be sent.
 *
 * Titling is skipped when the thread already has one, so this is safe to call
 * after every turn.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ownership check: without it this would title and enumerate anyone's thread.
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!conversation)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const rows = messages ?? [];
  const messageIds = rows.map((m) => ({ id: m.id, role: m.role }));

  const needsTitle =
    !conversation.title || conversation.title === "New conversation";

  if (!needsTitle || rows.length < 2) {
    return NextResponse.json({ title: conversation.title, messages: messageIds });
  }

  const userMsg = rows.find((m) => m.role === "user")?.content ?? "";
  const assistantMsg = rows.find((m) => m.role === "assistant")?.content ?? "";

  const result = await generateText({
    model: getLanguageModel("gpt-4o-mini"),
    system:
      "Generate a concise 3-6 word title for this conversation. Return only the title text, no quotes or punctuation.",
    messages: [
      { role: "user", content: userMsg },
      { role: "assistant", content: assistantMsg.slice(0, 500) },
    ],
  });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.org_id) {
    await meterTokenUsage({
      orgId: profile.org_id,
      userId: user.id,
      model: "gpt-4o-mini",
      inputTokens: result.usage?.inputTokens ?? 0,
      outputTokens: result.usage?.outputTokens ?? 0,
      endpoint: "/api/conversations/finalize",
      description: "Conversation title",
    });
  }

  const cleanTitle =
    result.text.replace(/^["']|["']$/g, "").trim() || "New conversation";

  await supabase
    .from("conversations")
    .update({ title: cleanTitle })
    .eq("id", id)
    .eq("user_id", user.id);

  return NextResponse.json({ title: cleanTitle, messages: messageIds });
}
