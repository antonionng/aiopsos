import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import Link from "next/link";
import { AudiencePage } from "@/components/wonderlab/catalogue";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "AI projects for teens aged 11–16",
});
export default function Page() {
  return (
    <>
      <div className="wl-section">
        <div className="wl-notice">
          <h2>Your ideas bring the game district to life.</h2>
          <p>
            Explore a city of clues, build playable worlds and test a launch
            plan. Choose a mission for ages 11–16 and learn by changing what
            happens next.
          </p>
          <Link className="wl-button" href="/wonderlab/district">
            Explore the game district →
          </Link>
        </div>
      </div>
      <AudiencePage audience="teens" />
    </>
  );
}
