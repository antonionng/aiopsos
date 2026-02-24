"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LinkIcon,
  Plus,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ExternalLink,
  Users,
  Share2,
  BarChart3,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AssessmentLinkRow {
  id: string;
  token: string;
  title: string;
  description: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  pending_responses: { count: number }[];
}

export default function LinksPage() {
  const [links, setLinks] = useState<AssessmentLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("AI Readiness Assessment");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchLinks = useCallback(async () => {
    const res = await fetch("/api/admin/links");
    const data = await res.json();
    setLinks(data.links ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  async function handleCreate() {
    setCreating(true);
    setError("");
    const res = await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        token: slug || undefined,
        description,
      }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setCreating(false);
      return;
    }
    setOpen(false);
    setTitle("AI Readiness Assessment");
    setSlug("");
    setDescription("");
    setCreating(false);
    fetchLinks();
  }

  async function toggleActive(id: string, currentActive: boolean) {
    await fetch(`/api/admin/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    fetchLinks();
  }

  async function deleteLink(id: string) {
    if (!confirm("Delete this assessment link? This cannot be undone.")) return;
    await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
    fetchLinks();
  }

  function copyUrl(token: string) {
    const url = `${window.location.origin}/assess/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Assessment Links</h1>
          <p className="text-sm text-muted-foreground">
            Create shareable links for your team to take the AI readiness
            assessment.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="mr-2 h-4 w-4" />
              New Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Assessment Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="AI Readiness Assessment"
                  className="bg-surface"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Custom slug{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0">/assess/</span>
                  <Input
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                      )
                    }
                    placeholder="auto-generated"
                    className="bg-surface"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Shown to respondents before they start"
                  className="bg-surface"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border skeleton-shimmer"
              />
            ))}
          </div>
        )}

        {!loading && links.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <LinkIcon className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-sm font-semibold">
              No assessment links yet
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first link to share with your team.
            </p>
            <Button
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={() => setOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Link
            </Button>
          </div>
        )}

        {links.map((link) => (
          <div
            key={link.id}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{link.title}</h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    /assess/{link.token}
                  </p>
                  {link.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {link.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {link.pending_responses?.[0]?.count ?? 0} responses
                    </span>
                    <span>
                      Created{" "}
                      {new Date(link.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    link.active
                      ? "bg-brand/10 text-brand"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {link.active ? "Active" : "Inactive"}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyUrl(link.token)}
                  className="h-8 px-2"
                >
                  {copiedId === link.token ? (
                    <Check className="h-3.5 w-3.5 text-brand" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>

                <a
                  href={`/assess/${link.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => toggleActive(link.id, link.active)}
                >
                  {link.active ? (
                    <ToggleRight className="h-4 w-4 text-brand" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={() => deleteLink(link.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
