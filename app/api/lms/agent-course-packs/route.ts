import { NextResponse } from "next/server";
import { agentCourseBlueprints } from "@/lib/always-on-agents/catalogue";
import {
  AGENT_COURSE_VERSION,
  getAgentCoursePack,
} from "@/lib/always-on-agents/courses";
import {
  assertLearningAccess,
  LearningError,
  learningActor,
  learningErrorResponse,
} from "@/lib/lms/server";

export const dynamic = "force-dynamic";

// Authored packs are Experrt's internal course library, not customer templates.
export async function GET(request: Request) {
  try {
    const actor = await learningActor();
    await assertLearningAccess(actor, true);
    const slug = new URL(request.url).searchParams.get("slug");
    if (actor.role !== "super_admin") {
      if (slug)
        throw new LearningError(
          "The authored course library is available to Experrt platform administrators.",
          403,
        );
      return NextResponse.json(
        { courses: [] },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    if (slug) {
      const pack = getAgentCoursePack(slug);
      if (!pack)
        throw new LearningError(
          "That authored course could not be found.",
          404,
        );
      return NextResponse.json(
        { content: pack.content, version: pack.version },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    return NextResponse.json(
      {
        courses: agentCourseBlueprints.map(({ slug, title, audience }) => ({
          slug,
          title,
          audience,
        })),
        version: AGENT_COURSE_VERSION,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const response = learningErrorResponse(error);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
}
