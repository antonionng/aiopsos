import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-template";

export const alt =
  "Experrt — applied AI, technology and robotics training";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        title="We train your people to actually use AI and robotics."
        subtitle="Assess your workforce, train them by role, and hold the records to show for it. Every course facilitated live."
      />
    ),
    size
  );
}
