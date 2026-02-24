"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Loader2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  metadata: Record<string, unknown>;
  user_name: string;
  user_email: string | null;
  org_name: string | null;
  org_id: string;
}

interface Filters {
  organisations: { id: string; name: string }[];
  actions: string[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters | null>(null);

  const [orgFilter, setOrgFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const limit = 50;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (orgFilter) params.set("org_id", orgFilter);
      if (actionFilter) params.set("action", actionFilter);
      if (dateFrom) params.set("from", new Date(dateFrom).toISOString());
      if (dateTo) params.set("to", new Date(dateTo + "T23:59:59").toISOString());

      const res = await fetch(`/api/super-admin/audit?${params}`);
      if (!res.ok) {
        setError("Access denied.");
        return;
      }
      const data = await res.json();
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
      if (data.filters) setFilters(data.filters);
    } catch {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page, orgFilter, actionFilter, dateFrom, dateTo]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const totalPages = Math.ceil(total / limit);

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

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide activity and compliance trail ({total} entries).
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-4 mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
        <Shield className="h-3 w-3" />
        Super Admin
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-1">
            <Label className="text-xs">Organisation</Label>
            <Select value={orgFilter || "all"} onValueChange={(v) => { setOrgFilter(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All orgs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All organisations</SelectItem>
                {(filters?.organisations ?? []).map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Action</Label>
            <Select value={actionFilter || "all"} onValueChange={(v) => { setActionFilter(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {(filters?.actions ?? []).map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">From</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <motion.div variants={item} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <FileText className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">No audit logs found</p>
          <p className="text-xs text-muted-foreground">Try adjusting your filters.</p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={item} className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs font-mono">
                        {log.action}
                      </Badge>
                      {log.org_name && (
                        <Badge variant="secondary" className="text-xs">
                          {log.org_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">{log.user_name}</span>
                      {log.user_email && (
                        <span className="text-muted-foreground"> ({log.user_email})</span>
                      )}
                    </p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground font-mono truncate">
                        {JSON.stringify(log.metadata)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <motion.div variants={item} className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
