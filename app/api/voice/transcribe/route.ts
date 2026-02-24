import { resolveUserContext } from "@/lib/resolve-user-context";
import { checkFeatureQuota, logFeatureUsage } from "@/lib/feature-quotas";
import { getPlanFeatures } from "@/lib/constants";

export const maxDuration = 30;

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

  const formData = await req.formData();
  const audioFile = formData.get("audio") as File | null;
  if (!audioFile) {
    return new Response(JSON.stringify({ error: "No audio provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const durationStr = formData.get("duration") as string | null;
  const durationMinutes = durationStr ? parseFloat(durationStr) / 60 : 0.5;

  const quota = await checkFeatureQuota(ctx.orgId, "voice", ctx.plan, ctx.seatCount, ctx.userId);
  if (quota.requiresUpgrade) {
    return new Response(
      JSON.stringify({ error: "Upgrade to Enterprise for voice chat." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const whisperResponse = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const fd = new FormData();
        fd.append("file", audioFile, audioFile.name || "audio.webm");
        fd.append("model", "whisper-1");
        fd.append("response_format", "json");
        return fd;
      })(),
    }
  );

  if (!whisperResponse.ok) {
    const err = await whisperResponse.text();
    return new Response(
      JSON.stringify({ error: "Transcription failed", detail: err }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await whisperResponse.json();

  await logFeatureUsage(ctx.orgId, ctx.userId, "voice", durationMinutes, {
    type: "transcription",
    duration_seconds: durationMinutes * 60,
  });

  return new Response(
    JSON.stringify({
      text: result.text,
      overage: quota.isOverage,
      overageCharge: quota.overageCharge,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
