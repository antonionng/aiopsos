"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, MapPin, QrCode, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  TOUR_TIMEZONES,
  parseCompanyCsv,
  suggestedSeatLimit,
} from "@/lib/tour-provisioning";

/**
 * Provision one training day.
 *
 * A day is ONE cohort holding delegates from several companies, and each
 * company needs its own organisation and its own QR link so a delegate lands
 * inside their own employer's tenant. At 30+ companies that cannot be done by
 * hand, and until now there was no cohort creation UI at all - POST
 * /api/cohorts had no callers anywhere in the app.
 */

interface Option {
  id: string;
  name?: string;
  title?: string;
  display_name?: string;
  level?: string;
  duration_hours?: number;
}

interface CompanyOutcome {
  name: string;
  org_id: string | null;
  org_status: "created" | "matched_existing" | "error";
  token: string | null;
  assess_url: string | null;
  credits: number | null;
  detail?: string;
}

interface ProvisionResult {
  cohort: {
    id: string;
    title: string;
    starts_on: string;
    timezone: string;
    seat_limit: number;
    course: string;
    delivering_org: string;
  };
  companies: CompanyOutcome[];
}

export default function TourProvisioningPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [organisations, setOrganisations] = useState<Option[]>([]);
  const [courses, setCourses] = useState<Option[]>([]);
  const [facilitators, setFacilitators] = useState<Option[]>([]);
  const [result, setResult] = useState<ProvisionResult | null>(null);

  const [deliveringOrgId, setDeliveringOrgId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [facilitatorId, setFacilitatorId] = useState("");
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");
  const [templateId, setTemplateId] = useState("training-needs");
  const [starterCredits, setStarterCredits] = useState("1000");
  const [seatLimit, setSeatLimit] = useState("");
  const [companyCsv, setCompanyCsv] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/super-admin/tour", { cache: "no-store" });
        if (!res.ok) {
          toast.error("Only a super admin can provision a training day.");
          return;
        }
        const data = await res.json();
        setOrganisations(data.organisations ?? []);
        setCourses(data.courses ?? []);
        setFacilitators(data.facilitators ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Parsed in the browser so the room is visible before anything is written.
  const companies = useMemo(() => parseCompanyCsv(companyCsv), [companyCsv]);
  const suggestedSeats = useMemo(
    () => (companies.length ? suggestedSeatLimit(companies) : 0),
    [companies]
  );

  async function provision() {
    if (!deliveringOrgId || !courseId || !title || !venue || !eventDate) {
      toast.error("Delivering organisation, course, title, venue and date are all required.");
      return;
    }
    if (companies.length === 0) {
      toast.error("Add at least one attending company.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/super-admin/tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delivering_org_id: deliveringOrgId,
          course_id: courseId,
          facilitator_id: facilitatorId || null,
          title,
          venue,
          event_date: eventDate,
          timezone,
          template_id: templateId,
          starter_credits: Number(starterCredits) || 0,
          ...(seatLimit ? { seat_limit: Number(seatLimit) } : {}),
          companies,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not provision the day.");
        return;
      }

      setResult(data);
      const failed = (data.companies as CompanyOutcome[]).filter(
        (c) => c.org_status === "error" || !c.token
      ).length;
      if (failed > 0) {
        toast.warning(`Day created. ${failed} company link(s) need attention.`);
      } else {
        toast.success(`Day created with ${data.companies.length} companies.`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Provision a training day</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One cohort for the day, owned by the delivering organisation, plus an
          organisation and a QR link for every company in the room. Each
          delegate who scans their company&apos;s code lands inside their own
          employer&apos;s tenant.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" /> The day
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Delivering organisation</Label>
              <Select value={deliveringOrgId} onValueChange={setDeliveringOrgId}>
                <SelectTrigger><SelectValue placeholder="Who is running it" /></SelectTrigger>
                <SelectContent>
                  {organisations.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Owns the cohort and is the only party that can edit it, enrol
                into it or issue its certificates.
              </p>
            </div>

            <div>
              <Label>Course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger><SelectValue placeholder="From the catalogue" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} · {c.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Trainer</Label>
              <Select value={facilitatorId} onValueChange={setFacilitatorId}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  {facilitators.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.display_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {facilitators.length === 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  No facilitators yet. A trainer needs an account first, then a
                  facilitator record before they can take the register.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Day title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Kuala Lumpur, day 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="venue">Venue or city</Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Kuala Lumpur"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TOUR_TIMEZONES.map((tz) => (
                    <SelectItem key={tz.id} value={tz.id}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Sessions are stored in UTC and shown to delegates in this zone.
                The column default is London, which is wrong for this tour.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="seats">Seats for the room</Label>
                <Input
                  id="seats"
                  type="number"
                  value={seatLimit}
                  onChange={(e) => setSeatLimit(e.target.value)}
                  placeholder={suggestedSeats ? String(suggestedSeats) : "auto"}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  The whole room, not one company. Too low and a bulk enrol
                  seats part of the room then starts reporting &quot;full&quot;.
                </p>
              </div>
              <div>
                <Label htmlFor="credits">Starter AI credits, per company</Label>
                <Input
                  id="credits"
                  type="number"
                  value={starterCredits}
                  onChange={(e) => setStarterCredits(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  A company with no wallet is unmetered on AI usage.
                </p>
              </div>
            </div>

            <div>
              <Label>Assessment instrument</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="training-needs">
                    Training needs (ranks AI / technology / robotics)
                  </SelectItem>
                  <SelectItem value="org-wide">AI maturity (five dimensions)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Companies in the room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="companies">
              Paste a delegate list — company name per line, or a CSV with a
              company column
            </Label>
            <Textarea
              id="companies"
              rows={12}
              className="font-mono text-xs"
              value={companyCsv}
              onChange={(e) => setCompanyCsv(e.target.value)}
              placeholder={"Company,Industry,Seats\nAcme Sdn Bhd,Manufacturing,12\nPT Budi Jaya,Logistics,8"}
            />

            {companies.length > 0 && (
              <div className="rounded-lg border border-border p-3">
                <p className="mb-2 text-xs font-medium">
                  {companies.length} companies · suggested {suggestedSeats} seats
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {companies.slice(0, 12).map((c) => (
                    <li key={c.name} className="flex justify-between gap-3">
                      <span className="truncate">{c.name}</span>
                      <span className="shrink-0">{c.seats ? `${c.seats} seats` : ""}</span>
                    </li>
                  ))}
                  {companies.length > 12 && (
                    <li>and {companies.length - 12} more</li>
                  )}
                </ul>
              </div>
            )}

            <Button
              onClick={provision}
              disabled={submitting || companies.length === 0}
              className="w-full"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning</>
              ) : (
                <>Create the day and {companies.length || 0} company links</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Safe to run twice: a company whose name already exists is matched
              rather than duplicated.
            </p>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="h-4 w-4" /> {result.cohort.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{result.cohort.course}</Badge>
              <Badge variant="secondary">
                <MapPin className="mr-1 h-3 w-3" />
                {result.cohort.starts_on} · {result.cohort.timezone}
              </Badge>
              <Badge variant="secondary">{result.cohort.seat_limit} seats</Badge>
              <Badge variant="secondary">
                delivered by {result.cohort.delivering_org}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Print one code per company for the registration desk. Enrol the
              room from the cohort screen after the assessment, when the
              accounts exist.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2">Company</th>
                    <th className="py-2">Tenant</th>
                    <th className="py-2">Scan URL</th>
                    <th className="py-2">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {result.companies.map((c) => (
                    <tr key={c.name} className="border-b border-border/50">
                      <td className="py-2 pr-3">{c.name}</td>
                      <td className="py-2 pr-3">
                        <Badge
                          variant={c.org_status === "error" ? "destructive" : "secondary"}
                        >
                          {c.org_status === "created"
                            ? "new"
                            : c.org_status === "matched_existing"
                              ? "existing"
                              : "failed"}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs break-all">
                        {c.assess_url ?? (
                          <span className="text-destructive">
                            {c.detail ?? "no link created"}
                          </span>
                        )}
                      </td>
                      <td className="py-2">{c.credits ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
