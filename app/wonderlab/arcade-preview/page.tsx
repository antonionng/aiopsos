import type { Metadata, Viewport } from "next";
import { ArcadePreview } from "@/components/wonderlab/first-person/arcade-preview";
import "./arcade-preview.css";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({
  title: "The Arcade Apprentice | First-person playtest",
  description: "Explore a magical arcade, describe your own game and step inside it. A new Wonderlab playtest.",
  robots: { index: false, follow: false },
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101b2b",
};

export default function ArcadePreviewPage() {
  return <ArcadePreview />;
}
