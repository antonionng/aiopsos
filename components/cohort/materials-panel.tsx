"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatBytes, MAX_MATERIAL_BYTES } from "@/lib/materials";

/**
 * Participant packs for one cohort: handed out by the trainer, downloaded by
 * the room.
 *
 * Used from both sides. `canUpload` is a presentation hint only - the
 * "Graders add materials" policy is what actually decides, so a delegate who
 * forged the prop still gets a 403 from the row insert.
 *
 * Downloads are brokered: the API checks access and mints a five-minute
 * signed URL. Nothing here ever holds a permanent object URL, because a
 * cohort can hold several companies and a pasted link would outlive the room.
 */

export interface Material {
  id: string;
  cohort_id: string | null;
  course_id: string | null;
  title: string;
  description: string;
  filename: string;
  file_size: number;
  mime_type: string;
  visibility: "enrolled" | "public";
}

interface Props {
  cohortId: string;
  courseId?: string | null;
  canUpload?: boolean;
  /** Heading copy differs for a trainer preparing a day vs a delegate on it. */
  emptyMessage?: string;
}

export function MaterialsPanel({
  cohortId,
  courseId,
  canUpload = false,
  emptyMessage = "No materials yet.",
}: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ cohort_id: cohortId });
    if (courseId) params.set("course_id", courseId);
    try {
      const res = await fetch(`/api/materials?${params}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [cohortId, courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(file: File) {
    if (file.size > MAX_MATERIAL_BYTES) {
      toast.error(
        `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_MATERIAL_BYTES)}.`
      );
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("cohort_id", cohortId);
      form.append("title", file.name);

      const res = await fetch("/api/materials", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Upload failed.");
        return;
      }
      toast.success(`${file.name} added to the pack.`);
      await load();
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function download(material: Material) {
    setBusyId(material.id);
    try {
      const res = await fetch(`/api/materials/${material.id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Could not open that file.");
        return;
      }
      window.location.href = data.url;
    } finally {
      setBusyId(null);
    }
  }

  async function remove(material: Material) {
    setBusyId(material.id);
    try {
      const res = await fetch(`/api/materials/${material.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Could not remove that file.");
        return;
      }
      toast.success("Removed.");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Participant pack</h3>
        {canUpload && (
          <>
            <input
              ref={fileInput}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
            >
              {uploading ? (
                <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Uploading</>
              ) : (
                <><Upload className="mr-2 h-3.5 w-3.5" /> Add a file</>
              )}
            </Button>
          </>
        )}
      </div>

      {loading ? (
        <div className="py-6 text-center">
          <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : materials.length === 0 ? (
        <p className="py-2 text-xs text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="space-y-1">
          {materials.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(m.file_size)}
                  {m.cohort_id ? " · this session" : " · course pack"}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                disabled={busyId === m.id}
                onClick={() => download(m)}
                aria-label={`Download ${m.title}`}
              >
                {busyId === m.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
              </Button>
              {canUpload && m.cohort_id && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busyId === m.id}
                  onClick={() => remove(m)}
                  aria-label={`Remove ${m.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
