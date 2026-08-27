"use client";

import { useState } from "react";
import { Loader2, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatBytes, MAX_SUBMISSION_BYTES } from "@/lib/materials";

/**
 * Hand in work against one session.
 *
 * POST /api/submissions has existed since migration 021, correct and
 * RLS-enforced, with no caller anywhere in the app - so work has been going
 * back to trainers by email and Drive. This is the missing half.
 *
 * A file or a link, or just a note: plenty of classroom work is a photo of a
 * whiteboard, and plenty is a link to something the delegate already keeps
 * elsewhere. RLS restricts a participant to their own enrolment, so nothing
 * here needs to check whose enrolment this is.
 */

interface Props {
  sessionId: string;
  enrolmentId: string;
  onSubmitted?: () => void;
}

export function SubmitWork({ sessionId, enrolmentId, onSubmitted }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!file && !link.trim() && !notes.trim()) {
      toast.error("Add a file, a link, or a note.");
      return;
    }
    if (file && file.size > MAX_SUBMISSION_BYTES) {
      toast.error(
        `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_SUBMISSION_BYTES)}.`
      );
      return;
    }

    setSaving(true);
    try {
      let res: Response;
      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("session_id", sessionId);
        form.append("enrolment_id", enrolmentId);
        form.append("notes", notes);
        res = await fetch("/api/submissions", { method: "POST", body: form });
      } else {
        res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            enrolment_id: enrolmentId,
            artefact_url: link.trim(),
            notes,
          }),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Could not submit that.");
        return;
      }

      toast.success("Handed in.");
      setFile(null);
      setLink("");
      setNotes("");
      setOpen(false);
      onSubmitted?.();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Paperclip className="mr-2 h-3.5 w-3.5" /> Submit work
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-xs"
      />
      {!file && (
        <Input
          placeholder="or paste a link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="text-xs"
        />
      )}
      <Textarea
        rows={2}
        placeholder="Anything the trainer should know"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="text-xs"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={submit} disabled={saving}>
          {saving ? (
            <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Sending</>
          ) : (
            <><Send className="mr-2 h-3.5 w-3.5" /> Hand in</>
          )}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
