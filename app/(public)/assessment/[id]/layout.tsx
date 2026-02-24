import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function PublicAssessmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let orgName: string | null = null;
  let logoUrl: string | null = null;

  const { data: assessment } = await supabaseAdmin
    .from("assessments")
    .select("org_id")
    .eq("id", id)
    .single();

  if (assessment) {
    const { data: org } = await supabaseAdmin
      .from("organisations")
      .select("name, logo_url")
      .eq("id", assessment.org_id)
      .single();

    orgName = org?.name ?? null;
    logoUrl = org?.logo_url ?? null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          {orgName ? (
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={orgName}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {orgName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium">{orgName}</span>
            </div>
          ) : (
            <div />
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Powered by
            <Image src="/logo.png" alt="AIOPSOS" width={60} height={24} className="h-5 w-auto" unoptimized />
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
