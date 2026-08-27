/**
 * SEO copy for the two public money pages and the six course overlays.
 *
 * Source of truth is the brief shipped with the pages. Do not warm the
 * register, invent hours, sell a certificate, or claim Article 4
 * compliance. Experrt AI sits between sessions; it does not teach or grade.
 */

import { COURSE_TITLES } from "./published-course-slugs.ts";

export type FaqItem = {
  question: string;
  answer: string;
};

export type CopyBlock = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export const LITERACY_PROGRAMME_PATH = "/ai-literacy-training";
export const ASSESSMENT_LANDING_PATH = "/ai-readiness-assessment";

export const LITERACY_MAPPED_COURSES = [
  {
    slug: "sponsoring-an-ai-literacy-programme",
    hours: 5,
    audience: "leadership",
  },
  {
    slug: "ai-foundations-for-every-role",
    hours: 7,
    audience: "practitioner",
  },
  {
    slug: "responsible-ai-use-at-work",
    hours: 6,
    audience: null,
  },
  {
    slug: "ai-governance-and-oversight-for-managers",
    hours: 7,
    audience: null,
  },
  {
    slug: "leading-an-ai-ready-team",
    hours: 10,
    audience: null,
  },
] as const;

export function literacyCourseTitle(slug: string): string {
  return COURSE_TITLES[slug] ?? slug;
}

export const LITERACY_PAGE = {
  title: "AI literacy training for workforces",
  description:
    "Live, role-proportionate AI literacy training. Assess the workforce, run facilitated cohorts, keep a dated record. Article 4 is a duty, not a certificate.",
  h1: "AI literacy training that matches the work, not a webinar for everyone.",
  standfirst:
    "Most organisations can show that they bought AI tools. Fewer can show that the people using those tools were trained in a way that matches their role and the risk of the work. Experrt runs that training live, on the work the team already does, and keeps a record as it runs. This page is the programme view. It is not a certificate shop.",
  whoFor: {
    heading: "Who this is for",
    paragraphs: [
      "The person asked to put an AI literacy programme in place — L&D, HR, risk, transformation — and the executive who commissions it.",
      "It is not for video libraries, chatbot products, or compliance certificates.",
    ],
  },
  whyNow: {
    heading: "Why now",
    paragraphs: [
      "The tools arrived first. Untrained use is expensive. Article 4 supervision began on 2 August 2026.",
      "Article 4 is measures supporting literacy, not a certificate. It does not name a course and it does not create a compliance credential.",
    ],
    links: [
      {
        href: "/insights/eu-ai-act-article-4-literacy-for-ld",
        label: "EU AI Act Article 4: what L&D actually has to do",
      },
      {
        href: "/insights/what-ai-literacy-actually-means-at-work",
        label: "What AI literacy actually means at work",
      },
    ],
  },
  engagement: {
    heading: "Assess, train, evidence",
    steps: [
      {
        title: "Assess",
        body: "A five-minute workforce diagnostic, free on the platform. Start via /register. The landing is /ai-readiness-assessment.",
      },
      {
        title: "Train",
        body: "Live facilitated cohorts on the work the team already does. Experrt AI sits between sessions. It does not teach and it does not grade.",
      },
      {
        title: "Evidence",
        body: "A dated, frozen pack: attendance, submissions, grades, and an export the organisation keeps.",
      },
    ],
  },
  pay: {
    heading: "What you pay",
    paragraphs: [
      "The platform is free. Money is per-cohort live courses and metered, capped AI.",
      "There is no certificate product on this page, and no Article 4 compliance package.",
    ],
  },
  faqs: [
    {
      question: "Does this make us Article 4 compliant?",
      answer:
        "No. Article 4 is a duty to take measures supporting literacy. It is not a certificate, and no programme on this site establishes compliance.",
    },
    {
      question: "Who should attend?",
      answer:
        "Role-proportionate cohorts. A claims handler, a line manager and a sponsor do not sit the same course. Usually not the same course for everyone.",
    },
    {
      question: "Is this live or e-learning?",
      answer:
        "Live. A facilitator runs the course in person or online. It is not a video library.",
    },
    {
      question: "How do we start?",
      answer:
        "Run the assessment from /ai-readiness-assessment (start via /register), or book a conversation at /contact. Email ag@experrt.com.",
    },
    {
      question: "What records do we get?",
      answer:
        "Attendance, submissions, grades, and an export. The organisation keeps the dated pack.",
    },
    {
      question: "What does it cost?",
      answer:
        "The platform is free. Cohorts are priced per run. AI usage is metered and capped.",
    },
    {
      question: "Is it the same course for everyone?",
      answer:
        "Usually no. Scope by role and risk. That is the point of the programme view.",
    },
    {
      question: "Does Experrt AI teach the courses?",
      answer:
        "No. Experrt AI sits between live sessions. It does not teach and it does not grade.",
    },
  ] satisfies FaqItem[],
} as const;

export const ASSESSMENT_PAGE = {
  title: "AI readiness assessment for L&D",
  description:
    "A five-minute workforce diagnostic. Five dimensions, six maturity tiers, scored by department and role. Maps to live courses. Not a four-week audit.",
  h1: "Know where each team actually stands.",
  standfirst:
    "A five-minute diagnostic, not a consultancy audit. It scores the workforce across five dimensions and six maturity tiers, by department and by role, and maps the gaps onto live courses.",
  whatItIs: {
    heading: "What this is",
    paragraphs: [
      "A five-minute workforce diagnostic. Staff answer on their own work. You see where each team actually stands, not a ranking of departments for a slide.",
      "Unused Copilot or ChatGPT seats show up here as a licence-waste problem: paid access that never became capability. This page does not sell those products.",
    ],
  },
  whatItIsNot: {
    heading: "What this is not",
    paragraphs: [
      "It is not a four-week audit, a maturity consultancy, or an Article 4 measure. Completing it does not satisfy Article 4.",
      "Experrt AI does not mark it. Starting today needs an account at /register. The page itself stays public.",
    ],
  },
  after: {
    heading: "After the scores",
    paragraphs: [
      "Book the live cohorts the gaps actually point at. Talk to us via /contact if you want the programme scoped before anyone sits a course. Email ag@experrt.com.",
    ],
  },
  faqs: [
    {
      question: "Is this an audit?",
      answer:
        "No. It is a five-minute diagnostic, not a four-week consultancy audit.",
    },
    {
      question: "How long does it take?",
      answer: "Five minutes per person.",
    },
    {
      question: "Does it rank our departments?",
      answer:
        "No. It scores by department and by role so training can be aimed. It is not a league table.",
    },
    {
      question: "Does this satisfy Article 4?",
      answer:
        "No. Article 4 is a duty to take measures supporting literacy. A diagnostic is not that measure, and it is not a certificate.",
    },
    {
      question: "What happens after we have scores?",
      answer:
        "Book live cohorts against the gaps. The assessment maps to the catalogue; it does not replace the training.",
    },
    {
      question: "Do we need an account?",
      answer:
        "Yes, today. Start via /register. This landing stays public until a public start exists.",
    },
    {
      question: "Can we talk before we run it?",
      answer: "Yes. Book a conversation at /contact, or email ag@experrt.com.",
    },
    {
      question: "Does Experrt AI mark the assessment?",
      answer: "No. Experrt AI does not mark it.",
    },
  ] satisfies FaqItem[],
} as const;

export type CourseSeo = {
  title: string;
  description: string;
  inserts: CopyBlock[];
  faqs: FaqItem[];
  furtherReading?: { href: string; label: string };
};

export const COURSE_SEO: Record<string, CourseSeo> = {
  "ai-foundations-for-every-role": {
    title: "AI foundations training for every role",
    description:
      "A 7-hour live introduction to AI at work. Staff use the tools on their own tasks and leave knowing what these systems cannot do. Not a product demo.",
    inserts: [
      {
        heading: "Who this is for",
        paragraphs: [
          "Staff who have a licence and little structure: they can open the tool and they have not been shown how to put it on their own work.",
        ],
      },
      {
        heading: "Who this is not for",
        paragraphs: [
          "Daily users who already work this way. Product tours. Anyone shopping for an Article 4 certificate — there is not one, and this course is not it.",
        ],
      },
      {
        heading: "What foundations means on a Tuesday",
        paragraphs: [
          "Three real tasks from the participant's own week, done in the room, plus the failure modes: what these systems cannot do, what must be checked, and what must not be pasted in.",
        ],
      },
      {
        heading: "How it is assessed",
        paragraphs: [
          "Live facilitation, submitted work against the modules, and a facilitator grade. Experrt AI does not teach this course and does not grade it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this the literacy course?",
        answer:
          "Literacy is a programme, not one course. Foundations is the practitioner introduction. Sponsors, managers and responsible-use cohorts sit elsewhere.",
      },
      {
        question: "Is this ChatGPT or Copilot training?",
        answer:
          "No. Participants use the tools they already have. This is not a product demo and it does not resell those products.",
      },
      {
        question: "Does this make us Article 4 compliant?",
        answer:
          "No. Article 4 is a duty, not a certificate. No single course establishes compliance.",
      },
      {
        question: "Is it a video?",
        answer: "No. It is live, seven facilitated hours.",
      },
      {
        question: "Who should not attend?",
        answer:
          "Daily users who already do this work, and commissioning executives. Sponsors sit Sponsoring an AI Literacy Programme.",
      },
    ],
  },
  "sponsoring-an-ai-literacy-programme": {
    title: "Commission AI literacy training",
    description:
      "A 5-hour live session for the person who must commission workforce AI training and answer for it. Scope by role and risk. Specify the records.",
    inserts: [
      {
        heading: "Who this is for",
        paragraphs: [
          "The sponsor: the person who must commission workforce AI training and answer for it later — usually L&D, HR, risk, or a named executive.",
        ],
      },
      {
        heading: "Who this is not for",
        paragraphs: [
          "Practitioners who need to use the tools on Tuesday. This is not a legal seminar and it is not a certificate briefing.",
        ],
      },
      {
        heading: "Commissioning against a measured gap",
        paragraphs: [
          "Start from the assessment, not a vendor menu. Scope by role and risk. Write down the records you will insist on before anyone quotes: attendance, submissions, grades, an export the organisation keeps.",
        ],
      },
      {
        heading: "What you can say afterwards",
        paragraphs: [
          "You can say you took measures supporting literacy for the roles you trained, on these dates, with this record. You cannot say the organisation is Article 4 compliant. No such certificate exists here.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this make us Article 4 compliant?",
        answer:
          "No. Article 4 is a duty, not a certificate. This session is how you commission measures and specify the record. It does not establish compliance.",
      },
      {
        question: "Do I need a legal background?",
        answer: "No. You need to be the person who will answer for the programme.",
      },
      {
        question: "Should L&D and the sponsor attend together?",
        answer:
          "Yes, when both exist. The session is for the people who will commission and describe the measures.",
      },
      {
        question: "What records should we insist on?",
        answer:
          "Attendance, submissions, grades, and an export the organisation keeps. A badge without those fields is not the record.",
      },
      {
        question: "Can we run this before a policy exists?",
        answer:
          "Yes. You can commission training before the policy is finished. You still specify the record.",
      },
    ],
  },
  "leading-an-ai-ready-team": {
    title: "Leading an AI-ready team",
    description:
      "A 10-hour live course for managers who decide whether AI adoption sticks. Expectations, blockers, team habits, and a written 90-day plan.",
    inserts: [
      {
        heading: "Line managers, not champions",
        paragraphs: [
          "This is for the manager who assigns the work and reviews it. A champion cannot set the standard for a team they do not manage.",
        ],
      },
      {
        heading: "Who this is not for",
        paragraphs: [
          "Informal champions, practitioners who need foundations, or the sponsor commissioning the whole programme. Incidents and policy application sit in AI Governance and Oversight for Managers.",
        ],
      },
      {
        heading: "What AI-ready means here",
        paragraphs: [
          "Expectations, blockers, team habits, and a written 90-day plan. Fluency is a team property. The manager decides whether adoption sticks.",
        ],
      },
      {
        heading: "Literacy programme context",
        paragraphs: [
          "This course is one part of a role-proportionate literacy programme. It is not an organisational certificate and it does not discharge Article 4 for the workforce.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this for champions?",
        answer:
          "No. It is for line managers. Champions scout; managers set the standard.",
      },
      {
        question: "Do managers need to be fluent first?",
        answer:
          "They need enough fluency to set expectations and review work. This course is where that managerial standard is trained.",
      },
      {
        question: "Does the organisation get a certificate?",
        answer:
          "No. This is not an organisational certificate and it does not make anyone Article 4 compliant.",
      },
      {
        question: "Is it live? How long?",
        answer: "Yes. Ten facilitated hours, live.",
      },
      {
        question: "Where do incidents sit?",
        answer:
          "Incidents, review thresholds and the register sit in AI Governance and Oversight for Managers, not here.",
      },
    ],
    furtherReading: {
      href: "/insights/managers-not-champions-ai-adoption",
      label: "Managers, not champions, after you buy the tools",
    },
  },
  "getting-value-from-tools-you-already-own": {
    title: "Get value from tools you already own",
    description:
      "A 5-hour live working audit of licences you already pay for. Unused Copilot and ChatGPT seats are the problem — this is not a product course.",
    inserts: [
      {
        heading: "Unused capability, not new tools",
        paragraphs: [
          "Licences were bought. Most of the capability inside them was never switched on. Unused Copilot and ChatGPT seats are the problem this course names. They are not products Experrt resells.",
        ],
      },
      {
        heading: "Who this is not for",
        paragraphs: [
          "Teams choosing the next vendor. Staff who still need foundations. An IT-only audience shopping for a reseller recommendation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this a Copilot course?",
        answer:
          "No. Unused Copilot seats are named only as the licence-waste problem. This is not a Microsoft product course.",
      },
      {
        question: "Is this ChatGPT training?",
        answer:
          "No. Unused ChatGPT seats are the same licence-waste problem. This is not OpenAI training and it is not a reseller pitch.",
      },
      {
        question: "Will you pick our next vendor?",
        answer:
          "No. We will not pick the next vendor as a reseller. The next purchase starts from what is genuinely missing after the audit.",
      },
      {
        question: "What level is it?",
        answer: "Practitioner. Five facilitated hours, live.",
      },
      {
        question: "Does this replace a literacy programme?",
        answer:
          "No. Getting value from paid seats is not the same as role-proportionate literacy measures, and it does not satisfy Article 4.",
      },
    ],
    furtherReading: {
      href: "/insights/unused-ai-licences-training-gap",
      label: "The licences are paid for. The team was not trained.",
    },
  },
  "working-alongside-a-cobot": {
    title: "Working alongside a cobot",
    description:
      "8-hour live, hands-on cobot training for the shift. Start, guide, stop, daily checks. For operators, not the integrator's commissioning day.",
    inserts: [
      {
        heading: "Operators, after the integrator leaves",
        paragraphs: [
          "The integrator trains two people on commissioning day, then leaves. This course is for the operators on the shift that inherits the cell: start, guide, stop, daily checks.",
        ],
      },
      {
        heading: "What this is not",
        paragraphs: [
          "Not OEM programming. Not the safety case. Not Article 4. A cobot walkthrough is not a literacy measure under the EU AI Act.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this the integrator’s commissioning day?",
        answer:
          "No. It is for operators after the integrator leaves. Start, guide, stop, daily checks.",
      },
      {
        question: "Is this OEM programming?",
        answer:
          "No. We do not teach the manufacturer’s programming core and we do not sell the robot.",
      },
      {
        question: "Does this replace the safety case?",
        answer: "No. The safety case stays with the people who own it.",
      },
      {
        question: "Is this Article 4 training?",
        answer:
          "No. A cobot walkthrough is not an Article 4 measure. Keep AI-literacy records separate if the cell includes AI-enabled vision or planning.",
      },
      {
        question: "Who should attend?",
        answer:
          "Operators and the supervisors who share the workspace. Not the integrator’s commissioning audience.",
      },
    ],
    furtherReading: {
      href: "/insights/cobot-training-for-the-shift-not-the-integrator",
      label: "Cobot training for the shift, not the integrator",
    },
  },
  "warehouse-and-logistics-automation-in-practice": {
    title: "Warehouse and logistics automation training",
    description:
      "7-hour live course on automated storage, mobile robots and conveyors as they behave at peak, with awkward stock, and when a unit goes down.",
    inserts: [
      {
        heading: "The demo is not the site",
        paragraphs: [
          "Automated storage, mobile robots and conveyors run cleanly in the demo. Peak, awkward stock, and a unit down are the site. This course is that difference.",
        ],
      },
      {
        heading: "What this is not",
        paragraphs: [
          "Not brand-specific vendor training. Not the cobot course. Not Article 4 literacy.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the demo enough?",
        answer:
          "No. The demo is not the site. Peak, awkward stock, and a unit down are the work.",
      },
      {
        question: "Is this brand-specific?",
        answer:
          "No. It is how automated storage, mobile robots and conveyors behave in operation, not a manufacturer’s product course.",
      },
      {
        question: "Is this the cobot course?",
        answer:
          "No. Operators sharing a collaborative robot sit Working Alongside a Cobot.",
      },
      {
        question: "Is this Article 4 training?",
        answer:
          "No. Warehouse automation practice is not an Article 4 literacy measure.",
      },
      {
        question: "How is it delivered?",
        answer:
          "Live, seven facilitated hours. Experrt AI does not teach it and does not grade it.",
      },
    ],
  },
};

export function getCourseSeo(slug: string): CourseSeo | undefined {
  return COURSE_SEO[slug];
}

export const MONEY_PAGE_PATHS = [
  LITERACY_PROGRAMME_PATH,
  ASSESSMENT_LANDING_PATH,
] as const;
