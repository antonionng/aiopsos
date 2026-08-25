import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { renderInvoicePdf } from "@/lib/pdf/invoice-document";
import type { InvoicePayload } from "@/lib/invoices";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Render a stored invoice to PDF.
 *
 * Rendering reads only the payload frozen at send time, so a download
 * years later reproduces the document the customer was emailed. Row-level
 * security decides who may fetch it: the org's billing audience for
 * issued invoices, super admins for everything.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("billing_invoices")
    .select("id, invoice_number, payload")
    .eq("id", id)
    .maybeSingle();

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const payload = invoice.payload as unknown as InvoicePayload;
  if (!payload || payload.version !== 1) {
    // A draft has no frozen payload yet - there is nothing faithful to render.
    return NextResponse.json(
      { error: "This invoice has not been issued yet" },
      { status: 409 }
    );
  }

  const buffer = await renderInvoicePdf(payload);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoice_number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
