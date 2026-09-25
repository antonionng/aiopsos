import type { Metadata } from "next";
import { CourseCatalog } from "@/components/learn/course-catalog";
import { LearnMarket } from "@/components/learn/learn-shell";
import { SELF_SERVE_TRACKS } from "@/lib/self-serve/catalog";
import { redirect } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { allSelfServeCourses, courseListLd, hubForTrack } from "@/lib/self-serve/seo";
import { withSiteShareImages } from "@/lib/social-image";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const TITLE = "Self-Paced Online Courses in AI, Technology, Robotics and HR";
const DESCRIPTION =
  "Forty self-paced online courses for UK professionals in applied AI, technology decisions, robotics and automation, and AI in HR. Each ends with signed work an employer can verify.";

export const metadata: Metadata = withSiteShareImages({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/learn" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/learn" },
  twitter: { title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
});

export default async function LearnIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; place?: string; team?: string }>;
}) {
  const { track, place, team } = await searchParams;
  const notice =
    place === "expired"
      ? "This invitation has expired. Ask the person who bought the places to contact hello@experrt.com."
      : place === "missing"
        ? "We could not find that invitation. It may have been withdrawn. Ask the person who invited you to send it again."
        : place === "failed"
          ? "We could not open your place just now. Try the link in your email again in a minute."
          : team === "retry"
            ? "Payment for your team has not been confirmed yet. If you were charged, use the link in your receipt email."
            : null;
  const active = SELF_SERVE_TRACKS.includes(track as SelfServeTrack)
    ? (track as SelfServeTrack)
    : null;
  if (active) redirect(`/learn/topics/${hubForTrack(active).slug}`);
  return (
    <LearnMarket>
      <StructuredData data={courseListLd(allSelfServeCourses(), "Self-paced courses", "/learn")} />
      {notice ? (
        <p className="ex-hint ex-measure" role="status" style={{ marginTop: 24 }}>
          {notice}
        </p>
      ) : null}
      <CourseCatalog track={null} />
    </LearnMarket>
  );
}
