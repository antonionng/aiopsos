import { fetchPublishedCourses } from "@/lib/courses";
import { getActor } from "@/lib/cohorts";
import { ScheduleDelivery } from "@/components/lms/schedule-delivery";
export default async function NewDelivery() {
  const actor = await getActor();
  if (!actor || !["admin", "manager", "super_admin"].includes(actor.role))
    return <p>A learning manager can schedule training for your workspace.</p>;
  const courses = await fetchPublishedCourses();
  return (
    <ScheduleDelivery
      courses={courses.map((c) => ({ id: c.id, title: c.title }))}
    />
  );
}
