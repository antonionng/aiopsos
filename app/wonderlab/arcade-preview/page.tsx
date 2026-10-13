import type { Metadata, Viewport } from "next";
import { ArcadePreview } from "@/components/wonderlab/first-person/arcade-preview";
import "./arcade-preview.css";

export const metadata: Metadata = {
  title: "The Arcade Apprentice | First-person playtest",
  description: "Explore a magical arcade, describe your own game and step inside it. A new Wonderlab playtest.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101b2b",
};

export default function ArcadePreviewPage() {
  return <ArcadePreview />;
}
