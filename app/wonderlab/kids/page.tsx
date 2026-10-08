import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { AudiencePage } from "@/components/wonderlab/catalogue";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "AI adventures for kids aged 4–10",
});
export default function Page() {
  return <AudiencePage audience="kids" />;
}
