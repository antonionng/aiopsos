import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { AudiencePage } from "@/components/wonderlab/catalogue";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "AI projects for teens aged 11–16",
});
export default function Page() {
  return <AudiencePage audience="teens" />;
}
