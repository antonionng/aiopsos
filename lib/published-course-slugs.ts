/**
 * Published catalogue slugs seeded in migrations 020 and 024.
 *
 * The sitemap uses these when Supabase is unreachable so a missing database
 * cannot 500 the crawl file. Live fetches still win when they return rows.
 */
export const FALLBACK_PUBLISHED_COURSE_SLUGS = [
  "ai-foundations-for-every-role",
  "prompting-and-output-verification",
  "embedding-ai-in-daily-workflows",
  "ai-tooling-and-integration-clinic",
  "responsible-ai-use-at-work",
  "leading-an-ai-ready-team",
  "ai-governance-and-oversight-for-managers",
  "ai-strategy-and-oversight-for-executives",
  "ai-in-the-executive-workflow",
  "sponsoring-an-ai-literacy-programme",
  "getting-value-from-tools-you-already-own",
  "automating-the-work-nobody-wants",
  "data-you-can-actually-use",
  "choosing-technology-well",
  "running-a-rollout-that-sticks",
  "technology-for-non-technical-leaders",
  "robotics-what-it-can-and-cannot-do",
  "working-alongside-a-cobot",
  "running-and-troubleshooting-a-robotic-cell",
  "warehouse-and-logistics-automation-in-practice",
  "specifying-a-robotics-deployment",
  "safety-risk-and-compliance-for-robotic-workcells",
  "robotics-investment-and-operating-model",
] as const;

export const COURSE_TITLES: Record<string, string> = {
  "ai-foundations-for-every-role": "AI Foundations for Every Role",
  "prompting-and-output-verification": "Prompting and Output Verification",
  "embedding-ai-in-daily-workflows": "Embedding AI in Daily Workflows",
  "ai-tooling-and-integration-clinic": "AI Tooling and Integration Clinic",
  "responsible-ai-use-at-work": "Responsible AI Use at Work",
  "leading-an-ai-ready-team": "Leading an AI-Ready Team",
  "ai-governance-and-oversight-for-managers":
    "AI Governance and Oversight for Managers",
  "ai-strategy-and-oversight-for-executives":
    "AI Strategy and Oversight for Executives",
  "ai-in-the-executive-workflow": "AI in the Executive Workflow",
  "sponsoring-an-ai-literacy-programme": "Sponsoring an AI Literacy Programme",
  "getting-value-from-tools-you-already-own":
    "Getting Value From the Tools You Already Own",
  "automating-the-work-nobody-wants": "Automating the Work Nobody Wants",
  "data-you-can-actually-use": "Data You Can Actually Use",
  "choosing-technology-well": "Choosing Technology Well",
  "running-a-rollout-that-sticks": "Running a Rollout That Sticks",
  "technology-for-non-technical-leaders":
    "Technology for Non-Technical Leaders",
  "robotics-what-it-can-and-cannot-do": "Robotics: What It Can and Cannot Do",
  "working-alongside-a-cobot": "Working Alongside a Cobot",
  "running-and-troubleshooting-a-robotic-cell":
    "Running and Troubleshooting a Robotic Cell",
  "warehouse-and-logistics-automation-in-practice":
    "Warehouse and Logistics Automation in Practice",
  "specifying-a-robotics-deployment": "Specifying a Robotics Deployment",
  "safety-risk-and-compliance-for-robotic-workcells":
    "Safety, Risk and Compliance for Robotic Workcells",
  "robotics-investment-and-operating-model":
    "Robotics Investment and the Operating Model",
};
