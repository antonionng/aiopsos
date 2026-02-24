"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApprovalRequest {
  id: string;
  status: "pending" | "approved" | "rejected";
  content_preview: string;
  comment: string | null;
  created_at: string;
  resolved_at: string | null;
  requester?: { name: string; email: string } | null;
  reviewer?: { name: string; email: string } | null;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
  approved: { icon: CheckCircle2, color: "text-brand", bg: "bg-brand/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [role, setRole] = useState<string>("user");
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});

  const loadRequests = useCallback(() => {
    fetch("/api/approvals")
      .then((r) => r.json())
      .then((d) => {
        setRequests(d.requests ?? []);
        setRole(d.role ?? "user");
      })
      .catch(() => {});
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  async function handleReview(id: string, status: "approved" | "rejected") {
    await fetch("/api/approvals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, comment: reviewComment[id] || "" }),
    });
    loadRequests();
  }

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");
  const isReviewer = role === "admin" || role === "manager";

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Approval Workflows</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve AI-generated content before it&apos;s shared externally.
          {isReviewer ? " You can approve or reject pending requests." : " Submit content for manager review."}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="mt-6 grid grid-cols-3 gap-3">
        <Card className="border-border bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Pending</p>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Approved</p>
              <CheckCircle2 className="h-4 w-4 text-brand" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {resolved.filter((r) => r.status === "approved").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Rejected</p>
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {resolved.filter((r) => r.status === "rejected").length}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="mt-6">
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Resolved ({resolved.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {pending.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Shield className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No pending approvals. All clear.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pending.map((req) => (
                <ApprovalCard
                  key={req.id}
                  request={req}
                  isReviewer={isReviewer}
                  comment={reviewComment[req.id] ?? ""}
                  onCommentChange={(v) => setReviewComment({ ...reviewComment, [req.id]: v })}
                  onApprove={() => handleReview(req.id, "approved")}
                  onReject={() => handleReview(req.id, "rejected")}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="resolved" className="mt-4 space-y-3">
            {resolved.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No resolved requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              resolved.map((req) => (
                <ApprovalCard key={req.id} request={req} isReviewer={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

function ApprovalCard({
  request,
  isReviewer,
  comment,
  onCommentChange,
  onApprove,
  onReject,
}: {
  request: ApprovalRequest;
  isReviewer: boolean;
  comment?: string;
  onCommentChange?: (v: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const config = STATUS_CONFIG[request.status];
  const StatusIcon = config.icon;

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${config.bg}`}>
              <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium">
                {request.requester?.name ?? "Unknown user"}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`text-[10px] ${config.color}`}
          >
            {config.label}
          </Badge>
        </div>

        {/* Content preview */}
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Content for review
            </span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {request.content_preview || "No preview available."}
          </p>
        </div>

        {/* Reviewer comment */}
        {request.comment && (
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Reviewer comment
            </p>
            <p className="text-sm">{request.comment}</p>
            {request.reviewer && (
              <p className="mt-1 text-xs text-muted-foreground">
                -- {request.reviewer.name}
              </p>
            )}
          </div>
        )}

        {/* Review actions */}
        {isReviewer && request.status === "pending" && (
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment (optional)"
              className="text-sm"
              rows={2}
              value={comment ?? ""}
              onChange={(e) => onCommentChange?.(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onApprove}
                className="flex-1"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onReject}
                className="flex-1"
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
