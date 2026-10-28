import { District } from "@/components/wonderlab/adventure/district";
import { withSiteShareImages } from "@/lib/social-image";
export const metadata = withSiteShareImages({
  title: "Explore the game district",
  description:
    "Investigate a city, build playable worlds and test your plans in Wonderlab's games for ages 11–16.",
});
export default function Page() {
  return <District />;
}
