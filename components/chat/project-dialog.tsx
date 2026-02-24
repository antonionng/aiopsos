"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Trash2, Loader2 } from "lucide-react";
import type { Project, ProjectFile } from "@/lib/types";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#64748b",
];

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
  onSaved: () => void;
}

export function ProjectDialog({
  open,
  onClose,
  project,
  onSaved,
}: ProjectDialogProps) {
  const isEditing = !!project;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setDescription(project.description);
        setInstructions(project.instructions);
        setColor(project.color);
        loadFiles(project.id);
      } else {
        setName("");
        setDescription("");
        setInstructions("");
        setColor(COLORS[0]);
        setFiles([]);
      }
    }
  }, [open, project]);

  async function loadFiles(projectId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch {
      setFiles([]);
    }
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);

    try {
      if (isEditing && project) {
        await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, instructions, color }),
        });
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, instructions, color }),
        });
      }
      onSaved();
      onClose();
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList || !project) return;
    setUploading(true);

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await fetch(`/api/projects/${project.id}/files`, {
          method: "POST",
          body: formData,
        });
      } catch {
        // skip failed uploads
      }
    }

    await loadFiles(project.id);
    setUploading(false);
  }

  async function handleDeleteFile(fileId: string) {
    if (!project) return;

    try {
      await fetch(`/api/projects/${project.id}/files`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: fileId }),
      });
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      // silently fail
    }
  }

  async function handleDelete() {
    if (!project) return;
    setSaving(true);

    try {
      await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      onSaved();
      onClose();
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit project" : "New project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name + Color */}
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <div className="flex gap-2">
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My AI Project"
                className="flex-1"
                autoFocus
              />
              <div className="flex items-center gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full transition-all ${
                      color === c
                        ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="project-desc">Description (optional)</Label>
            <Input
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="project-instructions">
              Custom instructions
            </Label>
            <p className="text-[11px] text-muted-foreground">
              These instructions will be applied to every conversation in this
              project.
            </p>
            <Textarea
              id="project-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Always respond in British English. Focus on enterprise use cases..."
              className="min-h-[100px] resize-none text-sm"
            />
          </div>

          {/* Files (only for existing projects) */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Project files</Label>
              <p className="text-[11px] text-muted-foreground">
                Upload context files that the AI can reference in this project.
              </p>

              {files.length > 0 && (
                <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-accent"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate">{f.filename}</span>
                      <span className="text-muted-foreground">
                        {formatSize(f.file_size)}
                      </span>
                      <button
                        onClick={() => handleDeleteFile(f.id)}
                        className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {uploading ? "Uploading..." : "Upload files"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete project
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!name.trim() || saving}
            >
              {saving ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : null}
              {isEditing ? "Save changes" : "Create project"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
