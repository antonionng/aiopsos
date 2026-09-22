import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/learn/certificate-view";
import { ACCESS_COOKIE } from "@/lib/self-serve/commerce";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { findPaidPurchase, loadProgress } from "@/lib/self-serve/records";
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
  const token = (await cookies()).get(ACCESS_COOKIE)?.value ?? "";
  let purchase = null;
  let progress = null;
  try {
    purchase = token ? await findPaidPurchase(token, course.slug) : null;
    progress = purchase ? await loadProgress(purchase.id) : null;
  } catch (error) {
    console.error("[self-serve] certificate", error);
  }
  return (
    <CertificateView
      slug={course.slug}
      title={course.title}
      progress={progress}
      persist={!!purchase}
    />
  );
}
