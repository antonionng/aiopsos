"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Coins, FileWarning, Settings2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BillingOrg {
  id: string;
  name: string;
  billing_method: string;
  invoice_terms_days: number;
  invoice_billing_email: string | null;
  invoice_po_reference: string | null;
  seat_count: number;
  credit_balance: number;
  outstanding_amount: number;
  overdue_amount: number;
}

interface BillingSettings {
  ai_credit_markup?: number;
  usd_to_gbp?: number;
  low_balance_threshold_credits?: number;
  invoice_bank_details?: Record<string, string>;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

export default function AdminBillingPage() {
  const [orgs, setOrgs] = useState<BillingOrg[] | null>(null);
  const [settings, setSettings] = useState<BillingSettings>({});
  const [editing, setEditing] = useState<BillingOrg | null>(null);
  const [adjusting, setAdjusting] = useState<BillingOrg | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit-dialog form state
  const [method, setMethod] = useState("card");
  const [terms, setTerms] = useState("30");
  const [billingEmail, setBillingEmail] = useState("");
  const [poRef, setPoRef] = useState("");

  // Adjustment form state
  const [adjustCredits, setAdjustCredits] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  // Settings form state
  const [markup, setMarkup] = useState("");
  const [fx, setFx] = useState("");

  const load = useCallback(async () => {
    const [orgsRes, settingsRes] = await Promise.all([
      fetch("/api/super-admin/billing/orgs").then((r) => r.json()),
      fetch("/api/super-admin/settings").then((r) => r.json()),
    ]);
    setOrgs(orgsRes.orgs ?? []);
    setSettings(settingsRes.settings ?? {});
    if (settingsRes.settings?.ai_credit_markup) {
      setMarkup(String(settingsRes.settings.ai_credit_markup));
    }
    if (settingsRes.settings?.usd_to_gbp) {
      setFx(String(settingsRes.settings.usd_to_gbp));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openEdit(org: BillingOrg) {
    setEditing(org);
    setMethod(org.billing_method);
    setTerms(String(org.invoice_terms_days));
    setBillingEmail(org.invoice_billing_email ?? "");
    setPoRef(org.invoice_po_reference ?? "");
  }

  async function saveOrg() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/billing/orgs/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing_method: method,
          invoice_terms_days: Number(terms),
          invoice_billing_email: billingEmail,
          invoice_po_reference: poRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed");
        return;
      }
      toast.success(`${editing.name} updated`);
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function applyAdjustment() {
    if (!adjusting) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/billing/orgs/${adjusting.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: Number(adjustCredits), description: adjustReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Adjustment failed");
        return;
      }
      toast.success(`Balance is now ${Number(data.balance).toLocaleString()} credits`);
      setAdjusting(null);
      setAdjustCredits("");
      setAdjustReason("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/super-admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ai_credit_markup: Number(markup), usd_to_gbp: Number(fx) }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed");
        return;
      }
      toast.success("Pricing settings saved");
      load();
    } finally {
      setSaving(false);
    }
  }

  if (!orgs) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const invoiceOrgs = orgs.filter((o) => o.billing_method === "invoice").length;
  const totalOutstanding = orgs.reduce((s, o) => s + o.outstanding_amount, 0);
  const totalOverdue = orgs.reduce((s, o) => s + o.overdue_amount, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Company billing methods, credit wallets, and pricing controls.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <motion.div variants={item}>
          <Card className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> Invoice companies
              </div>
              <p className="mt-1 text-2xl font-bold">{invoiceOrgs}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Coins className="h-3.5 w-3.5" /> Outstanding invoices
              </div>
              <p className="mt-1 text-2xl font-bold">£{(totalOutstanding / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileWarning className="h-3.5 w-3.5" /> Overdue
              </div>
              <p className={`mt-1 text-2xl font-bold ${totalOverdue > 0 ? "text-red-500" : ""}`}>
                £{(totalOverdue / 100).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pricing settings */}
      <motion.div variants={item} className="mt-8">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4 text-brand" />
              Credit pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div>
              <Label htmlFor="markup" className="text-xs">
                Markup on provider cost
              </Label>
              <Input
                id="markup"
                className="mt-1 w-32"
                value={markup}
                onChange={(e) => setMarkup(e.target.value)}
                placeholder="2.5"
              />
            </div>
            <div>
              <Label htmlFor="fx" className="text-xs">
                USD → GBP rate
              </Label>
              <Input
                id="fx"
                className="mt-1 w-32"
                value={fx}
                onChange={(e) => setFx(e.target.value)}
                placeholder="0.80"
              />
            </div>
            <Button size="sm" onClick={saveSettings} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save
            </Button>
            <p className="basis-full text-xs text-muted-foreground">
              1 credit = £0.01 of retail usage. Retail = provider cost × rate × markup. Markup{" "}
              {settings.ai_credit_markup ?? "2.5"} ≈{" "}
              {Math.round((1 - 1 / Number(settings.ai_credit_markup ?? 2.5)) * 100)}% gross margin
              at face value.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Companies table */}
      <motion.div variants={item} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Companies</h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-4">
            <div className="divide-y divide-border">
              {orgs.map((org) => (
                <div key={org.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <span className="min-w-40 font-medium">{org.name}</span>
                  <Badge
                    variant={org.billing_method === "invoice" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {org.billing_method === "invoice"
                      ? `Invoice · NET ${org.invoice_terms_days}`
                      : "Card"}
                  </Badge>
                  <span className="flex-1" />
                  <span className="tabular-nums text-xs text-muted-foreground">
                    {org.credit_balance.toLocaleString()} credits
                  </span>
                  {org.outstanding_amount > 0 && (
                    <span
                      className={`tabular-nums text-xs ${
                        org.overdue_amount > 0 ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      £{(org.outstanding_amount / 100).toFixed(2)} open
                    </span>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setAdjusting(org)}>
                    Adjust credits
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(org)}>
                    Billing settings
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit billing dialog */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.name} — billing</DialogTitle>
            <DialogDescription>
              Invoice billing is for contract customers: purchases raise an emailed PDF invoice
              instead of card checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Billing method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card (Mooov checkout)</SelectItem>
                  <SelectItem value="invoice">Invoice (bank transfer)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {method === "invoice" && (
              <>
                <div>
                  <Label htmlFor="terms" className="text-xs">
                    Payment terms (days)
                  </Label>
                  <Input
                    id="terms"
                    className="mt-1"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="billing-email" className="text-xs">
                    Billing email (accounts payable)
                  </Label>
                  <Input
                    id="billing-email"
                    className="mt-1"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="accounts@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="po-ref" className="text-xs">
                    PO reference (optional)
                  </Label>
                  <Input
                    id="po-ref"
                    className="mt-1"
                    value={poRef}
                    onChange={(e) => setPoRef(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveOrg} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust credits dialog */}
      <Dialog open={adjusting !== null} onOpenChange={(open) => !open && setAdjusting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adjusting?.name} — adjust credits</DialogTitle>
            <DialogDescription>
              Positive adds credits, negative removes them. Every adjustment lands in the ledger
              with your name and the reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adjust-credits" className="text-xs">
                Credits (e.g. 5000 or -200)
              </Label>
              <Input
                id="adjust-credits"
                className="mt-1"
                value={adjustCredits}
                onChange={(e) => setAdjustCredits(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="adjust-reason" className="text-xs">
                Reason
              </Label>
              <Input
                id="adjust-reason"
                className="mt-1"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Contract bonus / correction / goodwill"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjusting(null)}>
              Cancel
            </Button>
            <Button onClick={applyAdjustment} disabled={saving || !adjustCredits || !adjustReason}>
              {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
