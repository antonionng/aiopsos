import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRoadmap } from "@/lib/roadmap-generator";
import { sendRoadmapReadyEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const { orgName, overallScore, dimensionScores, departmentCount } = body;

    const phases = generateRoadmap({
      orgName: orgName || "Organisation",
      overallScore: overallScore ?? 2.0,
      dimensionScores: dimensionScores ?? {
        capability: 2,
        integration: 2,
        governance: 2,
        automation: 2,
      },
      departmentCount: departmentCount ?? 5,
    });

    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("email, name")
        .eq("id", user.id)
        .single();

      if (profile) {
        await sendRoadmapReadyEmail(
          profile.email,
          profile.name,
          orgName || "Organisation",
          phases.length
        );
      }
    }

    return NextResponse.json({ phases });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
