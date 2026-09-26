import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/learn/certificate-view";
import { LearnMarket } from "@/components/learn/learn-shell";
import { findEntitledPurchase } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { courseArtefact } from "@/lib/self-serve/engine";
import { loadProgress } from "@/lib/self-serve/records";
import { withSiteShareImages } from "@/lib/social-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getSelfServeCourse(slug);
  return withSiteShareImages({
    title: course ? `${course.title} record` : "Record",
    description: course?.promise,
    robots: { index: false, follow: false },
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getSelfServeCourse(slug);
  if (!course?.playable) notFound();
  let purchase = null;
  let progress = null;
  try {
    purchase = await findEntitledPurchase(course.slug);
    progress = purchase ? await loadProgress(purchase.id) : null;
  } catch (error) {
    console.error("[self-serve] certificate", error);
  }
  return (
    <LearnMarket>
      <CertificateView
        slug={course.slug}
        title={course.title}
        artefact={courseArtefact(course)}
        progress={progress}
        persist={!!purchase}
      />
    </LearnMarket>
  );
}
