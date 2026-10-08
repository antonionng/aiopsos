/** Lesson-free copy for /learn landers, role pages and comparison pages. */
export type LanderFaq = { question: string; answer: string };

export type LanderCourseLine = { slug: string; blurb: string };

export type Article4Page = {
  path: string;
  seoTitle: string;
  meta: string;
  h1: string;
  intro: string[];
  sections: Array<{ h2: string; body?: string[]; courses?: Array<[string, string, string, string]> | LanderCourseLine[] }>;
  faq: Array<[string, string]>;
  cta: { primary: [string, string]; secondary: [string, string]; team_note: string };
  sources: Array<[string, string]>;
};

export type RolePage = {
  slug: string;
  path: string;
  seoTitle: string;
  meta: string;
  h1: string;
  intro: string[];
  what_changed: string;
  courses: Array<[string, string]>;
  note?: string;
  faq: Array<[string, string]>;
  cta: [string, string];
  sharedParagraphs: string[];
};

export type ComparisonRow = [string, string, string, string, string, string, string];

export type ComparisonPage = {
  slug: string;
  path: string;
  seoTitle: string;
  meta: string;
  h1: string;
  intro: string[];
  table_cols: string[];
  rows: ComparisonRow[];
  sections: Array<{ h2: string; body?: string[]; courses?: Array<[string, string]> }>;
  faq: Array<[string, string]>;
  cta: [string, string];
};

export const CHECKED_DATE = "8 October 2026";

export const EXPERRT_VAT_NOTE = "No VAT to add";

export const ARTICLE4_PAGE = {
  "path": "/learn/eu-ai-act-article-4-training",
  "route_file": "app/learn/eu-ai-act-article-4-training/page.tsx",
  "seoTitle": "EU AI Act Article 4 Training for Staff, from £99",
  "meta": "Article 4 of the EU AI Act asks organisations using AI to support staff AI literacy, and it is now enforced. Online courses by role from £99.",
  "h1": "EU AI Act Article 4 training for your staff",
  "intro": [
    "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check.",
    "If the EU AI Act covers your organisation and your people use AI at work, Article 4 applies to you. It has applied since 2 February 2025. From August 2026, national regulators in each EU country supervise and enforce it. That is the change: this is no longer a rule you can plan for next year. It is a rule someone can now ask you about."
  ],
  "sections": [
    {
      "h2": "What has changed in 2026",
      "body": [
        "In July 2026 the EU's Digital Omnibus on AI amended Article 4. The duty did not go away. Organisations that provide or use AI systems must still take measures to support the development of AI literacy among their staff and anyone else using AI on their behalf, such as contractors.",
        "Two things are now explicit. First, the duty is to take measures that fit your people, judged by their technical knowledge, experience, education and training and by how the AI is used. Second, the law does not require you to guarantee any specific level of AI literacy for any individual.",
        "Read that carefully. It does not mean nothing is required. It means a regulator can ask what you actually did, for whom, and whether it fitted the way your people use AI. A slide deck that everyone clicked through will not answer that question well."
      ]
    },
    {
      "h2": "Does it apply to UK companies?",
      "body": [
        "Often, yes. The European Commission says the AI Act applies inside and outside the EU whenever an AI system is placed on the EU market, used in the EU, or its use affects people located in the EU. That covers many UK firms with EU customers, EU staff or EU operations.",
        "It is not limited to companies that build AI. The Commission's own example is a company whose staff use ChatGPT to write advertising text or translate documents. Those staff should understand the specific risks, such as an AI tool stating things that are not true."
      ]
    },
    {
      "h2": "What Article 4 does not ask for",
      "body": [
        "You do not need a certificate. The Commission says organisations can keep an internal record of the training and guidance they provide.",
        "You do not need to appoint an AI officer or set up a governance board for Article 4.",
        "You do not need to train everyone the same way. A team that uses AI to draft customer emails needs different measures from a team that uses AI to screen job applicants.",
        "And you do not need to follow debates about super intelligence. You need your people to understand the tools they already use, where those tools fail and what they must check before they rely on an answer."
      ]
    },
    {
      "h2": "Pick the course that fits each role",
      "courses": [
        [
          "ai-literacy-under-the-eu-ai-act",
          "For managers and team leaders. You work out, in plain terms, what Article 4 asks of your area and finish with a signed one-page AI literacy plan that records the measures taken."
        ],
        [
          "eu-ai-act-literacy-for-hr-and-l-and-d",
          "For HR and L&D leads who have been asked to organise AI literacy training. You build a role map and a record outline, so measures match how each group uses AI rather than what a supplier is selling."
        ],
        [
          "secure-use-of-ai-tools-at-work",
          "For everyone who uses AI tools. What is fine, what needs care and what must never go into an AI tool, ending with a written team rule."
        ],
        [
          "ai-output-verification",
          "For everyone who sends AI-assisted work to someone else. How to check every claim against a source before it leaves your desk."
        ]
      ]
    },
    {
      "h2": "Training a team",
      "body": [
        "On any course page, choose \"Buying for your team?\" and buy between 2 and 50 places in one payment, at the price shown per place. You invite each person by email. Everyone gets their own sign-in, progress and signed record, and you can see who has joined and who has finished. You also get an invoice for your records.",
        "Each person's 12 months of access starts on the day they accept their invitation. Places must be given out within 12 months of payment. If you need more than 50 places, email hello@experrt.com."
      ]
    },
    {
      "h2": "What your record shows, and what it does not",
      "body": [
        "When someone passes every lesson, they sign their final work and receive a certificate with a unique reference. The public record shows their name, the course, the date and the work they signed. It is one measure you can point to, alongside your own AI policy and internal records.",
        "It is not an accredited qualification. It does not certify compliance with the EU AI Act or any other law, and the courses are not legal advice. We say this plainly because the Commission is clear that no certificate is required, and you should know that before you buy."
      ]
    },
    {
      "h2": "If you would rather have a trainer in the room",
      "body": [
        "Experrt also runs trainer-led sessions in person or live online. See [Sponsoring an AI literacy programme](/courses/sponsoring-an-ai-literacy-programme) and [Responsible AI use at work](/courses/responsible-ai-use-at-work)."
      ]
    }
  ],
  "faq": [
    [
      "Does Article 4 still apply after the Digital Omnibus?",
      "Yes. The Digital Omnibus on AI amended Article 4 in July 2026, but organisations that provide or use AI systems must still take measures to support the AI literacy of their staff and others using AI on their behalf. National regulators supervise and enforce it from August 2026."
    ],
    [
      "Does the EU AI Act apply to UK companies?",
      "It can. The European Commission says the AI Act applies to organisations outside the EU when an AI system is placed on the EU market, used in the EU, or affects people located in the EU. Check how your own AI use touches the EU."
    ],
    [
      "Do we need an AI literacy certificate?",
      "No. The European Commission says there is no need for a certificate and that organisations can keep an internal record of trainings and other guidance. An Experrt certificate is a record of completed, signed work. It is not an accredited qualification and does not certify compliance."
    ],
    [
      "Will these courses make my organisation compliant?",
      "No course can do that on its own. Article 4 asks you to take measures that fit your people and how they use AI. These courses are one measure you can record. They are not legal advice."
    ],
    [
      "Which course should each person take?",
      "Managers and team leaders usually start with AI Literacy under the EU AI Act (£99). HR and L&D leads planning the programme take EU AI Act Literacy for HR and L&D (£129). Everyone who uses AI tools benefits from Secure Use of AI Tools at Work (£99) and AI Output Verification (£99)."
    ],
    [
      "Can I buy places for my whole team?",
      "Yes. Choose \"Buying for your team?\" on any course page and buy between 2 and 50 places in one payment. You invite people by email and see who has finished. For more than 50 places, email hello@experrt.com."
    ],
    [
      "Can I get a refund?",
      "No. All sales are final because the whole course opens as soon as payment is confirmed. If you are charged twice by mistake, the duplicate is reversed."
    ]
  ],
  "cta": {
    "primary": [
      "Start the £99 course for managers",
      "/learn/ai-literacy-under-the-eu-ai-act"
    ],
    "secondary": [
      "Plan it for HR and L&D, £129",
      "/learn/eu-ai-act-literacy-for-hr-and-l-and-d"
    ],
    "team_note": "Buying for a team? Choose 2 to 50 places on either course page."
  },
  "sources": [
    [
      "European Commission, AI literacy questions and answers (last updated 27 July 2026)",
      "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers"
    ],
    [
      "Regulation (EU) 2024/1689, the AI Act",
      "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
    ],
    [
      "Experrt course FAQ (team places, access, refunds, certificates)",
      "https://www.experrt.com/learn/faq"
    ]
  ],
  "schema": [
    "FAQPage",
    "BreadcrumbList",
    "ItemList of the four Course entities with Offer price and priceCurrency GBP"
  ]
} as const;

export const ROLE_PAGES = [
  {
    "slug": "finance-teams",
    "seoTitle": "AI Courses for Finance Teams, Online from £99",
    "meta": "Short online AI courses for finance staff, analysts and report writers: analysis, prompts, checking and safe use. From £99, certificate included.",
    "h1": "AI courses for finance teams",
    "intro": [
      "Finance teams are already using AI to summarise variance, draft commentary and reconcile figures. The risk is not that the tool is slow. It is that a confident, wrong number reaches a board pack with nobody able to say where it came from.",
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. If your organisation uses AI and has EU customers, staff or operations, Article 4 likely applies to you, and national regulators enforce it from August 2026."
    ],
    "what_changed": [
      "AI drafting is now inside the spreadsheet and the email client, so the old control of \"someone builds the model, someone checks it\" no longer happens by default. These courses put the check back where the work happens."
    ],
    "courses": [
      [
        "ai-assisted-analysis-and-reporting",
        "Written for analysts, finance staff and report writers. Use AI on real figures and keep every number reproducible."
      ],
      [
        "ai-output-verification",
        "Check every claim in AI-generated text against a source before it leaves your desk."
      ],
      [
        "prompt-engineering-for-professional-work",
        "Give AI tools complete instructions so the first draft is usable, then check the reply."
      ],
      [
        "secure-use-of-ai-tools-at-work",
        "Know what client and company data must never go into an AI tool, and leave with a written team rule."
      ],
      [
        "technology-decisions-for-non-technical-leaders",
        "For finance directors who sign off technology spend: read a proposal in terms of the work and obligations being bought."
      ]
    ],
    "note": "These are general professional courses. None of them is specific to accounting standards or regulated financial advice.",
    "faq": [
      [
        "Is there a finance-specific AI course?",
        "Not as such. AI-Assisted Analysis and Reporting (£99) is written for analysts, finance staff and report writers, and the other courses here apply to any professional who uses AI with figures and documents."
      ],
      [
        "How long do the courses take?",
        "Between 2 and 3 hours each, at your own pace. You have 12 months of access from the day you pay."
      ],
      [
        "Do the courses count towards professional CPD?",
        "We do not claim that they count towards any professional body's CPD requirements. Check your own body's rules. Each course ends with a signed certificate you can show."
      ],
      [
        "Can I buy places for my team?",
        "Yes. Buy between 2 and 50 places in one payment from any course page and invite people by email."
      ]
    ],
    "cta": [
      "Start AI-Assisted Analysis and Reporting, £99",
      "/learn/ai-assisted-analysis-and-reporting"
    ],
    "path": "/learn/for/finance-teams",
    "sharedParagraphs": [
      "Every course here is a short, self-paced online course with 12 months of access and a signed certificate when you pass. The certificate is not an accredited qualification and does not certify compliance with any law.",
      "Buying for more than one person? On any course page choose \"Buying for your team?\" and buy between 2 and 50 places in one payment. You invite people by email, everyone gets their own sign-in, progress and signed record, and you can see who has finished."
    ]
  },
  {
    "slug": "hr-teams",
    "seoTitle": "AI Courses for HR Teams, Online from £99",
    "meta": "Online AI courses for HR teams: recruitment, HR operations, employee data and the EU AI Act. From £99, 2 to 2.5 hours each, certificate included.",
    "h1": "AI courses for HR teams",
    "intro": [
      "HR is where AI decisions land on people. A screening tool that filters out good candidates, or an employee record pasted into a public chatbot, is an HR problem before it is an IT problem.",
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. The EU AI Act lists AI used in recruitment as high risk in Annex III, which brings extra training and oversight duties for organisations that use it. National regulators enforce Article 4 from August 2026."
    ],
    "what_changed": [
      "The question has moved from \"should HR use AI?\" to \"which HR tasks may AI draft, which must a person decide, and can we show that?\" These courses answer that for the work HR teams do every week."
    ],
    "courses": [
      [
        "ai-for-hr-and-people-teams",
        "Decide which HR tasks AI may draft and which a person must decide, without exposing employee data."
      ],
      [
        "hr-operations-with-ai",
        "Add one checked AI step to a repeating task such as offer letters, onboarding or leavers."
      ],
      [
        "hiring-and-selection-with-ai",
        "Decide which recruitment steps AI may draft and which a person must decide, and leave with a selection standard for a real vacancy."
      ],
      [
        "employee-data-privacy-and-ai",
        "Recognise personal data about workers and decide what may go into an AI tool."
      ],
      [
        "performance-and-feedback-with-ai",
        "Use AI only to prepare for a feedback or performance conversation, so the judgement stays with the manager."
      ],
      [
        "eu-ai-act-literacy-for-hr-and-l-and-d",
        "Plan AI literacy measures by role under Article 4 and leave with a role map and a record outline."
      ]
    ],
    "note": "The courses are not legal advice. For employment law or data protection questions, speak to your legal adviser.",
    "faq": [
      [
        "Which course should an HR team start with?",
        "AI for HR and People Teams (£99, 2.5 hours) is the broad starting point. Add Hiring and Selection with AI (£129) if you recruit, and Employee Data, Privacy and AI (£129) if you handle employee records in AI tools."
      ],
      [
        "Do HR teams need EU AI Act training?",
        "If your organisation uses AI and the EU AI Act applies to it, Article 4 asks you to take measures to support the AI literacy of staff using AI. HR often owns that programme. EU AI Act Literacy for HR and L&D (£129) is written for that job."
      ],
      [
        "Is the certificate an HR qualification?",
        "No. It confirms you completed an Experrt course and signed your work. It is not an accredited qualification."
      ],
      [
        "Can I buy places for the whole HR team?",
        "Yes. Buy between 2 and 50 places in one payment from any course page and invite people by email."
      ]
    ],
    "cta": [
      "Start AI for HR and People Teams, £99",
      "/learn/ai-for-hr-and-people-teams"
    ],
    "path": "/learn/for/hr-teams",
    "sharedParagraphs": [
      "Every course here is a short, self-paced online course with 12 months of access and a signed certificate when you pass. The certificate is not an accredited qualification and does not certify compliance with any law.",
      "Buying for more than one person? On any course page choose \"Buying for your team?\" and buy between 2 and 50 places in one payment. You invite people by email, everyone gets their own sign-in, progress and signed record, and you can see who has finished."
    ]
  },
  {
    "slug": "legal-teams",
    "seoTitle": "AI Courses for Legal Teams, Online from £99",
    "meta": "Short online courses for in-house legal teams on checking AI output, safe use of AI tools and EU AI Act Article 4. From £99, certificate included.",
    "h1": "AI courses for in-house legal teams",
    "intro": [
      "Legal teams face AI from two directions. Colleagues ask whether they may use a tool, and the team itself is tempted to use AI to draft and summarise. In both cases the cost of a fabricated reference or a leaked document is high.",
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. In-house lawyers are often the people asked what Article 4 means for the business, now that national regulators enforce it from August 2026."
    ],
    "what_changed": [
      "AI tools now sit inside the word processor and the document system. The control that matters is no longer whether staff have access. It is whether they check every claim and keep confidential material out of tools that should not see it."
    ],
    "courses": [
      [
        "ai-output-verification",
        "Check every claim in AI-generated text against a source before it leaves your desk."
      ],
      [
        "secure-use-of-ai-tools-at-work",
        "Know what is fine, what needs care and what must never go into an AI tool, and leave with a written team rule."
      ],
      [
        "ai-literacy-under-the-eu-ai-act",
        "What Article 4 asks of an organisation, in plain terms, ending with a one-page AI literacy plan."
      ],
      [
        "ai-for-writing-and-communication",
        "Turn a fast AI draft into work you are prepared to sign."
      ]
    ],
    "note": "These are general professional courses, not legal training. They do not give legal advice and we do not claim they count towards any regulator's CPD requirements.",
    "faq": [
      [
        "Is this legal training?",
        "No. These are general professional courses about using AI at work. They are useful for lawyers, but they are not legal education and not legal advice."
      ],
      [
        "Which course helps with the Article 4 question?",
        "AI Literacy under the EU AI Act (£99, 2 hours) explains what Article 4 asks and does not ask, and ends with a one-page plan that records measures and states what it does not claim."
      ],
      [
        "Do we need a certificate to meet Article 4?",
        "No. The European Commission says there is no need for a certificate and that an internal record of trainings is enough. Our certificate is a record of completed, signed work, not proof of compliance."
      ],
      [
        "Can I buy places for the team?",
        "Yes. Buy between 2 and 50 places in one payment from any course page."
      ]
    ],
    "cta": [
      "Start AI Output Verification, £99",
      "/learn/ai-output-verification"
    ],
    "path": "/learn/for/legal-teams",
    "sharedParagraphs": [
      "Every course here is a short, self-paced online course with 12 months of access and a signed certificate when you pass. The certificate is not an accredited qualification and does not certify compliance with any law.",
      "Buying for more than one person? On any course page choose \"Buying for your team?\" and buy between 2 and 50 places in one payment. You invite people by email, everyone gets their own sign-in, progress and signed record, and you can see who has finished."
    ]
  },
  {
    "slug": "operations-teams",
    "seoTitle": "AI and Automation Courses for Operations, from £99",
    "meta": "Online courses for operations teams on automation, spreadsheets, connecting tools and rollouts. From £99, 2 to 2.5 hours each, certificate included.",
    "h1": "AI and automation courses for operations teams",
    "intro": [
      "Operations teams carry the work nobody designed: the spreadsheet that runs the week, the handoff that is retyped between two systems, the new tool that half the team ignores. AI and automation can fix some of that, and make some of it worse.",
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. If your operations staff use AI tools and the Act applies to your organisation, Article 4 applies to them too. National regulators enforce it from August 2026."
    ],
    "what_changed": [
      "Automation no longer needs a developer. That is good news and a new risk: an automation nobody can stop or explain is a liability. These courses build small, tested changes with an owner and an off switch."
    ],
    "courses": [
      [
        "no-code-automation-for-everyday-work",
        "Build one small, tested automation for a repeating task, with a note on how to stop it."
      ],
      [
        "from-spreadsheets-to-simple-systems",
        "Decide what stays in the spreadsheet, what moves to a system and what retires."
      ],
      [
        "connecting-the-tools-your-team-already-uses",
        "Replace one handoff where work is retyped between two tools with a tested connection."
      ],
      [
        "running-a-technology-rollout",
        "Introduce a new tool in stages, with owners and dates."
      ],
      [
        "warehouse-and-logistics-automation",
        "For sites that move goods: see where automation would pay and where it would make the flow worse."
      ]
    ],
    "note": "",
    "faq": [
      [
        "Do I need coding skills?",
        "No. The courses are written for people who run processes, not for developers."
      ],
      [
        "Which course should I start with?",
        "No-Code Automation for Everyday Work (£99) if you have a repeating task to automate, or From Spreadsheets to Simple Systems (£99) if a spreadsheet is holding the process together."
      ],
      [
        "How long does each course take?",
        "Between 2 and 2.5 hours, at your own pace, with 12 months of access."
      ],
      [
        "Can I buy places for my team?",
        "Yes. Buy between 2 and 50 places in one payment from any course page."
      ]
    ],
    "cta": [
      "Start No-Code Automation, £99",
      "/learn/no-code-automation-for-everyday-work"
    ],
    "path": "/learn/for/operations-teams",
    "sharedParagraphs": [
      "Every course here is a short, self-paced online course with 12 months of access and a signed certificate when you pass. The certificate is not an accredited qualification and does not certify compliance with any law.",
      "Buying for more than one person? On any course page choose \"Buying for your team?\" and buy between 2 and 50 places in one payment. You invite people by email, everyone gets their own sign-in, progress and signed record, and you can see who has finished."
    ]
  },
  {
    "slug": "line-managers",
    "seoTitle": "AI Courses for Line Managers, Online from £99",
    "meta": "Online AI courses for line managers: review AI-assisted work, run fair feedback and meet EU AI Act Article 4. From £99, certificate included.",
    "h1": "AI courses for line managers",
    "intro": [
      "Your team is already using AI, whether or not anyone approved it. The line manager is the person who sees the work, so the line manager is the person who has to set the standard.",
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. Since national regulators began enforcing Article 4 in August 2026, \"what did managers tell their teams about AI?\" is a question with consequences."
    ],
    "what_changed": [
      "Champions and lunch-and-learns raised awareness. They did not change what gets checked before work goes out. That happens in one-to-ones and reviews, which is why these courses are written for managers."
    ],
    "courses": [
      [
        "ai-adoption-for-line-managers",
        "Review AI-assisted work in your one-to-ones with a short standard your team can follow."
      ],
      [
        "ai-literacy-under-the-eu-ai-act",
        "What Article 4 asks of your area, ending with a signed one-page AI literacy plan."
      ],
      [
        "performance-and-feedback-with-ai",
        "Use AI only to prepare for a feedback conversation, so the judgement stays yours."
      ],
      [
        "preparing-a-team-for-automation",
        "Plan for everyone whose work changes when automation arrives."
      ],
      [
        "digital-change-for-managers",
        "Lead a change of tool by naming what people will stop and start doing."
      ]
    ],
    "note": "",
    "faq": [
      [
        "Which course should a new manager take first?",
        "AI Adoption for Line Managers (£129, 2.5 hours) if your team already uses AI tools. AI Literacy under the EU AI Act (£99, 2 hours) if you have been asked to show what your area is doing about Article 4."
      ],
      [
        "Do I need to be technical?",
        "No. The courses are about judgement and team standards, not about building AI."
      ],
      [
        "Do I get a certificate?",
        "Yes. When you pass every lesson you sign your final work and receive a certificate you can verify online and add to LinkedIn. It is not an accredited qualification."
      ],
      [
        "Can I buy places for other managers?",
        "Yes. Buy between 2 and 50 places in one payment from any course page."
      ]
    ],
    "cta": [
      "Start AI Adoption for Line Managers, £129",
      "/learn/ai-adoption-for-line-managers"
    ],
    "path": "/learn/for/line-managers",
    "sharedParagraphs": [
      "Every course here is a short, self-paced online course with 12 months of access and a signed certificate when you pass. The certificate is not an accredited qualification and does not certify compliance with any law.",
      "Buying for more than one person? On any course page choose \"Buying for your team?\" and buy between 2 and 50 places in one payment. You invite people by email, everyone gets their own sign-in, progress and signed record, and you can see who has finished."
    ]
  },
  {
    "slug": "l-and-d-teams",
    "seoTitle": "AI Courses for L&D Teams, Online from £99",
    "meta": "Online courses for L&D teams: plan EU AI Act literacy by role, redesign programmes and measure whether training stuck. From £99, certificate included.",
    "h1": "AI courses for L&D teams",
    "intro": [
      "L&D (learning and development) is the team that plans, buys and records staff training. If you work in L&D, someone has probably asked you to \"sort out AI training\" with no budget line and no definition of done.",
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. Article 4 makes AI literacy an organisational duty, and national regulators enforce it from August 2026. L&D usually ends up owning the measures and the record."
    ],
    "what_changed": [
      "The Digital Omnibus on AI, which amended Article 4 in July 2026, made it explicit that organisations must take measures suited to their people but need not guarantee any specific level of AI literacy for any individual. That rewards a programme matched to roles over a single module pushed to everyone."
    ],
    "courses": [
      [
        "eu-ai-act-literacy-for-hr-and-l-and-d",
        "Plan AI literacy measures by role and leave with a role map and a record outline."
      ],
      [
        "redesigning-workplace-learning",
        "Rebuild one programme around a skill people can show in their work."
      ],
      [
        "measuring-whether-training-stuck",
        "Look past completions to changes in the work, and leave with a measurement sheet."
      ],
      [
        "building-a-workforce-skills-plan",
        "Build a two-quarter skills plan from changes to the work that are already decided."
      ],
      [
        "ai-literacy-under-the-eu-ai-act",
        "Give managers the same plain reading of Article 4 that you are working from."
      ]
    ],
    "note": "",
    "faq": [
      [
        "Can we use these courses as part of our Article 4 programme?",
        "Yes, as one measure among others. Each learner finishes with signed work and a verifiable record. The European Commission says an internal record of trainings is enough and no certificate is needed. Our record does not certify compliance."
      ],
      [
        "Can we buy places for a whole department?",
        "Yes. Buy between 2 and 50 places in one payment, invite people by email and see who has joined and finished. For more than 50 places, email hello@experrt.com."
      ],
      [
        "When does each person's access start?",
        "On the day they accept their invitation, and it lasts 12 months from then. Places must be given out within 12 months of payment."
      ],
      [
        "Is there a trainer-led option?",
        "Yes. Experrt also runs trainer-led sessions in person or live online, built on the same courses."
      ]
    ],
    "cta": [
      "Start EU AI Act Literacy for HR and L&D, £129",
      "/learn/eu-ai-act-literacy-for-hr-and-l-and-d"
    ],
    "path": "/learn/for/l-and-d-teams",
    "sharedParagraphs": [
      "Every course here is a short, self-paced online course with 12 months of access and a signed certificate when you pass. The certificate is not an accredited qualification and does not certify compliance with any law.",
      "Buying for more than one person? On any course page choose \"Buying for your team?\" and buy between 2 and 50 places in one payment. You invite people by email, everyone gets their own sign-in, progress and signed record, and you can see who has finished."
    ]
  }
] as const;

export const COMPARISON_PAGES = [
  {
    "slug": "ai-literacy-courses-uk",
    "path": "/learn/compare/ai-literacy-courses-uk",
    "seoTitle": "AI Literacy Courses UK Compared: Price and Format",
    "meta": "BSI, QA, BHCourses, Awaremind and Experrt AI literacy courses side by side: price, format and length, checked 8 October 2026. Experrt from £99.",
    "h1": "AI literacy courses in the UK, compared",
    "intro": [
      "The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. It has applied since 2 February 2025, and national regulators enforce it from August 2026, so many UK organisations with EU customers, staff or operations are now buying AI literacy training.",
      "This page sets out five options side by side, using only what each provider says on its own public page. We checked every page on 8 October 2026. Prices change, so check the provider's page before you buy. This is not a complete list and it is not a ranking. Experrt is one of the options, and we have tried to describe the others as fairly as we describe ourselves."
    ],
    "table_cols": [
      "Course",
      "Provider",
      "Price shown",
      "Format",
      "Length",
      "What you get at the end",
      "Source"
    ],
    "rows": [
      [
        "AI Literacy (Fundamentals) On-demand eLearning",
        "BSI",
        "£90 + VAT",
        "On-demand e-learning",
        "45 minutes",
        "BSI Training Academy certificate",
        "https://www.bsigroup.com/en-GB/training-courses/ai-literacy-fundamentals-on-demand-elearning-training-course/"
      ],
      [
        "AI Literacy: Safe and Compliant AI Use for All Staff",
        "QA",
        "From £750 + VAT",
        "Live instructor-led online (virtual), or bespoke",
        "3 hours",
        "Certificate of Achievement",
        "https://www.qa.com/course-catalogue/courses/ai-literacy-safe-and-compliant-ai-use-for-all-staff-qaailc/"
      ],
      [
        "EU AI Act Article 4 Training Course",
        "BHCourses",
        "€149 per person",
        "On-demand video, 20 lessons",
        "About 4.3 hours",
        "12 months of access. The page states there is no official EU certificate for Article 4.",
        "https://bhcourses.eu/en/ai-courses/eu-ai-act-training-course-article-4"
      ],
      [
        "EU AI Act Training (Article 4)",
        "Awaremind",
        "From €50 per participant, excl. VAT",
        "Four role-based levels, delivered in-company or online (workshops, masterclasses or blended)",
        "Not stated on the page",
        "Proof of participation",
        "https://www.awaremind.ai/ai-act-training/"
      ],
      [
        "AI Literacy under the EU AI Act",
        "Experrt",
        "£99",
        "Self-paced online",
        "2 hours",
        "Signed one-page AI literacy plan and a verifiable certificate. 12 months of access.",
        "https://www.experrt.com/learn/ai-literacy-under-the-eu-ai-act"
      ],
      [
        "EU AI Act Literacy for HR and L&D",
        "Experrt",
        "£129",
        "Self-paced online",
        "2 hours",
        "Signed role map and record outline and a verifiable certificate. 12 months of access.",
        "https://www.experrt.com/learn/eu-ai-act-literacy-for-hr-and-l-and-d"
      ]
    ],
    "sections": [
      {
        "h2": "How to choose",
        "body": [
          "Start with how your people actually use AI. A short, general module suits staff who only need the basics. Live, instructor-led training suits teams that learn best with a trainer and can be released for a fixed session. Self-paced courses that end in signed work suit people who need to produce something for their own area, such as a plan or a role map.",
          "Whatever you choose, keep a record of who did what. The European Commission says there is no need for a certificate and that an internal record of trainings is enough."
        ]
      },
      {
        "h2": "Where Experrt fits",
        "body": [
          "Experrt's two Article 4 courses are short, self-paced and end with work the learner signs: a one-page AI literacy plan for managers, or a role map and record outline for HR and L&D. You can buy 2 to 50 places in one payment and see who has finished. Neither course certifies compliance, and neither is an accredited qualification.",
          "If you prefer a trainer in the room, Experrt also runs trainer-led sessions. See [Sponsoring an AI literacy programme](/courses/sponsoring-an-ai-literacy-programme)."
        ]
      }
    ],
    "faq": [
      [
        "Is there an official EU AI literacy certificate?",
        "No. The European Commission says there is no need for a certificate for Article 4 and that organisations can keep an internal record of trainings and other guidance."
      ],
      [
        "Will any of these courses make my organisation compliant?",
        "No course does that on its own. Article 4 asks organisations to take measures that fit their staff and how they use AI. A course is one measure you can record."
      ],
      [
        "How were these courses chosen?",
        "They are courses whose pages we found when searching for UK AI literacy training on 8 October 2026. The list is not complete and the order is not a ranking."
      ],
      [
        "How current are these prices?",
        "We read each price from the provider's public page on 8 October 2026. Prices and formats change, so check the provider's page before you buy."
      ]
    ],
    "cta": [
      "See AI Literacy under the EU AI Act, £99",
      "/learn/ai-literacy-under-the-eu-ai-act"
    ],
    "schema": [
      "FAQPage",
      "BreadcrumbList"
    ],
    "schema_note": "Do not mark up competitor products with Product, Offer or Review schema. Only Experrt's own courses may carry Course and Offer markup."
  },
  {
    "slug": "ai-courses-for-hr-uk",
    "path": "/learn/compare/ai-courses-for-hr-uk",
    "seoTitle": "AI Courses for HR Teams UK Compared, 2026",
    "meta": "CIPD, AIHR and Experrt AI courses for HR side by side: price, format and length, checked 8 October 2026. Experrt from £99 for 2.5 hours online.",
    "h1": "AI courses for HR teams in the UK, compared",
    "intro": [
      "HR teams are being asked to use AI and to govern it at the same time. The EU AI Act is the European Union's law on how artificial intelligence (AI) is built and used. Article 4 is its AI literacy duty. AI literacy means the skills, knowledge and understanding people need to use AI with judgement: what a tool can do, where it goes wrong and what they must check. The EU AI Act also lists AI used in recruitment as high risk, which is why so many HR teams are looking for training now.",
      "This page compares three options using only what each provider says on its own public page, checked on 8 October 2026. Prices change, so check before you buy. This is not a complete list and not a ranking. The options differ a lot in length, so compare what you need, not just the price."
    ],
    "table_cols": [
      "Course",
      "Provider",
      "Price shown",
      "Format",
      "Length",
      "What you get at the end",
      "Source"
    ],
    "rows": [
      [
        "Introduction to AI for Human Resources",
        "CIPD",
        "£1,035.00 exc. VAT (the page offers 15% off for CIPD members)",
        "Facilitator-led online classes plus self-directed learning",
        "Two consecutive days",
        "Certificate, plus 12 months of CIPD Learning Hub access",
        "https://shop.cipd.org/product?catalog=AI-for-Human-Resources"
      ],
      [
        "Artificial Intelligence for HR Certificate Program",
        "AIHR",
        "$1,125 (shown to us in US dollars)",
        "Self-paced online, with expert and community support",
        "33 hours",
        "Certificate, 12 months of access, 30-day money-back guarantee stated on the page",
        "https://www.aihr.com/courses/artificial-intelligence-for-hr-certification/"
      ],
      [
        "AI for HR and People Teams",
        "Experrt",
        "£99",
        "Self-paced online",
        "2.5 hours",
        "Signed work and a verifiable certificate. 12 months of access.",
        "https://www.experrt.com/learn/ai-for-hr-and-people-teams"
      ]
    ],
    "sections": [
      {
        "h2": "How to choose",
        "body": [
          "If you want a broad grounding with a facilitator and time away from the desk, a two-day facilitated course is built for that. If you want a long certificate programme that covers many topics in depth, a 33-hour self-paced programme is built for that. If you need one HR person, or a whole team, to make better decisions about AI this month, a short self-paced course that ends in signed work may fit better."
        ]
      },
      {
        "h2": "Experrt's HR courses",
        "courses": [
          [
            "ai-for-hr-and-people-teams",
            "The broad starting point."
          ],
          [
            "hiring-and-selection-with-ai",
            "For anyone who recruits."
          ],
          [
            "employee-data-privacy-and-ai",
            "For anyone who handles employee records in AI tools."
          ],
          [
            "hr-operations-with-ai",
            "For repeating HR admin."
          ],
          [
            "eu-ai-act-literacy-for-hr-and-l-and-d",
            "For whoever owns the Article 4 programme."
          ]
        ]
      }
    ],
    "faq": [
      [
        "Which option is best for HR?",
        "It depends on what you need. The three options here range from 2.5 hours to 33 hours and from facilitator-led to self-paced. Compare the length and format against the job you need done."
      ],
      [
        "Is the Experrt certificate a CIPD qualification?",
        "No. It confirms you completed an Experrt course and signed your work. It is not an accredited qualification."
      ],
      [
        "How current are these prices?",
        "We read each price from the provider's public page on 8 October 2026. AIHR showed its price to us in US dollars. Check each page before you buy."
      ],
      [
        "Can I buy Experrt places for my HR team?",
        "Yes. Buy between 2 and 50 places in one payment from any course page and invite people by email."
      ]
    ],
    "cta": [
      "See AI for HR and People Teams, £99",
      "/learn/ai-for-hr-and-people-teams"
    ],
    "schema": [
      "FAQPage",
      "BreadcrumbList"
    ],
    "schema_note": "Do not mark up competitor products with Product, Offer or Review schema."
  }
] as const;

export function rolePage(slug: string) {
  return ROLE_PAGES.find((page) => page.slug === slug);
}

export function comparisonPage(slug: string) {
  return COMPARISON_PAGES.find((page) => page.slug === slug);
}
