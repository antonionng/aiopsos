import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendInvoiceEmail, getOrgAdminEmails } from "@/lib/email";
import { renderInvoicePdf } from "@/lib/pdf/invoice-document";
import type { InvoicePayload } from "@/lib/invoices";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REMINDER_GAP_DAYS = 7;

/**
 * Flip past-due invoices to `overdue` and chase them.
 *
 * Runs daily. Idempotent two ways: the status flip only touches rows
 * still in `sent`, and reminders are spaced by `last_reminder_at` - at
 * least seven days between chasers, so a daily run does not nag daily.
 *
 * Same shared-secret authorisation as session-reminders: without
 * CRON_SECRET the route refuses to run at all.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }

  const provided =
    req.headers.get("authorization")?.replace(/^Bearer /i, "") ??
    req.headers.get("x-cron-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Newly past due: sent -> overdue.
  const { data: flipped } = await supabaseAdmin
    .from("billing_invoices")
    .update({ status: "overdue" })
    .eq("status", "sent")
    .lt("due_date", today)
    .select("id");

  // Everything overdue and not chased in the last week gets a reminder.
  const reminderCutoff = new Date(
    Date.now() - REMINDER_GAP_DAYS * 86_400_000
  ).toISOString();

  const { data: due } = await supabaseAdmin
    .from("billing_invoices")
    .select("id, org_id, payload, last_reminder_at")
    .eq("status", "overdue")
    .or(`last_reminder_at.is.null,last_reminder_at.lt.${reminderCutoff}`);

  let reminded = 0;
  for (const invoice of due ?? []) {
    const payload = invoice.payload as unknown as InvoicePayload;
    if (!payload || payload.version !== 1) continue;

    // Claim before sending, so a slow send under an overlapping run
    // cannot double-chase: only the run that flips last_reminder_at
    // proceeds to email.
    const { data: claimed } = await supabaseAdmin
      .from("billing_invoices")
      .update({ last_reminder_at: new Date().toISOString() })
      .eq("id", invoice.id)
      .or(`last_reminder_at.is.null,last_reminder_at.lt.${reminderCutoff}`)
      .select("id");
    if (!claimed || claimed.length === 0) continue;

    try {
      const pdf = await renderInvoicePdf(payload);
      const recipients = payload.org.billing_email
        ? [{ email: payload.org.billing_email, name: payload.org.name }]
        : await getOrgAdminEmails(invoice.org_id);
      await sendInvoiceEmail(recipients, payload, pdf, { isReminder: true });
      reminded += 1;
    } catch (err) {
      console.error(`Overdue reminder failed for ${payload.invoice_number}:`, err);
    }
  }

  return NextResponse.json({
    flipped: flipped?.length ?? 0,
    reminded,
  });
}
