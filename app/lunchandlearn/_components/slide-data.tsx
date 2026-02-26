export type SlideType =
  | { type: "title"; title: string; subtitle?: string; badge?: string; footer?: string }
  | {
      type: "content";
      section: string;
      sectionNumber?: number;
      title: string;
      subtitle?: string;
      bullets: string[];
      footnote?: string;
      aside?: { message: string; features?: string[]; logoUrl?: string };
    }
  | {
      type: "split";
      section: string;
      sectionNumber?: number;
      title: string;
      left: { heading: string; items: string[]; accent?: string };
      right: { heading: string; items: string[]; accent?: string };
    }
  | {
      type: "comparison";
      section: string;
      sectionNumber?: number;
      title: string;
      headers: string[];
      rows: { label: string; values: string[] }[];
      footnote?: string;
    }
  | {
      type: "quiz";
      section: string;
      sectionNumber?: number;
      title: string;
      questions: { question: string; options: string[]; correct: number }[];
    }
  | {
      type: "activity";
      section: string;
      sectionNumber?: number;
      title: string;
      description: string;
      prompt: string;
      duration: number;
      tips?: string[];
      tipsHeading?: string;
    }
  | {
      type: "person";
      section: string;
      sectionNumber?: number;
      title: string;
      name: string;
      role: string;
      imageUrl: string;
      bio: string[];
      personal?: string;
    }
  | { type: "demo-generative" }
  | { type: "demo-agentic" }
  | { type: "demo-advisor" }
  | { type: "demo-qa" };

export const slides: SlideType[] = [
  // ── SECTION 1: Opening & Context ───────────────────
  // Slide 1 - Title
  {
    type: "title",
    badge: "Interactive Session - Powered by Live AI",
    title: "Mastering AI",
    subtitle:
      "Terminology, Architecture, Risks & Real-World Applications",
    footer: "Lunch & Learn · February 26, 2026 · 90 Minutes",
  },

  // Slide 2 - AI and Climate Responsibility
  {
    type: "content",
    section: "Opening & Context",
    sectionNumber: 1,
    title: "AI and Climate Responsibility",
    subtitle: "The energy picture is real, and it is improving fast",
    bullets: [
      "AI data centres accounted for around 1.5% of global electricity in 2025 (IEA), comparable to the aviation industry's ground operations",
      "Training GPT-4 produced an estimated 552 tonnes of CO2. GPT-5 class models cut that by roughly 40% through efficiency gains (Stanford HAI 2025)",
      "Google and Microsoft have committed to 100% carbon-free energy for AI workloads by 2030",
      "Inference is getting cheaper: cost-per-token dropped 90% between 2023 and 2025 (a16z), meaning less energy per useful output",
      "AI-enabled climate applications (flood forecasting, grid optimisation, precision agriculture) are projected to help avoid 5 to 10% of global emissions by 2030 (BCG / WEF)",
      "The question is not whether to use AI, but how to use it responsibly",
    ],
  },

  // Slide 3 - Using AI Responsibly
  {
    type: "content",
    section: "Opening & Context",
    sectionNumber: 1,
    title: "Using AI Responsibly",
    subtitle: "Practical steps every team can take starting today",
    bullets: [
      "Use the right-sized model for the job. Not every task needs the largest model; smaller, specialised models use a fraction of the energy",
      "Avoid unnecessary runs. Cache results, batch requests, and skip repeat queries where the answer has not changed",
      "Set clear governance on when AI is worth using. If a simple rule or script solves the problem, use that instead",
      "Track compute alongside outcomes. Measure the business value delivered per unit of resource consumed",
      "Favour providers with transparent carbon reporting and renewable energy commitments",
      "Build a culture of intentional use: every prompt should have a purpose, every workflow should justify its cost",
    ],
    aside: {
      message: "AIOPSOS is built for this: right-sized models, multi-model access, and governance that match how you want to use AI responsibly.",
      features: [
        "Route to the right model per task (no one-size-fits-all)",
        "Multi-model access across vendors",
        "Governance and audit trails",
      ],
      logoUrl: "/logo.png",
    },
  },

  // Slide 4 - About Antonio
  {
    type: "person",
    section: "Opening & Context",
    sectionNumber: 1,
    title: "About your host",
    name: "Antonio Giugno",
    role: "Founder & AI Architect",
    imageUrl: "/antonio.jpg",
    bio: [
      "Antonio is a leading AI architect and trainer with deep experience helping organisations navigate the shift from experimental AI use to strategic, embedded adoption. He has built and scaled multiple enterprise AI applications for long term clients. His work spans enterprise AI strategy, multi-model orchestration, and building the frameworks that turn AI potential into measurable business outcomes.",
      "Antonio founded AIOPSOS with a core conviction: that equitable AI access is essential. Every organisation, regardless of scale or resources, should have the tools and structure to benefit from what AI can deliver.",
      "He serves on the board of multiple tech companies and is a strong advocate for responsible AI adoption: right-sized models, governance, and measurable outcomes.",
    ],
    personal: "Dad of four. Passionate about applied AI in robotics.",
  },

  // Slide 5 - Agenda
  {
    type: "content",
    section: "Welcome",
    title: "Session Structure",
    subtitle: "Eight sections designed for all roles and experience levels",
    bullets: [
      "1. Opening & Context - AI in 2026: hype vs production reality",
      "2. The AI Landscape - Predictive, Generative, and Agentic systems",
      "3. Generative AI Deep Dive - Capabilities, limitations + live demo with real data",
      "4. Agentic AI Systems - Planning, acting, and autonomous workflows + live demo",
      "5. Generative vs Agentic - Key differences, hybrids, and when to use which",
      "6. Risk, Governance & Controls - Hallucination, bias, compliance, and best practices",
      "7. Application - AI for your team with live, role-specific demos",
      "8. Open Discussion - Live Q&A powered by GPT-5.2",
    ],
  },

  // Slide 3 - Hype vs Reality
  {
    type: "split",
    section: "Opening & Context",
    sectionNumber: 1,
    title: "AI in 2026 - Hype vs Reality",
    left: {
      heading: "Media Hype",
      items: [
        "\"80% of enterprise tasks will be autonomous by 2027\" - overhyped predictions",
        "Viral demos that look magical but lack production readiness",
        "AGI narratives dominating headlines and investment decks",
        "\"AI will replace your entire team\" clickbait cycle",
      ],
      accent: "#a1a1aa",
    },
    right: {
      heading: "Production Reality",
      items: [
        "78% of enterprises have adopted AI in some form (McKinsey 2026)",
        "Only 20% achieve expected ROI - governance and strategy gaps are the cause",
        "Models are dramatically better: 65% fewer hallucinations, 25% faster inference",
        "The winners invest in strategy, guardrails, and cross-team adoption",
      ],
      accent: "#d4d4d8",
    },
  },

  // Slide 4 - Why This Matters + Myths
  {
    type: "content",
    section: "Opening & Context",
    sectionNumber: 1,
    title: "Why This Matters & Myths Busted",
    subtitle: "The AI landscape is evolving fast - separating fact from fiction is critical",
    bullets: [
      "Models are smarter: GPT-5.2's 400K context window, Gemini's multimodal fusion, Claude's extended reasoning",
      "Productivity gains of 25%+ are real - but only with strategy, not just tooling",
      "Myth: AI eliminates jobs → Fact: It augments 70% of roles and creates new ones",
      "Myth: AGI is imminent → Fact: Narrow AI excels at specific tasks; we're decades from AGI",
      "Myth: AI is plug-and-play → Fact: Without governance and training, ROI stays at zero",
      "Every function benefits: marketing gets personalized campaigns, finance gets risk forecasting, engineering gets automation",
    ],
  },

  // ── SECTION 2: The AI Landscape ────────────────────
  // Slide 6 - Three Pillars
  {
    type: "split",
    section: "The AI Landscape",
    sectionNumber: 2,
    title: "Three Pillars of Modern AI",
    left: {
      heading: "Predictive AI",
      items: [
        "Uses historical data to forecast what will happen next",
        "Examples: sales trends, demand prediction, risk scoring, flood likelihood",
        "Well-established, high reliability, narrow scope. Answers: what is the probability?",
      ],
      accent: "#a1a1aa",
    },
    right: {
      heading: "Generative & Agentic AI",
      items: [
        "Generative: Creates new content from scratch. Text, images, code, reports. Answers: produce this.",
        "Agentic: Plans, uses tools, and executes multi-step tasks on its own. Answers: achieve this goal.",
        "Hybrids: Combine all three. Prediction informs, generation creates, agency executes.",
      ],
      accent: "#d4d4d8",
    },
  },

  // Slide 6 - 2026 Model Landscape
  {
    type: "comparison",
    section: "The AI Landscape",
    sectionNumber: 2,
    title: "2026 Model Landscape",
    headers: ["Model", "Key Advance"],
    rows: [
      { label: "GPT-5.2", values: ["OpenAI", "400K context, agentic coding, fastest inference"] },
      { label: "Claude Opus 4.6", values: ["Anthropic", "Extended reasoning, safety-first, deep analysis"] },
      { label: "Gemini 3.1 Pro", values: ["Google", "Native multimodal, video understanding, integration"] },
      { label: "Grok 4.2", values: ["xAI", "Multi-agent orchestration, real-time data"] },
      { label: "GLM-5", values: ["Open-source", "Enterprise-grade, cost-effective, self-hosted"] },
      { label: "Mistral Large", values: ["Mistral", "European compliance, efficient, multilingual"] },
    ],
  },

  // Slide 7 - Evolution Timeline
  {
    type: "content",
    section: "The AI Landscape",
    sectionNumber: 2,
    title: "How We Got Here",
    subtitle: "From basic chat to autonomous agents in 3 years",
    bullets: [
      "2023: ChatGPT moment - everyone discovers generative AI; mostly toy demos",
      "2024: RAG & fine-tuning - enterprises ground AI in their own data; real accuracy gains",
      "2025: Agentic frameworks emerge - AI starts planning, executing, and using tools",
      "2026: Cognitive density - models do more per token; hybrids combine prediction + generation + action",
      "Next: Multi-agent systems, continuous learning, and domain-specific foundation models",
    ],
  },

  // ── SECTION 3: Generative AI Deep Dive ─────────────
  // Slide 8 - What Generative AI Does
  {
    type: "content",
    section: "Generative AI Deep Dive",
    sectionNumber: 3,
    title: "What Generative AI Does",
    subtitle: "Creating new content from patterns learned across billions of examples",
    bullets: [
      "Text synthesis: Reports, emails, analysis, creative writing - at human quality",
      "Multimodal: Images (DALL-E 3, Midjourney), video (Sora 2.0), audio, and code",
      "Key capability: Summarization, translation, brainstorming, drafting - the 'thinking assistant'",
      "2026 advances: Dramatically fewer hallucinations, longer context, better reasoning",
      "How industry uses it: Adobe for campaign ideation, Deloitte for audit insights, Netflix for content personalization",
      "Up next: A live demo using real-time data from the Open-Meteo weather API and the Environment Agency Flood Monitoring API, fed into GPT-5.2",
    ],
  },

  // Slide 9 - Capabilities & Limitations
  {
    type: "split",
    section: "Generative AI Deep Dive",
    sectionNumber: 3,
    title: "Capabilities & Limitations",
    left: {
      heading: "Strengths",
      items: [
        "Rapid content generation - 10x faster than manual",
        "Pattern recognition across massive datasets",
        "Creative ideation and brainstorming at scale",
        "Code generation and debugging assistance",
        "Multilingual, multimodal output",
      ],
      accent: "#d4d4d8",
    },
    right: {
      heading: "Limitations",
      items: [
        "Hallucinations - confidently wrong outputs",
        "No real understanding - pattern matching, not reasoning",
        "Bias from training data - can perpetuate stereotypes",
        "Privacy concerns with sensitive data input",
        "Needs human oversight for critical decisions",
      ],
      accent: "#71717a",
    },
  },

  // Slide 10 - INTERACTIVE: Generative Demo
  { type: "demo-generative" },

  // Slide 11 - Group Activity: Generative
  {
    type: "activity",
    section: "Generative AI Deep Dive",
    sectionNumber: 3,
    title: "Group Activity: Craft Your Prompt",
    description:
      "In pairs, write a generative AI prompt for your specific role. Think about what repetitive or creative task AI could help with in your daily work.",
    prompt:
      "Write a prompt that a [your role] could use with generative AI to save 2+ hours per week. Be specific about the task, context, and desired output.",
    duration: 420,
    tipsHeading: "What a good prompt looks like (prompt engineering tips)",
    tips: [
      "Be specific about the task. Vague prompts get vague outputs.",
      "Include context: who, what, when. The more the model knows, the better it performs.",
      "Define the desired output: format, length, tone. Example: 'as a bullet list', 'in 3 sentences', 'formal tone'.",
      "Add constraints if needed: 'no jargon', 'suitable for non-technical readers', 'under 200 words'.",
    ],
  },

  // ── SECTION 4: Agentic AI Systems ──────────────────
  // Slide 12 - What is Agentic AI
  {
    type: "content",
    section: "Agentic AI Systems",
    sectionNumber: 4,
    title: "What is Agentic AI?",
    subtitle: "AI that doesn't just think - it plans, acts, and adapts",
    bullets: [
      "Plan: Breaks complex goals into steps and sequences them logically",
      "Act: Executes steps by calling tools, APIs, and external systems",
      "Observe: Monitors results and checks if the goal is being met",
      "Reflect: Adjusts the plan when things don't go as expected",
      "Key difference from generative: Autonomy. Generative AI answers; agentic AI executes.",
    ],
  },

  // Slide 13 - How Agents Differ
  {
    type: "content",
    section: "Agentic AI Systems",
    sectionNumber: 4,
    title: "The Autonomy Spectrum",
    subtitle: "From simple chat to full autonomous agents",
    bullets: [
      "Level 1 - Chatbot: Responds to prompts, no memory, no actions",
      "Level 2 - Assistant: Remembers context, follows instructions, single-turn tools",
      "Level 3 - Copilot: Suggests actions, drafts work, human approves each step",
      "Level 4 - Agent: Plans and executes multi-step tasks, uses tools, minimal oversight",
      "Level 5 - Multi-Agent: Multiple AI agents collaborate, delegate, and coordinate",
      "Up next: A live agentic demo. GPT-5.2 autonomously ingests real-time Open-Meteo weather and Environment Agency flood warnings, then plans a full incident response across 5 phases - no human intervention required",
    ],
  },

  // Slide 14 - INTERACTIVE: Agentic Demo
  { type: "demo-agentic" },

  // Slide 15 - Group Activity: Agentic
  {
    type: "activity",
    section: "Agentic AI Systems",
    sectionNumber: 4,
    title: "Group Activity: Design an Agent Workflow",
    description:
      "In your group, identify a repetitive multi-step process in your team. Design an AI agent workflow: What's the goal? What steps would the agent take? What tools would it need?",
    prompt:
      "Think about a workflow with 3+ steps that could be automated. Map out: Goal → Steps → Tools needed → Human checkpoints → Expected outcome.",
    duration: 420,
    tipsHeading: "How to design a great agent workflow",
    tips: [
      "Start with pain: pick a process someone dreads doing manually. The bigger the time sink, the stronger the case.",
      "Define a clear goal and end state. Agents need a measurable 'done'. Example: 'Generate and send the weekly flood risk report by 9am Monday'.",
      "Break it into discrete steps. Each step should have one input and one output. If a step is too big, split it further.",
      "Identify the tools the agent needs: APIs, databases, email, file storage, maps. Agents are only as good as the tools they can use.",
      "Add human checkpoints at high-risk steps. Not everything should be fully autonomous. Decide where a human reviews before the agent continues.",
      "Think about failure: what happens if a step fails? Good agent design includes fallback paths and retry logic.",
    ],
  },

  // ── SECTION 5: Generative vs Agentic ───────────────
  // Slide 16 - Comparison
  {
    type: "comparison",
    section: "Generative vs Agentic",
    sectionNumber: 5,
    title: "Side-by-Side Comparison",
    headers: ["Generative AI", "Agentic AI"],
    rows: [
      { label: "Autonomy", values: ["Low - responds to prompts", "High - plans and executes"] },
      { label: "Interaction", values: ["Single turn or conversation", "Multi-step, tool-using"] },
      { label: "Control", values: ["User controls every step", "Human sets goal, AI decides how"] },
      { label: "Best For", values: ["Content creation, analysis, drafting", "Workflow automation, complex tasks"] },
      { label: "Risk Profile", values: ["Hallucination, bias", "Execution errors, scope creep"] },
      { label: "Maturity (2026)", values: ["Production-ready, widespread", "Emerging, requires guardrails"] },
    ],
  },

  // Slide 17 - Hybrids
  {
    type: "content",
    section: "Generative vs Agentic",
    sectionNumber: 5,
    title: "Hybrid Approaches",
    subtitle: "The real power comes from combining generative and agentic capabilities",
    bullets: [
      "Generative for ideation + Agentic for execution = end-to-end automation",
      "Example: AI generates a marketing campaign brief (generative), then schedules posts and tracks performance (agentic)",
      "Predictive AI feeds data → Generative AI creates reports → Agentic AI distributes them",
      "IBM and Salesforce are leading hybrid deployments in 2026",
      "Key: Start generative (low risk), layer in agentic (higher value) as trust builds",
    ],
  },

  // Slide 18 - Decision Framework
  {
    type: "split",
    section: "Generative vs Agentic",
    sectionNumber: 5,
    title: "When to Use Which",
    left: {
      heading: "Choose Generative When",
      items: [
        "You need creative or analytical content produced",
        "Human review is feasible for every output",
        "The task is single-step or conversational",
        "Speed of content creation is the bottleneck",
        "Risk tolerance is low - output can be checked",
      ],
      accent: "#a1a1aa",
    },
    right: {
      heading: "Choose Agentic When",
      items: [
        "The task has multiple sequential steps",
        "It requires calling external tools or APIs",
        "Manual process is repetitive and rule-based",
        "Speed of execution is the bottleneck",
        "You can define clear success criteria and guardrails",
      ],
      accent: "#d4d4d8",
    },
  },

  // ── SECTION 6: Risk, Governance & Controls ─────────
  // Slide 19 - Risk Taxonomy
  {
    type: "content",
    section: "Risk, Governance & Controls",
    sectionNumber: 6,
    title: "AI Risk Taxonomy",
    subtitle: "Understanding and categorizing AI risks across the organization",
    bullets: [
      "Hallucination risk: AI generates plausible but factually incorrect outputs - mitigate with RAG and grounding",
      "Bias risk: Training data biases perpetuated in outputs - mitigate with diverse datasets and human review",
      "Privacy risk: Sensitive data leaking through prompts or outputs - mitigate with data policies and PII detection",
      "Execution risk (agentic): Autonomous AI taking unintended actions - mitigate with guardrails and human-in-the-loop",
      "Compliance risk: Regulatory requirements (EU AI Act, GDPR) - mitigate with governance frameworks and auditing",
      "Dependency risk: Over-reliance on AI without fallback processes - mitigate with redundancy planning",
    ],
  },

  // Slide 20 - Governance
  {
    type: "content",
    section: "Risk, Governance & Controls",
    sectionNumber: 6,
    title: "Governance Best Practices",
    subtitle: "Building trust through structure, transparency, and accountability",
    bullets: [
      "Establish an AI governance committee - cross-functional oversight",
      "Create an AI usage policy - what's allowed, what's not, with examples",
      "Implement audit trails - log all AI interactions for review",
      "Regular model evaluation - test for accuracy, bias, and drift",
      "Human-in-the-loop - critical decisions always have human approval",
      "Training & awareness - every team member understands AI capabilities and limits",
    ],
  },

  // Slide 21 - Quiz
  {
    type: "quiz",
    section: "Risk, Governance & Controls",
    sectionNumber: 6,
    title: "Quick Quiz: Test Your Knowledge",
    questions: [
      {
        question: "What is the primary risk unique to agentic AI (vs generative)?",
        options: [
          "Hallucination",
          "Execution risk - taking unintended autonomous actions",
          "Slow response times",
          "High cost per query",
        ],
        correct: 1,
      },
      {
        question: "What technique grounds AI outputs in factual data to reduce hallucinations?",
        options: [
          "Fine-tuning",
          "Prompt engineering",
          "Retrieval-Augmented Generation (RAG)",
          "Temperature reduction",
        ],
        correct: 2,
      },
      {
        question: "Which is the BEST first step for AI governance?",
        options: [
          "Buy the most expensive model",
          "Create a cross-functional AI usage policy",
          "Block all AI tools",
          "Let each team figure it out",
        ],
        correct: 1,
      },
      {
        question: "What does 'human-in-the-loop' mean in AI governance?",
        options: [
          "AI only works during business hours",
          "Humans review and approve AI outputs before action is taken",
          "Humans write all the code",
          "AI is trained only on human data",
        ],
        correct: 1,
      },
    ],
  },

  // ── SECTION 7: Application ─────────────────────────
  // Slide 22 - AI Across Functions
  {
    type: "comparison",
    section: "Application",
    sectionNumber: 7,
    title: "AI Across Business Functions",
    headers: ["Predictive", "Generative", "Agentic"],
    rows: [
      { label: "Sales", values: ["Lead scoring & pipeline forecasting", "Personalized outreach emails", "Automated follow-up sequences"] },
      { label: "Finance", values: ["Claims forecasting & risk scoring", "Report generation & analysis", "Automated audit workflows"] },
      { label: "Marketing", values: ["Campaign performance prediction", "Content creation & copywriting", "Multi-channel campaign orchestration"] },
      { label: "Engineering", values: ["Bug prediction & load forecasting", "Code generation & documentation", "CI/CD pipeline automation"] },
      { label: "Operations", values: ["Sensor failure prediction", "Maintenance report generation", "Automated monitoring & response"] },
    ],
    footnote: "Up next: Select your department to see live KPIs alongside AI recommendations generated from real-time Open-Meteo, Environment Agency, and operational data",
  },

  // Slide 23 - INTERACTIVE: Role Advisor
  { type: "demo-advisor" },

  // Slide 24 - Roadmap
  {
    type: "content",
    section: "Application",
    sectionNumber: 7,
    title: "Roadmap Thinking",
    subtitle: "A phased approach to AI adoption that builds trust and delivers value",
    bullets: [
      "Phase 1 (Month 1-2): Assess - AI readiness assessment, identify quick wins, build awareness",
      "Phase 2 (Month 2-4): Pilot - 2-3 low-risk generative AI use cases, measure impact, gather feedback",
      "Phase 3 (Month 4-6): Scale - Expand to more teams, introduce agentic capabilities, establish governance",
      "Phase 4 (Month 6-12): Optimize - Full cross-functional deployment, continuous improvement, ROI measurement",
      "Key principle: Start small, prove value, scale with confidence",
    ],
  },

  // ── SECTION 8: Open Discussion ─────────────────────
  // Slide 25 - Key Takeaways
  {
    type: "content",
    section: "Open Discussion",
    sectionNumber: 8,
    title: "Key Takeaways",
    bullets: [
      "AI is a spectrum: Predictive → Generative → Agentic → Hybrid - each has its place",
      "The 2026 models (GPT-5.2, Claude, Gemini) are genuinely production-ready - the tech is here",
      "Generative AI creates; Agentic AI executes - the power is in combining both",
      "Governance is not optional - it's what separates 78% adoption from 20% ROI",
      "Every role benefits - we demonstrated it live today with real-time Open-Meteo weather, Environment Agency flood warnings, and department operational data fed into GPT-5.2",
      "Start with assessment, pilot quickly, scale with confidence",
    ],
  },

  // Slide 26 - INTERACTIVE: Live Q&A
  { type: "demo-qa" },

  // Slide 27 - Thank You
  {
    type: "title",
    badge: "Thank You",
    title: "Let's Build Something Together",
    subtitle:
      "AI readiness assessment · Implementation roadmap · Cross-team training & enablement",
    footer: "Questions? Reach out anytime - the future is collaborative.",
  },
];
