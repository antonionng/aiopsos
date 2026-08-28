import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { sendInvoiceEmail, getOrgAdminEmails } from "@/lib/email";

/**
 * Invoice lifecycle for contract customers (billing_method = 'invoice').
 *
 * draft -> sent -> paid, with `overdue` a cron-applied shade of `sent`
 * and `void` a terminal state for mistakes. The consequential moments:
 *
 *   send  - the invoice number and dates are assigned and `payload` is
 *           frozen. The PDF renders from payload alone (evidence-pack
 *           doctrine), so what we can regenerate is exactly what the
 *           customer received.
 *   paid  - a super admin acknowledges the bank transfer. Only then do
 *           credit lines land in the wallet and cohort lines stamp
 *           paid_at. The UPDATE is guarded on status so a double-click
 *           cannot credit twice.
 *
 * Everything here runs on the service role; authorisation happens in the
 * calling routes.
 */

export interface InvoicePayload {
  version: 1;
  invoice_number: string;
  issue_date: string; // yyyy-mm-dd
  due_date: string;
  terms_days: number;
  currency: string;
  org: {
    name: string;
    billing_email: string | null;
    po_reference: string | null;
  };
  lines: Array<{
    description: string;
    quantity: number;
    unit_amount: number; // minor units
    total_amount: number;
    credits: number | null;
  }>;
  subtotal_amount: number;
  total_amount: number;
  bank_details: Record<string, string>;
}

async function createInvoice(
  orgId: string,
  createdBy: string | null,
  line: {
    description: string;
    quantity: number;
    unit_amount: number;
    pack_id?: string;
    cohort_id?: string;
    credits?: number;
  },
  currency: string
): Promise<{ id: string; invoice_number: string | null }> {
  const { data: org, error: orgError } = await supabaseAdmin
    .from("organisations")
    .select("invoice_terms_days")
    .eq("id", orgId)
    .single();
  if (orgError || !org) throw new Error("Organisation not found for invoice");

  const total = line.unit_amount * line.quantity;

  const { data: invoice, error } = await supabaseAdmin
    .from("billing_invoices")
    .insert({
      org_id: orgId,
      terms_days: org.invoice_terms_days ?? 30,
      currency,
      subtotal_amount: total,
      total_amount: total,
      created_by: createdBy,
    })
    .select("id, invoice_number")
    .single();
  if (error || !invoice) throw new Error(`Could not create invoice: ${error?.message}`);

  const { error: lineError } = await supabaseAdmin.from("billing_invoice_lines").insert({
    invoice_id: invoice.id,
    description: line.description,
    quantity: line.quantity,
    unit_amount: line.unit_amount,
    total_amount: total,
    pack_id: line.pack_id ?? null,
    cohort_id: line.cohort_id ?? null,
    credits: line.credits ?? null,
  });
  if (lineError) throw new Error(`Could not create invoice line: ${lineError.message}`);

  await logAudit({
    orgId,
    userId: createdBy,
    action: AUDIT_ACTIONS.INVOICE_CREATED,
    metadata: { invoice_id: invoice.id, description: line.description, total },
  });

  return invoice;
}

export async function createInvoiceForPack(
  orgId: string,
  packId: string,
  createdBy: string | null
) {
  const { data: pack, error } = await supabaseAdmin
    .from("credit_packs")
    .select("id, name, credits, price_amount, currency")
    .eq("id", packId)
    .single();
  if (error || !pack) throw new Error("Credit pack not found");

  return createInvoice(
    orgId,
    createdBy,
    {
      description: `AI credits - ${pack.name} pack (${pack.credits.toLocaleString("en-GB")} credits)`,
      quantity: 1,
      unit_amount: pack.price_amount,
      pack_id: pack.id,
      credits: pack.credits,
    },
    pack.currency
  );
}

export async function createInvoiceForCohort(
  orgId: string,
  cohortId: string,
  createdBy: string | null
) {
  const { data: cohort, error } = await supabaseAdmin
    .from("cohorts")
    .select("id, title, price_amount, currency, paid_at")
    .eq("id", cohortId)
    .single();
  if (error || !cohort) throw new Error("Cohort not found");
  if (cohort.paid_at) throw new Error("This cohort is already paid");
  if (!cohort.price_amount || cohort.price_amount <= 0) {
    throw new Error("This cohort has no price set");
  }

  return createInvoice(
    orgId,
    createdBy,
    {
      description: `Facilitated cohort: ${cohort.title}`,
      quantity: 1,
      unit_amount: cohort.price_amount,
      cohort_id: cohort.id,
    },
    cohort.currency
  );
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Assign the number, freeze the payload, render the PDF, email it.
 * Only drafts can be sent; sending twice is a no-op error.
 */
export async function sendInvoice(invoiceId: string): Promise<InvoicePayload> {
  const { data: invoice, error } = await supabaseAdmin
    .from("billing_invoices")
    .select(
      "id, org_id, status, terms_days, currency, subtotal_amount, total_amount, organisations(name, invoice_billing_email, invoice_po_reference)"
    )
    .eq("id", invoiceId)
    .single();
  if (error || !invoice) throw new Error("Invoice not found");
  if (invoice.status !== "draft") throw new Error(`Invoice is ${invoice.status}, not draft`);

  const { data: lines } = await supabaseAdmin
    .from("billing_invoice_lines")
    .select("description, quantity, unit_amount, total_amount, credits")
    .eq("invoice_id", invoiceId)
    .order("created_at");

  const { data: bankRow } = await supabaseAdmin
    .from("academy_settings")
    .select("value")
    .eq("key", "invoice_bank_details")
    .maybeSingle();

  const { data: seq, error: seqError } = await supabaseAdmin.rpc("academy_next_invoice_number");
  if (seqError || seq == null) {
    throw new Error(`Could not assign invoice number: ${seqError?.message}`);
  }

  const issue = new Date();
  const due = new Date(issue.getTime() + invoice.terms_days * 86_400_000);
  const invoiceNumber = `INV-${issue.getUTCFullYear()}-${String(seq).padStart(4, "0")}`;

  const org = invoice.organisations as unknown as {
    name: string;
    invoice_billing_email: string | null;
    invoice_po_reference: string | null;
  };

  const payload: InvoicePayload = {
    version: 1,
    invoice_number: invoiceNumber,
    issue_date: isoDate(issue),
    due_date: isoDate(due),
    terms_days: invoice.terms_days,
    currency: invoice.currency,
    org: {
      name: org?.name ?? "",
      billing_email: org?.invoice_billing_email ?? null,
      po_reference: org?.invoice_po_reference ?? null,
    },
    lines: (lines ?? []).map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unit_amount: l.unit_amount,
      total_amount: l.total_amount,
      credits: l.credits,
    })),
    subtotal_amount: invoice.subtotal_amount,
    total_amount: invoice.total_amount,
    bank_details: (bankRow?.value as Record<string, string>) ?? {},
  };

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("billing_invoices")
    .update({
      invoice_number: invoiceNumber,
      status: "sent",
      issue_date: payload.issue_date,
      due_date: payload.due_date,
      payload,
      sent_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .eq("status", "draft")
    .select("id");
  if (updateError || !updated || updated.length === 0) {
    throw new Error("Invoice was already sent by another request");
  }

  // Email with the PDF attached. Deliverability must not unwind the send -
  // the invoice exists and can be re-downloaded - so this only logs.
  try {
    const { renderInvoicePdf } = await import("@/lib/pdf/invoice-document");
    const pdf = await renderInvoicePdf(payload);
    const recipients = payload.org.billing_email
      ? [{ email: payload.org.billing_email, name: payload.org.name }]
      : await getOrgAdminEmails(invoice.org_id);
    await sendInvoiceEmail(recipients, payload, pdf);
  } catch (err) {
    console.error("Invoice email failed (invoice still sent):", err);
  }

  await logAudit({
    orgId: invoice.org_id,
    userId: null,
    action: AUDIT_ACTIONS.INVOICE_SENT,
    metadata: { invoice_id: invoiceId, invoice_number: invoiceNumber, total: invoice.total_amount },
  });

  return payload;
}

/**
 * Acknowledge payment received. The status guard in the WHERE makes this
 * single-shot: the second click, or a concurrent admin, updates zero rows
 * and changes nothing.
 */
export async function markInvoicePaid(invoiceId: string, byUser: string): Promise<void> {
  const { data: rows, error } = await supabaseAdmin
    .from("billing_invoices")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      marked_paid_by: byUser,
    })
    .eq("id", invoiceId)
    .in("status", ["sent", "overdue"])
    .select("id, org_id, invoice_number");
  if (error) throw new Error(`Could not mark invoice paid: ${error.message}`);
  const invoice = rows?.[0];
  if (!invoice) throw new Error("Invoice is not in a payable state");

  const { data: lines } = await supabaseAdmin
    .from("billing_invoice_lines")
    .select("credits, cohort_id, description")
    .eq("invoice_id", invoiceId);

  for (const line of lines ?? []) {
    if (line.credits && line.credits > 0) {
      const { error: creditError } = await supabaseAdmin.rpc("academy_apply_credit_delta", {
        p_org: invoice.org_id,
        p_delta: line.credits,
        p_reason: "invoice_paid",
        p_invoice: invoiceId,
        p_description: line.description,
        p_created_by: byUser,
      });
      if (creditError) {
        // The invoice is paid either way; a failed credit is an ops fix,
        // and the missing ledger row makes it visible.
        console.error("Invoice credit apply failed:", creditError.message);
      }
    }
    if (line.cohort_id) {
      await supabaseAdmin
        .from("cohorts")
        .update({ paid_at: new Date().toISOString() })
        .eq("id", line.cohort_id)
        .is("paid_at", null);
    }
  }

  await logAudit({
    orgId: invoice.org_id,
    userId: byUser,
    action: AUDIT_ACTIONS.INVOICE_MARKED_PAID,
    metadata: { invoice_id: invoiceId, invoice_number: invoice.invoice_number },
  });
}

export async function voidInvoice(invoiceId: string, byUser: string): Promise<void> {
  const { data: rows, error } = await supabaseAdmin
    .from("billing_invoices")
    .update({ status: "void" })
    .eq("id", invoiceId)
    .in("status", ["draft", "sent", "overdue"])
    .select("id, org_id, invoice_number");
  if (error) throw new Error(`Could not void invoice: ${error.message}`);
  const invoice = rows?.[0];
  if (!invoice) throw new Error("Invoice cannot be voided");

  await logAudit({
    orgId: invoice.org_id,
    userId: byUser,
    action: AUDIT_ACTIONS.INVOICE_VOIDED,
    metadata: { invoice_id: invoiceId, invoice_number: invoice.invoice_number },
  });
}
