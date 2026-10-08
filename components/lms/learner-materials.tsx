"use client";
import { useRef, useState } from "react";
import type { Activity } from "@/lib/lms/schema";
import { AssistantMessage } from "./assistant-message";
import type { LearningBrand } from "./learning-brand";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
async function embeddedLogo(url: string) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return "";
    const blob = await response.blob();
    if (!/^image\/(png|jpeg|webp|gif)$/.test(blob.type) || blob.size > 3000000) return "";
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch { return ""; }
}
async function savePack(title: string, body: string, brand: LearningBrand | null) {
  const [experrtLogo, companyLogo] = await Promise.all([
    embeddedLogo("/experrt-logo.png"),
    brand?.logo_url ? embeddedLogo(brand.logo_url) : Promise.resolve(""),
  ]);
  const branding = `<header style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">${experrtLogo ? `<img alt="Experrt" src="${experrtLogo}" style="width:150px;filter:invert(1)">` : '<strong>Experrt</strong>'}${brand ? `<span>×</span>${companyLogo ? `<img alt="Company logo" src="${companyLogo}" style="max-width:150px;max-height:70px;object-fit:contain">` : ""}<strong>${escapeHtml(brand.name)}</strong>` : ""}</header>${brand ? `<p>${[brand.description, brand.location, brand.website].filter(Boolean).map(escapeHtml).join("<br>")}</p>` : ""}`;

  const safe = title.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>${safe}</title><style>body{font:17px/1.65 system-ui,sans-serif;color:#242030;max-width:850px;margin:48px auto;padding:0 24px}h1{font-size:38px;line-height:1.15;color:#5130a5}h2{margin-top:32px;color:#5130a5}h3{margin-top:24px}section{padding:24px 0;border-bottom:1px solid #ddd}pre{white-space:pre-wrap;background:#f3f0fa;padding:16px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}a{color:#5130a5}@media print{body{margin:0}section{break-inside:avoid}}.eyebrow{font-size:12px;letter-spacing:2px;color:#5130a5}</style><body>${branding}<p class="eyebrow">EXPERRT · LEARNER PACK</p><h1>${safe}</h1><p>Use these materials alongside your assigned course. Submit your work in Experrt so your trainer can review it.</p>${body}<footer><p>Course materials for learning and practice. Completion and feedback remain in your learning record.</p></footer></body></html>`;
  const url = URL.createObjectURL(
    new Blob([html], { type: "text/html;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = title.replace(/[^a-z0-9]+/gi, "-").slice(0, 80) + ".html";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function LearnerMaterials({
  title,
  activities,
  brand,
  compact = false,
}: {
  compact?: boolean;
  brand: LearningBrand | null;
  title: string;
  activities: (Omit<Activity, "correctOption"> & { course_title: string })[];
}) {
  const pack = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  return (
    <section className={compact ? "activity-resource-content" : "lms-panel"}>
      <div className="lms-row between">
        {!compact&&<div>
          <span className="lms-eyebrow">Your course toolkit</span>
          <h2>Everything you need to practise.</h2>
          <p className="text-sm text-muted-foreground">
            Download a readable pack to use offline or print to PDF. Your
            submissions and results stay in your course workspace.
          </p>
        </div>}
        <button
          className={compact ? "text-sm font-semibold text-brand underline" : "lms-button"}
          disabled={downloading}
          onClick={async () => {
            if (!pack.current) return;
            setDownloading(true);
            try { await savePack(title, pack.current.innerHTML, brand); }
            finally { setDownloading(false); }
          }}
        >
          {downloading ? "Preparing your branded pack…" : compact ? "Download activity pack ↓" : "Download complete pack ↓"}
        </button>
      </div>
      <div ref={pack} className="mt-6 space-y-5">
        {activities.map((activity, i) => (
          <section key={activity.id} className={compact ? "" : "rounded-2xl border p-5"}>
            {!compact&&<><p className="text-xs text-muted-foreground">
              {activity.course_title} · Activity {i + 1}
            </p>
            <h2 className="my-2 text-xl font-semibold">{activity.title}</h2>
            <AssistantMessage text={activity.content} />
            {activity.kind === "quiz" && (
              <ol className="my-3 list-decimal pl-5">
                {activity.options.map((o, j) => (
                  <li key={j}>{o}</li>
                ))}
              </ol>
            )}
            {activity.criteria && (
              <div className="mt-4">
                <h3 className="font-semibold">
                  What your trainer will look for
                </h3>
                <AssistantMessage text={activity.criteria} />
              </div>
            )}
            </>}
            {(activity.materials ?? []).map((m) => (
              <article key={m.id} className="mt-5 rounded-xl bg-muted/40 p-4">
                <p className="text-xs uppercase text-brand">
                  {m.kind.replaceAll("_", " ")}
                </p>
                <h3 className="mb-3 font-semibold">{m.title}</h3>
                <AssistantMessage text={m.content} />
              </article>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}
