import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgCard, OG_SIZE, getOgFonts } from "@/lib/og-template";
export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim().slice(0,150) || "Build capability.\nBuild what’s next.";
  const subtitle = request.nextUrl.searchParams.get("description")?.trim().slice(0,190) || "An agentic learning platform and academy. AI Labs consulting and delivery for AI systems, technology, robotics and HR transformation.";
  return new ImageResponse(<OgCard title={title} subtitle={subtitle} />, { ...OG_SIZE, fonts: getOgFonts(), headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
