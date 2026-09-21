import { notFound } from "next/navigation";
import { CertificateView } from "@/components/learn/certificate-view";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";

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
