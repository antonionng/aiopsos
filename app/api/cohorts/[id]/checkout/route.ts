import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createPaymentIntent, newMooovPaymentId } from "@/lib/mooov";
import { getActor } from "@/lib/cohorts";

export const dynamic = "force-dynamic";

/**
 * Pay for a cohort.
 *
 * Pricing is per cohort, not per seat: a facilitator, a date and a seat limit
 * are a fixed cost regardless of whether ten or twelve people sit in the
 * room. So this is a one-off payment - training is quoted per engagement and
 * rarely twice at the same number.
 *
 * Card orgs get a Mooov hosted-checkout redirect; the mooov_payments row we
 * insert first is what the webhook routes on (Mooov intents carry no
 * metadata). Invoice orgs are handled by the invoicing flow instead.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, org_id, title, price_amount, currency, paid_at")
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!cohort.org_id || cohort.org_id !== actor.orgId) {
    return NextResponse.json(
      { error: "Only the organisation that owns this cohort can pay for it" },
      { status: 403 }
    );
  }

  if (cohort.paid_at) {
    return NextResponse.json({ error: "This cohort is already paid" }, { status: 409 });
  }

  if (!cohort.price_amount || cohort.price_amount <= 0) {
    return NextResponse.json(
      { error: "This cohort has no price set" },
      { status: 400 }
    );
  }

  const { data: org } = await supabase
    .from("organisations")
    .select("billing_method")
    .eq("id", cohort.org_id)
    .single();

  if (org?.billing_method === "invoice") {
    const { createInvoiceForCohort, sendInvoice } = await import("@/lib/invoices");
    const invoice = await createInvoiceForCohort(cohort.org_id, id, actor.userId);
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
    org_id: cohort.org_id,
    initiated_by: actor.userId,
    purpose: "cohort",
    cohort_id: id,
    amount: cohort.price_amount,
    currency: cohort.currency,
  });
  if (insertError) {
    return NextResponse.json({ error: "Could not start payment" }, { status: 500 });
  }

  const intent = await createPaymentIntent({
    paymentId,
    amount: cohort.price_amount,
    currency: cohort.currency,
    successUrl: `${baseUrl}/dashboard/cohorts/${id}?paid=1`,
  });

  if (intent.hosted_url) {
    await supabaseAdmin
      .from("mooov_payments")
      .update({ hosted_url: intent.hosted_url })
      .eq("payment_id", paymentId);
  }

  return NextResponse.json({ url: intent.hosted_url });
}
