import Link from "next/link";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_LABELS,
  COURSE_LEVELS,
  COURSE_LEVEL_LABELS,
  COURSE_SECTORS,
  COURSE_SECTOR_SHORT_LABELS,
  COURSE_SECTOR_SLUGS,
  type CourseCategory,
  type CourseLevel,
  type CourseSector,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The browse controls for the catalogue, shared by /courses and by each
 * /courses/sector/[sector] page.
 *
 * The old version was two rows of identical grey pills with nothing saying
 * what either row was. "Applied AI" and "Practitioner" look like the same
 * kind of thing, so the page read as one long list of unrelated tags rather
 * than two questions with an answer each. Every row is now labelled, and the
 * labels sit in a fixed column so the eye reads down them.
 *
 * Subject and level are query parameters, because they compose: you can want
 * leadership robotics. Sector is a route, because a sector view is a page
 * worth linking to and worth finding in a search engine, and because three
 * composing axes on one screen is the confusion this is meant to fix. Picking
 * a sector therefore keeps the subject and level you already chose and moves
 * you to that sector's page.
 */

// The active subject pill takes its own hue, so the filter you applied and
// the badges on the matching cards visibly agree.
const CATEGORY_PILL_ACTIVE: Record<CourseCategory, string> = {
  ai: "border-cat-ai/40 bg-cat-ai-soft text-cat-ai",
  technology: "border-cat-technology/40 bg-cat-technology-soft text-cat-technology",
  robotics: "border-cat-robotics/40 bg-cat-robotics-soft text-cat-robotics",
};

const PILL_BASE =
  "rounded-full border px-3.5 py-1.5 text-sm transition-colors";
const PILL_IDLE =
  "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground";
const PILL_ACTIVE = "border-foreground bg-foreground text-background";

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:gap-4">
      <span className="shrink-0 pt-1.5 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground sm:w-16">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export interface CatalogueFilterState {
  category: CourseCategory | null;
  level: CourseLevel | null;
  /** null on /courses; set on a sector page. */
  sector: CourseSector | null;
}

/** Subject and level survive a move between /courses and a sector page. */
function query(params: {
  category?: CourseCategory | null;
  level?: CourseLevel | null;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.level) search.set("level", params.level);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function pathFor(sector: CourseSector | null) {
  return sector ? `/courses/sector/${COURSE_SECTOR_SLUGS[sector]}` : "/courses";
}

export function CatalogueFilters({ active }: { active: CatalogueFilterState }) {
  const here = pathFor(active.sector);

  return (
    <div className="mb-8 divide-y divide-border/60 rounded-2xl border border-border bg-card/40 px-5 py-1">
      <FilterRow label="Subject">
        <Link
          href={`${here}${query({ level: active.level })}`}
          className={cn(PILL_BASE, active.category ? PILL_IDLE : PILL_ACTIVE)}
        >
          All subjects
        </Link>
        {COURSE_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`${here}${query({ category, level: active.level })}`}
            aria-current={active.category === category ? "true" : undefined}
            className={cn(
              PILL_BASE,
              active.category === category
                ? CATEGORY_PILL_ACTIVE[category]
                : PILL_IDLE
            )}
          >
            {COURSE_CATEGORY_LABELS[category]}
          </Link>
        ))}
      </FilterRow>

      <FilterRow label="Level">
        <Link
          href={`${here}${query({ category: active.category })}`}
          className={cn(PILL_BASE, active.level ? PILL_IDLE : PILL_ACTIVE)}
        >
          All levels
        </Link>
        {COURSE_LEVELS.map((level) => (
          <Link
            key={level}
            href={`${here}${query({ category: active.category, level })}`}
            aria-current={active.level === level ? "true" : undefined}
            className={cn(
              PILL_BASE,
              active.level === level ? PILL_ACTIVE : PILL_IDLE
            )}
          >
            {COURSE_LEVEL_LABELS[level]}
          </Link>
        ))}
      </FilterRow>

      <FilterRow label="Sector">
        <Link
          href={`/courses${query({
            category: active.category,
            level: active.level,
          })}`}
          className={cn(PILL_BASE, active.sector ? PILL_IDLE : PILL_ACTIVE)}
        >
          Any sector
        </Link>
        {COURSE_SECTORS.map((sector) => (
          <Link
            key={sector}
            href={`${pathFor(sector)}${query({
              category: active.category,
              level: active.level,
            })}`}
            aria-current={active.sector === sector ? "true" : undefined}
            className={cn(
              PILL_BASE,
              active.sector === sector ? PILL_ACTIVE : PILL_IDLE
            )}
          >
            {COURSE_SECTOR_SHORT_LABELS[sector]}
          </Link>
        ))}
      </FilterRow>
    </div>
  );
}
