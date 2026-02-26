import { streamText, type UIMessage } from "ai";
import { getLanguageModel } from "@/lib/model-router";
import { fetchWeather, formatWeatherForPrompt } from "@/lib/weather-api";
import { fetchFloodWarnings, formatFloodsForPrompt } from "@/lib/flood-api";

export const maxDuration = 60;

const SEEDED_CONTEXT: Record<string, string> = {
  sales: `SALES PIPELINE DATA:
- Thames Water: Water Utility, Risk Score 87/100, Deal Value £450K, Stage: Proposal Sent
- Aviva Insurance: Insurance, Risk Score 72/100, Deal Value £320K, Stage: Qualified Lead
- Zurich Municipal: Insurance, Risk Score 91/100, Deal Value £580K, Stage: Negotiation
- National Grid: Energy, Risk Score 65/100, Deal Value £290K, Stage: Discovery
- Barratt Developments: Construction, Risk Score 78/100, Deal Value £210K, Stage: Demo Scheduled
- United Utilities: Water Utility, Risk Score 83/100, Deal Value £390K, Stage: Contract Review
Pipeline Summary: Total £2.24M | Qualified £1.19M | Closing this quarter £580K`,

  finance: `FINANCIAL DATA:
Claims History (2025): 847 total claims, Average cost £12,400, Total value £10.5M
By Severity: Critical (12%) £4.2M | High (28%) £3.8M | Medium (35%) £1.9M | Low (25%) £0.6M
Budget: Current AI investment £150K | Projected annual savings from AI £420K | Break-even at 8 months
Revenue: ARR £3.2M | Growth rate 34% YoY | Net retention 118%
Insurance Partnerships: 4 active, generating £1.8M combined ARR`,

  marketing: `MARKETING DATA:
Campaign Performance (Q4 2025):
- "Flood Preparedness" email series: 45K reach, 3.2% CTR, 12 SQLs generated
- LinkedIn thought leadership: 23K impressions/mo, 8.4% engagement rate
- Webinar "Future of Flood Risk": 340 signups, 62% attendance, 28 leads
Content: 12 blog posts/quarter, 2 whitepapers, 1 industry report
Social: LinkedIn 4.2K followers (+18% QoQ), Twitter 1.1K followers
Upcoming: Q1 2026 campaign budget £45K, targeting insurance and water utility sectors`,

  engineering: `ENGINEERING DATA:
Product Backlog: 47 items total
- P0 (Critical): API v3 migration, Real-time alert latency (<30s target), Mobile app PWA
- P1 (High): ML model retraining pipeline, Sensor firmware OTA updates, Multi-tenant dashboard
- P2 (Medium): Historical data export, Custom alert rules engine, Drainage network mapping
Sprint Velocity: 34 story points/sprint (2-week sprints)
Technical Debt: 23% of backlog, mostly legacy data pipeline
Sensor Network: 1,847 deployed sensors, 99.2% uptime, 15-min data intervals
Tech Stack: Python/FastAPI backend, React frontend, PostgreSQL, AWS infrastructure`,

  product: `PRODUCT DATA:
User Analytics (Jan 2026):
- DAU: 1,240 | MAU: 3,890 | DAU/MAU ratio: 31.9%
- Feature adoption: Dashboard 94% | Alerts 87% | API 42% | Reports 61%
- NPS: 52 | CSAT: 4.2/5
Market Research: TAM £2.1B (UK flood risk management), SAM £340M, SOM £48M
Competitor Landscape: 3 direct competitors, none with real-time surface water capability
Key Requests: Mobile app (67% of users), Custom alert thresholds (54%), Historical trend analysis (49%)`,

  operations: `OPERATIONS DATA:
Sensor Network Deployment:
- Total sensors: 1,847 across 12 UK regions
- Coverage gaps: Southwest (14% under-covered), East Anglia (22% under-covered)
- Maintenance backlog: 43 sensors pending replacement, 12 offline
- Average sensor lifespan: 5.2 years (battery), target 5+ years
Monitoring: 24/7 automated, human review during flood events
SLA Performance: 99.7% uptime (target 99.5%), alert delivery <45s (target <60s)
Regional Distribution: Midlands 34%, North 22%, South 18%, London 14%, East 12%`,
};

function getSystemPrompt(mode: string, liveContext: string, department?: string): string {
  switch (mode) {
    case "generative":
      return `You are a senior flood risk analyst generating a professional executive risk briefing. Use the live data below to create a well-structured, actionable briefing. Format with clear sections using markdown: Executive Summary, Current Conditions, Active Warnings Analysis, Risk Assessment, and Recommended Actions. Be specific with the data — reference actual locations, severity levels, and metrics. This is being demonstrated live in a presentation, so be impressive and thorough but concise.

${liveContext}`;

    case "agentic":
      return `You are an autonomous AI agent executing a multi-step flood response planning task. You MUST structure your response in exactly 5 clearly labeled phases. Use these exact phase headers on their own line:

## PHASE 1: WEATHER ANALYSIS
Analyze the current weather data and forecast. Identify precipitation risks.

## PHASE 2: FLOOD WARNING ASSESSMENT
Review active flood warnings. Assess severity and affected areas.

## PHASE 3: ASSET RISK ANALYSIS
Cross-reference flood zones with the asset data below. Identify at-risk properties and infrastructure.

## PHASE 4: RESPONSE PLAN
Generate a structured incident response plan with priorities, resource allocation, and timeline.

## PHASE 5: STAKEHOLDER COMMUNICATIONS
Draft a concise stakeholder notification email and an internal action memo.

${liveContext}

ASSET DATA:
- 1,847 monitoring sensors across 12 UK regions
- 340 insured commercial properties in active flood zones
- 12 critical infrastructure sites requiring priority response
- 3 water utility partners with SLA obligations`;

    case "advisor": {
      const deptData = department ? SEEDED_CONTEXT[department] ?? "" : "";
      return `You are an AI adoption strategist presenting to the ${department ?? "team"} department of a flood forecasting technology company. Using the live flood/weather data AND the department-specific data below, generate exactly 5 specific, practical AI applications for this team. For each, include:

1. **Application Name** — catchy, specific title
2. **What it does** — 2-3 sentences explaining the AI capability
3. **Live data example** — reference the actual live data to show how it would work RIGHT NOW
4. **Business impact** — quantified benefit (time saved, revenue impact, risk reduction)
5. **Implementation complexity** — Low/Medium/High with brief justification

Make it immediately actionable and impressive. Reference specific numbers from the data.

${liveContext}

${deptData}`;
    }

    case "qa":
      return `You are an expert AI educator at a Lunch & Learn session for a flood forecasting technology company. The audience includes marketing, sales, finance, engineering, product, and operations teams with varying AI knowledge levels. The session covers:
- AI terminology (predictive, generative, agentic)
- 2026 model landscape (GPT-5.2, Claude, Gemini, etc.)
- Generative vs agentic AI differences
- Risk, governance, and responsible AI
- Practical AI applications across business functions

Answer questions clearly, accessibly, and with relevant examples. If asked about something shown in the demos, reference how live flood/weather data was used with GPT-5.2 to demonstrate generative and agentic AI concepts. Be engaging and inspiring — this is meant to excite the team about AI possibilities.`;

    default:
      return "You are a helpful AI assistant.";
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, mode = "generative", department } = body as {
    messages: UIMessage[];
    mode: string;
    department?: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let liveContext = "";
  if (mode !== "qa") {
    try {
      const [weather, floods] = await Promise.all([
        fetchWeather("loughborough"),
        fetchFloodWarnings(20),
      ]);
      liveContext = [
        formatWeatherForPrompt(weather, "Loughborough, UK"),
        "",
        formatFloodsForPrompt(floods),
      ].join("\n");
    } catch {
      liveContext = "LIVE DATA: Unable to fetch live data at this time. Use general knowledge about UK flood risks and weather patterns.";
    }
  }

  const systemPrompt = getSystemPrompt(mode, liveContext, department);

  const formattedMessages = messages.map((m) => {
    const text = (m.parts ?? [])
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
    return { role: m.role as "user" | "assistant", content: text };
  });

  const result = streamText({
    model: getLanguageModel("gpt-5.2"),
    system: systemPrompt,
    messages: formattedMessages,
  });

  return result.toUIMessageStreamResponse();
}
