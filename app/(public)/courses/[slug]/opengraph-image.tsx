import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-template";
import { fetchCourseBySlug } from "@/lib/courses";
import {
  COURSE_CATEGORY_LABELS,
  COURSE_LEVEL_LABELS,
} from "@/lib/constants";

export const alt = "Course overview";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchCourseBySlug(slug);

  if (!result) {
    return new ImageResponse(
      <OgCard title="Experrt courses" subtitle="Applied AI, technology and robotics training." />,
      size
    );
  }

  const { course } = result;
  return new ImageResponse(
    (
      <OgCard
        title={course.title}
        subtitle={course.summary}
        eyebrow={`${COURSE_CATEGORY_LABELS[course.category]} · ${COURSE_LEVEL_LABELS[course.level]} · ${course.duration_hours} hrs`}
        category={course.category}
      />
    ),
    size
  );
}
