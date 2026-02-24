"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Plus,
  ScrollText,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FeatureGate } from "@/components/feature-gate";
import {
  AI_POLICY_TEMPLATES,
  POLICY_CATEGORIES,
  POLICY_CATEGORY_LABELS,
  type PolicyCategory,
} from "@/lib/ai-policy-templates";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

interface Policy {
  id: string;
  title: string;
  content: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function AiPolicyPage() {
  return (
    <FeatureGate featureKey="aiPolicies">
      <PolicyContent />
    </FeatureGate>
  );
}

function PolicyContent() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<string>("general");
  const [editStatus, setEditStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);

  const [genCategory, setGenCategory] = useState<string>("general");
  const [genTemplateId, setGenTemplateId] = useState<string>("");
  const [genInstructions, setGenInstructions] = useState("");
  const [generating, setGenerating] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = ["admin", "super_admin"].includes(userRole);

  const loadPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-policies");
      if (!res.ok) return;
      const data = await res.json();
      setPolicies(data.policies ?? []);
      if (data.role) setUserRole(data.role);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  function openCreate(mode: "blank" | "template") {
    if (mode === "template") {
      setTemplatePickerOpen(true);
    } else {
      setEditingId("new");
      setEditTitle("");
      setEditContent("");
      setEditCategory("general");
      setEditStatus("draft");
      setCreateOpen(true);
    }
  }

  function pickTemplate(templateId: string) {
    const tmpl = AI_POLICY_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    setEditingId("new");
    setEditTitle(tmpl.title);
    setEditContent(tmpl.content);
    setEditCategory(tmpl.category);
    setEditStatus("draft");
    setTemplatePickerOpen(false);
    setCreateOpen(true);
  }

  function openEdit(policy: Policy) {
    setEditingId(policy.id);
    setEditTitle(policy.title);
    setEditContent(policy.content);
    setEditCategory(policy.category);
    setEditStatus(policy.status);
    setCreateOpen(true);
  }

  async function handleSave() {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const isNew = editingId === "new";
      const url = isNew ? "/api/ai-policies" : `/api/ai-policies/${editingId}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
          status: editStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save policy");
        return;
      }

      toast.success(isNew ? "Policy created" : "Policy updated");
      setCreateOpen(false);
      loadPolicies();
    } catch {
      toast.error("Failed to save policy");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/ai-policies/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to delete policy");
        return;
      }
      toast.success("Policy deleted");
      setDeleteConfirmId(null);
      if (expandedId === deleteConfirmId) setExpandedId(null);
      loadPolicies();
    } catch {
      toast.error("Failed to delete policy");
    } finally {
      setDeleting(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai-policies/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: genCategory,
          templateId: genTemplateId || undefined,
          customInstructions: genInstructions || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to generate policy");
        return;
      }
      const result = await res.json();
      setGenerateOpen(false);
      setEditingId("new");
      setEditTitle(result.title ?? "Generated Policy");
      setEditContent(result.content ?? "");
      setEditCategory(result.category ?? genCategory);
      setEditStatus("draft");
      setGenInstructions("");
      setGenTemplateId("");
      setCreateOpen(true);
      toast.success("Policy generated — review and save when ready");
    } catch {
      toast.error("Failed to generate policy");
    } finally {
      setGenerating(false);
    }
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="mb-1">AI Policies</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Create and manage AI usage policies for your organisation."
              : "Your organisation's AI usage policies."}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGenerateOpen(true)}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Generate with AI
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCreate("template")}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              From Template
            </Button>
            <Button
              size="sm"
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={() => openCreate("blank")}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Policy
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="mt-8 space-y-3">
        {loading ? (
          <Card className="border-border bg-card">
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : policies.length === 0 ? (
          isAdmin ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                  <ScrollText className="h-7 w-7 text-brand" />
                </div>
                <h3 className="mb-1 text-base font-semibold">Create your first AI policy</h3>
                <p className="mb-5 max-w-md text-sm text-muted-foreground">
                  Define clear guidelines for how your team uses AI. Start from a professional template, generate one with AI, or write your own.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGenerateOpen(true)}
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Generate with AI
                  </Button>
                  <Button
                    size="sm"
                    className="bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() => openCreate("template")}
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Start from Template
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold">Why AI policies matter</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { title: "Reduce risk", desc: "Set clear boundaries on data handling, model usage, and acceptable AI applications before issues arise." },
                    { title: "Build trust", desc: "Show your team and stakeholders that AI is being used responsibly with documented, transparent guidelines." },
                    { title: "Accelerate adoption", desc: "Employees adopt AI 2x faster when they have clear policies — uncertainty is the biggest blocker." },
                  ].map((c) => (
                    <Card key={c.title} className="border-border bg-card">
                      <CardContent className="pt-5">
                        <h3 className="mb-1.5 text-sm font-semibold">{c.title}</h3>
                        <p className="text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <ScrollText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-base font-semibold">No published policies</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Your organisation hasn&apos;t published any AI usage policies yet. Check back soon — your admin may be working on them.
              </p>
            </div>
          )
        ) : (
          policies.map((policy) => (
            <motion.div key={policy.id} variants={item}>
              <Card className="border-border bg-card">
                <button
                  onClick={() => toggleExpand(policy.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ScrollText className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {policy.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {POLICY_CATEGORY_LABELS[policy.category] ?? policy.category}
                        {" · "}
                        Updated {formatDate(policy.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={`text-[10px] ${
                        policy.status === "published"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {policy.status === "published" ? "Published" : "Draft"}
                    </Badge>
                    {expandedId === policy.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedId === policy.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-4 py-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <PolicyMarkdown content={policy.content} />
                        </div>
                        {isAdmin && (
                          <div className="mt-4 flex gap-2 border-t border-border pt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(policy)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirmId(policy.id)}
                            >
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId === "new" ? "Create Policy" : "Edit Policy"}
            </DialogTitle>
            <DialogDescription>
              {editingId === "new"
                ? "Create a new AI policy for your organisation."
                : "Update this policy. Changes are saved when you click Save."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. AI Acceptable Use Policy"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editStatus}
                  onValueChange={(v) => setEditStatus(v as "draft" | "published")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write your policy content in Markdown..."
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {saving ? "Saving..." : "Save Policy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Template Picker Dialog ── */}
      <Dialog open={templatePickerOpen} onOpenChange={setTemplatePickerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Start with a professionally structured template and customise it for your organisation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 max-h-[60vh] overflow-y-auto">
            {AI_POLICY_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => pickTemplate(tmpl.id)}
                className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
              >
                <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{tmpl.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {tmpl.description}
                  </p>
                  <Badge variant="secondary" className="mt-1.5 text-[10px]">
                    {POLICY_CATEGORY_LABELS[tmpl.category] ?? tmpl.category}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── AI Generate Dialog ── */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Policy with AI</DialogTitle>
            <DialogDescription>
              AI will create a tailored policy based on your organisation&apos;s
              context and assessment data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Policy Category</Label>
              <Select value={genCategory} onValueChange={setGenCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POLICY_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Base Template (optional)</Label>
              <Select value={genTemplateId} onValueChange={setGenTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="None — generate from scratch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {AI_POLICY_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional Instructions (optional)</Label>
              <Textarea
                value={genInstructions}
                onChange={(e) => setGenInstructions(e.target.value)}
                placeholder="e.g. Focus on healthcare data compliance, include HIPAA requirements..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this policy? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Policy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function PolicyMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableAlignments: string[] = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    const headerRow = tableRows[0];
    const bodyRows = tableRows.slice(1);
    elements.push(
      <table key={`table-${elements.length}`} className="w-full text-sm">
        <thead>
          <tr>
            {headerRow.map((cell, i) => (
              <th
                key={i}
                className="border border-border px-3 py-1.5 text-left text-xs font-semibold bg-muted/50"
                style={{ textAlign: (tableAlignments[i] as CanvasTextAlign) || "left" }}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-border px-3 py-1.5 text-xs"
                  style={{
                    textAlign: (tableAlignments[ci] as CanvasTextAlign) || "left",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
    tableRows = [];
    tableAlignments = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      if (
        cells.every((c) => /^[-:]+$/.test(c))
      ) {
        tableAlignments = cells.map((c) => {
          if (c.startsWith(":") && c.endsWith(":")) return "center";
          if (c.endsWith(":")) return "right";
          return "left";
        });
        inTable = true;
        continue;
      }

      if (!inTable && tableRows.length === 0) {
        tableRows.push(cells);
        continue;
      }

      tableRows.push(cells);
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    if (trimmed === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />);
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-xl font-bold mt-6 mb-2">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-lg font-semibold mt-5 mb-1.5">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold mt-4 mb-1">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("- [ ] ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-2">
          <input type="checkbox" disabled className="mt-1 shrink-0" />
          <span className="text-sm">{renderInline(trimmed.slice(6))}</span>
        </div>
      );
    } else if (trimmed.startsWith("- [x] ") || trimmed.startsWith("- [X] ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-2">
          <input type="checkbox" checked disabled className="mt-1 shrink-0" />
          <span className="text-sm">{renderInline(trimmed.slice(6))}</span>
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
          <span className="text-sm">{renderInline(trimmed.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s/)?.[1] ?? "";
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-2">
          <span className="text-sm font-medium text-muted-foreground shrink-0 w-5 text-right">
            {num}.
          </span>
          <span className="text-sm">{renderInline(text)}</span>
        </div>
      );
    } else if (trimmed.startsWith("---")) {
      elements.push(
        <hr key={i} className="my-4 border-border" />
      );
    } else if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
      elements.push(
        <p key={i} className="text-sm italic text-muted-foreground">
          {trimmed.slice(1, -1)}
        </p>
      );
    } else {
      elements.push(
        <p key={i} className="text-sm leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  }

  if (inTable) flushTable();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[4]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-muted px-1 py-0.5 text-xs font-mono"
        >
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
