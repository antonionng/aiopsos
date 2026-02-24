"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Crown,
  Lock,
  Check,
  ExternalLink,
  Zap,
  TrendingUp,
  Mic,
  Globe,
  Image,
  FlaskConical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SUBSCRIPTION_PLANS,
  PLAN_MODELS,
  PLAN_FEATURES,
  FEATURE_LABELS,
  FEATURE_UNITS,
  FEATURE_OVERAGE_RATES,
  type PlanType,
  type FeatureType,
} from "@/lib/constants";
import { MODEL_REGISTRY } from "@/lib/model-router";

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
  currentMonthUsage: {
    totalRequests: number;
    totalTokens: number;
    totalCharge: number;
  };
  featureUsage?: Record<FeatureType, FeatureUsageItem>;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then(setBilling)
      .catch(() => {
        setBilling({
          plan: "pro",
          status: "trialing",
          trialEndsAt: new Date(Date.now() + 12 * 86400000).toISOString(),
          seatCount: 10,
          currentMonthUsage: { totalRequests: 142, totalTokens: 215000, totalCharge: 8.64 },
        });
      });
  }, []);

  const trialDaysLeft = billing?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(billing.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  async function handleCheckout(plan: PlanType) {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, priceId: `price_${plan}` }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

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
  const isTrialing = billing.status === "trialing";
  const isActive = billing.status === "active" || isTrialing;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, view usage, and control access to AI models.
        </p>
      </motion.div>

      {/* Trial banner */}
      {isTrialing && trialDaysLeft > 0 && (
        <motion.div
          variants={item}
          className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted p-4"
        >
          <Crown className="h-5 w-5 text-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              Pro trial -- {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining
            </p>
            <p className="text-xs text-muted-foreground">
              You have full Pro access. Choose a plan before your trial ends.
            </p>
          </div>
          <Button size="sm" onClick={() => handleCheckout("pro")} disabled={loading}>
            Subscribe to Pro
          </Button>
        </motion.div>
      )}

      {/* Current plan + usage */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <motion.div variants={item}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4 text-brand" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {currentPlan.name}
                </span>
                <Badge variant={isActive ? "default" : "destructive"} className="text-[10px]">
                  {isTrialing ? "Trial" : billing.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                £{currentPlan.monthlyPricePerSeat}/user/month
              </p>
              <p className="text-xs text-muted-foreground">
                {billing.seatCount} seats = £{currentPlan.monthlyPricePerSeat * billing.seatCount}/mo
              </p>
              {billing.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={handlePortal}
                  disabled={loading}
                >
                  Manage Subscription
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>
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
              <p className="mt-1 text-xs text-muted-foreground">AI usage charges (cost + 20%)</p>
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
                <TrendingUp className="h-4 w-4 text-foreground" />
                Total Monthly Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const featureOverage = billing.featureUsage
                  ? Object.values(billing.featureUsage).reduce((s, f) => s + f.overageCharge, 0)
                  : 0;
                const total =
                  currentPlan.monthlyPricePerSeat * billing.seatCount +
                  billing.currentMonthUsage.totalCharge +
                  featureOverage;
                return (
                  <>
                    <p className="text-3xl font-bold">£{total.toFixed(2)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Subscription + usage</p>
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Subscription</span>
                        <span>£{(currentPlan.monthlyPricePerSeat * billing.seatCount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">AI usage</span>
                        <span>£{billing.currentMonthUsage.totalCharge.toFixed(2)}</span>
                      </div>
                      {featureOverage > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-red-500">Feature overages</span>
                          <span className="text-red-500">£{featureOverage.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>
      </div>

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

          {/* Total overage charges */}
          {(() => {
            const totalOverage = Object.values(billing.featureUsage!).reduce(
              (sum, f) => sum + f.overageCharge,
              0
            );
            if (totalOverage <= 0) return null;
            return (
              <Card className="mt-4 border-red-500/20 bg-red-500/5">
                <CardContent className="flex items-center justify-between pt-5">
                  <div>
                    <p className="text-sm font-medium text-red-600">Overage Charges This Month</p>
                    <p className="text-xs text-muted-foreground">
                      Charged at overage rates for usage beyond included quotas
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    £{totalOverage.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            );
          })()}
        </motion.div>
      )}

      {/* Plan comparison */}
      <motion.div variants={item} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Plans</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {(["basic", "pro", "enterprise"] as const).map((planKey) => {
            const plan = SUBSCRIPTION_PLANS[planKey];
            const models = PLAN_MODELS[planKey];
            const features = PLAN_FEATURES[planKey];
            const isCurrent = billing.plan === planKey;

            return (
              <Card
                key={planKey}
                className={`border-border bg-card relative ${
                  planKey === "enterprise" ? "ring-1 ring-brand/30" : ""
                }`}
              >
                {planKey === "enterprise" && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-brand text-brand-foreground text-[10px]">
                      Best Value
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base font-semibold">{plan.name}</span>
                    <span className="text-xl font-bold">
                      £{plan.monthlyPricePerSeat}
                      <span className="text-xs font-normal text-muted-foreground">/user/mo</span>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Minimum {plan.minSeats} seats (£{plan.monthlyPricePerSeat * plan.minSeats}/mo)
                  </p>

                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Models ({models.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {models.map((id) => (
                        <Badge key={id} variant="secondary" className="text-[10px]">
                          {MODEL_REGISTRY[id]?.label ?? id}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "Knowledge base", enabled: features.knowledgeBase },
                      { label: "Custom personas", enabled: features.personas },
                      { label: "Approval workflows", enabled: features.approvalWorkflows },
                      { label: "Stack recommendation", enabled: features.stackRecommendation },
                      { label: "Roadmap generator", enabled: features.roadmapGenerator },
                      { label: "Advanced analytics", enabled: features.advancedAnalytics },
                      { label: "PDF export", enabled: features.pdfExport },
                      { label: "Team collaboration", enabled: features.teamCollaboration },
                      { label: "Web search", enabled: features.webSearch },
                      { label: "Voice chat", enabled: features.voiceChat },
                      { label: "Image generation", enabled: features.imageGeneration },
                      { label: "Deep research", enabled: features.deepResearch },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-2 text-xs">
                        {f.enabled ? (
                          <Check className="h-3.5 w-3.5 text-brand" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                        )}
                        <span className={f.enabled ? "" : "text-muted-foreground/50"}>
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={planKey === "enterprise" ? "default" : "outline"}
                        onClick={() => handleCheckout(planKey)}
                        disabled={loading}
                      >
                        {(["basic", "pro", "enterprise"].indexOf(billing.plan) >
                          ["basic", "pro", "enterprise"].indexOf(planKey))
                          ? "Downgrade"
                          : "Upgrade"}{" "}
                        to {plan.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

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
