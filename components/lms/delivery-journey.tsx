import Link from "next/link";
export function DeliveryJourney({
  id,
  canGrade,
  canManage,
  participants,
  sessions,
}: {
  id: string;
  canGrade: boolean;
  canManage: boolean;
  participants: number;
  sessions: number;
}) {
  const steps = [
    {
      title: "Prepare the group",
      detail: `${participants} people enrolled. Check the course outline, trainer and joining details.`,
      href: "#participants",
      action: canManage ? "Manage participants" : "View your group",
    },
    {
      title: "Deliver the sessions",
      detail: `${sessions} sessions scheduled. Run the session, then record who attended.`,
      href: canGrade ? `/dashboard/cohorts/${id}/register` : "#sessions",
      action: canGrade ? "Record attendance" : "View sessions",
    },
    {
      title: "Review & recognise",
      detail:
        "Review submitted work and grades. Issue certificates only when the attendance and grade requirements are met.",
      href: canGrade
        ? `/dashboard/cohorts/${id}/grades`
        : "/dashboard/my-learning",
      action: canGrade
        ? "Review work & certificates"
        : "My work & certificates",
    },
  ];
  return (
    <section
      aria-label="Live training journey"
      className="mb-8 grid gap-3 md:grid-cols-3"
    >
      {steps.map((s, i) => (
        <div key={s.title} className="rounded-2xl border bg-card p-5">
          <span className="text-xs font-semibold text-brand">STEP {i + 1}</span>
          <h2 className="mb-2 mt-2 text-base font-semibold">{s.title}</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {s.detail}
          </p>
          <Link href={s.href} className="text-sm font-semibold text-brand">
            {s.action} →
          </Link>
        </div>
      ))}
    </section>
  );
}
