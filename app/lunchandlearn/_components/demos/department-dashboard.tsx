"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  SALES_PROSPECTS,
  FINANCE_METRICS,
  MARKETING_CAMPAIGNS,
  ENGINEERING_METRICS,
  PRODUCT_METRICS,
  SENSOR_NETWORK,
} from "./seeded-data";

function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      {sub && <p className="text-[10px] text-zinc-500">{sub}</p>}
    </div>
  );
}

function HBar({ label, value, max = 100, color = "white" }: { label: string; value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-xs text-zinc-400 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, opacity: 0.7 }}
        />
      </div>
      <span className="w-10 text-right text-xs font-mono text-zinc-400">{value}%</span>
    </div>
  );
}

function ArcGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = value / max;
  const arc = pct * 180;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 80 45" className="w-20">
        <path d="M8 40 A32 32 0 0 1 72 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M8 40 A32 32 0 0 1 72 40"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${(arc / 180) * 100.5} 100.5`}
        />
      </svg>
      <span className="text-sm font-bold text-white">{value}{typeof max === "number" && max <= 10 ? `/${max}` : ""}</span>
      <span className="text-[9px] text-zinc-500">{label}</span>
    </div>
  );
}

function SalesDashboard() {
  const stages = [
    { label: "Discovery", count: 1, value: "290K" },
    { label: "Demo", count: 1, value: "210K" },
    { label: "Qualified", count: 1, value: "320K" },
    { label: "Proposal", count: 1, value: "450K" },
    { label: "Negotiation", count: 1, value: "580K" },
    { label: "Review", count: 1, value: "390K" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <KPI label="Pipeline" value="£2.24M" sub="6 active deals" />
        <KPI label="Closing Q1" value="£580K" sub="1 deal in negotiation" />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Pipeline by stage</p>
        <div className="flex items-end gap-1 h-16">
          {stages.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ height: 0 }}
              animate={{ height: `${30 + i * 12}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex-1 rounded-t bg-white/20 relative group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                £{s.value}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-1 flex gap-1">
          {stages.map((s) => (
            <span key={s.label} className="flex-1 text-center text-[7px] text-zinc-600 truncate">{s.label}</span>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Top prospects</p>
        {SALES_PROSPECTS.slice(0, 3).map((p) => (
          <div key={p.company} className="flex items-center justify-between border-b border-white/5 py-1.5 last:border-0">
            <span className="text-xs text-zinc-300">{p.company}</span>
            <span className="text-xs font-mono text-zinc-400">{p.dealValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceDashboard() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KPI label="Claims" value="847" sub="FY 2025" />
        <KPI label="Total" value="£10.5M" />
        <KPI label="Avg" value="£12.4K" />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Claims by severity</p>
        {FINANCE_METRICS.bySeverity.map((s) => (
          <HBar key={s.level} label={s.level} value={s.pct} color={
            s.level === "Critical" ? "#ef4444" : s.level === "High" ? "#f97316" : s.level === "Medium" ? "#eab308" : "#a1a1aa"
          } />
        ))}
      </div>
      <div className="flex items-center justify-around rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <ArcGauge value={8} max={12} label="Break-even (mo)" color="#4ade80" />
        <div className="text-center">
          <p className="text-lg font-bold text-white">£420K</p>
          <p className="text-[9px] text-zinc-500">Projected savings</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">£150K</p>
          <p className="text-[9px] text-zinc-500">AI investment</p>
        </div>
      </div>
    </div>
  );
}

function MarketingDashboard() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KPI label="Reach" value="45K" sub="Q4 email" />
        <KPI label="LinkedIn" value="23K/mo" sub="8.4% engagement" />
        <KPI label="Leads" value="40" sub="Q4 total" />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Campaign performance</p>
        {MARKETING_CAMPAIGNS.map((c) => (
          <div key={c.name} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
            <span className="text-xs text-zinc-300 flex-1 truncate pr-2">{c.name}</span>
            <span className="text-xs font-mono text-zinc-400">{c.leads ?? 0} leads</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Webinar conversion</p>
        <div className="flex items-center gap-3">
          <ArcGauge value={62} max={100} label="Attendance" color="#a1a1aa" />
          <div className="flex-1 space-y-1">
            <HBar label="Signups" value={85} color="#d4d4d8" />
            <HBar label="Attended" value={62} color="#a1a1aa" />
            <HBar label="To lead" value={8} color="#71717a" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineeringDashboard() {
  const b = ENGINEERING_METRICS.backlog;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KPI label="Velocity" value={`${ENGINEERING_METRICS.sprintVelocity} pts`} sub="per sprint" />
        <KPI label="Deploys" value={ENGINEERING_METRICS.deployFrequency} />
        <KPI label="Incidents" value={ENGINEERING_METRICS.incidentRate} />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Backlog breakdown ({b.total} items)</p>
        <HBar label="P0 Critical" value={Math.round((b.p0 / b.total) * 100)} color="#ef4444" />
        <HBar label="P1 High" value={Math.round((b.p1 / b.total) * 100)} color="#f97316" />
        <HBar label="P2 Medium" value={Math.round((b.p2 / b.total) * 100)} color="#eab308" />
        <HBar label="Tech Debt" value={Math.round((b.techDebt / b.total) * 100)} color="#a1a1aa" />
        <HBar label="Features" value={Math.round((b.features / b.total) * 100)} color="#d4d4d8" />
      </div>
      <div className="flex items-center justify-around rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <ArcGauge value={ENGINEERING_METRICS.sprintVelocity} max={50} label="Sprint velocity" color="#a1a1aa" />
        <ArcGauge value={ENGINEERING_METRICS.sprintsCompleted} max={24} label="Sprints done" color="#d4d4d8" />
      </div>
    </div>
  );
}

function ProductDashboard() {
  const p = PRODUCT_METRICS;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KPI label="DAU" value={p.dau.toLocaleString()} />
        <KPI label="MAU" value={p.mau.toLocaleString()} />
        <KPI label="DAU/MAU" value={`${p.dauMauRatio}%`} />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Feature adoption</p>
        {p.featureAdoption.map((f) => (
          <HBar key={f.feature} label={f.feature} value={f.adoption} color="#d4d4d8" />
        ))}
      </div>
      <div className="flex items-center justify-around rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <ArcGauge value={p.nps} max={100} label="NPS" color="#4ade80" />
        <ArcGauge value={p.csat} max={5} label="CSAT" color="#a1a1aa" />
      </div>
    </div>
  );
}

function OperationsDashboard() {
  const s = SENSOR_NETWORK;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KPI label="Sensors" value={s.totalSensors.toLocaleString()} sub={`${s.regions} regions`} />
        <KPI label="Uptime" value={s.uptime} />
        <KPI label="Interval" value={s.dataInterval} />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Regional distribution</p>
        {s.regionalDistribution.map((r) => (
          <HBar key={r.region} label={r.region} value={r.pct} color="#d4d4d8" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center">
          <p className="text-lg font-bold text-orange-400">{s.maintenanceBacklog}</p>
          <p className="text-[9px] text-zinc-500">Pending maintenance</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center">
          <p className="text-lg font-bold text-red-400">{s.offlineSensors}</p>
          <p className="text-[9px] text-zinc-500">Offline sensors</p>
        </div>
      </div>
    </div>
  );
}

const DASHBOARDS: Record<string, () => React.ReactElement> = {
  sales: SalesDashboard,
  finance: FinanceDashboard,
  marketing: MarketingDashboard,
  engineering: EngineeringDashboard,
  product: ProductDashboard,
  operations: OperationsDashboard,
};

export function DepartmentDashboard({ department }: { department: string }) {
  const Dashboard = DASHBOARDS[department];
  if (!Dashboard) return null;

  return (
    <motion.div
      key={department}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto pr-1"
    >
      <Dashboard />
    </motion.div>
  );
}
