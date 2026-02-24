import type { DimensionScores } from "./types";
import type { RoadmapPhase, RoadmapMilestone } from "./types";
import { getTierForScore } from "./constants";

interface RoadmapInput {
  orgName: string;
  overallScore: number;
  dimensionScores: DimensionScores;
  departmentCount: number;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function generateRoadmap(input: RoadmapInput): RoadmapPhase[] {
  const tier = getTierForScore(input.overallScore);
  const responsibleGap = input.dimensionScores.responsible < 2;
  const toolsReady = input.dimensionScores.tools >= 3;

  const phase1: RoadmapPhase = {
    phase: 1,
    title: "Foundation",
    days: "Days 1–30",
    objectives: [
      "Standardise AI tool access across all departments",
      "Define and publish AI governance framework",
      "Establish AI usage policy and acceptable use guidelines",
      `Train ${input.departmentCount} departments with role-specific sessions`,
      "Identify and onboard internal AI champions",
    ],
    deliverables: [
      "AI Policy & Risk Framework document",
      `${input.departmentCount} role-based training sessions delivered`,
      "Prompt playbooks for each department",
      "Usage guidelines and model routing architecture",
      "Baseline usage metrics established",
    ],
    milestones: [
      { id: generateId(), title: "AI usage policy published", day: 5, completed: false },
      { id: generateId(), title: "Tool access standardised", day: 10, completed: false },
      { id: generateId(), title: "First training cohort completed", day: 15, completed: false },
      { id: generateId(), title: "Prompt playbooks distributed", day: 20, completed: false },
      { id: generateId(), title: "AI champions identified and briefed", day: 25, completed: false },
      { id: generateId(), title: "Baseline metrics captured", day: 30, completed: false },
    ],
  };

  if (responsibleGap) {
    phase1.objectives.push("Address responsible use gaps (score below 2.0)");
    phase1.deliverables.push("AI guidelines and responsible use remediation plan");
    phase1.milestones.push({
      id: generateId(),
      title: "Responsible use gap assessment complete",
      day: 7,
      completed: false,
    });
  }

  const phase2: RoadmapPhase = {
    phase: 2,
    title: "Workflow Embedding",
    days: "Days 30–60",
    objectives: [
      "Embed AI into 3–5 core departmental workflows",
      "Measure productivity impact with before/after metrics",
      "Reduce redundant manual work through AI assistance",
      "Establish quality control processes for AI outputs",
    ],
    deliverables: [
      "Workflow automation design documents",
      "Internal AI champions working group active",
      "Cost and token tracking dashboard operational",
      "3–5 integration pilots running",
      "ROI measurement framework with initial data",
    ],
    milestones: [
      { id: generateId(), title: "Top 5 workflows identified for AI embedding", day: 35, completed: false },
      { id: generateId(), title: "First workflow pilot launched", day: 40, completed: false },
      { id: generateId(), title: "Champions group first session held", day: 42, completed: false },
      { id: generateId(), title: "Token tracking dashboard live", day: 45, completed: false },
      { id: generateId(), title: "3 workflow pilots operational", day: 50, completed: false },
      { id: generateId(), title: "First ROI measurement captured", day: 55, completed: false },
      { id: generateId(), title: "Phase 2 review with leadership", day: 60, completed: false },
    ],
  };

  const phase3: RoadmapPhase = {
    phase: 3,
    title: toolsReady ? "Automation & Agent Scaling" : "Automation & Agent Pilot",
    days: "Days 60–90",
    objectives: [
      toolsReady
        ? "Scale 2–3 automation workflows to production"
        : "Identify 1–2 automation candidates for pilot",
      "Test limited agentic workflows with human oversight",
      "Formalise governance escalation model",
      "Create long-term AI roadmap (12-month strategy)",
    ],
    deliverables: [
      toolsReady ? "Production agent workflows" : "Agent pilot design document",
      "Automation risk matrix",
      "Model usage governance review report",
      "12-month AI strategy plan",
      "Executive strategy presentation deck",
    ],
    milestones: [
      { id: generateId(), title: "Automation candidates assessed", day: 65, completed: false },
      { id: generateId(), title: "Agent pilot architecture designed", day: 70, completed: false },
      { id: generateId(), title: "Pilot agent workflow running", day: 75, completed: false },
      { id: generateId(), title: "Governance escalation model documented", day: 78, completed: false },
      { id: generateId(), title: "Full ROI analysis complete", day: 82, completed: false },
      { id: generateId(), title: "12-month strategy drafted", day: 85, completed: false },
      { id: generateId(), title: "Executive strategy presentation delivered", day: 90, completed: false },
    ],
  };

  return [phase1, phase2, phase3];
}
