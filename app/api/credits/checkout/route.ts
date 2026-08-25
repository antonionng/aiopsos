import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createPaymentIntent, newMooovPaymentId } from "@/lib/mooov";
import { getActor } from "@/lib/cohorts";

export const dynamic = "force-dynamic";

/**
 * Buy a credit pack for the organisation's wallet.
 *
 * Card orgs get a Mooov hosted-checkout redirect; the wallet is credited
 * by the webhook when the payment captures, never here. Invoice orgs get
 * an emailed invoice instead, and the wallet is credited when a super
 * admin marks it paid.
 *
 * Who may buy: org admins and managers, plus the org owner (ownership is
 * a column on organisations, not a role).
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor || !actor.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let packId: unknown;
  try {
    ({ pack_id: packId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof packId !== "string") {
    return NextResponse.json({ error: "pack_id is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organisations")
    .select("id, billing_method, owner_id")
    .eq("id", actor.orgId)
    .single();
  if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });

  const isOwner = org.owner_id === actor.userId;
  const canBuy = isOwner || ["admin", "manager", "super_admin"].includes(actor.role);
  if (!canBuy) {
    return NextResponse.json(
      { error: "Only organisation admins or the owner can buy credits" },
      { status: 403 }
    );
  }

  const { data: pack } = await supabase
    .from("credit_packs")
    .select("id, name, credits, price_amount, currency, active")
    .eq("id", packId)
    .maybeSingle();
  if (!pack || !pack.active) {
    return NextResponse.json({ error: "Credit pack not available" }, { status: 404 });
  }

  if (org.billing_method === "invoice") {
    const { createInvoiceForPack, sendInvoice } = await import("@/lib/invoices");
    const invoice = await createInvoiceForPack(org.id, pack.id, actor.userId);
    const payload = await sendInvoice(invoice.id);
    return NextResponse.json({
      invoice_id: invoice.id,
      invoice_number: payload.invoice_number,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const paymentId = newMooovPaymentId();

  const { error: insertError } = await supabaseAdmin.from("mooov_payments").insert({
    payment_id: paymentId,
    org_id: org.id,
    initiated_by: actor.userId,
    purpose: "credit_pack",
    pack_id: pack.id,
    amount: pack.price_amount,
    currency: pack.currency,
  });
  if (insertError) {
    return NextResponse.json({ error: "Could not start payment" }, { status: 500 });
  }

  const intent = await createPaymentIntent({
    paymentId,
    amount: pack.price_amount,
    currency: pack.currency,
    successUrl: `${baseUrl}/dashboard/billing?topup=success`,
  });

  if (intent.hosted_url) {
    await supabaseAdmin
      .from("mooov_payments")
      .update({ hosted_url: intent.hosted_url })
      .eq("payment_id", paymentId);
  }

  return NextResponse.json({ url: intent.hosted_url });
}
