import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { Family } from "@/components/wonderlab/family";
import { missions } from "@/lib/wonderlab/catalog";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "Your family space",
  robots: { index: false, follow: false },
});
export default function Page() {
  return (
    <Family
      lessons={missions.map(({ slug, title, band, outcome }) => ({
        slug,
        title,
        band,
        outcome,
      }))}
    />
  );
}
