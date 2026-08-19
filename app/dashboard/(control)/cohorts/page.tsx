"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, GraduationCap, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  COHORT_STATUS_LABELS,
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  type CohortStatus,
  type CourseLevel,
  type DeliveryMode,
} from "@/lib/constants";

interface CohortRow {
  id: string;
  title: string;
  delivery_mode: DeliveryMode;
  location: string | null;
  timezone: string;
  seat_limit: number;
  starts_on: string | null;
  ends_on: string | null;
  status: CohortStatus;
  paid_at: string | null;
  enrolled_count: number;
  courses: { slug: string; title: string; level: CourseLevel } | null;
  facilitators: { display_name: string } | null;
}

const STATUS_VARIANT: Record<CohortStatus, "default" | "secondary" | "outline"> = {
  scheduled: "outline",
  running: "default",
  completed: "secondary",
  cancelled: "secondary",
};

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cohorts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setCohorts(d.cohorts ?? []);
      })
      .catch(() => setError("Failed to load cohorts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading cohorts...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="mb-1">Cohorts</h1>
        <p className="text-sm text-muted-foreground">
          Scheduled deliveries of academy courses. Attendance, submissions and
          grades are recorded against each one.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {cohorts.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
              <GraduationCap className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">No cohorts yet</h2>
            <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
              A cohort is one delivery of a course: a facilitator, a set of
              dates, and the people attending. Start from the training needs on
              an assessment, or browse the catalogue.
            </p>
            <Link
              href="/courses"
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Browse courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cohorts.map((cohort) => (
            <Link key={cohort.id} href={`/dashboard/cohorts/${cohort.id}`}>
              <Card className="border-border bg-card transition-colors hover:border-foreground/30">
                <CardContent className="pt-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={STATUS_VARIANT[cohort.status]} className="text-[10px]">
                      {COHORT_STATUS_LABELS[cohort.status]}
                    </Badge>
                    {cohort.courses && (
                      <span className="text-xs text-muted-foreground">
                        {COURSE_LEVEL_LABELS[cohort.courses.level]}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {DELIVERY_MODE_LABELS[cohort.delivery_mode]}
                    </span>
                  </div>

                  <p className="mb-1 text-base font-semibold">{cohort.title}</p>
                  {cohort.courses && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      {cohort.courses.title}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                    {cohort.starts_on && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(cohort.starts_on).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {cohort.ends_on && cohort.ends_on !== cohort.starts_on && (
                          <>
                            {" – "}
                            {new Date(cohort.ends_on).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </>
                        )}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {cohort.enrolled_count} of {cohort.seat_limit} seats
                    </span>
                    {cohort.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {cohort.location}
                      </span>
                    )}
                    {cohort.facilitators && (
                      <span>Facilitated by {cohort.facilitators.display_name}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
