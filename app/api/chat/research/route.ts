import { generateText } from "ai";
import { getLanguageModel } from "@/lib/model-router";
import { resolveUserContext } from "@/lib/resolve-user-context";
import { checkFeatureQuota, logFeatureUsage } from "@/lib/feature-quotas";
import { getPlanFeatures } from "@/lib/constants";
import { searchWeb } from "@/lib/tavily";

export const maxDuration = 120;

function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  const ctx = await resolveUserContext();
  if (!ctx) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!getPlanFeatures(ctx.plan).deepResearch) {
    return new Response(
      JSON.stringify({ error: "Deep research requires an Enterprise plan." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const { query } = await req.json();
  if (!query || typeof query !== "string") {
    return new Response(JSON.stringify({ error: "query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const quota = await checkFeatureQuota(ctx.orgId, "deep_research", ctx.plan, ctx.seatCount, ctx.userId);
  if (quota.requiresUpgrade) {
    return new Response(
      JSON.stringify({ error: "Deep research not available on your plan." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(sseEvent(data)));
      }

      try {
        // Step 1: Break query into sub-questions
        send({ type: "progress", message: "Analysing research question..." });

        const decomposition = await generateText({
          model: getLanguageModel("gpt-4o-mini"),
          system:
            "You are a research planning assistant. Given a research query, break it into 3-5 specific sub-questions that need to be answered. Return ONLY a JSON array of strings.",
          messages: [{ role: "user", content: query }],
        });

        let subQuestions: string[];
        try {
          const cleaned = decomposition.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
          subQuestions = JSON.parse(cleaned);
          if (!Array.isArray(subQuestions)) subQuestions = [query];
        } catch {
          subQuestions = [query];
        }

        // Step 2: Search for each sub-question
        const allResults: Array<{ question: string; results: Array<{ title: string; url: string; content: string }> }> = [];

        for (let i = 0; i < subQuestions.length; i++) {
          const sq = subQuestions[i];
          send({
            type: "progress",
            message: `Searching: "${sq}" (${i + 1}/${subQuestions.length})`,
          });

          try {
            const searchResponse = await searchWeb(sq, { maxResults: 3, searchDepth: "advanced" });
            allResults.push({ question: sq, results: searchResponse.results });

            await logFeatureUsage(ctx.orgId, ctx.userId, "web_search", 1, {
              query: sq,
              source: "deep_research",
            });
          } catch {
            allResults.push({ question: sq, results: [] });
          }
        }

        // Step 3: Synthesize findings
        send({ type: "progress", message: "Synthesising findings into report..." });

        const sourceContext = allResults
          .map(({ question, results }, qi) => {
            const sources = results
              .map(
                (r, ri) =>
                  `  [${qi + 1}.${ri + 1}] ${r.title} (${r.url})\n  ${r.content}`
              )
              .join("\n");
            return `### ${question}\n${sources || "  No results found."}`;
          })
          .join("\n\n");

        const synthesis = await generateText({
          model: getLanguageModel("gpt-4o"),
          system: `You are a thorough research analyst. Synthesize the following search results into a comprehensive, well-structured research report with inline citations using [source.number] notation. Include:
1. Executive Summary
2. Key Findings (with citations)
3. Analysis & Discussion
4. Conclusions & Recommendations
5. Sources

Format the report in Markdown.`,
          messages: [
            {
              role: "user",
              content: `Research question: ${query}\n\nResearch findings:\n${sourceContext}`,
            },
          ],
        });

        // Step 4: Log usage and send result
        await logFeatureUsage(ctx.orgId, ctx.userId, "deep_research", 1, {
          query,
          sub_questions: subQuestions.length,
          search_count: allResults.reduce((s, r) => s + r.results.length, 0),
        });

        send({ type: "result", report: synthesis.text });
        send({ type: "done" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Research failed";
        send({ type: "error", message: msg });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
