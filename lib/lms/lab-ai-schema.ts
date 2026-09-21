import { z } from "zod";
export const labInsightsSchema = z.object({
  summary: z.string().max(1800),
  strengths: z.array(z.string().max(600)).max(5),
  concerns: z.array(z.string().max(600)).max(5),
  questions: z.array(z.string().max(600)).max(5),
  criteria: z.array(z.object({ criterion_id: z.string(), suggested_score: z.number().int().min(0).max(4).nullable(), rationale: z.string().max(900) })).max(20),
  draftFeedback: z.string().min(10).max(4000),
});
export type LabInsights = z.infer<typeof labInsightsSchema>;
export type EvidenceCoverage = { name: string; status: "read" | "truncated" | "manual" | "unreadable"; detail: string };
export type PrivateLabReview = { id: string; status: string; insights: LabInsights | null; coverage: EvidenceCoverage[]; error: string | null };

/** Read static source only. Notebook outputs and attachments are deliberately excluded. */
export function extractLabText(name: string, bytes: Uint8Array, limit = 20000): {text: string; coverage: EvidenceCoverage} {
  const ext = name.toLowerCase().split(".").at(-1);
  if (!ext || !["txt","md","sql","py","csv","json","ipynb","r","js","ts"].includes(ext))
    return {text:"", coverage:{name,status:"manual",detail:"This file format needs trainer review."}};
  try {
    let text = new TextDecoder("utf-8", {fatal:true}).decode(bytes);
    if (text.includes("\0")) throw new Error("Binary content");
    if (ext === "ipynb") {
      const notebook = JSON.parse(text);
      if (!Array.isArray(notebook.cells)) throw new Error("Missing notebook cells");
      text = notebook.cells.map((cell: {cell_type?:string;source?:unknown}, i:number) => {
        const source = typeof cell.source === "string" ? cell.source : Array.isArray(cell.source) && cell.source.every(s=>typeof s === "string") ? cell.source.join("") : "";
        return `Cell ${i+1} (${cell.cell_type || "unknown"})\n${source}`;
      }).join("\n\n");
    }
    const truncated = text.length > limit;
    return {text:text.slice(0,limit),coverage:{name,status:truncated?"truncated":"read",detail:truncated?"Only the first part was reviewed. Check the full file.":ext==="ipynb"?"Cell source reviewed. Outputs were excluded; code was not executed.":"Text reviewed. Code was not executed."}};
  } catch { return {text:"",coverage:{name,status:"unreadable",detail:"The file could not be read as valid text. Trainer review required."}}; }
}
