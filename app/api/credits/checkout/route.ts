import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { billingStripeCheckout } from "@/lib/stripe-billing";
import { getWorkspaceActor as getActor } from "@/lib/cohorts";

export const dynamic = "force-dynamic";

/**
 * Buy a credit pack for the organisation's wallet.
 *
 * Card orgs get a Stripe Checkout redirect; the wallet is credited
 * by the verified webhook after payment, never here. Invoice orgs get
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
  if (!org)
    return NextResponse.json(
      { error: "Organisation not found" },
      { status: 404 },
    );

  const isOwner = org.owner_id === actor.userId;
  const canBuy =
    isOwner || ["admin", "manager", "super_admin"].includes(actor.role);
  if (!canBuy) {
    return NextResponse.json(
      { error: "Only organisation admins or the owner can buy credits" },
      { status: 403 },
    );
  }

  const { data: pack } = await supabase
    .from("credit_packs")
    .select("id, name, credits, price_amount, currency, active")
    .eq("id", packId)
    .maybeSingle();
  if (!pack || !pack.active) {
    return NextResponse.json(
      { error: "Credit pack not available" },
      { status: 404 },
    );
  }

  if (org.billing_method === "invoice") {
    const { createInvoiceForPack, sendInvoice } =
      await import("@/lib/invoices");
    const invoice = await createInvoiceForPack(org.id, pack.id, actor.userId);
    const payload = await sendInvoice(invoice.id);
    return NextResponse.json({
      invoice_id: invoice.id,
      invoice_number: payload.invoice_number,
    });
  }

  try {
    const url = await billingStripeCheckout({
      userId: actor.userId,
      orgId: org.id,
      purpose: "credit_pack",
      itemId: pack.id,
      title: pack.name + " AI credits",
      successPath: "/dashboard/billing?topup=success",
      cancelPath: "/dashboard/billing",
    });
    return NextResponse.json(
      { url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not open Stripe checkout.",
      },
      { status: 503 },
    );
  }
}
