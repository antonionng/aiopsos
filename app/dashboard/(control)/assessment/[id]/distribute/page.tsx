"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Link2,
  Share2,
  BarChart3,
  Plus,
  Send,
  Loader2,
  Copy,
  Check,
  Code,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CsvUpload, type CsvRow } from "@/components/assessment/csv-upload";
import { QrCode } from "@/components/assessment/qr-code";
import { SocialShare } from "@/components/assessment/social-share";
import { CampaignTracker } from "@/components/assessment/campaign-tracker";

interface CampaignInvite {
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

export default function DistributePage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<{
    id: string;
    title: string;
    template_id?: string;
  } | null>(null);
  const [orgName, setOrgName] = useState("");
  const [assessUrl, setAssessUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Email invites state
  const [emailInput, setEmailInput] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    duplicates: number;
    errors: string[];
  } | null>(null);

  // Campaign state
  const [stats, setStats] = useState<CampaignStats>({
    invited: 0,
    sent: 0,
    completed: 0,
    rate: 0,
  });
  const [invites, setInvites] = useState<CampaignInvite[]>([]);
  const [campaignLoading, setCampaignLoading] = useState(true);

  // Embed snippet state
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Load assessment info
  useEffect(() => {
    async function load() {
      try {
        const [assessRes, orgRes] = await Promise.all([
          fetch("/api/assessment"),
          fetch("/api/organisation"),
        ]);
        const assessData = await assessRes.json();
        const orgData = await orgRes.json();

        const found = assessData.assessments?.find(
          (a: { id: string }) => a.id === assessmentId
        );
        if (found) setAssessment(found);
        if (orgData.organisation) setOrgName(orgData.organisation.name);

        // Get or derive the assess URL
        const baseUrl = window.location.origin;
        setAssessUrl(`${baseUrl}/assessment/${assessmentId}/take`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [assessmentId]);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/assessment/${assessmentId}/campaign`);
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.invites) setInvites(data.invites);
    } finally {
      setCampaignLoading(false);
    }
  }, [assessmentId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  // Parse manual email input into invite objects
  function parseEmailsToInvites(text: string) {
    return text
      .split(/[,;\n]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        // Handle "Name <email>" format
        const match = entry.match(/^(.+?)\s*<(.+?)>$/);
        if (match) {
          return { email: match[2].trim(), name: match[1].trim() };
        }
        return { email: entry, name: "" };
      })
      .filter((e) => e.email.includes("@"));
  }

  async function handleSendInvites() {
    setSending(true);
    setSendResult(null);

    let inviteList: { email: string; name?: string; department?: string }[] =
      [];

    // From single email input
    if (emailInput.trim()) {
      inviteList.push(...parseEmailsToInvites(emailInput));
    }

    // From bulk textarea
    if (bulkEmails.trim()) {
      inviteList.push(...parseEmailsToInvites(bulkEmails));
    }

    // From CSV
    if (csvRows.length > 0) {
      inviteList.push(
        ...csvRows
          .filter((r) => r.valid)
          .map((r) => ({
            email: r.email,
            name: r.name,
            department: r.department,
          }))
      );
    }

    // Deduplicate by email
    const seen = new Set<string>();
    inviteList = inviteList.filter((inv) => {
      const key = inv.email.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (inviteList.length === 0) {
      setSending(false);
      return;
    }

    try {
      const res = await fetch(`/api/assessment/${assessmentId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invites: inviteList }),
      });
      const data = await res.json();
      setSendResult(data);
      setEmailInput("");
      setBulkEmails("");
      setCsvRows([]);
      await fetchCampaign();
    } finally {
      setSending(false);
    }
  }

  async function handleRemind(emails?: string[]) {
    await fetch(`/api/assessment/${assessmentId}/remind`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails }),
    });
    await fetchCampaign();
  }

  function copyEmbed() {
    const snippet = `<iframe src="${assessUrl}" width="100%" height="700" frameborder="0" style="border-radius:12px;"></iframe>`;
    navigator.clipboard.writeText(snippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  }

  // Count total pending invites to send
  const pendingCount =
    (emailInput.trim() ? parseEmailsToInvites(emailInput).length : 0) +
    (bulkEmails.trim() ? parseEmailsToInvites(bulkEmails).length : 0) +
    csvRows.filter((r) => r.valid).length;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/assessment")}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-xl font-semibold tracking-tight">
              Distribute Assessment
            </h1>
            <p className="text-sm text-muted-foreground">
              {assessment?.title ?? "Assessment"} — Get your team on board
              through any channel.
            </p>
          </div>
          {stats.invited > 0 && (
            <Badge variant="secondary" className="bg-brand/10 text-brand">
              {stats.completed}/{stats.invited} completed
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="email" className="gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Email Invites</span>
            <span className="sm:hidden">Email</span>
          </TabsTrigger>
          <TabsTrigger value="link" className="gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Link & QR</span>
            <span className="sm:hidden">Link</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Social</span>
            <span className="sm:hidden">Share</span>
          </TabsTrigger>
          <TabsTrigger value="tracker" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Campaign</span>
            <span className="sm:hidden">Track</span>
          </TabsTrigger>
        </TabsList>

        {/* === TAB 1: Email Invites === */}
        <TabsContent value="email">
          <div className="space-y-6">
            {/* Quick add */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Add Emails</h3>
              <div className="flex gap-2">
                <Input
                  placeholder='email@example.com or "Jane Doe <jane@example.com>"'
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendInvites();
                  }}
                  className="bg-background"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!emailInput.trim()) return;
                    setBulkEmails((prev) =>
                      prev
                        ? `${prev}\n${emailInput.trim()}`
                        : emailInput.trim()
                    );
                    setEmailInput("");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bulk paste */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">
                Paste Multiple Emails
              </h3>
              <textarea
                placeholder={
                  "Paste emails separated by commas, semicolons, or new lines.\nSupports \"Name <email>\" format."
                }
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm focus:border-brand/40 focus:outline-none"
              />
              {bulkEmails.trim() && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {parseEmailsToInvites(bulkEmails).length} emails detected
                </p>
              )}
            </div>

            {/* CSV upload */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">
                Upload CSV
              </h3>
              <CsvUpload onParsed={setCsvRows} disabled={sending} />
            </div>

            {/* Send button + result */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleSendInvites}
                disabled={sending || pendingCount === 0}
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {sending
                  ? "Sending..."
                  : `Send ${pendingCount} Invite${pendingCount !== 1 ? "s" : ""}`}
              </Button>

              {sendResult && (
                <div className="flex items-center gap-2 text-sm">
                  {sendResult.sent > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-500"
                    >
                      {sendResult.sent} sent
                    </Badge>
                  )}
                  {sendResult.duplicates > 0 && (
                    <Badge variant="secondary">
                      {sendResult.duplicates} duplicate
                      {sendResult.duplicates !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {sendResult.errors.length > 0 && (
                    <Badge variant="destructive">
                      {sendResult.errors.length} error
                      {sendResult.errors.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <button
                    onClick={() => setSendResult(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* === TAB 2: Share Link + QR Code === */}
        <TabsContent value="link">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Link section */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold">Assessment Link</h3>
              <QrCode url={assessUrl} size={200} />
            </div>

            {/* Embed section */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Embed Snippet</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Copy this HTML to embed the assessment in your internal wiki,
                intranet, or Notion page.
              </p>
              <div className="rounded-lg bg-background p-3">
                <code className="block text-xs text-muted-foreground break-all">
                  {`<iframe src="${assessUrl}" width="100%" height="700" frameborder="0" style="border-radius:12px;"></iframe>`}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={copyEmbed}
              >
                {copiedEmbed ? (
                  <Check className="mr-1.5 h-3.5 w-3.5 text-brand" />
                ) : (
                  <Code className="mr-1.5 h-3.5 w-3.5" />
                )}
                {copiedEmbed ? "Copied!" : "Copy Embed Code"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* === TAB 3: Social / Messaging === */}
        <TabsContent value="social">
          <SocialShare
            url={assessUrl}
            assessmentTitle={assessment?.title ?? "AI Readiness Assessment"}
            orgName={orgName}
          />
        </TabsContent>

        {/* === TAB 4: Campaign Tracker === */}
        <TabsContent value="tracker">
          <CampaignTracker
            stats={stats}
            invites={invites}
            onRemind={handleRemind}
            loading={campaignLoading}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
