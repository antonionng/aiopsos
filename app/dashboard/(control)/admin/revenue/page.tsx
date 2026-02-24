"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Loader2,
  CreditCard,
  BarChart3,
} from "lucide-react";

interface RevenueData {
  mrr: number;
  arr: number;
  currency: string;
  active_subscriptions: number;
  trialing: number;
  canceled: number;
  churn_rate: number;
  conversion_rate: number;
  usage_revenue: number;
  plan_breakdown: { plan: string; mrr: number; count: number }[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
}

export default function RevenueDashboardPage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRevenue = useCallback(async () => {
    try {
      const res = await fetch("/api/super-admin/revenue");
      if (!res.ok) {
        setError("Access denied. Super admin role required.");
        return;
      }
      const d = await res.json();
      setData(d);
    } catch {
      setError("Failed to load revenue data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Access Denied</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxMrr = Math.max(...data.plan_breakdown.map((p) => p.mrr), 1);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Revenue Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Financial health and subscription metrics across the platform.
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-4 mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
        <Shield className="h-3 w-3" />
        Super Admin
      </motion.div>

      {/* Primary KPIs */}
      <motion.div variants={item} className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" /> MRR
          </div>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(data.mrr, data.currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> ARR
          </div>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(data.arr, data.currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" /> Usage Revenue (MTD)
          </div>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(data.usage_revenue, data.currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" /> Churn Rate
          </div>
          <p className="mt-2 text-2xl font-bold">{data.churn_rate}%</p>
        </div>
      </motion.div>

      {/* Subscription funnel */}
      <motion.div variants={item} className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Active
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">{data.active_subscriptions}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" /> Trialing
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">{data.trialing}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" /> Churned
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">{data.canceled}</p>
        </div>
      </motion.div>

      {/* Conversion rate */}
      <motion.div variants={item} className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold">Trial Conversion</h2>
        <div className="flex items-center gap-4">
          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${data.conversion_rate}%` }}
            />
          </div>
          <span className="text-sm font-bold">{data.conversion_rate}%</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {data.active_subscriptions} active out of {data.active_subscriptions + data.trialing + data.canceled} total
        </p>
      </motion.div>

      {/* Revenue by plan */}
      <motion.div variants={item} className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Revenue by Plan</h2>
        </div>
        {data.plan_breakdown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plan data available.</p>
        ) : (
          <div className="space-y-3">
            {data.plan_breakdown.map((p) => (
              <div key={p.plan}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{p.plan}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(p.mrr, data.currency)}/mo &middot; {p.count} tenants
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${(p.mrr / maxMrr) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
