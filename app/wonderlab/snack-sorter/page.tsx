import type { Metadata, Viewport } from "next";
import { SnackSorterLoader } from "./loader";
import "../creature-crossing/creature-crossing.css";
import "./snack-sorter.css";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({
  title: "Pip's Snack Sorter | Teach a robot with examples",
  description: "Teach Pip the robot which things are yummy and which are yucky, then watch Pip sort the lunch belt. A free Wonderlab game for ages 4 to 6.",
  robots: { index: false, follow: false },
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#9ad8ff",
};

export default function SnackSorterPage() {
  return <SnackSorterLoader />;
}
