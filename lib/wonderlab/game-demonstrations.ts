export const demonstrations = {
  route: [
    "Watch Pip. One right arrow means move one square to the right. An up arrow means move one square up.",
    "Now we press Go. Pip follows the arrows, but stops in the wrong place. We need to check our instructions.",
    "Let’s change the route to four right arrows. Try again. Now Pip crosses the bridge and reaches home!",
    "We gave instructions, checked what happened and made a change. Those habits help when using AI with a grown-up. Pip only follows fixed arrows here. Real AI works differently and still needs checking.",
  ],
  creature: [
    "The explorer needs a creature for a rainy forest. It must walk through puddles and hide among leaves. Watch the two feature slots.",
    "A space helmet looks interesting, but it does not help with puddles. A nice-looking result can still miss what we asked for.",
    "Replace the helmet with rain boots, then add a leaf disguise. Test the creature. Both features now match the job.",
    "When you ask AI to make something, explain what it needs to do. Check the result and improve your request if it misses something. These creature pieces are a prepared game, not live AI.",
  ],
  prompt: [
    "A prompt is an instruction for AI. This machine needs to write a short sign for young museum visitors, using the fact card.",
    "Watch what happens when we ask it to invent facts. The draft adds a celebrity visitor that the source never mentioned.",
    "Change that instruction to use only the fact card. The new draft stays with the supplied facts. Now compare it with the source yourself.",
    "A clearer prompt helps you describe the job. It does not guarantee a correct answer from real AI. This demonstration uses prepared drafts; your checking still matters.",
  ],
  evidence: [
    "This poster draft looks ready to publish, but first compare its claims with the source. The source says Saturday, in the library, with no food confirmed.",
    "Sunday contradicts the source, so correct it to Saturday. The library is supported, so keep it.",
    "The free-pizza promise has no supporting evidence. Remove it. The revised poster now contains only supported details.",
    "AI can produce polished, confident mistakes without deliberately lying. Check claims against evidence before trusting or publishing the result. Now try reviewing a draft yourself.",
  ],
} as const;
