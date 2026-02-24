"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CsvRow {
  email: string;
  name: string;
  department: string;
  valid: boolean;
}

interface CsvUploadProps {
  onParsed: (rows: CsvRow[]) => void;
  disabled?: boolean;
}

function parseCSVClient(text: string): CsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes("email") ||
    firstLine.includes("name") ||
    firstLine.includes("department");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  let emailCol = 0;
  let nameCol = 1;
  let deptCol = 2;

  if (hasHeader) {
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const ei = headers.findIndex((h) => h.includes("email"));
    const ni = headers.findIndex(
      (h) => h.includes("name") && !h.includes("email")
    );
    const di = headers.findIndex(
      (h) =>
        h.includes("dept") ||
        h.includes("department") ||
        h.includes("team")
    );
    if (ei >= 0) emailCol = ei;
    if (ni >= 0) nameCol = ni;
    if (di >= 0) deptCol = di;
  }

  const seen = new Set<string>();
  return dataLines.map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const email = (cols[emailCol] ?? "").toLowerCase();
    const name = cols[nameCol] ?? "";
    const department = cols[deptCol] ?? "";
    const valid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !seen.has(email);
    if (email) seen.add(email);
    return { email, name, department, valid };
  });
}

export function CsvUpload({ onParsed, disabled }: CsvUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseCSVClient(text);
        setRows(parsed);
        onParsed(parsed);
      };
      reader.readAsText(file);
    },
    [onParsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clear = useCallback(() => {
    setFileName(null);
    setRows([]);
    onParsed([]);
    if (inputRef.current) inputRef.current.value = "";
  }, [onParsed]);

  const validCount = rows.filter((r) => r.valid).length;
  const invalidCount = rows.length - validCount;

  if (fileName && rows.length > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-brand" />
            <div>
              <p className="text-sm font-medium">{fileName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  {validCount} valid
                </span>
                {invalidCount > 0 && (
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {invalidCount} invalid
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview table */}
        <div className="max-h-48 overflow-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border/50 ${
                    !row.valid ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-3 py-1.5 font-mono">{row.email}</td>
                  <td className="px-3 py-1.5">{row.name || "—"}</td>
                  <td className="px-3 py-1.5">{row.department || "—"}</td>
                  <td className="px-3 py-1.5 text-center">
                    {row.valid ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-500 text-[10px]"
                      >
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        Invalid
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 50 && (
            <p className="p-2 text-center text-xs text-muted-foreground">
              Showing 50 of {rows.length} rows
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragOver
          ? "border-brand bg-brand/5"
          : "border-border hover:border-brand/30 hover:bg-brand/5"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleInputChange}
        className="hidden"
      />
      <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">
        Drop a CSV file here, or click to browse
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Columns: email (required), name, department
      </p>
    </div>
  );
}
