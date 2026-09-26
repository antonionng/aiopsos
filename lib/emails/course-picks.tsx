import * as React from "react";
import { EMAIL_BRAND, EMAIL_INK, EMAIL_PAPER, EMAIL_VIOLET } from "@/lib/email-theme";
import type { CoursePick } from "@/lib/self-serve/upsell";
import { courseEmailUrl } from "@/lib/self-serve/upsell";

/**
 * Paper cards on the dark shell, so the suggestions read as a separate offer
 * and never as part of the receipt or the instructions above them.
 */
export function CoursePicks({
  picks,
  base,
  campaign,
  heading = "Courses learners take next",
  intro,
}: {
  picks: CoursePick[];
  base: string;
  campaign: string;
  heading?: string;
  intro?: string;
}) {
  if (picks.length === 0) return null;
  const root = base.replace(/\/$/, "");
  return (
    <div style={{ marginTop: "44px" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: EMAIL_BRAND,
          margin: "0 0 8px",
        }}
      >
        {heading}
      </p>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#D5C7FF", margin: "0 0 16px" }}>
        {intro ??
          "Each course is self-paced, ends with an assessment and a signed record, and is saved to the same account."}
      </p>
      {picks.map((pick) => (
        <a
          key={pick.slug}
          href={courseEmailUrl(root, pick.slug, campaign)}
          style={{
            display: "block",
            backgroundColor: EMAIL_PAPER,
            color: EMAIL_INK,
            borderRadius: "12px",
            padding: "18px 20px",
            marginBottom: "12px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: EMAIL_VIOLET,
              marginBottom: "6px",
            }}
          >
            {pick.track} · {pick.hours}
          </span>
          <span style={{ display: "block", fontSize: "17px", fontWeight: 700, lineHeight: 1.3, marginBottom: "6px" }}>
            {pick.title}
          </span>
          <span style={{ display: "block", fontSize: "14px", lineHeight: 1.55, color: "#4A4458", marginBottom: "10px" }}>
            {pick.line}
          </span>
          <span style={{ display: "block", fontSize: "14px", fontWeight: 700 }}>
            £{pick.priceGbp} · See the course →
          </span>
        </a>
      ))}
      <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#BEB3D0", margin: "8px 0 0" }}>
        Or browse all{" "}
        <a href={`${root}/learn?utm_source=email&utm_medium=email&utm_campaign=${campaign}`} style={{ color: "#FFFEFA" }}>
          self-paced courses
        </a>
        .
      </p>
    </div>
  );
}
