import type { Course } from "./types";
import type { CourseCategory, CourseLevel, RespondentRole } from "./constants";

/**
 * Training-needs interpretation: bands and course ranking by subject.
 *
 * Pure module - no runtime imports - so node:test loads it with type
 * stripping alone. Higher score = higher need throughout; the template's
 * options are phrased that way, the math never inverts.
 *
 * Deliberately NOT maturity language: nobody is "Tier 2" at needing
 * training. Needs are priorities, so the bands speak in priorities.
 */

export interface NeedBand {
  id: "high" | "moderate" | "low";
  label: string;
  min: number;
  description: string;
}

export const NEED_BANDS: readonly NeedBand[] = [
  {
    id: "high",
    label: "High priority",
    min: 3.5,
    description:
      "A measured, immediate gap. Training here pays back fastest - this is where to book first.",
  },
  {
    id: "moderate",
    label: "Worth planning",
    min: 2,
    description:
      "A real need without urgency. Schedule it into the next training cycle rather than reacting later.",
  },
  {
    id: "low",
    label: "Low priority",
    min: 0,
    description:
      "Little measured need right now. Revisit when the work or the tools change.",
  },
];

export function getNeedBand(score: number): NeedBand {
  return NEED_BANDS.find((b) => score >= b.min) ?? NEED_BANDS[NEED_BANDS.length - 1];
}

// Mirrors the role→level intent in recommendation-engine: practitioners
// learn to do, managers learn to run, leadership learns to decide.
const ROLE_LEVELS: Record<RespondentRole, readonly CourseLevel[]> = {
  individual_contributor: ["practitioner"],
  team_lead: ["practitioner", "manager"],
  manager: ["manager", "practitioner"],
  director: ["manager", "leadership"],
  executive: ["leadership", "manager"],
};

export interface SubjectNeed {
  category: CourseCategory;
  score: number;
  band: NeedBand;
  courses: Course[];
}

/**
 * Rank the catalogue against measured subject needs. Every subject is
 * returned (highest need first) so the results page can show the full
 * picture; each carries the published courses for that subject, filtered
 * to levels that fit the respondent's role and capped at three.
 */
export function rankCoursesByNeed(
  needScores: Record<string, number>,
  respondentRole: RespondentRole | null,
  catalogue: Course[]
): SubjectNeed[] {
  const levels = respondentRole ? ROLE_LEVELS[respondentRole] : null;

  const categories = Object.keys(needScores) as CourseCategory[];
  return categories
    .map((category) => {
      const raw = needScores[category];
      const score = Number.isFinite(raw) ? raw : 0;
      const matching = catalogue
        .filter((c) => c.status === "published" && c.category === category)
        .filter((c) => !levels || levels.includes(c.level))
        .sort((a, b) => {
          const aRank = levels ? levels.indexOf(a.level) : 0;
          const bRank = levels ? levels.indexOf(b.level) : 0;
          return aRank - bRank || a.duration_hours - b.duration_hours;
        })
        .slice(0, 3);
      return { category, score, band: getNeedBand(score), courses: matching };
    })
    .sort((a, b) => b.score - a.score);
}
