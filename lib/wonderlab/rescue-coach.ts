export const rescueCoaching = {
  plan: "Tap an arrow. Each arrow tells Pip to move one square. Pip waits until you press Go.",
  watch: "Watch Pip follow your arrows. Check where Pip stops.",
  repair:
    "Tap the arrow with the cross to remove it. Add a different arrow, then press Go to try again.",
  short:
    "Pip needs more steps. Add an arrow, then press Go to try the whole route again.",
  home: "Pip is home! You gave instructions and checked where they led.",
  key: "Pip still needs the key. Change your route to visit the key before the door.",
  ready: "Your arrows are ready. Press Go and watch what happens.",
  limit:
    "Your route has fourteen arrows. Remove an arrow before adding another.",
  transfer:
    "An AI helper has counted these apples. It says there are three. Count them together. Is the AI answer right?",
  retry:
    "Let’s check the picture. Touch each apple as you count: one, two. Does that match three?",
  success:
    "You checked! There are two apples, not three. AI can sound sure and still get things wrong. Check its answers with a grown-up.",
} as const;
export function readRescueDraft(
  raw: string | null,
): ("up" | "down" | "left" | "right")[] {
  try {
    const value = JSON.parse(raw ?? "[]");
    if (
      !Array.isArray(value) ||
      value.length > 14 ||
      !value.every((d) => ["up", "down", "left", "right"].includes(d))
    )
      return [];
    return value;
  } catch {
    return [];
  }
}
