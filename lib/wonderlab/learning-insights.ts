import { missions } from "./catalog.ts";
import { getMissionForVersion } from "./versions.ts";
import { checkActivity, isEntitled } from "./engine.ts";
import type { Band, Order } from "./types.ts";

type Progress = {
  child_id: string;
  mission_slug: string;
  content_version: string;
  answers: Record<string, string[]>;
  creation: string;
  completed: boolean;
  updated_at?: string;
};

/** Describes saved learning evidence. It does not infer ability, mood or mastery. */
export function learningInsights(
  childId: string,
  band: Band,
  records: Progress[],
  orders: Order[],
) {
  const work = records
    .filter((p) => p.child_id === childId)
    .flatMap((p) => {
      const mission = getMissionForVersion(p.mission_slug, p.content_version);
      if (!mission) return [];
      const passed = mission.activities.filter((a) =>
        checkActivity(a, p.answers?.[a.id] ?? []),
      ).length;
      return [{ ...p, mission, passed }];
    });
  const started = work.filter(
    (p) =>
      Object.values(p.answers ?? {}).some((a) => a.length) || p.creation.trim(),
  );
  const completed = work.filter((p) => p.completed);
  const available = missions.filter(
    (m) =>
      m.band === band &&
      orders.some(
        (o) =>
          o.child_id === childId && o.mission_slug === m.slug && isEntitled(o),
      ),
  );
  const next =
    available.find((m) =>
      started.some((p) => p.mission_slug === m.slug && !p.completed),
    ) ??
    available.find((m) => !completed.some((p) => p.mission_slug === m.slug));
  const nextWork = work.find((p) => p.mission_slug === next?.slug);
  const nextMission = nextWork?.mission ?? next;
  const recent = [...started].sort(
    (a, b) =>
      (Date.parse(b.updated_at ?? "") || 0) -
      (Date.parse(a.updated_at ?? "") || 0),
  )[0];
  return {
    started: started.length,
    completed: completed.length,
    activitiesChecked: work.reduce((n, p) => n + p.passed, 0),
    creations: work.filter((p) => p.creation.trim()).length,
    recent: recent
      ? {
          title: recent.mission.title,
          outcome: recent.mission.outcome,
          updatedAt: recent.updated_at ?? null,
        }
      : null,
    next: nextMission
      ? {
          slug: nextMission.slug,
          title: nextMission.title,
          together: nextMission.project.offline,
          action:
            nextWork?.passed === nextMission.activities.length
              ? "Finish the creation and review the project checks together."
              : nextWork
                ? "Continue from the last saved checkpoint and talk about what changes after trying an idea."
                : "Try this mission together, then ask your child to explain one choice they made.",
        }
      : null,
    skills: missions
      .filter((m) => m.band === band)
      .map((m) => {
        const saved = work.find((p) => p.mission_slug === m.slug);
        return {
          skill: m.skill,
          title: m.title,
          outcome: saved?.mission.outcome ?? m.outcome,
          status: saved?.completed
            ? "Mission and project checks completed"
            : saved?.passed
              ? `${saved.passed} of ${saved.mission.activities.length} activities checked`
              : started.some((p) => p.mission_slug === m.slug)
                ? "Exploring this skill"
                : "Ready to explore",
        };
      }),
  };
}
export type LearningInsights = ReturnType<typeof learningInsights>;
