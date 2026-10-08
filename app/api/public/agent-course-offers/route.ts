import { NextResponse } from "next/server";
import { getAgentCourseOffer, getAgentCourseOffers } from "@/lib/always-on-agents/commerce";
import { learningErrorResponse } from "@/lib/lms/server";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    if(!new URL(request.url).searchParams.has("slug"))return NextResponse.json({offers:await getAgentCourseOffers()},{headers:{"Cache-Control":"no-store"}});
    const offer = await getAgentCourseOffer(
      new URL(request.url).searchParams.get("slug") || "",
    );
    return NextResponse.json(
      { offer },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return learningErrorResponse(error);
  }
}
