import { ensureProfile } from "@/lib/supabase/ensure-profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureProfile();

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
