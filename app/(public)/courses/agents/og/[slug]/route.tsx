import { ImageResponse } from "next/og";
import { AgentOgCard } from "@/lib/agent-og-card";
import { getOgFonts, OG_SIZE } from "@/lib/og-template";
import { getAgentMarketingCourse } from "@/lib/always-on-agents/marketing";

export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getAgentMarketingCourse(slug);
  if (!course && slug !== "catalogue") return new Response("Course not found", { status: 404 });
  return new ImageResponse(<AgentOgCard
    title={course?.title ?? "Learn to work with always-on AI agents"}
    summary={course?.summary ?? "Explore 13 courses that help you plan useful tasks, give clear instructions and check your agent’s work."}
    image={course?.image ?? "/courses/always-on-agents/agent-collaboration.png"}
    group={course?.group ?? "Always-on AI agent courses"}
  />, { ...OG_SIZE, fonts: getOgFonts(), headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
