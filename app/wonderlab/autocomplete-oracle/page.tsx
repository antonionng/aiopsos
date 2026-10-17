import type { Metadata, Viewport } from "next";
import { AutocompleteOracle } from "@/components/wonderlab/oracle/game";
import "./oracle.css";

export const metadata: Metadata = {
  title: "Autocomplete Oracle | How does AI write?",
  description: "Train a tiny text generator, catch it writing confident nonsense and decide when it should say “I don’t know”. A free Wonderlab game for ages 11 to 16.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0b0f24" };

export default function AutocompleteOraclePage() {
  return <AutocompleteOracle />;
}
