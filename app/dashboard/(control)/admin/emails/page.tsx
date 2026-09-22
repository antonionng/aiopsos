import { redirect } from "next/navigation";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailSamples } from "@/lib/email-samples";
import { getNotifyEmail } from "@/lib/notify-email";
import { EmailTestPanel } from "./email-test-panel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Emails | Platform administration" };

export default async function AdminEmailsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/admin/emails");
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "super_admin") redirect("/dashboard");

  const samples = await Promise.all(
    emailSamples().map(async (sample) => ({
      id: sample.id,
      audience: sample.audience,
      trigger: sample.trigger,
      subject: sample.subject,
      html: await render(sample.element),
    }))
  );

  return <EmailTestPanel samples={samples} notifyEmail={getNotifyEmail()} />;
}
