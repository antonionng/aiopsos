/** Self-paced links from trainer-led, sector and use-case pages. Lesson-free. */
export type SelfServeCta = {
  learnSlug: string;
  href: string;
  linkText: string;
  alsoHref?: string;
};

function entry(page: string, learnSlug: string, href: string, linkText: string, alsoHref?: string): [string, SelfServeCta] {
  const slug = page.replace(/^\/(?:courses\/(?:sector\/)?)?/, "").replace(/^use-cases\//, "");
  return [slug, { learnSlug, href, linkText, ...(alsoHref ? { alsoHref } : {}) }];
}

export const TRAINER_LED_SELF_SERVE: Record<string, SelfServeCta> = Object.fromEntries([
  ["ai-for-everyday-hr", { learnSlug: "ai-for-hr-and-people-teams", href: "/learn/ai-for-hr-and-people-teams", linkText: "Prefer to start on your own? Self-paced version, £99: AI for HR and People Teams" }],
  ["people-operations-workflow-automation", { learnSlug: "hr-operations-with-ai", href: "/learn/hr-operations-with-ai", linkText: "Prefer to start on your own? Self-paced course, £99: HR Operations with AI" }],
  ["digital-onboarding-and-employee-journeys", { learnSlug: "hr-operations-with-ai", href: "/learn/hr-operations-with-ai", linkText: "Prefer to start on your own? Self-paced course, £99: HR Operations with AI" }],
  ["hr-data-quality-and-connected-records", { learnSlug: "from-spreadsheets-to-simple-systems", href: "/learn/from-spreadsheets-to-simple-systems", linkText: "Prefer to start on your own? Self-paced course, £99: From Spreadsheets to Simple Systems" }],
  ["ai-assisted-recruitment-operations", { learnSlug: "hiring-and-selection-with-ai", href: "/learn/hiring-and-selection-with-ai", linkText: "Prefer to start on your own? Self-paced version, £129: Hiring and Selection with AI" }],
  ["hr-knowledge-and-employee-self-service", { learnSlug: "hr-operations-with-ai", href: "/learn/hr-operations-with-ai", linkText: "Prefer to start on your own? Self-paced course, £99: HR Operations with AI" }],
  ["people-analytics-for-hr-decisions", { learnSlug: "data-skills-for-people-who-are-not-analysts", href: "/learn/data-skills-for-people-who-are-not-analysts", linkText: "Prefer to start on your own? Self-paced course, £99: Data Skills for People Who Are Not Analysts" }],
  ["employee-listening-with-ai", { learnSlug: "ai-for-hr-and-people-teams", href: "/learn/ai-for-hr-and-people-teams", linkText: "Prefer to start on your own? Self-paced course, £99: AI for HR and People Teams" }],
  ["hris-selection-and-integration", { learnSlug: "choosing-technology-for-your-team", href: "/learn/choosing-technology-for-your-team", linkText: "Prefer to start on your own? Self-paced course, £129: Choosing Technology for Your Team" }],
  ["skills-mapping-and-workforce-planning", { learnSlug: "building-a-workforce-skills-plan", href: "/learn/building-a-workforce-skills-plan", linkText: "Prefer to start on your own? Self-paced version, £129: Building a Workforce Skills Plan" }],
  ["learning-operations-and-ai-enabled-development", { learnSlug: "redesigning-workplace-learning", href: "/learn/redesigning-workplace-learning", linkText: "Prefer to start on your own? Self-paced course, £129: Redesigning Workplace Learning" }],
  ["redesigning-hr-services-with-agents", { learnSlug: "designing-ai-agents-for-business-workflows", href: "/learn/designing-ai-agents-for-business-workflows", linkText: "Prefer to start on your own? Self-paced course, £129: Designing AI Agents for Business Workflows" }],
  ["hr-transformation-strategy-and-roadmap", { learnSlug: "building-a-workforce-skills-plan", href: "/learn/building-a-workforce-skills-plan", linkText: "Prefer to start on your own? Self-paced course, £129: Building a Workforce Skills Plan" }],
  ["responsible-ai-governance-for-hr", { learnSlug: "eu-ai-act-literacy-for-hr-and-l-and-d", href: "/learn/eu-ai-act-literacy-for-hr-and-l-and-d", linkText: "Prefer to start on your own? Self-paced course, £129: EU AI Act Literacy for HR and L&D" }],
  ["leading-people-change-in-an-ai-workplace", { learnSlug: "preparing-a-team-for-automation", href: "/learn/preparing-a-team-for-automation", linkText: "Prefer to start on your own? Self-paced course, £99: Preparing a Team for Automation" }],
  ["hr-technology-investment-and-value", { learnSlug: "technology-decisions-for-non-technical-leaders", href: "/learn/technology-decisions-for-non-technical-leaders", linkText: "Prefer to start on your own? Self-paced course, £149: Technology Decisions for Non-Technical Leaders" }],
  ["ai-foundations-for-every-role", { learnSlug: "applying-ai-in-daily-work", href: "/learn/applying-ai-in-daily-work", linkText: "Prefer to start on your own? Self-paced course, £99: Applying AI in Daily Work" }],
  ["prompting-and-output-verification", { learnSlug: "prompt-engineering-for-professional-work", href: "/learn/prompt-engineering-for-professional-work", linkText: "Prefer to start on your own? Self-paced version, £99: Prompt Engineering for Professional Work" }],
  ["embedding-ai-in-daily-workflows", { learnSlug: "applying-ai-in-daily-work", href: "/learn/applying-ai-in-daily-work", linkText: "Prefer to start on your own? Self-paced version, £99: Applying AI in Daily Work" }],
  ["ai-tooling-and-integration-clinic", { learnSlug: "connecting-the-tools-your-team-already-uses", href: "/learn/connecting-the-tools-your-team-already-uses", linkText: "Prefer to start on your own? Self-paced course, £129: Connecting the Tools Your Team Already Uses" }],
  ["leading-an-ai-ready-team", { learnSlug: "ai-adoption-for-line-managers", href: "/learn/ai-adoption-for-line-managers", linkText: "Prefer to start on your own? Self-paced version, £129: AI Adoption for Line Managers" }],
  ["ai-in-the-executive-workflow", { learnSlug: "technology-decisions-for-non-technical-leaders", href: "/learn/technology-decisions-for-non-technical-leaders", linkText: "Prefer to start on your own? Self-paced course, £149: Technology Decisions for Non-Technical Leaders" }],
  ["getting-value-from-tools-you-already-own", { learnSlug: "getting-value-from-the-technology-you-already-pay-for", href: "/learn/getting-value-from-the-technology-you-already-pay-for", linkText: "Prefer to start on your own? Self-paced version, £99: Getting Value from the Technology You Already Pay For" }],
  ["running-an-ai-champions-network", { learnSlug: "ai-adoption-for-line-managers", href: "/learn/ai-adoption-for-line-managers", linkText: "Prefer to start on your own? Self-paced course, £129: AI Adoption for Line Managers" }],
  ["working-alongside-a-cobot", { learnSlug: "collaborative-robots-at-work", href: "/learn/collaborative-robots-at-work", linkText: "Prefer to start on your own? Self-paced version, £99: Collaborative Robots at Work" }],
  ["running-and-troubleshooting-a-robotic-cell", { learnSlug: "running-a-robotic-cell", href: "/learn/running-a-robotic-cell", linkText: "Prefer to start on your own? Self-paced version, £129: Running a Robotic Cell" }],
  ["warehouse-and-logistics-automation-in-practice", { learnSlug: "warehouse-and-logistics-automation", href: "/learn/warehouse-and-logistics-automation", linkText: "Prefer to start on your own? Self-paced version, £129: Warehouse and Logistics Automation" }],
  ["vision-systems-and-automated-inspection", { learnSlug: "vision-systems-and-automated-inspection", href: "/learn/vision-systems-and-automated-inspection", linkText: "Prefer to start on your own? Self-paced version, £129: Vision Systems and Automated Inspection" }],
  ["robotics-what-it-can-and-cannot-do", { learnSlug: "robotics-for-non-engineers", href: "/learn/robotics-for-non-engineers", linkText: "Prefer to start on your own? Self-paced version, £99: Robotics for Non-Engineers" }],
  ["specifying-a-robotics-deployment", { learnSlug: "specifying-a-robotics-project", href: "/learn/specifying-a-robotics-project", linkText: "Prefer to start on your own? Self-paced version, £149: Specifying a Robotics Project" }],
  ["safety-risk-and-compliance-for-robotic-workcells", { learnSlug: "robotics-safety-and-risk", href: "/learn/robotics-safety-and-risk", linkText: "Prefer to start on your own? Self-paced version, £129: Robotics Safety and Risk" }],
  ["preparing-your-team-for-automation", { learnSlug: "preparing-a-team-for-automation", href: "/learn/preparing-a-team-for-automation", linkText: "Prefer to start on your own? Self-paced version, £99: Preparing a Team for Automation" }],
  ["robotics-investment-and-operating-model", { learnSlug: "robotics-investment-decisions", href: "/learn/robotics-investment-decisions", linkText: "Prefer to start on your own? Self-paced version, £149: Robotics Investment Decisions" }],
  ["ai-governance-and-oversight-for-managers", { learnSlug: "ai-literacy-under-the-eu-ai-act", href: "/learn/ai-literacy-under-the-eu-ai-act", linkText: "Prefer to start on your own? Self-paced course, £99: AI Literacy under the EU AI Act" }],
  ["responsible-ai-use-at-work", { learnSlug: "secure-use-of-ai-tools-at-work", href: "/learn/secure-use-of-ai-tools-at-work", linkText: "Prefer to start on your own? Self-paced course, £99: Secure Use of AI Tools at Work" }],
  ["ai-strategy-and-oversight-for-executives", { learnSlug: "technology-decisions-for-non-technical-leaders", href: "/learn/technology-decisions-for-non-technical-leaders", linkText: "Prefer to start on your own? Self-paced course, £149: Technology Decisions for Non-Technical Leaders" }],
  ["everyday-security-for-busy-teams", { learnSlug: "security-decisions-for-non-technical-teams", href: "/learn/security-decisions-for-non-technical-teams", linkText: "Prefer to start on your own? Self-paced version, £99: Security Decisions for Non-Technical Teams" }],
  ["ai-for-analysis-and-reporting", { learnSlug: "ai-assisted-analysis-and-reporting", href: "/learn/ai-assisted-analysis-and-reporting", linkText: "Prefer to start on your own? Self-paced version, £99: AI-Assisted Analysis and Reporting" }],
  ["ai-for-customer-facing-teams", { learnSlug: "ai-for-customer-communications", href: "/learn/ai-for-customer-communications", linkText: "Prefer to start on your own? Self-paced version, £99: AI for Customer Communications" }],
  ["writing-and-communicating-with-ai", { learnSlug: "ai-for-writing-and-communication", href: "/learn/ai-for-writing-and-communication", linkText: "Prefer to start on your own? Self-paced version, £99: AI for Writing and Communication" }],
  ["building-ai-assistants-for-your-team", { learnSlug: "setting-up-and-supervising-ai-agents", href: "/learn/setting-up-and-supervising-ai-agents", linkText: "Prefer to start on your own? Self-paced course, £179: Setting Up and Supervising AI Agents" }],
  ["sponsoring-an-ai-literacy-programme", { learnSlug: "ai-literacy-under-the-eu-ai-act", href: "/learn/ai-literacy-under-the-eu-ai-act", linkText: "Prefer to start on your own? Self-paced course, £99: AI Literacy under the EU AI Act" }],
  ["measuring-ai-adoption-and-value", { learnSlug: "measuring-whether-training-stuck", href: "/learn/measuring-whether-training-stuck", linkText: "Prefer to start on your own? Self-paced course, £99: Measuring Whether Training Stuck" }],
  ["data-you-can-actually-use", { learnSlug: "data-skills-for-people-who-are-not-analysts", href: "/learn/data-skills-for-people-who-are-not-analysts", linkText: "Prefer to start on your own? Self-paced version, £99: Data Skills for People Who Are Not Analysts" }],
  ["from-spreadsheets-to-systems", { learnSlug: "from-spreadsheets-to-simple-systems", href: "/learn/from-spreadsheets-to-simple-systems", linkText: "Prefer to start on your own? Self-paced version, £99: From Spreadsheets to Simple Systems" }],
  ["automating-the-work-nobody-wants", { learnSlug: "no-code-automation-for-everyday-work", href: "/learn/no-code-automation-for-everyday-work", linkText: "Prefer to start on your own? Self-paced version, £99: No-Code Automation for Everyday Work" }],
  ["technology-for-non-technical-leaders", { learnSlug: "technology-decisions-for-non-technical-leaders", href: "/learn/technology-decisions-for-non-technical-leaders", linkText: "Prefer to start on your own? Self-paced version, £149: Technology Decisions for Non-Technical Leaders" }],
  ["digital-change-without-the-theatre", { learnSlug: "digital-change-for-managers", href: "/learn/digital-change-for-managers", linkText: "Prefer to start on your own? Self-paced version, £129: Digital Change for Managers" }],
  ["choosing-technology-well", { learnSlug: "choosing-technology-for-your-team", href: "/learn/choosing-technology-for-your-team", linkText: "Prefer to start on your own? Self-paced version, £129: Choosing Technology for Your Team" }],
  ["running-a-rollout-that-sticks", { learnSlug: "running-a-technology-rollout", href: "/learn/running-a-technology-rollout", linkText: "Prefer to start on your own? Self-paced version, £129: Running a Technology Rollout" }],
]);

export const SECTOR_SELF_SERVE: Record<string, SelfServeCta> = {
  "financial-services": { learnSlug: "ai-assisted-analysis-and-reporting", href: "/learn/ai-assisted-analysis-and-reporting", linkText: "Prefer to start on your own? Self-paced course, £99: AI-Assisted Analysis and Reporting" },
  "healthcare": { learnSlug: "secure-use-of-ai-tools-at-work", href: "/learn/secure-use-of-ai-tools-at-work", linkText: "Prefer to start on your own? Self-paced course, £99: Secure Use of AI Tools at Work" },
  "manufacturing": { learnSlug: "robotics-for-non-engineers", href: "/learn/robotics-for-non-engineers", linkText: "Prefer to start on your own? Self-paced course, £99: Robotics for Non-Engineers" },
  "public-sector": { learnSlug: "ai-output-verification", href: "/learn/ai-output-verification", linkText: "Prefer to start on your own? Self-paced course, £99: AI Output Verification" },
  "professional-services": { learnSlug: "prompt-engineering-for-professional-work", href: "/learn/prompt-engineering-for-professional-work", linkText: "Prefer to start on your own? Self-paced course, £99: Prompt Engineering for Professional Work" },
  "retail": { learnSlug: "ai-for-customer-communications", href: "/learn/ai-for-customer-communications", linkText: "Prefer to start on your own? Self-paced course, £99: AI for Customer Communications" },
  "logistics": { learnSlug: "warehouse-and-logistics-automation", href: "/learn/warehouse-and-logistics-automation", linkText: "Prefer to start on your own? Self-paced course, £129: Warehouse and Logistics Automation" },
  "education": { learnSlug: "applying-ai-in-daily-work", href: "/learn/applying-ai-in-daily-work", linkText: "Prefer to start on your own? Self-paced course, £99: Applying AI in Daily Work" },
};

export const USE_CASE_SELF_SERVE: Record<string, SelfServeCta> = {
  "enterprise": { learnSlug: "ai-literacy-under-the-eu-ai-act", href: "/learn/ai-literacy-under-the-eu-ai-act", linkText: "Prefer to start on your own? Self-paced course, £99: AI Literacy under the EU AI Act", alsoHref: "/learn/eu-ai-act-article-4-training" },
  "growing-teams": { learnSlug: "applying-ai-in-daily-work", href: "/learn/applying-ai-in-daily-work", linkText: "Prefer to start on your own? Self-paced course, £99: Applying AI in Daily Work" },
  "finance": { learnSlug: "ai-assisted-analysis-and-reporting", href: "/learn/ai-assisted-analysis-and-reporting", linkText: "Prefer to start on your own? Self-paced course, £99: AI-Assisted Analysis and Reporting", alsoHref: "/learn/for/finance-teams" },
  "hr": { learnSlug: "ai-for-hr-and-people-teams", href: "/learn/ai-for-hr-and-people-teams", linkText: "Prefer to start on your own? Self-paced course, £99: AI for HR and People Teams", alsoHref: "/learn/for/hr-teams" },
  "operations": { learnSlug: "no-code-automation-for-everyday-work", href: "/learn/no-code-automation-for-everyday-work", linkText: "Prefer to start on your own? Self-paced course, £99: No-Code Automation for Everyday Work", alsoHref: "/learn/for/operations-teams" },
  "sales-and-marketing": { learnSlug: "ai-for-writing-and-communication", href: "/learn/ai-for-writing-and-communication", linkText: "Prefer to start on your own? Self-paced course, £99: AI for Writing and Communication" },
  "customer-support": { learnSlug: "ai-for-customer-communications", href: "/learn/ai-for-customer-communications", linkText: "Prefer to start on your own? Self-paced course, £99: AI for Customer Communications" },
};

