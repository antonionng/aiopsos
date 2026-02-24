"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  Activity,
} from "lucide-react";
import { FeatureGate } from "@/components/feature-gate";
import { DataThresholdGate } from "@/components/data-threshold-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DATA_THRESHOLDS } from "@/lib/constants";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface UsageData {
  summary: {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    activeUsers: number;
    avgDailyRequests: number;
  };
  dailyUsage: { date: string; requests: number; tokens: number; cost: number }[];
  modelBreakdown: { model: string; requests: number; tokens: number; cost: number; percentage: number }[];
  departmentBreakdown: { department: string; requests: number; cost: number; users: number }[];
  auditLogs: { id: string; user: string; action: string; model: string; timestamp: string }[];
}

const COLORS = ["#ececec", "#a0a0a0", "#666666", "#888888", "#cccccc"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

export default function AnalyticsPage() {
  return (
    <FeatureGate featureKey="advancedAnalytics">
      <AnalyticsContent />
    </FeatureGate>
  );
}

function AnalyticsContent() {
  const [data, setData] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (data.summary.totalRequests < DATA_THRESHOLDS.ANALYTICS_MIN_REQUESTS) {
    return (
      <DataThresholdGate
        currentCount={data.summary.totalRequests}
        requiredCount={DATA_THRESHOLDS.ANALYTICS_MIN_REQUESTS}
        featureLabel="Analytics & ROI"
        description="Track usage, cost, and adoption metrics across your organisation. We need a minimum amount of activity data before analytics become meaningful."
        educationalCards={[
          {
            icon: TrendingUp,
            title: "Usage trends",
            body: "See how AI adoption grows over time, which models are most used, and how costs distribute across departments.",
          },
          {
            icon: Users,
            title: "Team adoption",
            body: "Track how many team members are actively using AI tools and identify opportunities to drive adoption.",
          },
          {
            icon: DollarSign,
            title: "Cost optimisation",
            body: "Understand cost per department and per model so you can optimise spend and demonstrate ROI.",
          },
        ]}
      >
        <></>
      </DataThresholdGate>
    );
  }

  const stats = [
    { label: "Total Requests", value: data.summary.totalRequests.toLocaleString(), icon: Zap, color: "text-foreground" },
    { label: "Active Users", value: data.summary.activeUsers, icon: Users, color: "text-foreground" },
    { label: "Total Cost", value: `$${data.summary.totalCost.toFixed(2)}`, icon: DollarSign, color: "text-foreground" },
    { label: "Avg Daily", value: data.summary.avgDailyRequests, icon: Activity, color: "text-foreground" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Analytics & ROI</h1>
        <p className="text-sm text-muted-foreground">
          Track usage, cost, and adoption metrics across your organisation.
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={item} className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Usage over time */}
      <motion.div variants={item} className="mt-4">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-brand" />
              Usage Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--foreground)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Model + Department breakdown */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Model usage pie */}
        <motion.div variants={item}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Model Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data.modelBreakdown}
                    dataKey="percentage"
                    nameKey="model"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.modelBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department cost bar */}
        <motion.div variants={item}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Cost by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.departmentBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="department"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="cost" fill="var(--foreground)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Audit log */}
      <motion.div variants={item} className="mt-4">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {data.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b border-border/50 py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {log.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{log.user}</p>
                      <p className="text-xs text-muted-foreground">{log.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">{log.model}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
