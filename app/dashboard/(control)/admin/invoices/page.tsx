"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdminInvoice {
  id: string;
  invoice_number: string | null;
  org_name: string;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  currency: string;
  total_amount: number;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "text-muted-foreground border-border",
  sent: "text-blue-500 border-blue-500/40",
  paid: "text-emerald-500 border-emerald-500/40",
  overdue: "text-red-500 border-red-500/40",
  void: "text-muted-foreground border-border line-through",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[] | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(() => {
    fetch("/api/super-admin/invoices")
      .then((r) => r.json())
      .then((res) => setInvoices(res.invoices ?? []))
      .catch(() => setInvoices([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!invoices) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const filtered =
    filter === "all" ? invoices : invoices.filter((invoice) => invoice.status === filter);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="mb-1">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Every invoice across all companies. Create drafts from the company&apos;s billing
            settings or a cohort page.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-6 flex gap-2">
        {["all", "draft", "sent", "overdue", "paid", "void"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status}
            {status === "overdue" && invoices.some((i) => i.status === "overdue") && (
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
          </Button>
        ))}
      </motion.div>

      <motion.div variants={item} className="mt-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-4">
            {filtered.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No invoices here.</p>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/admin/invoices/${invoice.id}`}
                    className="flex items-center gap-3 py-3 text-sm hover:bg-muted/40 -mx-2 px-2 rounded-md"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="w-32 font-medium tabular-nums">
                      {invoice.invoice_number ?? "Draft"}
                    </span>
                    <span className="flex-1 truncate">{invoice.org_name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${STATUS_STYLES[invoice.status] ?? ""}`}
                    >
                      {invoice.status}
                    </Badge>
                    {invoice.due_date && invoice.status !== "paid" && invoice.status !== "void" && (
                      <span className="w-24 text-right text-xs text-muted-foreground">
                        due {new Date(invoice.due_date).toLocaleDateString("en-GB")}
                      </span>
                    )}
                    <span className="w-24 text-right tabular-nums font-medium">
                      £{(invoice.total_amount / 100).toFixed(2)}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
