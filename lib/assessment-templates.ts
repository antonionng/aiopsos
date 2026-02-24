import type { AssessmentQuestion } from "./scoring";

export interface AssessmentTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  questions: AssessmentQuestion[];
}

const SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Minimally" },
  { value: 2, label: "Somewhat" },
  { value: 3, label: "Moderately" },
  { value: 4, label: "Significantly" },
  { value: 5, label: "Fully" },
];

function opts(labels: string[]) {
  return labels.map((label, i) => ({ value: i, label }));
}

// ─── Org-Wide (default — migrated from scoring.ts) ────────────────────

const ORG_WIDE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "conf_1", dimension: "confidence",
    text: "How comfortable are you using AI tools in your work?",
    description: "Think about how you feel when you sit down to use an AI tool.",
    options: opts(["I've never used one", "I've tried but it feels unfamiliar", "I can use them for simple tasks", "I'm fairly comfortable and use them regularly", "I'm confident and use them daily", "I'm highly skilled and help others learn"]),
  },
  {
    id: "conf_2", dimension: "confidence",
    text: "How confident are you at getting useful results from AI?",
    description: "Consider how often AI gives you something you can actually use.",
    options: opts(["I wouldn't know where to start", "I get mixed results — mostly unusable", "Sometimes useful, but I have to try several times", "I usually get good results on the first or second try", "I consistently get high-quality results", "I've developed reliable techniques that work every time"]),
  },
  {
    id: "conf_3", dimension: "confidence",
    text: "Can you tell when AI has given you something wrong or unreliable?",
    description: "Think about your ability to spot mistakes, hallucinations, or bias.",
    options: opts(["I wouldn't know how to check", "I might catch obvious errors", "I can spot most factual mistakes", "I reliably check and verify AI output", "I have a systematic approach to evaluating quality", "I can identify subtle issues and help others do the same"]),
  },
  {
    id: "prac_1", dimension: "practice",
    text: "How often do you use AI tools as part of your work?",
    description: "Any AI tool — chatbots, writing assistants, image generators, copilots, etc.",
    options: opts(["Never", "I've tried once or twice", "A few times a month", "A few times a week", "Daily", "Multiple times a day — it's part of my routine"]),
  },
  {
    id: "prac_2", dimension: "practice",
    text: "When you use AI, what best describes how?",
    description: "Think about the kinds of tasks you turn to AI for.",
    options: opts(["I don't use AI for work", "Quick one-off questions or curiosity", "Specific tasks like drafting emails or summarising", "Integrated into several parts of my workflow", "Central to how I approach most of my work", "I've redesigned how I work around AI capabilities"]),
  },
  {
    id: "prac_3", dimension: "practice",
    text: "Do you have go-to ways of using AI that you repeat regularly?",
    description: "Saved prompts, templates, standard workflows, or repeatable patterns.",
    options: opts(["No, I start from scratch each time", "I vaguely remember what worked before", "I have a couple of approaches I reuse", "I've built a small library of prompts or workflows", "I have well-documented processes I follow consistently", "I've created templates and shared them with my team"]),
  },
  {
    id: "tool_1", dimension: "tools",
    text: "Which AI tools do you have access to through work?",
    description: "Consider what your organisation provides or allows you to use.",
    options: opts(["None — I don't have access to any AI tools", "I use free public tools on my own", "My company provides one AI tool", "I have access to a few different AI tools", "I have access to a good range of tools for different tasks", "I have access to a comprehensive AI toolkit tailored to my role"]),
  },
  {
    id: "tool_2", dimension: "tools",
    text: "Are the AI tools you use connected to your other work tools?",
    description: "Think about whether AI integrates with your email, docs, CRM, code editor, etc.",
    options: opts(["Not at all — I copy-paste between them", "I manually move information back and forth", "There are basic plug-ins or browser extensions", "Some tools are connected (e.g. Copilot in my editor, AI in my email)", "Most of my key tools have AI built in or connected", "AI is deeply embedded across my toolchain with seamless data flow"]),
  },
  {
    id: "tool_3", dimension: "tools",
    text: "If you wanted to try a new AI tool, how easy would that be?",
    description: "Consider approval processes, budgets, and IT restrictions.",
    options: opts(["I wouldn't know where to start or who to ask", "It would be very difficult — strict restrictions", "I'd need to go through a long approval process", "I could request it and probably get approval", "I have a budget or process that makes it straightforward", "I'm encouraged to experiment and can try new tools easily"]),
  },
  {
    id: "resp_1", dimension: "responsible",
    text: "Are you aware of any guidelines about how to use AI safely at work?",
    description: "Policies, acceptable use rules, data handling dos and don'ts.",
    options: opts(["I'm not aware of any guidelines", "I've heard there might be something but haven't seen it", "I've seen a basic list of dos and don'ts", "I know the guidelines and try to follow them", "I follow clear, well-documented policies", "I actively help shape and promote responsible AI use"]),
  },
  {
    id: "resp_2", dimension: "responsible",
    text: "How careful are you about what information you share with AI tools?",
    description: "Think about personal data, confidential documents, and sensitive information.",
    options: opts(["I haven't thought about it", "I'm generally cautious but not systematic", "I avoid sharing obviously sensitive information", "I actively check what I'm sharing before using AI", "I follow a clear data classification process", "I use approved tools with built-in data protections"]),
  },
  {
    id: "resp_3", dimension: "responsible",
    text: "Do you know what to do if AI produces something harmful or wrong?",
    description: "Incorrect advice, biased output, or something that could cause problems.",
    options: opts(["I wouldn't know what to do", "I'd probably just ignore it and move on", "I'd flag it to my manager", "I know there's a process and would follow it", "I have a clear escalation path with defined steps", "I actively report issues and contribute to improving safeguards"]),
  },
  {
    id: "cult_1", dimension: "culture",
    text: "Does your team openly talk about how they use AI?",
    description: "Sharing tips, discussing use cases, learning from each other.",
    options: opts(["Nobody talks about AI", "A few people mention it occasionally", "Some informal sharing happens", "We regularly share tips and use cases", "We have dedicated channels or sessions for AI knowledge sharing", "AI is a core part of our team conversations and ways of working"]),
  },
  {
    id: "cult_2", dimension: "culture",
    text: "Do you feel encouraged to experiment with AI in your role?",
    description: "Consider whether your team and leadership support trying new things.",
    options: opts(["No — AI use is discouraged or not discussed", "It's tolerated but not encouraged", "It's accepted but I'm mostly on my own", "I'm encouraged to try things out", "There's active support with time and resources to experiment", "Experimentation is celebrated and built into our culture"]),
  },
  {
    id: "cult_3", dimension: "culture",
    text: "Is there someone you can go to for help with AI?",
    description: "A champion, mentor, team lead, or support resource.",
    options: opts(["No — I'm completely on my own", "I can ask around but there's no clear person", "I know someone informally who's helpful", "There are identified AI champions or go-to people", "There's structured support — training, office hours, or a team", "There's a dedicated AI support function with resources and guidance"]),
  },
];

// ─── Engineering ──────────────────────────────────────────────────────

const ENGINEERING_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "eng_conf_1", dimension: "confidence",
    text: "How confident are you using AI coding assistants (Copilot, Cursor, etc.)?",
    description: "Think about AI code-completion, generation, and refactoring tools.",
    options: opts(["I've never used one", "I've tried but the suggestions feel random", "I can use them for boilerplate and simple functions", "I regularly accept AI suggestions and they speed me up", "AI assistants are integral to my coding workflow", "I tune AI assistants with custom context and help my team adopt them"]),
  },
  {
    id: "eng_conf_2", dimension: "confidence",
    text: "Can you effectively prompt AI to debug or explain complex code?",
    description: "Consider using AI for stack traces, logic errors, or architecture questions.",
    options: opts(["I wouldn't know how to start", "I've tried but rarely get useful answers", "It helps with simple bugs but not complex ones", "I can usually get useful debugging help from AI", "I systematically use AI for code review and debugging", "I've built custom debugging workflows and shared them with the team"]),
  },
  {
    id: "eng_conf_3", dimension: "confidence",
    text: "How well can you evaluate whether AI-generated code is production-ready?",
    description: "Think about security, performance, edge cases, and maintainability.",
    options: opts(["I wouldn't know what to check", "I can spot obvious syntax issues", "I review for basic correctness and logic", "I check for security, performance, and edge cases", "I have a systematic review process for AI-generated code", "I've defined team standards for evaluating and accepting AI code"]),
  },
  {
    id: "eng_prac_1", dimension: "practice",
    text: "How often do you use AI tools during development?",
    description: "Code completion, test generation, documentation, PR reviews, etc.",
    options: opts(["Never", "I've experimented a couple of times", "A few times a month for specific tasks", "Several times a week as part of my workflow", "Daily — AI is part of my development loop", "Continuously — AI is embedded in every stage of my workflow"]),
  },
  {
    id: "eng_prac_2", dimension: "practice",
    text: "Do you use AI to generate tests, documentation, or commit messages?",
    description: "Think beyond code completion to broader development tasks.",
    options: opts(["No, I do everything manually", "I've tried once or twice", "I occasionally use it for docs or tests", "I regularly generate tests and docs with AI", "AI handles most boilerplate — tests, docs, PRs, changelogs", "I've automated AI into our CI/CD pipeline for these tasks"]),
  },
  {
    id: "eng_prac_3", dimension: "practice",
    text: "Have you built repeatable AI-assisted development workflows?",
    description: "Saved prompts for PRs, code patterns, architecture decisions, etc.",
    options: opts(["No, I start fresh each time", "I remember what worked but nothing formal", "I have a few saved prompts or snippets", "I have documented workflows for common dev tasks", "I've built templates the team uses", "Our team has a shared AI playbook integrated into our dev process"]),
  },
  {
    id: "eng_tool_1", dimension: "tools",
    text: "What AI development tools does your team have access to?",
    description: "Copilot, Cursor, Claude, code review bots, AI testing tools, etc.",
    options: opts(["None — no AI tools available", "Free-tier tools used individually", "One licensed AI tool for the team", "A few AI tools for different development tasks", "A comprehensive AI-assisted development stack", "A fully integrated AI toolkit customised for our codebase and workflows"]),
  },
  {
    id: "eng_tool_2", dimension: "tools",
    text: "Is AI integrated into your CI/CD pipeline or development infrastructure?",
    description: "Automated code review, test generation, security scanning, deployment.",
    options: opts(["Not at all", "We've discussed it but haven't started", "Basic AI linting or formatting in place", "AI-powered code review or test generation in CI", "Multiple AI integrations across our pipeline", "AI is deeply embedded — from PR review to deployment monitoring"]),
  },
  {
    id: "eng_tool_3", dimension: "tools",
    text: "How easy is it for engineers to try new AI tools or models?",
    description: "Consider procurement, security review, and experimentation culture.",
    options: opts(["Extremely difficult — strict lockdown", "Very difficult — long approval cycles", "Possible but requires significant effort", "Reasonably straightforward with some process", "Easy — we have sandbox environments and budget", "Encouraged — we have dedicated time and infrastructure for experimentation"]),
  },
  {
    id: "eng_resp_1", dimension: "responsible",
    text: "Does your team have guidelines for using AI with proprietary code?",
    description: "Data handling, IP concerns, which code can be shared with AI services.",
    options: opts(["No guidelines exist", "There might be something but I haven't seen it", "Basic rules about not sharing secrets", "Clear guidelines on what code can go through AI", "Comprehensive policy with data classification", "We use self-hosted or approved models with audit trails"]),
  },
  {
    id: "eng_resp_2", dimension: "responsible",
    text: "Do you review AI-generated code for security vulnerabilities?",
    description: "Injection risks, dependency issues, authentication flaws, etc.",
    options: opts(["I haven't thought about it", "I do a quick glance", "I check for obvious security issues", "I run it through our standard security review", "We have automated security scanning for AI-generated code", "We have a formal AI code security framework with team training"]),
  },
  {
    id: "eng_resp_3", dimension: "responsible",
    text: "Is there a process for handling AI-introduced bugs or incidents?",
    description: "Tracking, root cause analysis, and learning from AI-related failures.",
    options: opts(["No process exists", "We'd handle it like any other bug", "We'd flag it but no formal process", "We tag AI-related incidents for tracking", "We have a formal process including root cause analysis", "We systematically learn from AI incidents and feed back into our guidelines"]),
  },
  {
    id: "eng_cult_1", dimension: "culture",
    text: "Does your engineering team share AI-assisted development techniques?",
    description: "Demos, Slack channels, pair programming with AI, lunch-and-learns.",
    options: opts(["Nobody discusses AI tools", "A few individuals mention it casually", "Some informal knowledge sharing happens", "We regularly share tips and prompts", "We have dedicated sessions and channels for AI practices", "AI-assisted development is a core part of our engineering culture"]),
  },
  {
    id: "eng_cult_2", dimension: "culture",
    text: "Is there engineering leadership support for AI adoption?",
    description: "Budget, time allocation, strategic direction from tech leads or CTOs.",
    options: opts(["No support or interest from leadership", "Leadership is aware but hasn't acted", "There's verbal support but no resources", "Leadership has allocated some budget and time", "Strong leadership support with clear strategy", "AI adoption is a key engineering OKR with dedicated investment"]),
  },
  {
    id: "eng_cult_3", dimension: "culture",
    text: "Are there AI champions or specialists in your engineering org?",
    description: "People who help others adopt AI tools and best practices.",
    options: opts(["No — everyone is on their own", "A few enthusiasts but no formal role", "One or two go-to people informally", "Identified AI champions across teams", "Dedicated role or working group for AI adoption", "An AI platform team supporting the entire engineering organisation"]),
  },
];

// ─── Sales ────────────────────────────────────────────────────────────

const SALES_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "sales_conf_1", dimension: "confidence",
    text: "How confident are you using AI to research prospects and companies?",
    description: "Think about using AI to summarise accounts, find insights, and prepare for calls.",
    options: opts(["I've never tried it", "I've experimented but it wasn't helpful", "I can get basic summaries and insights", "I regularly use AI for account research", "AI research is a key part of my prospecting workflow", "I've built systematic AI research processes that the team follows"]),
  },
  {
    id: "sales_conf_2", dimension: "confidence",
    text: "Can you use AI to draft personalised outreach and proposals?",
    description: "Cold emails, follow-ups, proposals, and pitch decks.",
    options: opts(["I wouldn't know how", "I've tried but the output felt generic", "I can generate basic drafts that need heavy editing", "AI produces good first drafts that I can refine quickly", "I consistently get high-quality, personalised content from AI", "I've developed proven AI workflows for different outreach scenarios"]),
  },
  {
    id: "sales_conf_3", dimension: "confidence",
    text: "Can you spot when AI-generated sales content misses the mark?",
    description: "Wrong tone, inaccurate claims, pricing errors, or off-brand messaging.",
    options: opts(["I wouldn't know what to look for", "I might catch obvious mistakes", "I check for factual accuracy and tone", "I reliably catch issues before sending", "I have a systematic review process for AI sales content", "I've trained others on evaluating AI-generated sales materials"]),
  },
  {
    id: "sales_prac_1", dimension: "practice",
    text: "How often do you use AI in your sales workflow?",
    description: "Prospecting, email drafting, call prep, deal analysis, forecasting, etc.",
    options: opts(["Never", "I've tried once or twice", "A few times a month", "Several times a week", "Daily — it's part of my routine", "Continuously — AI supports every stage of my sales process"]),
  },
  {
    id: "sales_prac_2", dimension: "practice",
    text: "Do you use AI to analyse deals, calls, or pipeline data?",
    description: "Call summaries, deal scoring, competitive intel, forecast insights.",
    options: opts(["No, all analysis is manual", "I've experimented but not regularly", "I use it occasionally for call summaries", "I regularly use AI for deal and call analysis", "AI analysis is central to my deal strategy", "I've built AI-powered analytics workflows the team uses"]),
  },
  {
    id: "sales_prac_3", dimension: "practice",
    text: "Have you built repeatable AI-assisted sales workflows?",
    description: "Templates for prospecting sequences, proposal generation, objection handling.",
    options: opts(["No, I start from scratch", "I informally remember what worked", "I have a few saved prompts", "I've documented AI workflows for key sales activities", "I have comprehensive playbooks the team follows", "Our sales process is systematically AI-enhanced end to end"]),
  },
  {
    id: "sales_tool_1", dimension: "tools",
    text: "What AI sales tools does your team have access to?",
    description: "AI in CRM, prospecting tools, conversation intelligence, content assistants.",
    options: opts(["None — no AI tools", "Free tools used individually", "One AI tool (e.g., basic CRM AI)", "A few AI tools for different sales activities", "A comprehensive AI-enabled sales stack", "A fully integrated AI toolkit across CRM, outreach, and analytics"]),
  },
  {
    id: "sales_tool_2", dimension: "tools",
    text: "Is AI integrated into your CRM and sales processes?",
    description: "Automated data entry, next-best-action, lead scoring, email tracking.",
    options: opts(["No AI in our CRM", "Basic AI features we don't really use", "Some AI features (e.g., auto-logging)", "AI lead scoring or recommendations active", "AI deeply integrated across our sales stack", "AI orchestrates our entire sales workflow from lead to close"]),
  },
  {
    id: "sales_tool_3", dimension: "tools",
    text: "How easy is it for sales reps to try new AI tools?",
    description: "Procurement, approval, training, and adoption support.",
    options: opts(["Impossible — strict controls", "Very difficult", "Possible but cumbersome", "Manageable with some approval", "Easy — we have budget and sandbox access", "Encouraged — there's dedicated support for experimenting"]),
  },
  {
    id: "sales_resp_1", dimension: "responsible",
    text: "Are there guidelines for AI use with customer and prospect data?",
    description: "CRM data, call recordings, email content, personal information.",
    options: opts(["No guidelines", "I've heard something but haven't seen it", "Basic rules about customer data", "Clear policies on what data can go through AI", "Comprehensive data handling framework", "Approved AI tools with built-in compliance and audit trails"]),
  },
  {
    id: "sales_resp_2", dimension: "responsible",
    text: "Do you verify AI-generated claims before sharing with prospects?",
    description: "Pricing accuracy, product capabilities, competitive comparisons.",
    options: opts(["I haven't thought about it", "I do a quick read-through", "I check key facts and figures", "I systematically verify all claims before sending", "I have a review checklist for AI-generated sales content", "Our team has a formal approval process for AI-generated materials"]),
  },
  {
    id: "sales_resp_3", dimension: "responsible",
    text: "Do you know how to handle it if AI sends something incorrect to a prospect?",
    description: "Wrong pricing, inaccurate product info, or inappropriate content.",
    options: opts(["I wouldn't know what to do", "I'd correct it informally", "I'd flag it to my manager", "There's a process I'd follow", "We have a formal escalation and correction process", "We have systematic error tracking and continuous improvement"]),
  },
  {
    id: "sales_cult_1", dimension: "culture",
    text: "Does your sales team share AI tips and success stories?",
    description: "Team meetings, Slack channels, win stories involving AI.",
    options: opts(["Nobody talks about AI", "Occasional mentions", "Some informal sharing", "Regular sharing of AI techniques", "Dedicated channels and sessions", "AI is a core part of our sales culture and enablement"]),
  },
  {
    id: "sales_cult_2", dimension: "culture",
    text: "Does sales leadership encourage AI adoption?",
    description: "Budget, training, recognition, strategic direction.",
    options: opts(["No interest from leadership", "Aware but no action", "Verbal support only", "Some budget and time allocated", "Strong support with clear strategy", "AI adoption is a key sales OKR with dedicated investment"]),
  },
  {
    id: "sales_cult_3", dimension: "culture",
    text: "Is there someone in sales you can go to for AI help?",
    description: "Sales enablement, AI champion, tech-savvy colleague.",
    options: opts(["No — completely on my own", "I can ask around informally", "One or two helpful people", "Identified AI champions in sales", "Sales enablement covers AI tools and techniques", "Dedicated AI support for the sales organisation"]),
  },
];

// ─── Marketing ────────────────────────────────────────────────────────

const MARKETING_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "mkt_conf_1", dimension: "confidence",
    text: "How confident are you using AI for content creation?",
    description: "Blog posts, social media, ad copy, email campaigns, creative briefs.",
    options: opts(["I've never tried", "I've experimented but the output was poor", "I can generate basic drafts", "I regularly get useful content from AI", "AI is central to my content workflow", "I've developed advanced AI content techniques and trained others"]),
  },
  {
    id: "mkt_conf_2", dimension: "confidence",
    text: "Can you use AI to analyse campaign performance and audience data?",
    description: "Summarising analytics, identifying trends, audience segmentation.",
    options: opts(["I wouldn't know how", "I've tried but couldn't get useful insights", "I can get basic summaries", "I regularly use AI for marketing analytics", "AI analysis shapes my campaign strategy", "I've built AI-powered analytics dashboards and processes"]),
  },
  {
    id: "mkt_conf_3", dimension: "confidence",
    text: "Can you maintain brand voice and accuracy in AI-generated content?",
    description: "Ensuring AI content matches your brand guidelines and is factually correct.",
    options: opts(["I haven't thought about it", "I struggle to get AI to match our voice", "I can make basic brand adjustments", "I reliably adapt AI content to our brand", "I have systematic prompts that produce on-brand content", "I've created brand-specific AI guidelines and style prompts"]),
  },
  {
    id: "mkt_prac_1", dimension: "practice",
    text: "How often do you use AI in your marketing work?",
    description: "Content, design, analytics, SEO, social media, email — any marketing task.",
    options: opts(["Never", "I've tried once or twice", "A few times a month", "Several times a week", "Daily", "Continuously — AI supports every marketing function"]),
  },
  {
    id: "mkt_prac_2", dimension: "practice",
    text: "Do you use AI for SEO, A/B testing ideas, or competitive analysis?",
    description: "Keyword research, headline variations, competitor content analysis.",
    options: opts(["No, all manual", "I've experimented", "Occasionally for specific tasks", "Regularly for SEO and testing", "Central to my marketing strategy", "I've automated AI into our marketing operations"]),
  },
  {
    id: "mkt_prac_3", dimension: "practice",
    text: "Have you built repeatable AI content and campaign workflows?",
    description: "Templates, prompt libraries, automated content calendars.",
    options: opts(["No, I start fresh each time", "I remember what worked informally", "A few saved prompts", "Documented workflows for key activities", "Comprehensive playbooks the team uses", "End-to-end AI-enhanced marketing operations"]),
  },
  {
    id: "mkt_tool_1", dimension: "tools",
    text: "What AI marketing tools does your team have access to?",
    description: "AI writing assistants, image generators, analytics AI, social tools.",
    options: opts(["None", "Free tools used individually", "One licensed AI tool", "A few tools for different tasks", "A comprehensive AI marketing stack", "Fully integrated AI across all marketing channels"]),
  },
  {
    id: "mkt_tool_2", dimension: "tools",
    text: "Is AI integrated into your marketing platforms?",
    description: "Email platform, CMS, social scheduler, analytics dashboard, ad platforms.",
    options: opts(["Not at all", "Basic features we don't use", "Some AI features active", "AI integrated in key platforms", "Most platforms have AI features we use", "AI is deeply embedded across our entire marketing stack"]),
  },
  {
    id: "mkt_tool_3", dimension: "tools",
    text: "How easy is it for marketers to try new AI tools?",
    description: "Budget, approval, training, and experimentation support.",
    options: opts(["Impossible", "Very difficult", "Possible but slow", "Manageable", "Easy with support", "Actively encouraged with dedicated resources"]),
  },
  {
    id: "mkt_resp_1", dimension: "responsible",
    text: "Are there guidelines for AI use with customer data and brand content?",
    description: "Data privacy, brand guidelines, content approval, legal requirements.",
    options: opts(["No guidelines", "I've heard of something", "Basic rules exist", "Clear policies I follow", "Comprehensive framework", "Approved tools with built-in compliance"]),
  },
  {
    id: "mkt_resp_2", dimension: "responsible",
    text: "Do you check AI-generated content for accuracy and brand compliance?",
    description: "Factual claims, legal requirements, brand voice, image rights.",
    options: opts(["I haven't thought about it", "Quick glance", "I check key facts", "Systematic review before publishing", "Formal approval process", "Automated and manual checks with team training"]),
  },
  {
    id: "mkt_resp_3", dimension: "responsible",
    text: "Do you know how to handle it if AI content causes a brand issue?",
    description: "Factual errors, tone-deaf messaging, copyright concerns.",
    options: opts(["I wouldn't know what to do", "I'd fix it informally", "I'd flag it to my manager", "There's a process to follow", "Formal escalation and correction process", "Systematic tracking with continuous improvement"]),
  },
  {
    id: "mkt_cult_1", dimension: "culture",
    text: "Does your marketing team share AI techniques and results?",
    description: "Team meetings, shared prompt libraries, case studies.",
    options: opts(["Nobody discusses AI", "Occasional mentions", "Some informal sharing", "Regular sharing of techniques", "Dedicated sessions and resources", "AI is core to our marketing culture"]),
  },
  {
    id: "mkt_cult_2", dimension: "culture",
    text: "Does marketing leadership support AI adoption?",
    description: "Budget, training, strategic direction, recognition.",
    options: opts(["No interest", "Aware but inactive", "Verbal support only", "Some investment", "Strong support with strategy", "AI is a key marketing priority"]),
  },
  {
    id: "mkt_cult_3", dimension: "culture",
    text: "Is there someone in marketing you can go to for AI help?",
    description: "AI champion, creative technologist, enablement support.",
    options: opts(["Completely on my own", "I can ask around", "One or two helpful people", "Identified AI champions", "Enablement covers AI tools", "Dedicated AI support for marketing"]),
  },
];

// ─── Leadership ───────────────────────────────────────────────────────

const LEADERSHIP_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "lead_conf_1", dimension: "confidence",
    text: "How confident are you in evaluating AI opportunities for your organisation?",
    description: "Assessing where AI can create value, reduce risk, or improve efficiency.",
    options: opts(["I don't feel equipped to assess AI opportunities", "I have a very basic understanding", "I can identify some obvious use cases", "I can evaluate AI opportunities with reasonable confidence", "I systematically assess AI across all business functions", "I lead AI strategy and help the board understand the landscape"]),
  },
  {
    id: "lead_conf_2", dimension: "confidence",
    text: "Can you evaluate AI vendor proposals and investment decisions?",
    description: "Technical due diligence, ROI analysis, build vs. buy decisions.",
    options: opts(["I wouldn't know what to evaluate", "I rely entirely on technical teams", "I can assess basic business cases", "I can critically evaluate proposals and ROI", "I have frameworks for AI investment decisions", "I've led multiple successful AI procurement and investment cycles"]),
  },
  {
    id: "lead_conf_3", dimension: "confidence",
    text: "Can you communicate AI strategy to stakeholders at all levels?",
    description: "Board presentations, team buy-in, customer communications, investor updates.",
    options: opts(["I struggle to explain AI concepts", "I can share basic talking points", "I can present AI plans to my direct reports", "I communicate AI strategy confidently across levels", "I tailor AI messaging for different audiences effectively", "I'm a recognised voice on AI strategy internally and externally"]),
  },
  {
    id: "lead_prac_1", dimension: "practice",
    text: "How often do you personally use AI tools?",
    description: "Strategic analysis, decision support, communications, research.",
    options: opts(["Never", "I've tried once or twice", "A few times a month", "Several times a week", "Daily", "AI is integral to how I lead"]),
  },
  {
    id: "lead_prac_2", dimension: "practice",
    text: "Do you use AI for strategic decision-making and analysis?",
    description: "Market research, competitive analysis, scenario planning, data synthesis.",
    options: opts(["No — all analysis is traditional", "I've experimented", "Occasionally for research", "Regularly for strategic analysis", "Central to my decision-making process", "I've embedded AI into our strategic planning framework"]),
  },
  {
    id: "lead_prac_3", dimension: "practice",
    text: "Have you established AI-related KPIs or success metrics?",
    description: "Adoption rates, productivity gains, cost savings, innovation metrics.",
    options: opts(["No metrics exist", "We track basic usage", "A few informal metrics", "Clear KPIs for AI initiatives", "Comprehensive measurement framework", "AI metrics are integrated into our organisational scorecard"]),
  },
  {
    id: "lead_tool_1", dimension: "tools",
    text: "What AI tools are available across your organisation?",
    description: "Enterprise licenses, approved tools, departmental access.",
    options: opts(["None — no AI tools", "Individuals use free tools", "One enterprise AI tool", "Multiple tools across departments", "Comprehensive enterprise AI stack", "A fully governed, organisation-wide AI platform"]),
  },
  {
    id: "lead_tool_2", dimension: "tools",
    text: "Is there a centralised AI strategy and technology stack?",
    description: "Unified platform, shared models, central governance.",
    options: opts(["No central strategy", "It's been discussed", "Basic guidelines exist", "Central strategy with some coordination", "Unified AI platform and governance", "Mature AI operating model with dedicated team"]),
  },
  {
    id: "lead_tool_3", dimension: "tools",
    text: "How easy is it for teams to adopt new AI tools?",
    description: "Procurement, security review, training, change management.",
    options: opts(["Extremely difficult", "Very slow process", "Possible with significant effort", "Manageable with clear process", "Streamlined adoption pathway", "Proactive AI enablement with dedicated support"]),
  },
  {
    id: "lead_resp_1", dimension: "responsible",
    text: "Does your organisation have an AI governance framework?",
    description: "Policies, risk management, ethical guidelines, compliance.",
    options: opts(["Nothing exists", "We know we need one", "Basic acceptable use policy", "Comprehensive governance framework", "Mature governance with regular reviews", "Industry-leading governance with external validation"]),
  },
  {
    id: "lead_resp_2", dimension: "responsible",
    text: "Is there board-level or executive oversight of AI risk?",
    description: "Regular reporting, risk assessments, strategic reviews.",
    options: opts(["No oversight", "Occasional informal updates", "Annual review", "Quarterly reporting to leadership", "Regular board-level AI oversight", "Dedicated AI ethics committee with board representation"]),
  },
  {
    id: "lead_resp_3", dimension: "responsible",
    text: "Are AI risks factored into your business continuity and compliance?",
    description: "Vendor lock-in, model reliability, regulatory exposure, reputational risk.",
    options: opts(["Not considered", "Informally acknowledged", "Some risks identified", "AI risks in our risk register", "Comprehensive AI risk management", "AI risk fully integrated into enterprise risk framework"]),
  },
  {
    id: "lead_cult_1", dimension: "culture",
    text: "Is AI adoption part of your organisational change strategy?",
    description: "Training programmes, communication plans, cultural initiatives.",
    options: opts(["Not at all", "Early conversations", "Some ad hoc initiatives", "Part of our change management plan", "Comprehensive AI transformation programme", "AI is a core pillar of our organisational strategy"]),
  },
  {
    id: "lead_cult_2", dimension: "culture",
    text: "Do you actively champion AI adoption with your leadership peers?",
    description: "Advocacy, resource allocation, cross-functional coordination.",
    options: opts(["No — not a priority", "I'm interested but haven't acted", "I've raised it in discussions", "I actively advocate for AI investment", "I lead cross-functional AI initiatives", "I'm the primary AI champion in the executive team"]),
  },
  {
    id: "lead_cult_3", dimension: "culture",
    text: "Is there dedicated AI talent or an AI centre of excellence?",
    description: "Data scientists, ML engineers, AI strategists, dedicated teams.",
    options: opts(["No AI-specific talent", "One or two interested individuals", "A few people with AI skills", "Dedicated AI roles in the organisation", "An AI centre of excellence or platform team", "A mature AI organisation embedded across all business units"]),
  },
];

// ─── Governance ───────────────────────────────────────────────────────

const GOVERNANCE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "gov_conf_1", dimension: "confidence",
    text: "How well do you understand the regulatory landscape for AI in your industry?",
    description: "EU AI Act, sector-specific regulations, data protection requirements.",
    options: opts(["I'm not aware of AI regulations", "I know they exist but not the details", "I understand the basics", "I have a good understanding of key regulations", "I track regulatory changes systematically", "I advise the organisation on AI regulatory compliance"]),
  },
  {
    id: "gov_conf_2", dimension: "confidence",
    text: "Can you assess AI systems for bias, fairness, and ethical risks?",
    description: "Algorithmic bias, protected characteristics, disparate impact.",
    options: opts(["I wouldn't know how", "I understand the concept but can't assess", "I can identify obvious bias risks", "I can conduct basic fairness assessments", "I have systematic approaches to AI ethics evaluation", "I lead AI ethics initiatives and train others"]),
  },
  {
    id: "gov_conf_3", dimension: "confidence",
    text: "Can you evaluate AI vendor compliance and data processing practices?",
    description: "DPIAs, sub-processors, data residency, security certifications.",
    options: opts(["I wouldn't know what to check", "I know there are concerns", "I can identify basic data risks", "I can evaluate vendor compliance thoroughly", "I have comprehensive vendor assessment frameworks", "I define and maintain our AI vendor governance standards"]),
  },
  {
    id: "gov_prac_1", dimension: "practice",
    text: "Is AI governance integrated into your regular business processes?",
    description: "Procurement, project approvals, change management, risk reviews.",
    options: opts(["No AI governance processes", "We know we need them", "Ad hoc reviews when issues arise", "AI is included in key approval processes", "Systematic AI governance across the organisation", "Mature AI governance framework fully embedded in operations"]),
  },
  {
    id: "gov_prac_2", dimension: "practice",
    text: "Do you conduct regular AI risk assessments?",
    description: "Impact assessments, risk reviews, compliance audits.",
    options: opts(["Never", "Only when required by incidents", "Annually", "Quarterly or for new deployments", "Continuous monitoring and assessment", "Real-time risk monitoring with automated alerting"]),
  },
  {
    id: "gov_prac_3", dimension: "practice",
    text: "Is there an AI use case register or inventory?",
    description: "Documenting where and how AI is used across the organisation.",
    options: opts(["No inventory exists", "We know we should have one", "Partial documentation of some uses", "Comprehensive register for most AI uses", "Complete, regularly updated AI use case registry", "Dynamic AI inventory with automated discovery and classification"]),
  },
  {
    id: "gov_tool_1", dimension: "tools",
    text: "Do you have tools for AI governance and compliance monitoring?",
    description: "Model monitoring, audit trails, compliance dashboards, risk tools.",
    options: opts(["No governance tools", "Basic spreadsheets or documents", "Some dedicated tools in place", "A governance platform for key requirements", "Comprehensive governance and monitoring stack", "Enterprise-grade AI governance platform with automation"]),
  },
  {
    id: "gov_tool_2", dimension: "tools",
    text: "Is there automated monitoring of AI model performance and drift?",
    description: "Model accuracy, data quality, output monitoring, anomaly detection.",
    options: opts(["No monitoring", "Manual spot checks", "Basic metrics tracked", "Automated monitoring for key models", "Comprehensive monitoring across all AI systems", "Real-time monitoring with automated remediation"]),
  },
  {
    id: "gov_tool_3", dimension: "tools",
    text: "Do you have tools for managing AI policies and documentation?",
    description: "Policy management, documentation systems, training platforms.",
    options: opts(["Nothing in place", "Documents scattered across systems", "Basic documentation in shared drives", "Centralised policy repository", "Dedicated policy management with version control", "Integrated governance platform with training and attestation"]),
  },
  {
    id: "gov_resp_1", dimension: "responsible",
    text: "Is there a clear AI ethics framework and accountability structure?",
    description: "Ethical principles, responsible AI guidelines, defined roles.",
    options: opts(["Nothing exists", "We know we need this", "Basic principles documented", "Comprehensive ethics framework", "Mature framework with clear accountability", "Industry-leading responsible AI programme with external review"]),
  },
  {
    id: "gov_resp_2", dimension: "responsible",
    text: "Are there defined processes for AI incident response and remediation?",
    description: "Handling AI failures, bias incidents, data breaches, compliance violations.",
    options: opts(["No processes", "Ad hoc response only", "Basic escalation path", "Documented incident response procedures", "Comprehensive playbooks with tested procedures", "Mature incident management with regular drills and continuous improvement"]),
  },
  {
    id: "gov_resp_3", dimension: "responsible",
    text: "Is there training on responsible AI use across the organisation?",
    description: "Awareness programmes, role-specific training, certification.",
    options: opts(["No training exists", "Basic awareness shared informally", "One-time training session", "Regular training programme", "Role-specific training with assessment", "Comprehensive programme with certification and continuous learning"]),
  },
  {
    id: "gov_cult_1", dimension: "culture",
    text: "Is responsible AI a visible organisational priority?",
    description: "Executive communications, values statements, public commitments.",
    options: opts(["Not discussed", "Mentioned occasionally", "Included in some communications", "Regular leadership messaging", "Core organisational value with visible commitment", "Externally recognised leader in responsible AI"]),
  },
  {
    id: "gov_cult_2", dimension: "culture",
    text: "Do employees feel comfortable raising AI ethics concerns?",
    description: "Psychological safety, reporting channels, non-retaliation policies.",
    options: opts(["People would be afraid to raise concerns", "Some hesitation to speak up", "People can raise concerns but no formal channel", "Clear reporting channels exist", "Proactive culture of raising and discussing concerns", "Ethics discussions are celebrated and systematically integrated"]),
  },
  {
    id: "gov_cult_3", dimension: "culture",
    text: "Is there cross-functional collaboration on AI governance?",
    description: "Legal, IT, risk, business units working together on AI governance.",
    options: opts(["Governance is siloed or absent", "Informal conversations between teams", "Some cross-functional engagement", "Regular cross-functional governance meetings", "Dedicated cross-functional AI governance body", "Mature AI governance council with representation from all functions"]),
  },
];

// ─── Template Registry ────────────────────────────────────────────────

export const ASSESSMENT_TEMPLATES: Record<string, AssessmentTemplate> = {
  "org-wide": {
    id: "org-wide",
    title: "Organisation-Wide AI Readiness",
    subtitle: "Holistic assessment for all roles",
    icon: "Building2",
    description: "A general AI readiness assessment suitable for any role in the organisation. Measures confidence, daily practice, tool access, responsible use, and culture.",
    questions: ORG_WIDE_QUESTIONS,
  },
  engineering: {
    id: "engineering",
    title: "Engineering AI Readiness",
    subtitle: "For software and DevOps teams",
    icon: "Code2",
    description: "Tailored for engineering teams — covers AI-assisted development, CI/CD integration, code quality, and technical governance.",
    questions: ENGINEERING_QUESTIONS,
  },
  sales: {
    id: "sales",
    title: "Sales AI Readiness",
    subtitle: "For revenue and GTM teams",
    icon: "TrendingUp",
    description: "Designed for sales teams — covers AI-powered prospecting, CRM integration, deal analysis, and customer data handling.",
    questions: SALES_QUESTIONS,
  },
  marketing: {
    id: "marketing",
    title: "Marketing AI Readiness",
    subtitle: "For content and growth teams",
    icon: "Megaphone",
    description: "Built for marketing teams — covers AI content creation, campaign analytics, brand voice, and creative workflows.",
    questions: MARKETING_QUESTIONS,
  },
  leadership: {
    id: "leadership",
    title: "Leadership AI Readiness",
    subtitle: "For executives and directors",
    icon: "Crown",
    description: "For senior leaders — covers AI strategy, investment evaluation, organisational change, and executive communication.",
    questions: LEADERSHIP_QUESTIONS,
  },
  governance: {
    id: "governance",
    title: "AI Governance & Compliance",
    subtitle: "For risk, legal, and compliance",
    icon: "Shield",
    description: "Focused on governance, risk, and compliance — covers regulatory awareness, ethics frameworks, incident response, and policy management.",
    questions: GOVERNANCE_QUESTIONS,
  },
};

export const TEMPLATE_IDS = Object.keys(ASSESSMENT_TEMPLATES);

export function getTemplate(id: string): AssessmentTemplate {
  return ASSESSMENT_TEMPLATES[id] ?? ASSESSMENT_TEMPLATES["org-wide"];
}
