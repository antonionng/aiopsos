import { createHash } from "node:crypto";
/** Stable within an authenticated workspace and one user message, not one model call. */
export function learningTaskRequestKey(
  userId: string,
  orgId: string,
  conversationId: string,
  messageId: string,
) {
  const h = createHash("sha256")
    .update(
      JSON.stringify([
        "learning-task-v1",
        userId,
        orgId,
        conversationId,
        messageId,
      ]),
    )
    .digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}
