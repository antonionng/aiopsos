import { NextResponse } from "next/server";
import { resolveUserContext } from "@/lib/resolve-user-context";
import { checkFeatureQuota, logFeatureUsage } from "@/lib/feature-quotas";
import { getPlanFeatures } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  const ctx = await resolveUserContext();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!getPlanFeatures(ctx.plan).imageGeneration) {
    return NextResponse.json(
      { error: "Image generation requires an Enterprise plan." },
      { status: 403 }
    );
  }

  const { prompt, size = "1024x1024", quality = "standard" } = await req.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const quota = await checkFeatureQuota(ctx.orgId, "image_gen", ctx.plan, ctx.seatCount, ctx.userId);
  if (quota.requiresUpgrade) {
    return NextResponse.json(
      { error: "Image generation not available on your plan." },
      { status: 403 }
    );
  }

  const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality,
      response_format: "url",
    }),
  });

  if (!dalleResponse.ok) {
    const err = await dalleResponse.text();
    return NextResponse.json(
      { error: "Image generation failed", detail: err },
      { status: 500 }
    );
  }

  const dalleData = await dalleResponse.json();
  const imageUrl = dalleData.data?.[0]?.url;
  const revisedPrompt = dalleData.data?.[0]?.revised_prompt;

  if (!imageUrl) {
    return NextResponse.json({ error: "No image returned" }, { status: 500 });
  }

  // Download and store in Supabase
  let storedUrl = imageUrl;
  try {
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    const filename = `${ctx.userId}/${Date.now()}.png`;

    const supabase = await createClient();
    const { error: uploadError } = await supabase.storage
      .from("generated-images")
      .upload(filename, imgBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from("generated-images")
        .getPublicUrl(filename);
      if (publicUrl?.publicUrl) {
        storedUrl = publicUrl.publicUrl;
      }
    }
  } catch {
    // Use original URL if storage fails
  }

  await logFeatureUsage(ctx.orgId, ctx.userId, "image_gen", 1, {
    prompt,
    size,
    quality,
    revised_prompt: revisedPrompt,
  });

  return NextResponse.json({
    url: storedUrl,
    revised_prompt: revisedPrompt,
    overage: quota.isOverage,
  });
}
