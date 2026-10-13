import { NextResponse } from "next/server";
import { apiError, assertOrigin, readBody } from "@/lib/wonderlab/server";
import { arcadeContext, generateArcadeDesign } from "@/lib/wonderlab/first-person-server";

export const maxDuration = 60;
const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return NextResponse.json(await arcadeContext(), { headers });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertOrigin(request);
    return NextResponse.json(await generateArcadeDesign(await readBody(request)), { headers });
  } catch (error) {
    return apiError(error);
  }
}
