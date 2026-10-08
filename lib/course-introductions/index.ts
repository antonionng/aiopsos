import catalogue from "./catalogue.json";
import media from "./media.json";

export type CourseIntroductionCopy = (typeof catalogue)[number];
export type IntroductionVideo = {
  src: string;
  poster: string;
  captions: string;
  transcript: string;
  durationLabel: string;
  reviewed: boolean;
};

export function getCourseIntroduction(slug: string) {
  return catalogue.find(course => course.slug === slug);
}

export function getIntroductionVideo(slug: string): IntroductionVideo | null {
  const video = (media as Record<string, IntroductionVideo>)[slug];
  if (!video) return null;
  if (video.reviewed) return video;
  if (process.env.NODE_ENV !== "development") return null;
  // The development-only handler keeps review files out of the public folder
  // and serves them from the same origin under the existing security policy.
  const preview = (path: string) => `/api/public/course-media-preview/${path.split("/").pop()}`;
  return { ...video, src: preview(video.src), poster: preview(video.poster), captions: preview(video.captions), transcript: preview(video.transcript) };
}

export function getLessonRecording(slug: string, moduleNumber: number) {
  return getIntroductionVideo(`${slug}/lesson-${String(moduleNumber).padStart(2, "0")}`);
}

export function hasLessonRecordings(slug?: string) {
  return Object.keys(media).some(key =>
    key.includes("/lesson-") && (!slug || key.startsWith(`${slug}/`)) &&
    getIntroductionVideo(key) !== null,
  );
}
