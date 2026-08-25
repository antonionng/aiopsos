"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price_amount: number; // minor units
  currency: string;
}

/**
 * The pack shop. Card orgs are redirected to Mooov hosted checkout; for
 * invoice orgs the same button raises and emails an invoice, and the
 * toast says so - no redirect.
 */
export function CreditPackPicker({
  packs,
  canBuy,
  billingMethod,
}: {
  packs: CreditPack[];
  canBuy: boolean;
  billingMethod: string;
}) {
  const [buyingId, setBuyingId] = useState<string | null>(null);

  async function handleBuy(pack: CreditPack) {
    setBuyingId(pack.id);
    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: pack.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not start the purchase");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.invoice_number) {
        toast.success(
          `Invoice ${data.invoice_number} has been emailed to your billing contact. Credits are added when it's paid.`
        );
        return;
      }
      toast.error("Unexpected response from checkout");
    } catch {
      toast.error("Could not start the purchase");
    } finally {
      setBuyingId(null);
    }
  }

  if (packs.length === 0) return null;

  const baseline = packs[0] ? packs[0].price_amount / packs[0].credits : 1;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {packs.map((pack) => {
        const perCredit = pack.price_amount / pack.credits;
        const savingPct = Math.round((1 - perCredit / baseline) * 100);
        return (
          <Card key={pack.id} className="border-border bg-card relative">
            {savingPct > 0 && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-brand text-brand-foreground text-[10px]">
                  Save {savingPct}%
                </Badge>
              </div>
            )}
            <CardContent className="pt-6">
              <p className="text-sm font-semibold">{pack.name}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {pack.credits.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground"> credits</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                £{(pack.price_amount / 100).toFixed(2)} · {(perCredit).toFixed(2)}p per credit
              </p>
              <Button
                className="mt-4 w-full"
                size="sm"
                disabled={!canBuy || buyingId !== null}
                onClick={() => handleBuy(pack)}
              >
                {buyingId === pack.id
                  ? "Starting…"
                  : billingMethod === "invoice"
                    ? "Request invoice"
                    : "Buy now"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
      {!canBuy && (
        <p className="col-span-full text-xs text-muted-foreground">
          Only organisation admins or the owner can buy credits.
        </p>
      )}
    </div>
  );
}
