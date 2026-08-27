import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Users2,
  LineChart,
  ShieldCheck,
  Sparkles,
  CalendarClock,
  Route,
  BookOpenCheck,
} from "lucide-react";
import { CompanionShowcase } from "@/components/marketing/companion-showcase";
import { experrtAiMetadata } from "@/lib/public-share-metadata";

export const metadata: Metadata = experrtAiMetadata();

const VERBS = [
  {
    icon: BookOpenCheck,
    title: "It knows you",
    live: true,
    body: "Your enrolments, attendance, the grades your facilitator has released, your certificates and your assessment results. Ask anything about your own record and it answers from the data, not from vibes. What it cannot see: anyone else's individual usage — that exists only as team-level aggregates, for everyone, including your boss.",
  },
  {
    icon: Route,
    title: "It plans",
    live: true,
    body: "Ask what to learn next and it reads your measured gaps, checks which cohorts are actually running, and maps a sequenced path — course by course, ending with a re-assessment so the improvement is measured rather than assumed.",
  },
  {
    icon: Sparkles,
    title: "It acts",
    live: false,
    body: "Rolling out: the agent requests your seat on the next cohort and drops sessions into your calendar. You confirm every action, and a human approves every seat — the agent requests, your organisation decides. Every action is logged.",
  },
  {
    icon: CalendarClock,
    title: "It checks in",
    live: false,
    body: "Rolling out: between live sessions it keeps the practice alive — a prep note before Thursday's session, a nudge when a module's exercises are waiting, a weekly digest of where you are on your path. Opt-out any time; useful, never nagging.",
  },
];

const GUARDRAILS = [
  "Spend is capped per person, per day and per month — nobody can run up a bill.",
  "No individual surveillance: AI usage is reported by department, never by person. The tool for individual usage does not exist.",
  "It never grades work, never marks attendance, and never says you passed — a live facilitator does that, and the agent tells you so.",
  "Every answer comes from tools scoped to what your role may see. The scoping is code, not a polite request in a prompt.",
];

export default function ExperrtAiPage() {
  return (
    <article>
      <header className="mb-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          Experrt AI
        </p>
        <h1 className="mb-5 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Your very own learning agent.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Most workplace AI answers questions. Experrt AI holds your training
          record, your measured gaps and your path forward &mdash; and it acts
          on them. It works between the live sessions a facilitator runs.
          It never replaces them; it makes the time between them count.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Get your agent free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-accent"
          >
            See the training it draws on
          </Link>
        </div>
      </header>

      {/* The verbs */}
      <section className="mb-16">
        <h2 className="mb-2 font-display text-2xl font-bold tracking-[-0.02em]">
          What makes it an agent
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
          Not a chatbot with your logo on it. Four verbs, honestly labelled.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {VERBS.map((verb) => {
            const Icon = verb.icon;
            return (
              <div key={verb.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                      <Icon className="h-4.5 w-4.5 text-brand" />
                    </span>
                    <h3 className="text-base font-semibold">{verb.title}</h3>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      verb.live ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {verb.live ? "Live now" : "Rolling out"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{verb.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Three roles */}
      <section className="mb-16">
        <h2 className="mb-2 font-display text-2xl font-bold tracking-[-0.02em]">
          One agent, three roles
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
          Experrt AI meets each person as their role needs it. Watch the
          conversations play out &mdash; including the question it refuses.
        </p>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: GraduationCap, label: "Learning agent", who: "Every learner" },
            { icon: Users2, label: "L&D agent", who: "Programme teams" },
            { icon: LineChart, label: "Insights agent", who: "Owners & managers" },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <Icon className="h-4 w-4 text-brand" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.who}</p>
                </div>
              </div>
            );
          })}
        </div>
        <CompanionShowcase />
      </section>

      {/* Guardrails */}
      <section className="mb-16 rounded-2xl border border-border bg-card p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
            <ShieldCheck className="h-5 w-5 text-brand" />
          </span>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
            An agent your compliance team can approve
          </h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {GUARDRAILS.map((g) => (
            <li key={g} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
              {g}
            </li>
          ))}
        </ul>
      </section>

      {/* Facilitator FAQ */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold tracking-[-0.02em]">
          Where the humans fit
        </h2>
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">
              Does Experrt AI teach the courses?
            </span>
            <br />
            No. Every course is delivered live by a facilitator, in your room
            or online. The agent supports the learning between those sessions
            &mdash; recall, practice, planning &mdash; and hands anything about
            course judgement to the person actually teaching it.
          </p>
          <p>
            <span className="font-semibold text-foreground">
              Does it grade my people?
            </span>
            <br />
            Never. Facilitators take attendance and grade submitted work; the
            agent can show you what they recorded, and that is the whole
            relationship. Records stay with your organisation and export into
            dated evidence packs.
          </p>
          <p>
            <span className="font-semibold text-foreground">What does it cost?</span>
            <br />
            The platform, agent included, is free for your whole organisation.
            AI usage is metered at model rates behind per-person caps &mdash;
            nothing when nobody uses it.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-brand/30 bg-card p-8 text-center">
        <h2 className="mb-3 font-display text-2xl font-bold tracking-[-0.02em]">
          Give everyone a learning agent today.
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
          Create your organisation, run the readiness assessment, and every
          member gets Experrt AI with their own record behind it.
        </p>
        <Link
          href="/register"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Get started free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
