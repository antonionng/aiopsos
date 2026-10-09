import type { Metadata } from "next";
import { QuestPreview } from "@/components/wonderlab/quest/quest-player";
import "../quest.css";
import "../quest-world.css";

export const metadata: Metadata = {
  title: "The Glasshouse Mystery | Playable quest preview",
  robots: { index: false, follow: false },
};

export default function QuestPreviewPage() {
  return <QuestPreview />;
}
