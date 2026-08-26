/**
 * Use-case catalogue: what facilitated training looks like applied to a
 * particular kind of organisation or function.
 *
 * Pure module - no runtime imports - so node:test can load it with type
 * stripping alone (same contract as insights/catalog and training-needs).
 *
 * Content rules, in order of importance:
 *  - No invented customers, quotes or metrics. Every example is written as
 *    "what this looks like", not "what Acme achieved".
 *  - No compliance claims. Training supports documented, role-proportionate
 *    literacy measures; it does not make anyone compliant. The pages carry
 *    LITERACY_DISCLAIMER in the layout footer.
 *  - Every courseSlug must exist in the published catalogue
 *    (lib/published-course-slugs.ts is the checkable list).
 */

export type UseCaseKind = "audience" | "function";

export interface UseCaseExample {
  title: string;
  /** The situation as the reader will recognise it. */
  scenario: string;
  /** What the work looks like once the team is trained for it. */
  inPractice: string;
  /** Published catalogue slugs that teach this. */
  courseSlugs: string[];
}

export interface UseCaseEntry {
  slug: string;
  kind: UseCaseKind;
  /** Card and page title, e.g. "Finance teams". */
  name: string;
  /** Short label for navigation chips. */
  navLabel: string;
  headline: string;
  intro: string;
  examples: UseCaseExample[];
}

const USE_CASES: readonly UseCaseEntry[] = [
  // ── Audiences ──────────────────────────────────────────────
  {
    slug: "enterprise",
    kind: "audience",
    name: "Enterprise",
    navLabel: "Enterprise",
    headline: "Role-proportionate training at scale, with the records to show for it",
    intro:
      "Large organisations do not have one AI literacy gap - they have hundreds of different ones, spread across divisions, roles and risk levels. The work is scoping measures proportionately, delivering them live, and keeping the evidence as the programme runs. That is what the assessment, the academy and the evidence layer are built to do together.",
    examples: [
      {
        title: "A literacy programme scoped by role, not a webinar for everyone",
        scenario:
          "The board has asked for an AI literacy programme. The easy answer is one generic e-learning module pushed to every inbox; nobody believes it changes anything, and it does not reflect how differently a claims handler, a developer and a director use these tools.",
        inPractice:
          "The assessment measures each team's actual gaps across five dimensions. Practitioner cohorts train on their own work, managers train on oversight, and the executive session deals with strategy and accountability. Each cohort's attendance, submitted work and grades are recorded as it runs, so the programme can be described accurately afterwards - without overclaiming what it establishes.",
        courseSlugs: [
          "sponsoring-an-ai-literacy-programme",
          "ai-foundations-for-every-role",
          "ai-strategy-and-oversight-for-executives",
        ],
      },
      {
        title: "Line managers who can answer for their team's AI use",
        scenario:
          "AI use has spread faster than oversight. Risk and internal audit are starting to ask line managers what their teams use AI for, and the honest answer in most cases is that nobody has written it down.",
        inPractice:
          "Managers train on applying the organisation's own AI policy to live requests, setting review thresholds, handling incidents, and keeping a lightweight register of team use - the record an auditor actually asks to see.",
        courseSlugs: [
          "ai-governance-and-oversight-for-managers",
          "responsible-ai-use-at-work",
        ],
      },
      {
        title: "Adoption measured honestly across thousands of seats",
        scenario:
          "The licence spend is significant and the dashboard shows logins, which is not the same as changed work. Leadership wants to know what the investment is doing before renewing it.",
        inPractice:
          "Managers learn to set baselines, choose the small set of metrics that show changed work, and report time saved and value captured as different things. The champions network keeps working practice moving between teams instead of staying wherever it started.",
        courseSlugs: [
          "measuring-ai-adoption-and-value",
          "running-an-ai-champions-network",
          "leading-an-ai-ready-team",
        ],
      },
      {
        title: "Executives working on their own material",
        scenario:
          "Senior leaders sign off AI strategy they have never personally used, and approve long documents they have not had time to interrogate.",
        inPractice:
          "A half-day session where directors work their own board papers and briefing notes through the tools, learn what senior material can and cannot enter them, and leave with the questions to ask of the next AI proposal that reaches the board.",
        courseSlugs: [
          "ai-in-the-executive-workflow",
          "ai-strategy-and-oversight-for-executives",
        ],
      },
    ],
  },
  {
    slug: "growing-teams",
    kind: "audience",
    name: "Growing teams",
    navLabel: "Growing teams",
    headline: "The capability jump without the enterprise machinery",
    intro:
      "Smaller organisations do not have an L&D department, a transformation office or time for a maturity model. They have a handful of people doing several jobs each, tools bought in a hurry, and a spreadsheet that has quietly become the operations system. Training here is short, practical and done on the team's own work.",
    examples: [
      {
        title: "Getting value from what is already paid for",
        scenario:
          "Licences were bought as the team grew - a plan upgrade here, an add-on there. Most of the capability inside them has never been switched on, and there is talk of buying something new to solve a problem an existing tool already handles.",
        inPractice:
          "A working audit of the licences the team actually holds, switching on the highest-value features during the session, and making the case to drop what nobody uses. The next purchase decision starts from what is genuinely missing.",
        courseSlugs: [
          "getting-value-from-tools-you-already-own",
          "choosing-technology-well",
        ],
      },
      {
        title: "The whole team using AI on real work in one day",
        scenario:
          "A couple of people use AI constantly, a few tried it once, and the rest are waiting for permission or a reason. Everyone is too busy for a course that talks about AI in the abstract.",
        inPractice:
          "One facilitated day where every participant brings three real tasks and leaves having done them with an assistant - plus the failure modes, the boundaries, and a plan for their first unsupervised week.",
        courseSlugs: [
          "ai-foundations-for-every-role",
          "embedding-ai-in-daily-workflows",
        ],
      },
      {
        title: "Automating the work nobody was hired for",
        scenario:
          "Weekly reports assembled by hand, data re-keyed between systems, the same email written forty times. In a small team this is a meaningful share of someone's week, and it is nobody's actual job.",
        inPractice:
          "Each participant maps one recurring task, builds a working automation for it during the session, tests it against the awkward cases and hands it over - so it keeps running when its author is on holiday.",
        courseSlugs: [
          "automating-the-work-nobody-wants",
          "building-ai-assistants-for-your-team",
        ],
      },
      {
        title: "Growing out of the spreadsheet before it breaks",
        scenario:
          "The pipeline, the rota or the stock list lives in a spreadsheet one person understands. It has survived every 'we should sort that out' conversation so far, and it will fail at the least convenient moment.",
        inPractice:
          "Recognising which spreadsheets are load-bearing, choosing the smallest real system that replaces each one, and running the migration without breaking the team that depends on it.",
        courseSlugs: [
          "from-spreadsheets-to-systems",
          "data-you-can-actually-use",
        ],
      },
    ],
  },

  // ── Functions ──────────────────────────────────────────────
  {
    slug: "finance",
    kind: "function",
    name: "Finance teams",
    navLabel: "Finance",
    headline: "Faster close, same rigour",
    intro:
      "Finance is where AI's confident errors cost the most, because a wrong number travels further than a wrong sentence. The training is built around that asymmetry: use the tools to draft, reconcile and interrogate faster - and verify everything before it circulates.",
    examples: [
      {
        title: "Month-end commentary drafted in hours, not days",
        scenario:
          "The numbers are done by day three; the narrative around them takes until day six. Every month the same variance explanations are written from scratch under deadline.",
        inPractice:
          "Analysts draft the commentary with an assistant working from the actuals, then apply a verification routine: every figure traced back to source before the pack circulates, because the number will be quoted long after the caveat is forgotten.",
        courseSlugs: [
          "ai-for-analysis-and-reporting",
          "prompting-and-output-verification",
        ],
      },
      {
        title: "Two reports, one truth",
        scenario:
          "Sales says one number, finance says another, and a recurring hour of every month is spent explaining the difference to someone senior.",
        inPractice:
          "Tracing the disagreement to its sources, cleaning and structuring the dataset both reports depend on, and establishing a source of truth with a named owner - so the argument does not reform in six months.",
        courseSlugs: ["data-you-can-actually-use", "from-spreadsheets-to-systems"],
      },
      {
        title: "Interrogating the investment case",
        scenario:
          "A technology or automation proposal lands with a payback calculation built on the vendor's assumptions. Finance is asked to bless it without the time to rebuild it.",
        inPractice:
          "Using AI to pull apart a long proposal quickly - surfacing the assumptions, testing the unit economics, and asking the questions the demo was designed to avoid - while the judgement on the answer stays with the analyst.",
        courseSlugs: [
          "technology-for-non-technical-leaders",
          "robotics-investment-and-operating-model",
          "ai-in-the-executive-workflow",
        ],
      },
      {
        title: "Clear lines around sensitive numbers",
        scenario:
          "Unreleased results, payroll data and forecasts are exactly the material people are most tempted to paste into a tool, and exactly the material that must not leak.",
        inPractice:
          "Classifying what may and may not enter an AI tool against the organisation's own policy, identifying the decisions that stay with a person, and recording AI involvement so the work can be reviewed later.",
        courseSlugs: ["responsible-ai-use-at-work"],
      },
    ],
  },
  {
    slug: "hr",
    kind: "function",
    name: "HR and People teams",
    navLabel: "HR & People",
    headline: "The function that owns the change, trained for it",
    intro:
      "People teams sit on both sides of AI adoption: heavy users of the tools on documents and data, and the function accountable for how the whole organisation is trained, supported and treated as work changes. Both sides need deliberate skill.",
    examples: [
      {
        title: "Policy, handbook and letter drafting with a human accountable",
        scenario:
          "A large share of HR output is structured writing: policies, consultation letters, role profiles, internal comms. Drafting is slow; the risk of an unreviewed AI draft going out under the company's name is real.",
        inPractice:
          "Drafting with AI against the organisation's own templates and tone, then editing into a defensible final version - with a clear rule about which documents never leave without a human rewrite, and employee data kept out of the tools entirely.",
        courseSlugs: [
          "writing-and-communicating-with-ai",
          "responsible-ai-use-at-work",
        ],
      },
      {
        title: "Decisions about people stay with people",
        scenario:
          "Screening tools promise shortlists and sentiment scores. Some of this is useful triage; some of it is a discrimination claim waiting for a test case - and the team needs to know which is which.",
        inPractice:
          "Identifying the tasks that require a human decision maker, recognising bias in AI-assisted work, and recording how AI was involved in any process that touches an individual's employment.",
        courseSlugs: [
          "responsible-ai-use-at-work",
          "ai-governance-and-oversight-for-managers",
        ],
      },
      {
        title: "Commissioning training against a measured gap",
        scenario:
          "L&D is asked to 'do something on AI' with no baseline, a vendor pitch in every inbox, and a budget that has to be defended later.",
        inPractice:
          "Running a training-needs assessment first, scoping measures proportionately to role and risk, commissioning against the measured gap, and insisting on the attendance and assessment records that let the programme be described accurately afterwards.",
        courseSlugs: [
          "sponsoring-an-ai-literacy-programme",
          "measuring-ai-adoption-and-value",
        ],
      },
      {
        title: "Supporting the people the change worries",
        scenario:
          "Every adoption programme produces a group who hear 'efficiency' and understand 'redundancy'. Ignoring that is how adoption stalls politely.",
        inPractice:
          "Managers learn to hold the conversation honestly - what changes, what does not, and the skills path for people whose current tasks the tools take - so anxiety is addressed rather than managed around.",
        courseSlugs: [
          "leading-an-ai-ready-team",
          "preparing-your-team-for-automation",
        ],
      },
    ],
  },
  {
    slug: "operations",
    kind: "function",
    name: "Operations teams",
    navLabel: "Operations",
    headline: "From the weekly report to the warehouse floor",
    intro:
      "Operations carries the widest spread of this catalogue: office workflows that want automating, data that wants trusting, and - where there is a site - the robots, cells and conveyors that people work alongside every shift.",
    examples: [
      {
        title: "The reporting week, automated",
        scenario:
          "Every Monday someone assembles the same numbers from the same four systems into the same deck. It takes half a day, and it is wrong often enough that nobody fully trusts it.",
        inPractice:
          "Mapping the reporting workflow, automating the assembly, and putting checks on the data feeding it - so the half-day becomes minutes and the number is one someone will stand behind.",
        courseSlugs: [
          "automating-the-work-nobody-wants",
          "data-you-can-actually-use",
        ],
      },
      {
        title: "People and cobots on the same line",
        scenario:
          "A collaborative robot is arriving on the line. The integrator trains two people on commissioning day, then leaves - and every shift after that inherits a machine nobody quite owns.",
        inPractice:
          "Operators train hands-on: starting, guiding and stopping the cobot, running the daily checks, recognising the conditions where it should not run, and escalating faults instead of improvising fixes.",
        courseSlugs: [
          "working-alongside-a-cobot",
          "running-and-troubleshooting-a-robotic-cell",
        ],
      },
      {
        title: "Automation that survives peak",
        scenario:
          "The automated storage and the conveyors run beautifully in the demo and adequately in November. Peak is when exceptions multiply and one unit down becomes a site problem.",
        inPractice:
          "Teams learn how the automation routes and queues work, how to handle the exceptions it reliably creates, how to keep throughput in degraded running, and how to prepare the site for peak rather than survive it.",
        courseSlugs: [
          "warehouse-and-logistics-automation-in-practice",
          "preparing-your-team-for-automation",
        ],
      },
      {
        title: "A rollout the floor actually adopts",
        scenario:
          "The last system rollout technically succeeded: deployed on time, adopted by almost nobody. The workarounds it was meant to replace are still running.",
        inPractice:
          "Planning the next rollout around the people whose work changes, equipping the group that decides whether it sticks, measuring adoption rather than deployment, and reading the early signals in week three instead of month six.",
        courseSlugs: ["running-a-rollout-that-sticks"],
      },
    ],
  },
  {
    slug: "sales-and-marketing",
    kind: "function",
    name: "Sales and Marketing teams",
    navLabel: "Sales & Marketing",
    headline: "Faster output that still sounds like you",
    intro:
      "Commercial teams were the first to adopt AI and the first to discover its failure mode: content that is quick, plausible and interchangeable with every competitor's. The training is about speed with a voice - and about what never reaches a customer unchecked.",
    examples: [
      {
        title: "Meeting prep in minutes",
        scenario:
          "Proper preparation for a customer meeting - the account history, the sector context, the last three conversations - takes an hour that rarely exists, so it often does not happen.",
        inPractice:
          "Reps prepare with an assistant working across the account record and public context, walk in knowing what changed since last time, and spend the saved hour selling. What the assistant asserts gets checked against the record before it is repeated to a customer.",
        courseSlugs: [
          "ai-for-customer-facing-teams",
          "prompting-and-output-verification",
        ],
      },
      {
        title: "Proposals and campaigns with a voice",
        scenario:
          "Drafts are fast now. So are everyone else's, and it shows: the same phrases, the same structure, the same nothing. Meanwhile a fabricated claim in a proposal is a commercial incident.",
        inPractice:
          "Drafting with AI and editing into the organisation's own voice, with a verification pass on every factual claim - prices, capabilities, dates - before anything carries the company's name.",
        courseSlugs: [
          "writing-and-communicating-with-ai",
          "ai-for-customer-facing-teams",
        ],
      },
      {
        title: "Pipeline reporting someone will stand behind",
        scenario:
          "The forecast is assembled from CRM data everyone knows is patchy, then defended in a meeting by whoever compiled it.",
        inPractice:
          "Cleaning the data the forecast depends on, using AI to interrogate the pipeline and pressure-test the story it tells, and keeping the judgement calls - what is really going to close - with the people who own the deals.",
        courseSlugs: [
          "ai-for-analysis-and-reporting",
          "data-you-can-actually-use",
        ],
      },
      {
        title: "A team assistant for the questions that repeat",
        scenario:
          "The same product, pricing and objection-handling questions are answered by the most experienced people over and over, in DMs, at speed, from memory.",
        inPractice:
          "The team builds an assistant grounded in its own approved material - battlecards, pricing rules, case studies - scoped to one job, tested against awkward cases, and clear about when to hand back to a person.",
        courseSlugs: ["building-ai-assistants-for-your-team"],
      },
    ],
  },
  {
    slug: "customer-support",
    kind: "function",
    name: "Customer Support teams",
    navLabel: "Support",
    headline: "Faster answers a customer can still trust",
    intro:
      "Support is the sharpest version of the AI trade-off: the volume argues for automation, and every message lands on a real customer with a real problem. Teams that do this well are precise about which is which.",
    examples: [
      {
        title: "First replies that are fast and right",
        scenario:
          "Queue pressure rewards speed; customers punish boilerplate. Agents paste from macros that half-fit and edit under pressure, or worse, send unedited AI text with the wrong promise in it.",
        inPractice:
          "Agents draft replies with an assistant against the actual ticket history, keep the human voice, and know exactly which categories - complaints, anything with money, anything regulated - never leave without a human rewrite.",
        courseSlugs: [
          "ai-for-customer-facing-teams",
          "writing-and-communicating-with-ai",
        ],
      },
      {
        title: "The knowledge base becomes an assistant",
        scenario:
          "The answers exist - in the help centre, in old tickets, in the heads of three senior agents. Finding them takes longer than solving the problem.",
        inPractice:
          "The team builds an internal assistant grounded in its own documented answers, scoped to what it genuinely knows, and instructed to say so when it does not - then tests it against the awkward tickets before anyone relies on it.",
        courseSlugs: [
          "building-ai-assistants-for-your-team",
          "ai-tooling-and-integration-clinic",
        ],
      },
      {
        title: "Customer data handled properly under pressure",
        scenario:
          "A busy agent with a hard ticket and a helpful tool is one paste away from putting a customer's personal details somewhere they should not be.",
        inPractice:
          "Clear, practised classification of what may and may not enter a tool, workflows that make the safe path the fast path, and a reporting culture where a mistake surfaces in minutes rather than in an audit.",
        courseSlugs: [
          "responsible-ai-use-at-work",
          "everyday-security-for-busy-teams",
        ],
      },
      {
        title: "Measuring what automation did to quality",
        scenario:
          "Handle time is down since the AI tools arrived. Whether customers are better served is a different question nobody has measured.",
        inPractice:
          "Team leads set a baseline, track the metrics that show changed outcomes rather than changed speed, and report both honestly - so the next automation decision is made on evidence.",
        courseSlugs: [
          "measuring-ai-adoption-and-value",
          "leading-an-ai-ready-team",
        ],
      },
    ],
  },
] as const;

export function getUseCases(): readonly UseCaseEntry[] {
  return USE_CASES;
}

export function getUseCasesByKind(kind: UseCaseKind): UseCaseEntry[] {
  return USE_CASES.filter((entry) => entry.kind === kind);
}

export function getUseCase(slug: string): UseCaseEntry | undefined {
  return USE_CASES.find((entry) => entry.slug === slug);
}

/** Unique course slugs cited by an entry, in first-mention order. */
export function useCaseCourseSlugs(entry: UseCaseEntry): string[] {
  return [...new Set(entry.examples.flatMap((example) => example.courseSlugs))];
}
