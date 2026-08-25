import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

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
 * PATCH: billing configuration for one company - switch card/invoice
 * (contract-backed; the switch is deliberate and audited), NET terms,
 * billing contact, PO reference.
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (body.billing_method !== undefined) {
    if (body.billing_method !== "card" && body.billing_method !== "invoice") {
      return NextResponse.json({ error: "billing_method must be card or invoice" }, { status: 400 });
    }
    updates.billing_method = body.billing_method;
  }
  if (body.invoice_terms_days !== undefined) {
    const terms = Number(body.invoice_terms_days);
    if (!Number.isInteger(terms) || terms < 0 || terms > 365) {
      return NextResponse.json({ error: "invoice_terms_days must be 0-365" }, { status: 400 });
    }
    updates.invoice_terms_days = terms;
  }
  if (body.invoice_billing_email !== undefined) {
    updates.invoice_billing_email = body.invoice_billing_email || null;
  }
  if (body.invoice_po_reference !== undefined) {
    updates.invoice_po_reference = body.invoice_po_reference || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data: before } = await supabaseAdmin
    .from("organisations")
    .select("billing_method")
    .eq("id", id)
    .maybeSingle();
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabaseAdmin.from("organisations").update(updates).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  if (updates.billing_method && updates.billing_method !== before.billing_method) {
    await logAudit({
      orgId: id,
      userId: admin.id,
      action: AUDIT_ACTIONS.BILLING_METHOD_CHANGED,
      metadata: { from: before.billing_method, to: updates.billing_method },
    });
  }

  return NextResponse.json({ ok: true });
}

/**
 * POST: manual credit adjustment - goodwill, correction, contract bonus.
 * Positive or negative, always through the ledger with the reason and the
 * admin's id on the row.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { credits?: unknown; description?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const credits = Number(body.credits);
  if (!Number.isInteger(credits) || credits === 0 || Math.abs(credits) > 10_000_000) {
    return NextResponse.json({ error: "credits must be a non-zero integer" }, { status: 400 });
  }
  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim().slice(0, 500)
      : null;
  if (!description) {
    return NextResponse.json(
      { error: "A description is required for manual adjustments" },
      { status: 400 }
    );
  }

  const { data: balance, error } = await supabaseAdmin.rpc("academy_apply_credit_delta", {
    p_org: id,
    p_delta: credits,
    p_reason: "adjustment",
    p_description: description,
    p_created_by: admin.id,
  });
  if (error) {
    return NextResponse.json({ error: "Adjustment failed" }, { status: 500 });
  }

  await logAudit({
    orgId: id,
    userId: admin.id,
    action: AUDIT_ACTIONS.CREDITS_ADJUSTED,
    metadata: { credits, description, balance_after: balance },
  });

  return NextResponse.json({ ok: true, balance });
}
