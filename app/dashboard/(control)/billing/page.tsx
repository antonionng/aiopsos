"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CreditCard,
  Lock,
  Check,
  Zap,
  Mic,
  Globe,
  Image,
  FlaskConical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SUBSCRIPTION_PLANS,
  PLAN_MODELS,
  FEATURE_LABELS,
  FEATURE_UNITS,
  FEATURE_OVERAGE_RATES,
  type PlanType,
  type FeatureType,
} from "@/lib/constants";
import { MODEL_REGISTRY } from "@/lib/model-router";
import { CreditBalanceCard } from "@/components/billing/credit-balance-card";
import { CreditPackPicker, type CreditPack } from "@/components/billing/credit-pack-picker";
import { CreditHistory, type LedgerRow } from "@/components/billing/credit-history";
import { InvoicesList, type InvoiceRow } from "@/components/billing/invoices-list";

interface FeatureUsageItem {
  used: number;
  limit: number;
  overageCharge: number;
}

interface BillingData {
  plan: PlanType;
  status: string;
  trialEndsAt: string | null;
  seatCount: number;
  memberCount?: number;
  currentMonthUsage: {
    totalRequests: number;
    totalTokens: number;
    totalCharge: number;
  };
  featureUsage?: Record<FeatureType, FeatureUsageItem>;
  billingMethod?: string;
  creditBalance?: number | null;
  creditPacks?: CreditPack[];
  creditHistory?: LedgerRow[];
  invoices?: InvoiceRow[];
}

const FEATURE_ICONS: Record<FeatureType, typeof Mic> = {
  voice: Mic,
  web_search: Globe,
  image_gen: Image,
  deep_research: FlaskConical,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingData | null>(null);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then(setBilling)
      .catch(() => setBilling(null));

    // Back from Mooov hosted checkout. The wallet is credited by the
    // webhook, which may land a beat after the redirect - hence "shortly".
    if (new URLSearchParams(window.location.search).get("topup") === "success") {
      toast.success("Payment received - your credits will appear shortly.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (!billing) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[billing.plan];
  const isAdminView = billing.creditPacks !== undefined;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Billing</h1>
        <p className="text-sm text-muted-foreground">
          AI credits, usage, and invoices for your organisation.
        </p>
      </motion.div>

      {/* Balance + plan + usage */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <motion.div variants={item}>
          <CreditBalanceCard
            balance={billing.creditBalance ?? null}
            billingMethod={billing.billingMethod ?? "card"}
          />
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-foreground" />
                This Month&apos;s Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                £{billing.currentMonthUsage.totalCharge.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">AI usage at credit face value</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-lg font-semibold">
                    {billing.currentMonthUsage.totalRequests.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Requests</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {(billing.currentMonthUsage.totalTokens / 1000).toFixed(0)}k
                  </p>
                  <p className="text-[10px] text-muted-foreground">Tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4 text-brand" />
                Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">£0</span>
                <Badge variant="default" className="text-[10px]">
                  Included
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The platform is free - you pay for AI credits and facilitated courses.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {currentPlan.name} tier · {billing.seatCount} seats
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Buy credits */}
      {isAdminView && (
        <motion.div variants={item} className="mt-8">
          <h2 className="mb-1 text-lg font-semibold">Top up credits</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {billing.billingMethod === "invoice"
              ? "Your organisation pays by invoice - requesting a pack emails an invoice to your billing contact, and credits are added when it's paid."
              : "Card payments are processed securely at checkout. Credits are added the moment payment completes."}
          </p>
          <CreditPackPicker
            packs={billing.creditPacks ?? []}
            canBuy
            billingMethod={billing.billingMethod ?? "card"}
          />
        </motion.div>
      )}

      {/* Invoices */}
      {isAdminView && (billing.invoices?.length ?? 0) > 0 && (
        <motion.div variants={item} className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Invoices</h2>
          <InvoicesList invoices={billing.invoices ?? []} />
        </motion.div>
      )}

      {/* Credit history */}
      {isAdminView && (
        <motion.div variants={item} className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Credit history</h2>
          <CreditHistory rows={billing.creditHistory ?? []} />
        </motion.div>
      )}

      {/* Feature Usage Meters */}
      {billing.featureUsage && (
        <motion.div variants={item} className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Premium Feature Usage</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["voice", "web_search", "image_gen", "deep_research"] as const).map((feature) => {
              const usage = billing.featureUsage![feature];
              const Icon = FEATURE_ICONS[feature];
              const pct = usage.limit > 0 ? Math.min((usage.used / usage.limit) * 100, 100) : 0;
              const overLimit = usage.used > usage.limit && usage.limit > 0;

              return (
                <Card key={feature} className="border-border bg-card">
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-4 w-4 text-brand" />
                      <span className="text-sm font-medium">{FEATURE_LABELS[feature]}</span>
                      {usage.limit === 0 && (
                        <Badge variant="outline" className="ml-auto text-[9px]">
                          <Lock className="mr-1 h-2.5 w-2.5" />
                          Upgrade
                        </Badge>
                      )}
                    </div>

                    {usage.limit > 0 ? (
                      <>
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-2xl font-bold tabular-nums">
                            {Math.round(usage.used)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / {usage.limit} {FEATURE_UNITS[feature]}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${
                              overLimit
                                ? "bg-red-500"
                                : pct > 80
                                ? "bg-amber-500"
                                : "bg-brand"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        {overLimit && (
                          <p className="mt-2 text-xs text-red-500">
                            Over limit by {Math.round(usage.used - usage.limit)} {FEATURE_UNITS[feature]}
                            {" · "}Overage: £{usage.overageCharge.toFixed(2)}
                            {" (£"}{FEATURE_OVERAGE_RATES[feature]}/{FEATURE_UNITS[feature].slice(0, -1)})
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Not available on {billing.plan === "basic" ? "Basic" : "Pro"} plan
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* All available models */}
      <motion.div variants={item} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Model Access</h2>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.values(MODEL_REGISTRY).map((m) => {
                const hasAccess = (PLAN_MODELS[billing.plan] as readonly string[]).includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      hasAccess ? "border-border" : "border-border/50 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {hasAccess ? (
                        <Check className="h-3.5 w-3.5 text-brand" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[9px]">
                        {m.provider}
                      </Badge>
                      {!hasAccess && (
                        <Badge variant="outline" className="text-[9px]">
                          Pro
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
