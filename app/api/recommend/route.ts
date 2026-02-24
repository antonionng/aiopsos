import { NextRequest, NextResponse } from "next/server";
import { generateModelRouting, generateControlLayer } from "@/lib/recommendation-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { departments } = body;

    if (!departments || !Array.isArray(departments)) {
      return NextResponse.json({ error: "departments array required" }, { status: 400 });
    }

    const routing = generateModelRouting(departments);
    const controlLayer = generateControlLayer(departments);

    return NextResponse.json({ routing, controlLayer });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
