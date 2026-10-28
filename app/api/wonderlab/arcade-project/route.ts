import { NextResponse } from "next/server";
import { apiError, assertOrigin, readBody } from "@/lib/wonderlab/server";
import { loadArcadeProject, saveArcadeProject } from "@/lib/wonderlab/arcade-project-server";

const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  try {
    return NextResponse.json(await loadArcadeProject(), { headers });
  } catch (error) {
    const response = apiError(error);
    response.headers.set("Cache-Control", headers["Cache-Control"]);
    return response;
  }
}
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    return NextResponse.json(await saveArcadeProject(await readBody(request)), { headers });
  } catch (error) {
    const response = apiError(error);
    response.headers.set("Cache-Control", headers["Cache-Control"]);
    return response;
  }
}
