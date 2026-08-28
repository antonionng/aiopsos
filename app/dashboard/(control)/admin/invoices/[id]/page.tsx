"use client";

import { useCallback, useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Send, CheckCircle2, Ban, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface InvoiceDetail {
  id: string;
  invoice_number: string | null;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  terms_days: number;
  currency: string;
  subtotal_amount: number;
  total_amount: number;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  organisations: {
    name: string;
    invoice_billing_email: string | null;
    invoice_po_reference: string | null;
  } | null;
}

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit_amount: number;
  total_amount: number;
  credits: number | null;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "text-muted-foreground border-border",
  sent: "text-blue-500 border-blue-500/40",
  paid: "text-emerald-500 border-emerald-500/40",
  overdue: "text-red-500 border-red-500/40",
  void: "text-muted-foreground border-border",
};

export default function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [lines, setLines] = useState<InvoiceLine[]>([]);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/super-admin/invoices/${id}`).then((r) => r.json());
    setInvoice(res.invoice ?? null);
    setLines(res.lines ?? []);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(action: "send" | "mark_paid" | "void") {
    if (action === "void" && !window.confirm("Void this invoice? This cannot be undone.")) {
      return;
    }
    setActing(true);
    try {
      const res = await fetch(`/api/super-admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Action failed");
        return;
      }
      toast.success(
        action === "send"
          ? `Invoice ${data.invoice_number} sent`
          : action === "mark_paid"
            ? "Marked paid - credits and courses released"
            : "Invoice voided"
      );
      load();
    } finally {
      setActing(false);
    }
  }

  if (!invoice) {
    return <div className="skeleton-shimmer h-64 rounded-xl" />;
  }

  const org = invoice.organisations;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/dashboard/admin/invoices"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All invoices
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mb-0">{invoice.invoice_number ?? "Draft invoice"}</h1>
        <Badge variant="outline" className={`text-xs ${STATUS_STYLES[invoice.status] ?? ""}`}>
          {invoice.status}
        </Badge>
        <span className="flex-1" />
        {invoice.status !== "draft" && (
          <Button asChild variant="outline" size="sm">
            <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer">
              <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
            </a>
          </Button>
        )}
        {invoice.status === "draft" && (
          <Button size="sm" onClick={() => act("send")} disabled={acting}>
            {acting ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-3.5 w-3.5" />
            )}
            Send invoice
          </Button>
        )}
        {(invoice.status === "sent" || invoice.status === "overdue") && (
          <Button size="sm" onClick={() => act("mark_paid")} disabled={acting}>
            {acting ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Mark paid
          </Button>
        )}
        {invoice.status !== "paid" && invoice.status !== "void" && (
          <Button variant="outline" size="sm" onClick={() => act("void")} disabled={acting}>
            <Ban className="mr-1.5 h-3.5 w-3.5" /> Void
          </Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Billed to</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{org?.name ?? "Unknown"}</p>
            {org?.invoice_billing_email && (
              <p className="text-muted-foreground">{org.invoice_billing_email}</p>
            )}
            {org?.invoice_po_reference && (
              <p className="text-muted-foreground">PO: {org.invoice_po_reference}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Dates & terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Issued: </span>
              {invoice.issue_date
                ? new Date(invoice.issue_date).toLocaleDateString("en-GB")
                : "not yet"}
            </p>
            <p>
              <span className="text-muted-foreground">Due: </span>
              {invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString("en-GB")
                : `NET ${invoice.terms_days} from send`}
            </p>
            {invoice.paid_at && (
              <p>
                <span className="text-muted-foreground">Paid: </span>
                {new Date(invoice.paid_at).toLocaleDateString("en-GB")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Lines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="flex-1">{line.description}</span>
                {line.credits && (
                  <Badge variant="secondary" className="text-[10px]">
                    +{line.credits.toLocaleString()} credits on payment
                  </Badge>
                )}
                <span className="w-10 text-right tabular-nums text-muted-foreground">
                  ×{line.quantity}
                </span>
                <span className="w-24 text-right tabular-nums font-medium">
                  £{(line.total_amount / 100).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 py-2.5 text-sm">
              <span className="flex-1 font-semibold">Total</span>
              <span className="w-24 text-right tabular-nums font-bold">
                £{(invoice.total_amount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
