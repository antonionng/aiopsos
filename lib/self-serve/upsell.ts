import { SELF_SERVE_COURSES, trackLabel } from "./catalog.ts";
import { formatCourseHours } from "./landing.ts";
import type { SelfServeCourse } from "./types.ts";

export type CoursePick = {
  slug: string;
  title: string;
  track: string;
  line: string;
  priceGbp: number;
  hours: string;
};

function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

function toPick(course: SelfServeCourse): CoursePick {
  return {
    slug: course.slug,
    title: course.title,
    track: trackLabel(course.track),
    line: firstSentence(course.promise),
    priceGbp: course.priceGbp,
    hours: formatCourseHours(course.hours),
  };
}

/**
 * Courses to suggest after `slug`. The ones that follow it in its own track
 * come first, in catalogue order and wrapping round, so a learner is offered
 * the next step rather than the most popular course. Anything the learner
 * already owns is never offered.
 */
export function recommendCourses(
  slug: string | null | undefined,
  owned: Iterable<string> = [],
  limit = 3
): CoursePick[] {
  const skip = new Set(owned);
  if (slug) skip.add(slug);
  const playable = SELF_SERVE_COURSES.filter((course) => course.playable && !skip.has(course.slug));
  const current = slug ? SELF_SERVE_COURSES.find((course) => course.slug === slug) : undefined;
  if (!current) return playable.slice(0, limit).map(toPick);

  const order = SELF_SERVE_COURSES.map((course) => course.slug);
  const at = order.indexOf(current.slug);
  const distance = (course: SelfServeCourse) =>
    (order.indexOf(course.slug) - at + order.length) % order.length;

  const sameTrack = playable
    .filter((course) => course.track === current.track)
    .sort((a, b) => distance(a) - distance(b));
  const others = playable
    .filter((course) => course.track !== current.track)
    .sort((a, b) => distance(a) - distance(b));
  return [...sameTrack, ...others].slice(0, limit).map(toPick);
}

/**
 * "The AI literacy plan" becomes "AI literacy plan", so it reads after
 * "your". Acronyms keep their capitals.
 */
export function workNoun(title: string | null | undefined): string {
  const bare = (title ?? "").trim().replace(/^(the|your|a|an)\s+/i, "");
  if (!bare) return "final work";
  return /^[A-Z]{2}/.test(bare) ? bare : bare.charAt(0).toLowerCase() + bare.slice(1);
}

export function courseEmailUrl(base: string, slug: string, campaign: string): string {
  const root = base.replace(/\/$/, "");
  return `${root}/learn/${slug}?utm_source=email&utm_medium=email&utm_campaign=${encodeURIComponent(campaign)}`;
}
