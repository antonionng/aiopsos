/**
 * Title, meta, extra sections and FAQs for the three money use-case pages.
 * Worked examples stay in lib/use-cases.ts and must not be replaced here.
 */

import type { FaqItem, CopyBlock } from "./money-pages.ts";

export type UseCaseSeo = {
  title: string;
  description: string;
  sections: CopyBlock[];
  faqs: FaqItem[];
};

export const USE_CASE_SEO: Record<string, UseCaseSeo> = {
  enterprise: {
    title: "Enterprise AI literacy and adoption training",
    description:
      "Role-proportionate AI training at scale, with a dated record. Live cohorts, not a webinar for everyone. Assess first. Article 4 is a duty, not a certificate.",
    sections: [
      {
        heading: "A programme, not a webinar for everyone",
        paragraphs: [
          "Large organisations do not have one AI literacy gap. They have many, spread across divisions, roles and risk levels. The work is scoping measures proportionately, delivering them live, and keeping the evidence as the programme runs.",
          "This page is the enterprise view of that programme. It is not a certificate shop, and it does not make an organisation Article 4 compliant.",
        ],
      },
      {
        heading: "Assess, then train, then keep the record",
        paragraphs: [
          "Assess first. The five-minute diagnostic is at /ai-readiness-assessment; start via /register. Train in live cohorts mapped to the gap. Experrt AI sits between sessions; it does not teach and it does not grade. Evidence is a dated, frozen pack.",
          "The programme view is /ai-literacy-training. The platform is free. Money is per-cohort live courses and metered, capped AI.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does enterprise training make us Article 4 compliant?",
        answer:
          "No. Article 4 is a duty, not a certificate. Role-proportionate live cohorts and a dated record are measures you can describe. They do not establish compliance.",
      },
      {
        question: "Do we run the same course for everyone?",
        answer:
          "Usually no. Scope by role and risk. A webinar for everyone is the easy answer and a weak reading of literacy.",
      },
      {
        question: "How do we start at this scale?",
        answer:
          "Assess first at /ai-readiness-assessment (start via /register), then book cohorts. Or talk at /contact. Email ag@experrt.com.",
      },
      {
        question: "Is this live or a video roll-out?",
        answer:
          "Live facilitated cohorts. Not a webinar for everyone, and not a video library.",
      },
      {
        question: "What records do we keep?",
        answer:
          "Attendance, submissions, grades, and an export. The organisation keeps the dated pack.",
      },
    ],
  },
  operations: {
    title: "Operations AI and robotics training",
    description:
      "Office automation and site robotics, trained as different jobs. Live cohorts on the work, not a demo day. A cobot walkthrough is not Article 4.",
    sections: [
      {
        heading: "Office work and site work are different jobs",
        paragraphs: [
          "Operations carries the widest spread in this catalogue. Office workflows want automating and data that can be trusted. Where there is a site, people work alongside robots, cells and conveyors every shift. Those are not the same training problem.",
          "Office cohorts deal with the reporting week, the rollout that has to stick, and the tools already paid for. Site cohorts deal with the cell after the integrator leaves, and with automation that has to survive peak.",
        ],
      },
      {
        heading: "A cobot walkthrough is not Article 4",
        paragraphs: [
          "Article 4 is a literacy duty for AI systems, not a robot induction. A cobot walkthrough is not an Article 4 measure. If the cell includes AI-enabled vision or planning, keep those records separate.",
          "The shift briefing is /insights/cobot-training-for-the-shift-not-the-integrator.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is cobot training an Article 4 measure?",
        answer:
          "No. A cobot walkthrough is not Article 4. Keep AI-literacy records separate if the cell includes AI-enabled systems.",
      },
      {
        question: "Do office and site teams sit the same course?",
        answer:
          "No. Office automation and site robotics are split. The worked examples below show which courses attach to which job.",
      },
      {
        question: "Is warehouse training brand-specific?",
        answer:
          "No. The demo is not the site, and the course is not a manufacturer product day.",
      },
      {
        question: "How do we start?",
        answer:
          "Assess the office side at /ai-readiness-assessment if the gap is AI use. For a cell or a warehouse, book a conversation at /contact. Email ag@experrt.com.",
      },
      {
        question: "Does Experrt AI teach the cell?",
        answer:
          "No. Experrt AI sits between live sessions. It does not teach and it does not grade.",
      },
    ],
  },
  hr: {
    title: "HR AI literacy and people-team training",
    description:
      "HR sits on both sides of AI: users of the tools, and the function that commissions literacy training. People decisions stay with people.",
    sections: [
      {
        heading: "Both sides: user and commissioner",
        paragraphs: [
          "People teams are heavy users of the tools on documents and data, and they are the function accountable for how the organisation is trained. Both sides need deliberate skill. One generic webinar covers neither.",
          "Commissioning sits on /ai-literacy-training and in Sponsoring an AI Literacy Programme. Daily use sits in the practitioner courses. Assess first at /ai-readiness-assessment.",
        ],
      },
      {
        heading: "People decisions stay with people",
        paragraphs: [
          "Screening tools and sentiment scores can be useful triage. They are not a decision about a person. The tasks that require a human decision maker stay with a human decision maker. Record how AI was involved. Do not file a tool output as the decision.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are we the users or the commissioners?",
        answer:
          "Both. HR uses the tools on its own work and commissions literacy measures for everyone else. Those are different courses.",
      },
      {
        question: "Do people decisions get automated?",
        answer:
          "No. People decisions stay with people. AI involvement in anything that touches employment is recorded, not delegated.",
      },
      {
        question: "Does HR training make us Article 4 compliant?",
        answer:
          "No. Article 4 is a duty, not a certificate. Commissioning a programme and sitting a course are not compliance.",
      },
      {
        question: "How do we start?",
        answer:
          "Run the assessment from /ai-readiness-assessment (start via /register), or book a conversation at /contact. Email ag@experrt.com.",
      },
      {
        question: "Is it the same course for all staff?",
        answer:
          "Usually no. Role-proportionate. The people team and the workforce they support do not sit one webinar.",
      },
    ],
  },
};

export function getUseCaseSeo(slug: string): UseCaseSeo | undefined {
  return USE_CASE_SEO[slug];
}
