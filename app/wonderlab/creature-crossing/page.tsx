import type { Metadata, Viewport } from "next";
import { CreatureCrossingLoader } from "./loader";
import "./creature-crossing.css";

export const metadata: Metadata = {
  title: "Creature Crossing | Teach an AI with examples",
  description:
    "Teach the Wonder Gate with examples, then watch a stampede of new creatures test what it learned. A free Wonderlab game about how AI learns.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#8fd0ff",
};

export default function CreatureCrossingPage() {
  return <CreatureCrossingLoader />;
}
