"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Trash2,
  FolderOpen,
  FileUp,
  BrainCircuit,
  Search,
  Shield,
} from "lucide-react";
import { FeatureGate } from "@/components/feature-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KBFile {
  id: string;
  filename: string;
  file_size: number;
  created_at: string;
  department_id: string | null;
  departments?: { name: string } | null;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function KnowledgeBasePage() {
  return (
    <FeatureGate featureKey="knowledgeBase">
      <KnowledgeBaseContent />
    </FeatureGate>
  );
}

function KnowledgeBaseContent() {
  const [files, setFiles] = useState<KBFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const loadFiles = useCallback(() => {
    fetch("/api/knowledge")
      .then((r) => r.json())
      .then((d) => setFiles(d.files ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        const formData = new FormData();
        formData.append("file", fileList[i]);
        await fetch("/api/knowledge", { method: "POST", body: formData });
      }
      loadFiles();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/knowledge", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadFiles();
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Upload company documents to ground AI responses in your organisation&apos;s knowledge.
        </p>
      </motion.div>

      {/* Upload area */}
      <motion.div variants={item} className="mt-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleUpload(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
            dragOver
              ? "border-brand bg-brand/5"
              : "border-border hover:border-brand/30"
          }`}
        >
          <FileUp className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">
            Drag & drop files here, or click to browse
          </p>
          <p className="mb-4 text-xs text-muted-foreground">
            PDF, DOCX, TXT, MD -- max 10MB per file
          </p>
          <label>
            <Button variant="outline" size="sm" disabled={uploading} asChild>
              <span>
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Upload Files"}
              </span>
            </Button>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt,.md,.csv"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </div>
      </motion.div>

      {/* File list */}
      <motion.div variants={item} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">
          Documents ({files.length})
        </h2>

        {files.length === 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                <FolderOpen className="h-7 w-7 text-brand" />
              </div>
              <h3 className="mb-1 text-base font-semibold">No documents yet</h3>
              <p className="mb-5 max-w-md text-sm text-muted-foreground">
                Upload company documents so AI responses are grounded in your organisation&apos;s knowledge — policies, processes, product docs, and more.
              </p>
              <label>
                <Button className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
                  <span>
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Upload Your First Document
                  </span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.docx,.txt,.md,.csv"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold">How it works</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: FileUp, title: "Upload documents", desc: "Add PDFs, Word docs, or text files. We support policies, playbooks, SOPs, product specs, and more." },
                  { icon: BrainCircuit, title: "AI learns your context", desc: "Documents are indexed so the AI chat can reference your company knowledge in every response." },
                  { icon: Search, title: "Grounded answers", desc: "Your team gets answers based on real company data — not generic responses. Fewer hallucinations, more accuracy." },
                ].map((c) => (
                  <Card key={c.title} className="border-border bg-card">
                    <CardContent className="pt-5">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5">
                        <c.icon className="h-4 w-4 text-foreground" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold">{c.title}</h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="border-border bg-card">
                <CardContent className="flex items-center gap-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-brand" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{file.filename}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(file.file_size)}
                      </span>
                      {file.departments?.name && (
                        <Badge variant="secondary" className="text-[10px]">
                          {file.departments.name}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(file.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
