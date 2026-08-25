import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendInvoice, markInvoicePaid, voidInvoice } from "@/lib/invoices";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [{ data: invoice }, { data: lines }] = await Promise.all([
    supabaseAdmin
      .from("billing_invoices")
      .select("*, organisations(name, invoice_billing_email, invoice_po_reference)")
      .eq("id", id)
      .maybeSingle(),
    supabaseAdmin
      .from("billing_invoice_lines")
      .select("id, description, quantity, unit_amount, total_amount, credits, pack_id, cohort_id")
      .eq("invoice_id", id)
      .order("created_at"),
  ]);

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ invoice, lines: lines ?? [] });
}

/**
 * Lifecycle actions: { action: "send" | "mark_paid" | "void" }.
 * Each is single-shot by construction in lib/invoices - a repeat returns
 * the domain error rather than repeating the side effect.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let action: unknown;
  try {
    ({ action } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    switch (action) {
      case "send": {
        const payload = await sendInvoice(id);
        return NextResponse.json({ ok: true, invoice_number: payload.invoice_number });
      }
      case "mark_paid":
        await markInvoicePaid(id, admin.id);
        return NextResponse.json({ ok: true });
      case "void":
        await voidInvoice(id, admin.id);
        return NextResponse.json({ ok: true });
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Action failed" },
      { status: 400 }
    );
  }
}
