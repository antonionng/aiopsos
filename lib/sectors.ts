import { COURSE_SECTORS, type CourseSector } from "./constants.ts";

/**
 * Copy for the sector landing pages at /courses/sector/[sector].
 *
 * Pure module - no runtime imports - so node:test can load it with type
 * stripping alone, the same contract as use-cases and insights/catalog.
 *
 * Content rules, in order of importance, and identical to the use-case pages:
 *  - No invented customers, quotes or metrics. Everything is written as
 *    "what this looks like", never "what a client achieved".
 *  - No compliance claims. Training supports documented, role-proportionate
 *    literacy measures. It does not make anyone compliant, and the sector
 *    pages carry LITERACY_DISCLAIMER through the shared footer.
 *  - A sector page never claims a bespoke curriculum. The catalogue is the
 *    catalogue; what changes is the material the room works through, which
 *    is already true of every course because they are facilitated live on
 *    the participants' own work.
 */

export interface SectorTension {
  /** The thing the reader will recognise from their own week. */
  title: string;
  body: string;
}

export interface SectorEntry {
  sector: CourseSector;
  /** Page H1. */
  headline: string;
  /** Search description and the paragraph under the H1. */
  intro: string;
  /** What the sector brings into the room that a generic cohort does not. */
  tensions: SectorTension[];
}

const SECTORS: readonly SectorEntry[] = [
  {
    sector: "financial_services",
    headline: "AI and technology training for financial services",
    intro:
      "Banks, insurers, asset managers and the firms that serve them are using these tools already, usually ahead of the oversight that was meant to govern them. The work is not slowing that down. It is training people to verify what comes back, teaching managers what to review and how often, and giving the executive layer the questions to ask before the next proposal is signed off.",
    tensions: [
      {
        title: "Second line asks what the first line is actually doing",
        body: "Risk and internal audit start asking teams what they use AI for, and the honest answer is usually that nobody has written it down. Managers train on applying the firm's own policy to live requests, setting review thresholds and keeping a register that stands up to being asked for.",
      },
      {
        title: "Client and customer material cannot go anywhere",
        body: "Sessions are run on the constraint rather than around it: what may enter a tool, what may not, where the line sits for client-identifiable and market-sensitive material, and what the approved route looks like when someone needs the answer anyway.",
      },
      {
        title: "Analysis nobody can reproduce is worse than no analysis",
        body: "The analysis and reporting work is built around a trail: how the figure was reached, what was checked, and what a reviewer needs in order to sign it. Speed that cannot be defended is not a saving in this sector.",
      },
    ],
  },
  {
    sector: "healthcare",
    headline: "AI and technology training for healthcare and life sciences",
    intro:
      "Providers, trusts, care organisations and life sciences teams carry a duty of care that generic AI training simply does not account for. These cohorts run on administrative and operational work first, with clinical judgement treated as the thing the technology serves rather than the thing it replaces, and with the boundary said out loud rather than assumed.",
    tensions: [
      {
        title: "Patient data is the first question, not the last",
        body: "Every session starts from what may and may not enter a tool, who owns that decision locally, and what the approved alternative is. Teams leave able to explain their own boundary to a colleague, which is what makes it hold.",
      },
      {
        title: "The administrative load is where the time actually goes",
        body: "Correspondence, referrals, summarising long records, drafting the same letter for the fortieth time. This is the work AI can genuinely lift, and it is where these cohorts spend their practice time.",
      },
      {
        title: "Automation lands on shift patterns, not on org charts",
        body: "Where robotics and automation reach logistics, pharmacy, labs and facilities, the operational course covers who owns the system on a Sunday night and what happens on the shift when it stops.",
      },
    ],
  },
  {
    sector: "manufacturing",
    headline: "AI and robotics training for manufacturing and industrials",
    intro:
      "This is the sector where the robotics catalogue does most of its work, and where the gap is rarely engineering. It is the operators who have to run the cell, the supervisors who have to keep it safe, and the managers who have to specify the next one without repeating what went wrong with the last. Training runs on the plant's own processes, on the machines actually in use.",
    tensions: [
      {
        title: "The integrator leaves and the cell becomes yours",
        body: "Running and troubleshooting a robotic cell, first-line diagnosis, when to escalate and when not to. The cost of a stopped line is usually the argument that wins the training budget.",
      },
      {
        title: "Safety is a working practice, not a document",
        body: "Guarding, risk assessment, and the habits that survive a busy shift. Supervisors work through their own workcells rather than a textbook layout.",
      },
      {
        title: "Specifying the next deployment properly",
        body: "What to ask for, what the payback actually depends on, what it costs to run once the integrator has gone, and who inside the business owns it afterwards.",
      },
      {
        title: "The operations system is a spreadsheet",
        body: "A large amount of manufacturing runs on one workbook that one person understands. The technology track deals with that honestly, including when to leave it alone.",
      },
    ],
  },
  {
    sector: "public_sector",
    headline: "AI and technology training for the public sector",
    intro:
      "Central government, local authorities, agencies and public bodies face the same tools as everyone else with tighter constraints around them: public money, public records, and decisions that affect people who cannot take their business elsewhere. These cohorts are built around proportionate, documented use and around explaining a decision afterwards.",
    tensions: [
      {
        title: "A decision that affects a citizen has to be explainable",
        body: "Where AI touches casework, correspondence or triage, teams train on what the tool may do, what a human must do, and how to describe the difference to someone who asks. Verification habits carry more weight here than speed.",
      },
      {
        title: "Records, requests and retention",
        body: "Sessions cover what a tool creates that later becomes a record, and what that means for how it is used day to day.",
      },
      {
        title: "A literacy programme across thousands of people",
        body: "The sponsor course deals with scoping measures by role rather than pushing one generic module to every inbox, and with keeping the evidence as the programme runs rather than reconstructing it a year later.",
      },
      {
        title: "Procurement decided years ago what you have",
        body: "The technology track works on getting value out of licences the organisation already holds, which is usually more available capability than anything currently in a business case.",
      },
    ],
  },
  {
    sector: "professional_services",
    headline: "AI and technology training for professional services",
    intro:
      "Law, accountancy, consulting, agencies and advisory firms sell judgement by the hour, which makes AI both an obvious lever and an obvious threat to the model. These cohorts deal with the real question rather than the abstract one: which parts of the work the tools genuinely take, and how to keep the part clients are paying for.",
    tensions: [
      {
        title: "Client confidentiality is the whole business",
        body: "What may enter a tool, under which client's terms, and what the approved route is when the answer is no. Practitioners leave able to make that call themselves rather than escalating every time.",
      },
      {
        title: "Drafting is most of the day",
        body: "Written work is where the time is, and where the quality risk sits. Sessions cover producing a first draft fast and interrogating it properly, which is a different skill from writing it yourself.",
      },
      {
        title: "Research and analysis that has to hold up",
        body: "Verification habits, source checking, and knowing the failure modes of the tool well enough to catch a confident answer that is wrong.",
      },
      {
        title: "The billing model is the elephant",
        body: "The manager and leadership sessions deal with measuring what changed, and with the difference between time saved and value captured, because in this sector they are not the same number.",
      },
    ],
  },
  {
    sector: "retail",
    headline: "AI and technology training for retail and consumer",
    intro:
      "Retailers, consumer brands and hospitality operators run on volume, on seasonal peaks and on a large frontline workforce. Training here is short, practical and built for people who are not at a desk, with the operational and customer-facing work taken seriously rather than treated as a lesser case of office work.",
    tensions: [
      {
        title: "Customer-facing teams need judgement, not scripts",
        body: "Where AI drafts a reply or summarises a case, the training is about when to trust it, when to rewrite it and when the customer needs a person. A tool that sounds confident and is wrong costs more here than the time it saved.",
      },
      {
        title: "Peak decides everything",
        body: "Automation and forecasting work is framed around the weeks that actually matter, and around what happens when the system is wrong during them.",
      },
      {
        title: "Warehouse and store operations",
        body: "The logistics automation course covers what these systems do well, what they do badly, and the operational realities of running them alongside a workforce that changes shift to shift.",
      },
    ],
  },
  {
    sector: "logistics",
    headline: "AI and automation training for logistics and supply chain",
    intro:
      "Warehousing, distribution, transport and supply chain teams were automating before the current wave of AI arrived, which means the questions here are more mature and more operational. The training is about running these systems, specifying the next ones, and preparing the workforce that has to work alongside them.",
    tensions: [
      {
        title: "The automation already exists and nobody owns it",
        body: "Sortation, conveyors, AMRs and goods-to-person systems bought over several years, with support arrangements that have quietly lapsed. The operational courses deal with running and troubleshooting what is already installed.",
      },
      {
        title: "Preparing people for what is coming",
        body: "Announcing automation badly costs more than the automation. The manager course covers what to say, when, and how to move people into the work that remains, without pretending nothing changes.",
      },
      {
        title: "Planning data that is not good enough to plan with",
        body: "Forecasting and analysis work starts from the state of the data, because a model built on a bad master file produces a confident answer that is wrong in an expensive direction.",
      },
    ],
  },
  {
    sector: "education",
    headline: "AI and technology training for education",
    intro:
      "Schools, colleges, universities and training providers are dealing with AI on two fronts at once: their own staff using it for work, and learners using it for everything. These cohorts are for the staff side, and they are honest that a policy nobody understands is not a policy.",
    tensions: [
      {
        title: "Staff need a position they can actually explain",
        body: "Teaching and professional services staff work through what the institution's own policy means for a real request, so the answer given to a learner or a parent is consistent rather than improvised.",
      },
      {
        title: "Administrative load is where the relief is",
        body: "Reports, correspondence, planning documents and the same summary written repeatedly. Practice time goes on the work that is genuinely repetitive, not on the parts that need a person.",
      },
      {
        title: "Leaders are asked for a strategy before they have used the tools",
        body: "The leadership session puts senior staff on their own material first, because a position on AI written by someone who has never used one tends not to survive contact with the institution.",
      },
    ],
  },
];

export function getSectors(): SectorEntry[] {
  return [...SECTORS];
}

export function getSector(sector: string): SectorEntry | undefined {
  return SECTORS.find((entry) => entry.sector === sector);
}

/** Every sector in COURSE_SECTORS has copy. Asserted by the sector tests. */
export function missingSectorCopy(): CourseSector[] {
  return COURSE_SECTORS.filter((sector) => !getSector(sector));
}
