interface ExportMessage {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string | null;
}

export function exportAsMarkdown(
  title: string,
  messages: ExportMessage[]
): string {
  const lines: string[] = [`# ${title}`, ""];

  for (const msg of messages) {
    if (msg.role === "user") {
      lines.push(`**You:**`);
    } else if (msg.role === "assistant") {
      lines.push(`**Assistant${msg.model ? ` (${msg.model})` : ""}:**`);
    } else {
      lines.push(`**System:**`);
    }
    lines.push("");
    lines.push(msg.content);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

export function downloadMarkdown(title: string, messages: ExportMessage[]) {
  const md = exportAsMarkdown(title, messages);
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "conversation"}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTextAsFile(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
