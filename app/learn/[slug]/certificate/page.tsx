import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/learn/certificate-view";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
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
  return <CertificateView slug={course.slug} title={course.title} />;
}
