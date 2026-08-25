import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { MATURITY_TIERS } from "@/lib/constants";

export const runtime = "edge";

// The card is always dark, whatever theme the viewer uses, so colors are
// literals - but the tier scale itself comes from MATURITY_TIERS, the same
// source the in-app gauge reads. Amber is the brand accent (see globals.css).
const BRAND = "#fbbf24";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = parseFloat(searchParams.get("score") ?? "0");
  const org = searchParams.get("org") ?? "Experrt";
  const conf = parseFloat(searchParams.get("conf") ?? "0");
  const prac = parseFloat(searchParams.get("prac") ?? "0");
  const tools = parseFloat(searchParams.get("tools") ?? "0");
  const resp = parseFloat(searchParams.get("resp") ?? "0");
  const cult = parseFloat(searchParams.get("cult") ?? "0");

  const tier =
    MATURITY_TIERS.find((t) => score >= t.min && score <= t.max)?.label ??
    "Not Assessed";

  const dims = [
    { label: "Confidence", score: conf },
    { label: "Practice", score: prac },
    { label: "Tools", score: tools },
    { label: "Responsible", score: resp },
    { label: "Culture", score: cult },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#0d0d0d",
          color: "#ececec",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#888888",
          }}
        >
          {org} — AI Readiness Assessment
        </div>

        <div
          style={{
            fontSize: "96px",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: BRAND,
          }}
        >
          {score.toFixed(1)}
        </div>

        <div
          style={{
            fontSize: "18px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#888888",
            marginTop: "8px",
            marginBottom: "48px",
          }}
        >
          {tier}
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "800px",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {dims.map((d) => (
            <div
              key={d.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "120px",
                  fontSize: "14px",
                  color: "#888888",
                  textAlign: "right",
                }}
              >
                {d.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: "8px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${(d.score / 5) * 100}%`,
                    height: "100%",
                    backgroundColor: BRAND,
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div
                style={{
                  width: "32px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ffffff",
                  textAlign: "right",
                }}
              >
                {d.score.toFixed(1)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "12px",
            color: "#555555",
          }}
        >
          Powered by Experrt
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
