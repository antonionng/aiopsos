"use client";

import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * The wallet headline: credits, face value, and how this org pays.
 * `balance === null` means the org has never bought credits - metered AI
 * still works during rollout, so that state reads as informational, not
 * alarming.
 */
export function CreditBalanceCard({
  balance,
  billingMethod,
  lowThreshold = 200,
}: {
  balance: number | null;
  billingMethod: string;
  lowThreshold?: number;
}) {
  const isLow = balance !== null && balance <= lowThreshold && balance > 0;
  const isEmpty = balance !== null && balance <= 0;

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Coins className="h-4 w-4 text-brand" />
          AI Credits
          {billingMethod === "invoice" && (
            <Badge variant="outline" className="ml-auto text-[10px]">
              Invoice billing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balance === null ? (
          <>
            <p className="text-3xl font-bold"> - </p>
            <p className="mt-1 text-xs text-muted-foreground">
              No credits purchased yet. Buy a pack below to fund your team&apos;s AI usage.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold tabular-nums ${
                  isEmpty ? "text-red-500" : ""
                }`}
              >
                {balance.toLocaleString()}
              </span>
              {isEmpty && (
                <Badge variant="destructive" className="text-[10px]">
                  Out of credits
                </Badge>
              )}
              {isLow && (
                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">
                  Running low
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ≈ £{(balance / 100).toFixed(2)} of AI usage remaining
            </p>
            {isEmpty && (
              <p className="mt-3 text-xs text-red-500">
                AI features are paused for your organisation until the balance is topped up.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
