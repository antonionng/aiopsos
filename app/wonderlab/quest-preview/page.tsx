import type { Metadata, Viewport } from "next";
import { QuestPreview } from "@/components/wonderlab/quest/quest-player";
import "../quest.css";
import "../quest-world.css";

export const metadata: Metadata = {
  title: "The Glasshouse Mystery | Playable quest preview",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#214c3e",
};

export default function QuestPreviewPage() {
  return <QuestPreview />;
}
