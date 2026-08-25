import { COURSE_CATEGORY_COLORS, type CourseCategory } from "@/lib/constants";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The one social card layout, shared by every opengraph-image route. Always
 * dark regardless of viewer theme (social embeds have no theme), amber brand
 * accent, category hue when the page is about one subject.
 *
 * Returns JSX for next/og's ImageResponse, which supports only a subset of
 * CSS - every div needs display:flex, no shorthand grid, literal colors.
 */
export function OgCard({
  title,
  subtitle,
  eyebrow,
  category,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  category?: CourseCategory;
}) {
  const accent = category ? COURSE_CATEGORY_COLORS[category].base : "#fbbf24";

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0d0d0d",
        color: "#ececec",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "4px",
            backgroundColor: accent,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            display: "flex",
          }}
        >
          Experrt
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && (
          <div
            style={{
              fontSize: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accent,
              marginBottom: "20px",
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 60 ? "52px" : "64px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: "980px",
            display: "flex",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#a0a0a0",
              marginTop: "24px",
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "18px", color: "#666666", display: "flex" }}>
          Facilitated live, in person or online
        </div>
        <div
          style={{
            width: "160px",
            height: "6px",
            borderRadius: "3px",
            backgroundColor: accent,
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}
