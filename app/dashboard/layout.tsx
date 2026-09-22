import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { OrgOnboarding } from "@/components/org-onboarding";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureProfile();

  // A profile with no organisation is a dead end everywhere downstream: the
  // hub prompts an assessment, the assessment page says none exists, and
  // nothing explains why. Intercept it here rather than letting each page
  // fail in its own way.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.org_id) {
    const { count } = await supabaseAdmin
      .from("self_serve_purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "paid");
    if ((count ?? 0) > 0) redirect("/learn/my-courses");
    return <OrgOnboarding email={user.email ?? ""} />;
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
