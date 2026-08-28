import { createClient } from "@/lib/supabase/server";

/**
 * Persist a turn produced by an endpoint other than /api/chat.
 *
 * Image generation and deep research write their answers straight to the
 * client and stored nothing, so reopening a thread showed the question with
 * no answer - the work was paid for and then lost. Both call this now.
 *
 * The conversation row may not exist yet: the client mints conversation ids
 * so the first message can render instantly, and /api/chat only creates the
 * row when it persists. If one of these endpoints wins that race, it creates
 * the row itself.
 */
export async function persistSideChannelTurn(opts: {
  conversationId: string | undefined;
  userId: string;
  orgId: string;
  prompt: string;
  answer: string;
  model: string;
  /** The agent the user was on, so a new thread is not mislabelled. */
  companion?: string;
}): Promise<void> {
  const { conversationId, userId, orgId, prompt, answer, model, companion } = opts;
  if (!conversationId) return;

  try {
    const supabase = await createClient();

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!conversation) {
      await supabase.from("conversations").upsert(
        {
          id: conversationId,
          user_id: userId,
          org_id: orgId,
          model,
          title: "New conversation",
          companion: ["learning", "ld", "insights"].includes(companion ?? "")
            ? companion
            : "learning",
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }

    await supabase.from("messages").insert([
      { conversation_id: conversationId, role: "user", content: prompt, model },
      { conversation_id: conversationId, role: "assistant", content: answer, model },
    ]);
  } catch {
    // Never fail the user's request because the transcript copy did not save.
  }
}
