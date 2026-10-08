import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { currentLearner } from "@/lib/self-serve/access";
import { courseHoldings } from "@/lib/self-serve/records";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentLearner();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const [{ data: profile }, holdings] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("name, org_id").eq("id", user.id).maybeSingle(),
    courseHoldings(user.id, user.email).catch(() => []),
  ]);
  const name =
    (profile?.name as string | undefined)?.trim() ||
    (user.user_metadata?.name as string | undefined)?.trim() ||
    "";

  return NextResponse.json(
    {
      signedIn: true,
      name,
      email: user.email ?? "",
      lms: Boolean(profile?.org_id),
      owned: holdings.filter((holding) => holding.active).map((holding) => holding.purchase.course_slug),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
