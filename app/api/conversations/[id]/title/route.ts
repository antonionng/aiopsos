import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getLanguageModel } from "@/lib/model-router";
import { createClient } from "@/lib/supabase/server";
import { meterTokenUsage } from "@/lib/meter";

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

  const { data: messages } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(2);

  if (!messages || messages.length < 2)
    return NextResponse.json(
      { error: "Need at least one exchange to generate a title" },
      { status: 400 }
    );

  const userMsg = messages.find((m) => m.role === "user")?.content ?? "";
  const assistantMsg =
    messages.find((m) => m.role === "assistant")?.content ?? "";

  const result = await generateText({
    model: getLanguageModel("gpt-4o-mini"),
    system:
      "Generate a concise 3-6 word title for this conversation. Return only the title text, no quotes or punctuation.",
    messages: [
      { role: "user", content: userMsg },
      {
        role: "assistant",
        content: assistantMsg.slice(0, 500),
      },
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
      endpoint: "/api/conversations/title",
      description: "Conversation title",
    });
  }

  const cleanTitle = result.text.replace(/^["']|["']$/g, "").trim() || "New conversation";

  await supabase
    .from("conversations")
    .update({ title: cleanTitle })
    .eq("id", id)
    .eq("user_id", user.id);

  return NextResponse.json({ title: cleanTitle });
}
