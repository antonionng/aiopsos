import { readFileSync } from "node:fs";
import { join } from "node:path";

export function AgentOgCard({ title, summary, image, group }: { title: string; summary: string; image: string; group: string }) {
  const picture = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", image)).toString("base64")}`;
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/experrt-logo.png")).toString("base64")}`;
  return <div style={{ display: "flex", width: 1200, height: 630, background: "#201C29", color: "#FFFEFA", fontFamily: "Space Grotesk", position: "relative", overflow: "hidden" }}>
    <div style={{ display: "flex", flexDirection: "column", width: 700, padding: "42px 44px", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="Experrt" width={200} height={45} />
        <div style={{ display: "flex", borderLeft: "1px solid #70677E", paddingLeft: 20, fontSize: 19, color: "#D5C7FF" }}>ACADEMY</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", color: "#E4F477", fontSize: 17, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>{group}</div>
        <div style={{ display: "flex", fontSize: title.length > 65 ? 44 : 53, lineHeight: 1.08, letterSpacing: -1.8 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 23, lineHeight: 1.4, marginTop: 22, color: "#DED7E9" }}>{summary}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ display: "flex", color: "#E4F477", fontSize: 18 }}>Practical projects · AI assessment</div>
        <div style={{ display: "flex", fontSize: 19, color: "#D5C7FF" }}>experrt.com</div>
      </div>
    </div>
    <div style={{ display: "flex", width: 500, padding: "28px 28px 28px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={picture} alt="" width={472} height={574} style={{ objectFit: "cover", borderRadius: 28 }} />
    </div>
  </div>;
}
