export type CourseSalesCopy = {
  overview: string[];
  audience: string[];
  takeaways: string[];
  benefits: { title: string; body: string }[];
  /** Keyed by lesson id. */
  lessons: Record<string, string>;
};

export const COURSE_SALES: Record<string, CourseSalesCopy> = {};
