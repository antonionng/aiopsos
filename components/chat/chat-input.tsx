"use client";

import { useState, useRef, useCallback, type KeyboardEvent, type DragEvent, type ClipboardEvent } from "react";
import { ArrowUp, Slash, X, Square, FileIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { VoiceButton } from "@/components/chat/voice-button";
import { ActionsMenu } from "@/components/chat/actions-menu";

export interface ChatAttachment {
  id: string;
  url: string;
  filename: string;
  file_type: string;
  file: File;
}

interface Props {
  onSend: (message: string, attachments?: ChatAttachment[]) => void;
  isLoading: boolean;
  isStreaming?: boolean;
  onTemplateOpen?: () => void;
  onStop?: () => void;
  plan?: string;
  onWebSearch?: (query: string) => void;
  onImageGen?: (prompt: string) => void;
  onDeepResearch?: (query: string) => void;
}

export function ChatInput({ onSend, isLoading, isStreaming, onTemplateOpen, onStop, plan, onWebSearch, onImageGen, onDeepResearch }: Props) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || isLoading) return;
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "/" && value === "" && onTemplateOpen) {
      e.preventDefault();
      onTemplateOpen();
    }
  }

  function handleInput() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }

  const addFiles = useCallback((files: FileList | File[]) => {
    const newAttachments: ChatAttachment[] = [];
    for (const file of Array.from(files)) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const url = URL.createObjectURL(file);
      newAttachments.push({
        id,
        url,
        filename: file.name,
        file_type: file.type,
        file,
      });
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((a) => a.id !== id);
    });
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (const item of Array.from(items)) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      addFiles(imageFiles);
    }
  }

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <div className="bg-background px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <div
          className={`relative rounded-2xl border bg-surface shadow-sm transition-all focus-within:shadow-md focus-within:border-border/80 ${
            isDragging
              ? "border-brand border-dashed bg-brand/5"
              : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="group/att relative flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-2 py-1.5"
                >
                  {isImage(att.file_type) ? (
                    <img
                      src={att.url}
                      alt={att.filename}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="max-w-[120px] truncate text-xs text-muted-foreground">
                    {att.filename}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/10 text-foreground/60 transition-colors hover:bg-foreground/20"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onPaste={handlePaste}
            placeholder="Message AIOPSOS..."
            className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent px-4 pt-3.5 pb-12 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ActionsMenu
                plan={plan}
                onAttach={() => fileInputRef.current?.click()}
                onWebSearch={onWebSearch}
                onImageGen={onImageGen}
                onDeepResearch={onDeepResearch}
              />
              {onTemplateOpen && (
                <button
                  onClick={onTemplateOpen}
                  className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Prompt templates (/)"
                >
                  <Slash className="h-3 w-3" />
                  <span className="hidden sm:inline">Templates</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <VoiceButton
                onTranscript={(text) => {
                  setValue((prev) => (prev ? prev + " " + text : text));
                }}
                disabled={isLoading}
              />

              {isStreaming && onStop ? (
                <button
                  onClick={onStop}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground transition-all hover:bg-destructive/90"
                  title="Stop generating"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={(!value.trim() && attachments.length === 0) || isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground transition-all hover:bg-brand/90 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
