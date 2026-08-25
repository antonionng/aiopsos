import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyMooovWebhook, getMooovWebhookSecret } from "@/lib/mooov";

export const dynamic = "force-dynamic";

/**
 * Unified Mooov webhook - every payment (cohort fees, credit packs) lands
 * here. Mooov retries with exponential backoff and can deliver an event
 * twice, so there are two independent idempotency guards:
 *
 *   1. `mooov_webhook_events` PK insert with ignoreDuplicates - a replayed
 *      event id is acknowledged and dropped before any processing.
 *   2. The payment-row status transition is a single conditional UPDATE
 *      (`WHERE status = 'pending'`); zero rows updated means another
 *      delivery already won, so side effects (wallet credit, paid_at)
 *      run at most once.
 *
 * A wallet is never credited from the event payload alone - always via the
 * looked-up mooov_payments row we created at checkout time.
 */

type MooovEvent = {
  id: string;
  type: string;
  data?: { payment_id?: string };
};

export async function POST(req: Request) {
  const rawBody = await req.text();

  let secret: string;
  try {
    secret = getMooovWebhookSecret();
  } catch {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (!verifyMooovWebhook(rawBody, req.headers.get("x-mooov-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: MooovEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (!event.id || !event.type) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Guard 1: event-id dedupe. An empty result means this id was already
  // recorded by an earlier delivery - acknowledge and stop.
  const { data: inserted, error: dedupeError } = await supabaseAdmin
    .from("mooov_webhook_events")
    .upsert(
      {
        event_id: event.id,
        delivery_id: req.headers.get("x-mooov-delivery"),
        event_type: event.type,
        payload: event,
      },
      { onConflict: "event_id", ignoreDuplicates: true }
    )
    .select("event_id");

  if (dedupeError) {
    // Without the dedupe record we cannot process safely; a non-2xx makes
    // Mooov retry later.
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
  if (!inserted || inserted.length === 0) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  let processingError: string | null = null;
  try {
    await processEvent(event);
  } catch (err) {
    processingError = err instanceof Error ? err.message : String(err);
  }

  await supabaseAdmin
    .from("mooov_webhook_events")
    .update({ processed_at: new Date().toISOString(), error: processingError })
    .eq("event_id", event.id);

  return NextResponse.json({ received: true });
}

async function processEvent(event: MooovEvent) {
  const paymentId = event.data?.payment_id;
  if (!paymentId) return; // not a payment event we act on

  switch (event.type) {
    // Merchant destinations emit `payment.captured`; the Connect envelope
    // calls the same thing `payment.succeeded`. Accept both.
    case "payment.captured":
    case "payment.succeeded":
      await handleCaptured(paymentId);
      break;

    case "payment.failed":
      await supabaseAdmin
        .from("mooov_payments")
        .update({ status: "failed" })
        .eq("payment_id", paymentId)
        .eq("status", "pending");
      break;

    case "payment.refunded":
      await handleRefunded(paymentId);
      break;

    case "payment.voided":
      await supabaseAdmin
        .from("mooov_payments")
        .update({ status: "voided" })
        .eq("payment_id", paymentId)
        .eq("status", "pending");
      break;

    default:
      // Unknown event types appear without notice; ignore gracefully.
      break;
  }
}

async function handleCaptured(paymentId: string) {
  // Guard 2: pending -> captured is a one-shot transition. Zero rows back
  // means another delivery already processed this payment.
  const { data: rows, error } = await supabaseAdmin
    .from("mooov_payments")
    .update({ status: "captured", captured_at: new Date().toISOString() })
    .eq("payment_id", paymentId)
    .eq("status", "pending")
    .select("org_id, purpose, pack_id, cohort_id, id");

  if (error) throw new Error(`payment update failed: ${error.message}`);
  const payment = rows?.[0];
  if (!payment) return;

  if (payment.purpose === "cohort" && payment.cohort_id) {
    const { error: cohortError } = await supabaseAdmin
      .from("cohorts")
      .update({ paid_at: new Date().toISOString() })
      .eq("id", payment.cohort_id)
      .is("paid_at", null);
    if (cohortError) throw new Error(`cohort update failed: ${cohortError.message}`);
  }

  if (payment.purpose === "credit_pack" && payment.pack_id) {
    const { data: pack, error: packError } = await supabaseAdmin
      .from("credit_packs")
      .select("credits, name")
      .eq("id", payment.pack_id)
      .single();
    if (packError || !pack) throw new Error("credit pack not found for captured payment");

    const { error: creditError } = await supabaseAdmin.rpc("academy_apply_credit_delta", {
      p_org: payment.org_id,
      p_delta: pack.credits,
      p_reason: "purchase",
      p_payment: payment.id,
      p_description: `${pack.name} pack purchase`,
    });
    if (creditError) throw new Error(`credit apply failed: ${creditError.message}`);
  }
}

async function handleRefunded(paymentId: string) {
  const { data: rows, error } = await supabaseAdmin
    .from("mooov_payments")
    .update({ status: "refunded" })
    .eq("payment_id", paymentId)
    .eq("status", "captured")
    .select("org_id, purpose, pack_id, id");

  if (error) throw new Error(`payment update failed: ${error.message}`);
  const payment = rows?.[0];
  if (!payment) return;

  // Claw refunded credits back. The balance may go negative - that is the
  // correct record of an org that spent credits it was later refunded for.
  if (payment.purpose === "credit_pack" && payment.pack_id) {
    const { data: pack } = await supabaseAdmin
      .from("credit_packs")
      .select("credits, name")
      .eq("id", payment.pack_id)
      .single();
    if (pack) {
      const { error: creditError } = await supabaseAdmin.rpc("academy_apply_credit_delta", {
        p_org: payment.org_id,
        p_delta: -pack.credits,
        p_reason: "refund",
        p_payment: payment.id,
        p_description: `${pack.name} pack refund`,
      });
      if (creditError) throw new Error(`credit clawback failed: ${creditError.message}`);
    }
  }
}
