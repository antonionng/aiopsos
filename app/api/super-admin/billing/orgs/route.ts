import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

/**
 * Billing view of every organisation: method (card/invoice), terms, wallet
 * balance, and money outstanding on open invoices. The companies list of
 * the admin billing portal. Org creation itself stays on the tenants
 * surface - this is billing configuration, not tenant management.
 */
export async function GET() {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [{ data: orgs }, { data: wallets }, { data: openInvoices }] = await Promise.all([
    supabaseAdmin
      .from("organisations")
      .select(
        "id, name, billing_method, invoice_terms_days, invoice_billing_email, invoice_po_reference, seat_count"
      )
      .order("name"),
    supabaseAdmin.from("credit_wallets").select("org_id, balance"),
    supabaseAdmin
      .from("billing_invoices")
      .select("org_id, total_amount, status")
      .in("status", ["sent", "overdue"]),
  ]);

  const walletByOrg = new Map((wallets ?? []).map((w) => [w.org_id, w.balance]));
  const outstandingByOrg = new Map<string, { total: number; overdue: number }>();
  for (const invoice of openInvoices ?? []) {
    const entry = outstandingByOrg.get(invoice.org_id) ?? { total: 0, overdue: 0 };
    entry.total += invoice.total_amount;
    if (invoice.status === "overdue") entry.overdue += invoice.total_amount;
    outstandingByOrg.set(invoice.org_id, entry);
  }

  return NextResponse.json({
    orgs: (orgs ?? []).map((org) => ({
      ...org,
      credit_balance: walletByOrg.get(org.id) ?? 0,
      outstanding_amount: outstandingByOrg.get(org.id)?.total ?? 0,
      overdue_amount: outstandingByOrg.get(org.id)?.overdue ?? 0,
    })),
  });
}
