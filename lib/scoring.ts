import { DIMENSIONS, getTierForScore, type Dimension } from "./constants";
import type { AssessmentResponse, DimensionScores } from "./types";

export interface AssessmentQuestion {
  id: string;
  dimension: Dimension;
  text: string;
  description: string;
  options: { value: number; label: string }[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── Confidence & Skills (3 questions) ──
  {
    id: "conf_1",
    dimension: "confidence",
    text: "How comfortable are you using AI tools in your work?",
    description: "Think about how you feel when you sit down to use an AI tool.",
    options: [
      { value: 0, label: "I've never used one" },
      { value: 1, label: "I've tried but it feels unfamiliar" },
      { value: 2, label: "I can use them for simple tasks" },
      { value: 3, label: "I'm fairly comfortable and use them regularly" },
      { value: 4, label: "I'm confident and use them daily" },
      { value: 5, label: "I'm highly skilled and help others learn" },
    ],
  },
  {
    id: "conf_2",
    dimension: "confidence",
    text: "How confident are you at getting useful results from AI?",
    description: "Consider how often AI gives you something you can actually use.",
    options: [
      { value: 0, label: "I wouldn't know where to start" },
      { value: 1, label: "I get mixed results - mostly unusable" },
      { value: 2, label: "Sometimes useful, but I have to try several times" },
      { value: 3, label: "I usually get good results on the first or second try" },
      { value: 4, label: "I consistently get high-quality results" },
      { value: 5, label: "I've developed reliable techniques that work every time" },
    ],
  },
  {
    id: "conf_3",
    dimension: "confidence",
    text: "Can you tell when AI has given you something wrong or unreliable?",
    description: "Think about your ability to spot mistakes, hallucinations, or bias.",
    options: [
      { value: 0, label: "I wouldn't know how to check" },
      { value: 1, label: "I might catch obvious errors" },
      { value: 2, label: "I can spot most factual mistakes" },
      { value: 3, label: "I reliably check and verify AI output" },
      { value: 4, label: "I have a systematic approach to evaluating quality" },
      { value: 5, label: "I can identify subtle issues and help others do the same" },
    ],
  },

  // ── Daily Practice (3 questions) ──
  {
    id: "prac_1",
    dimension: "practice",
    text: "How often do you use AI tools as part of your work?",
    description: "Any AI tool - chatbots, writing assistants, image generators, copilots, etc.",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "I've tried once or twice" },
      { value: 2, label: "A few times a month" },
      { value: 3, label: "A few times a week" },
      { value: 4, label: "Daily" },
      { value: 5, label: "Multiple times a day - it's part of my routine" },
    ],
  },
  {
    id: "prac_2",
    dimension: "practice",
    text: "When you use AI, what best describes how?",
    description: "Think about the kinds of tasks you turn to AI for.",
    options: [
      { value: 0, label: "I don't use AI for work" },
      { value: 1, label: "Quick one-off questions or curiosity" },
      { value: 2, label: "Specific tasks like drafting emails or summarising" },
      { value: 3, label: "Integrated into several parts of my workflow" },
      { value: 4, label: "Central to how I approach most of my work" },
      { value: 5, label: "I've redesigned how I work around AI capabilities" },
    ],
  },
  {
    id: "prac_3",
    dimension: "practice",
    text: "Do you have go-to ways of using AI that you repeat regularly?",
    description: "Saved prompts, templates, standard workflows, or repeatable patterns.",
    options: [
      { value: 0, label: "No, I start from scratch each time" },
      { value: 1, label: "I vaguely remember what worked before" },
      { value: 2, label: "I have a couple of approaches I reuse" },
      { value: 3, label: "I've built a small library of prompts or workflows" },
      { value: 4, label: "I have well-documented processes I follow consistently" },
      { value: 5, label: "I've created templates and shared them with my team" },
    ],
  },

  // ── Tools & Access (3 questions) ──
  {
    id: "tool_1",
    dimension: "tools",
    text: "Which AI tools do you have access to through work?",
    description: "Consider what your organisation provides or allows you to use.",
    options: [
      { value: 0, label: "None - I don't have access to any AI tools" },
      { value: 1, label: "I use free public tools on my own" },
      { value: 2, label: "My company provides one AI tool" },
      { value: 3, label: "I have access to a few different AI tools" },
      { value: 4, label: "I have access to a good range of tools for different tasks" },
      { value: 5, label: "I have access to a comprehensive AI toolkit tailored to my role" },
    ],
  },
  {
    id: "tool_2",
    dimension: "tools",
    text: "Are the AI tools you use connected to your other work tools?",
    description: "Think about whether AI integrates with your email, docs, CRM, code editor, etc.",
    options: [
      { value: 0, label: "Not at all - I copy-paste between them" },
      { value: 1, label: "I manually move information back and forth" },
      { value: 2, label: "There are basic plug-ins or browser extensions" },
      { value: 3, label: "Some tools are connected (e.g. Copilot in my editor, AI in my email)" },
      { value: 4, label: "Most of my key tools have AI built in or connected" },
      { value: 5, label: "AI is deeply embedded across my toolchain with seamless data flow" },
    ],
  },
  {
    id: "tool_3",
    dimension: "tools",
    text: "If you wanted to try a new AI tool, how easy would that be?",
    description: "Consider approval processes, budgets, and IT restrictions.",
    options: [
      { value: 0, label: "I wouldn't know where to start or who to ask" },
      { value: 1, label: "It would be very difficult - strict restrictions" },
      { value: 2, label: "I'd need to go through a long approval process" },
      { value: 3, label: "I could request it and probably get approval" },
      { value: 4, label: "I have a budget or process that makes it straightforward" },
      { value: 5, label: "I'm encouraged to experiment and can try new tools easily" },
    ],
  },

  // ── Responsible Use (3 questions) ──
  {
    id: "resp_1",
    dimension: "responsible",
    text: "Are you aware of any guidelines about how to use AI safely at work?",
    description: "Policies, acceptable use rules, data handling dos and don'ts.",
    options: [
      { value: 0, label: "I'm not aware of any guidelines" },
      { value: 1, label: "I've heard there might be something but haven't seen it" },
      { value: 2, label: "I've seen a basic list of dos and don'ts" },
      { value: 3, label: "I know the guidelines and try to follow them" },
      { value: 4, label: "I follow clear, well-documented policies" },
      { value: 5, label: "I actively help shape and promote responsible AI use" },
    ],
  },
  {
    id: "resp_2",
    dimension: "responsible",
    text: "How careful are you about what information you share with AI tools?",
    description: "Think about personal data, confidential documents, and sensitive information.",
    options: [
      { value: 0, label: "I haven't thought about it" },
      { value: 1, label: "I'm generally cautious but not systematic" },
      { value: 2, label: "I avoid sharing obviously sensitive information" },
      { value: 3, label: "I actively check what I'm sharing before using AI" },
      { value: 4, label: "I follow a clear data classification process" },
      { value: 5, label: "I use approved tools with built-in data protections" },
    ],
  },
  {
    id: "resp_3",
    dimension: "responsible",
    text: "Do you know what to do if AI produces something harmful or wrong?",
    description: "Incorrect advice, biased output, or something that could cause problems.",
    options: [
      { value: 0, label: "I wouldn't know what to do" },
      { value: 1, label: "I'd probably just ignore it and move on" },
      { value: 2, label: "I'd flag it to my manager" },
      { value: 3, label: "I know there's a process and would follow it" },
      { value: 4, label: "I have a clear escalation path with defined steps" },
      { value: 5, label: "I actively report issues and contribute to improving safeguards" },
    ],
  },

  // ── Culture & Support (3 questions) ──
  {
    id: "cult_1",
    dimension: "culture",
    text: "Does your team openly talk about how they use AI?",
    description: "Sharing tips, discussing use cases, learning from each other.",
    options: [
      { value: 0, label: "Nobody talks about AI" },
      { value: 1, label: "A few people mention it occasionally" },
      { value: 2, label: "Some informal sharing happens" },
      { value: 3, label: "We regularly share tips and use cases" },
      { value: 4, label: "We have dedicated channels or sessions for AI knowledge sharing" },
      { value: 5, label: "AI is a core part of our team conversations and ways of working" },
    ],
  },
  {
    id: "cult_2",
    dimension: "culture",
    text: "Do you feel encouraged to experiment with AI in your role?",
    description: "Consider whether your team and leadership support trying new things.",
    options: [
      { value: 0, label: "No - AI use is discouraged or not discussed" },
      { value: 1, label: "It's tolerated but not encouraged" },
      { value: 2, label: "It's accepted but I'm mostly on my own" },
      { value: 3, label: "I'm encouraged to try things out" },
      { value: 4, label: "There's active support with time and resources to experiment" },
      { value: 5, label: "Experimentation is celebrated and built into our culture" },
    ],
  },
  {
    id: "cult_3",
    dimension: "culture",
    text: "Is there someone you can go to for help with AI?",
    description: "A champion, mentor, team lead, or support resource.",
    options: [
      { value: 0, label: "No - I'm completely on my own" },
      { value: 1, label: "I can ask around but there's no clear person" },
      { value: 2, label: "I know someone informally who's helpful" },
      { value: 3, label: "There are identified AI champions or go-to people" },
      { value: 4, label: "There's structured support - training, office hours, or a team" },
      { value: 5, label: "There's a dedicated AI support function with resources and guidance" },
    ],
  },
];

export function calculateDimensionScores(
  answers: Record<string, number>,
  questions: AssessmentQuestion[] = ASSESSMENT_QUESTIONS,
): DimensionScores {
  const scores: DimensionScores = { confidence: 0, practice: 0, tools: 0, responsible: 0, culture: 0 };

  for (const dim of DIMENSIONS) {
    const dimQuestions = questions.filter((q) => q.dimension === dim);
    const dimAnswers = dimQuestions.map((q) => answers[q.id] ?? 0);
    const sum = dimAnswers.reduce((a, b) => a + b, 0);
    scores[dim] = dimQuestions.length > 0 ? Number((sum / dimQuestions.length).toFixed(2)) : 0;
  }

  return scores;
}

export function calculateOverallScore(scores: DimensionScores): number {
  const values = Object.values(scores);
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
}

export function aggregateDepartmentScores(responses: AssessmentResponse[]): DimensionScores {
  if (responses.length === 0) {
    return { confidence: 0, practice: 0, tools: 0, responsible: 0, culture: 0 };
  }
  const sum: DimensionScores = { confidence: 0, practice: 0, tools: 0, responsible: 0, culture: 0 };
  for (const r of responses) {
    sum.confidence += r.confidence_score;
    sum.practice += r.practice_score;
    sum.tools += r.tools_score;
    sum.responsible += r.responsible_score;
    sum.culture += r.culture_score;
  }
  const n = responses.length;
  return {
    confidence: Number((sum.confidence / n).toFixed(2)),
    practice: Number((sum.practice / n).toFixed(2)),
    tools: Number((sum.tools / n).toFixed(2)),
    responsible: Number((sum.responsible / n).toFixed(2)),
    culture: Number((sum.culture / n).toFixed(2)),
  };
}

export function getRiskAreas(scores: DimensionScores): { dimension: Dimension; score: number; severity: string }[] {
  return DIMENSIONS
    .filter((dim) => scores[dim] < 2)
    .map((dim) => ({
      dimension: dim,
      score: scores[dim],
      severity: scores[dim] < 1 ? "critical" : "warning",
    }));
}

export function getAutomationOpportunities(
  departmentScores: { department: string; scores: DimensionScores }[]
) {
  return departmentScores.map((d) => ({
    department: d.department,
    toolsReadiness: d.scores.tools,
    practiceLevel: (d.scores.confidence + d.scores.practice) / 2,
    tier: getTierForScore(calculateOverallScore(d.scores)),
  }));
}
