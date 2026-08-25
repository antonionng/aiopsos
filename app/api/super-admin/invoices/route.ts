import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createInvoiceForPack, createInvoiceForCohort } from "@/lib/invoices";

async function requireSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin") return null;
  return profile;
}

/** All invoices, newest first, with org names for the list view. */
export async function GET() {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: invoices } = await supabaseAdmin
    .from("billing_invoices")
    .select(
      "id, invoice_number, org_id, status, issue_date, due_date, currency, total_amount, sent_at, paid_at, created_at, organisations(name)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json({
    invoices: (invoices ?? []).map((invoice) => ({
      ...invoice,
      org_name:
        (invoice.organisations as unknown as { name: string } | null)?.name ?? "Unknown",
      organisations: undefined,
    })),
  });
}

/**
 * Create a draft invoice by hand - for a credit pack or a cohort the
 * customer arranged offline. Sending is a separate, deliberate action on
 * the detail view.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { org_id?: unknown; pack_id?: unknown; cohort_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const orgId = typeof body.org_id === "string" ? body.org_id : null;
  const packId = typeof body.pack_id === "string" ? body.pack_id : null;
  const cohortId = typeof body.cohort_id === "string" ? body.cohort_id : null;

  if (!orgId || (!packId && !cohortId) || (packId && cohortId)) {
    return NextResponse.json(
      { error: "Provide org_id and exactly one of pack_id or cohort_id" },
      { status: 400 }
    );
  }

  try {
    const invoice = packId
      ? await createInvoiceForPack(orgId, packId, admin.id)
      : await createInvoiceForCohort(orgId, cohortId!, admin.id);
    return NextResponse.json({ invoice_id: invoice.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create invoice" },
      { status: 400 }
    );
  }
}
