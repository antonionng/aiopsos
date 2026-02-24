import { resolveUserContext } from "@/lib/resolve-user-context";
import { getPlanFeatures } from "@/lib/constants";
import { logFeatureUsage } from "@/lib/feature-quotas";

export const maxDuration = 30;

const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;

export async function POST(req: Request) {
  const ctx = await resolveUserContext();
  if (!ctx) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!getPlanFeatures(ctx.plan).voiceChat) {
    return new Response(
      JSON.stringify({ error: "Voice chat requires an Enterprise plan." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const { text, voice = "nova" } = body;

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const selectedVoice = VALID_VOICES.includes(voice) ? voice : "nova";

  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: selectedVoice,
      response_format: "mp3",
    }),
  });

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    return new Response(
      JSON.stringify({ error: "Speech synthesis failed", detail: err }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const estimatedMinutes = (text.length / 1000) * 0.15;
  await logFeatureUsage(ctx.orgId, ctx.userId, "voice", estimatedMinutes, {
    type: "synthesis",
    voice: selectedVoice,
    char_count: text.length,
  });

  return new Response(ttsResponse.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
    },
  });
}
