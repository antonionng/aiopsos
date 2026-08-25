"use client";

import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface InvoiceRow {
  id: string;
  invoice_number: string | null;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  currency: string;
  total_amount: number;
}

const STATUS_STYLES: Record<string, string> = {
  sent: "text-blue-500 border-blue-500/40",
  paid: "text-emerald-500 border-emerald-500/40",
  overdue: "text-red-500 border-red-500/40",
  void: "text-muted-foreground border-border",
};

/** The org's invoices - visible when they have any (invoice-method orgs mainly). */
export function InvoicesList({ invoices }: { invoices: InvoiceRow[] }) {
  if (invoices.length === 0) return null;

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-4">
        <div className="divide-y divide-border">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center gap-3 py-2.5 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium tabular-nums">
                {invoice.invoice_number ?? "Draft"}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] ${STATUS_STYLES[invoice.status] ?? ""}`}
              >
                {invoice.status}
              </Badge>
              <span className="flex-1" />
              {invoice.due_date && invoice.status !== "paid" && (
                <span className="text-xs text-muted-foreground">
                  due {new Date(invoice.due_date).toLocaleDateString("en-GB")}
                </span>
              )}
              <span className="tabular-nums font-medium">
                £{(invoice.total_amount / 100).toFixed(2)}
              </span>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer">
                  <Download className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
