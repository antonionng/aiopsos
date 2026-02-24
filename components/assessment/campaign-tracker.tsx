"use client";

import { useState } from "react";
import {
  Users,
  Send,
  CheckCircle,
  TrendingUp,
  Bell,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Invite {
  id: string;
  email: string;
  name: string;
  department: string;
  status: "pending" | "sent" | "opened" | "completed" | "bounced";
  sent_at: string | null;
  reminded_at: string | null;
  completed_at: string | null;
}

interface CampaignStats {
  invited: number;
  sent: number;
  completed: number;
  rate: number;
}

interface CampaignTrackerProps {
  stats: CampaignStats;
  invites: Invite[];
  onRemind: (emails?: string[]) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
  loading?: boolean;
}

const STATUS_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-blue-500/10 text-blue-500" },
  opened: { label: "Opened", className: "bg-amber-500/10 text-amber-500" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-500" },
  bounced: { label: "Bounced", className: "bg-destructive/10 text-destructive" },
};

export function CampaignTracker({
  stats,
  invites,
  onRemind,
  onRemove,
  loading,
}: CampaignTrackerProps) {
  const [filter, setFilter] = useState<string>("all");
  const [reminding, setReminding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? invites
      : invites.filter((i) => i.status === filter);

  async function handleRemindAll() {
    setReminding(true);
    await onRemind();
    setReminding(false);
  }

  async function handleRemindOne(email: string) {
    await onRemind([email]);
  }

  async function handleRemove(id: string) {
    if (!onRemove) return;
    setRemovingId(id);
    await onRemove(id);
    setRemovingId(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[20vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Invited",
            value: stats.invited,
            icon: <Users className="h-4 w-4" />,
          },
          {
            label: "Sent",
            value: stats.sent,
            icon: <Send className="h-4 w-4" />,
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <CheckCircle className="h-4 w-4" />,
          },
          {
            label: "Completion Rate",
            value: `${stats.rate}%`,
            icon: <TrendingUp className="h-4 w-4" />,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              {card.icon}
              <span className="text-xs">{card.label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {stats.invited > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Campaign Progress</span>
            <span>
              {stats.completed} / {stats.invited} completed
            </span>
          </div>
          <Progress value={stats.rate} className="h-2" />
        </div>
      )}

      {/* Actions + filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["all", "pending", "sent", "opened", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {stats.invited > stats.completed && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemindAll}
            disabled={reminding}
          >
            {reminding ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bell className="mr-1.5 h-3.5 w-3.5" />
            )}
            Remind All Incomplete
          </Button>
        )}
      </div>

      {/* Invitee table */}
      {filtered.length > 0 ? (
        <div className="overflow-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 hidden sm:table-cell">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell">Sent</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invite) => {
                const badge = STATUS_BADGES[invite.status];
                return (
                  <tr
                    key={invite.id}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {invite.email}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      {invite.name || "—"}
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      {invite.department || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${badge?.className}`}
                      >
                        {badge?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground hidden sm:table-cell">
                      {invite.sent_at
                        ? new Date(invite.sent_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {invite.status !== "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleRemindOne(invite.email)}
                          >
                            <Bell className="h-3 w-3" />
                          </Button>
                        )}
                        {onRemove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleRemove(invite.id)}
                            disabled={removingId === invite.id}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <Users className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {invites.length === 0
              ? "No invites sent yet. Add emails above to get started."
              : "No invites match this filter."}
          </p>
        </div>
      )}
    </div>
  );
}
