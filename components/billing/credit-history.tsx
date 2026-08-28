"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LedgerRow {
  id: string;
  credits_delta: number;
  balance_after: number;
  reason: string;
  model: string | null;
  description: string | null;
  created_at: string;
}

const REASON_LABELS: Record<string, string> = {
  purchase: "Top-up",
  invoice_paid: "Invoice paid",
  usage: "Usage",
  adjustment: "Adjustment",
  refund: "Refund",
};

/** The org's credit ledger, newest first. Admin/manager/owner eyes only (RLS). */
export function CreditHistory({ rows }: { rows: LedgerRow[] }) {
  if (rows.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No credit activity yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-4">
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 py-2.5 text-sm">
              <Badge variant="secondary" className="text-[10px] w-24 justify-center shrink-0">
                {REASON_LABELS[row.reason] ?? row.reason}
              </Badge>
              <span className="flex-1 truncate text-muted-foreground">
                {row.description ?? row.model ?? " - "}
              </span>
              <span
                className={`tabular-nums font-medium ${
                  row.credits_delta >= 0 ? "text-emerald-500" : ""
                }`}
              >
                {row.credits_delta >= 0 ? "+" : ""}
                {row.credits_delta.toLocaleString()}
              </span>
              <span className="w-24 text-right tabular-nums text-xs text-muted-foreground shrink-0">
                {new Date(row.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
