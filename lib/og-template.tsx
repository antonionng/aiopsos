import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CourseCategory } from "@/lib/constants";

export const OG_SIZE = { width: 1200, height: 630 };
// Load assets only when rendering an image. Next also imports this module
// while resolving page metadata, where file access must not break the page.
export function getOgFonts() {
  const font = readFileSync(join(process.cwd(), "public/fonts/space-grotesk-bold.ttf"));
  return [{ name: "Space Grotesk", data: new Uint8Array(font).buffer, weight: 700 as const, style: "normal" as const }];
}

export function OgCard({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string; category?: CourseCategory }) {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/experrt-logo.png")).toString("base64")}`;
  return (
    <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", padding: "46px 58px 38px", background: "#7046EB", color: "#FFFEFA", fontFamily: "Space Grotesk", fontWeight: 700, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -140, bottom: -255, width: 560, height: 560, borderRadius: 280, border: "72px solid #D5C7FF", opacity: 0.16, display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* The supplied wordmark is embedded unchanged, preserving its proportions and texture. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="Experrt" width={285} height={64} />
        <div style={{ display: "flex", fontSize: 20, color: "#E4F477" }}>experrt.com</div>
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", paddingTop: 16, paddingBottom: 20 }}>
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 2, color: "#FFFEFA", marginBottom: 20 }}>{(eyebrow || "LEARNING PLATFORM · ACADEMY · AI LABS").slice(0,100)}</div>
        <div style={{ display: "flex", whiteSpace: "pre-wrap", fontSize: title.length > 85 ? 50 : 70, lineHeight: 1.04, letterSpacing: -2.5, color: "#E4F477", maxWidth: 1040 }}>{title.slice(0,150)}</div>
        {subtitle && <div style={{ display: "flex", fontSize: 25, lineHeight: 1.3, marginTop: 24, maxWidth: 990 }}>{subtitle.slice(0,190)}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #A58AF3", paddingTop: 22 }}>
        <div style={{ display: "flex", gap: 12 }}>{["Agentic learning", "Academy & courses", "AI Labs · Build & implement"].map(label => <div key={label} style={{ display: "flex", fontSize: 17, padding: "10px 16px", background: "#201C29", borderRadius: 24 }}>{label}</div>)}</div>
        <div style={{ display: "flex", fontSize: 16, color: "#E4F477" }}>Stay curious.</div>
      </div>
    </div>
  );
}
