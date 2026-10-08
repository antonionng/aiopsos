export function completionCount(
  activities: { id: string }[],
  progress: { activity_id: string; state: string }[],
) {
  const passed = new Set(
    progress.filter((p) => p.state === "passed").map((p) => p.activity_id),
  );
  return {
    done: activities.filter((a) => passed.has(a.id)).length,
    total: activities.length,
  };
}
