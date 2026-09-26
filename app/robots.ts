import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site";

const BASE_URL = getPublicSiteUrl();

const ALLOW = ["/", "/assessment/start", "/api/og/", "/llms.txt", "/llms-full.txt"];

// Signed-in surfaces, one-time assessment links and individual certificates
// have no business in an index. The certificate pages in particular name a
// person; the holder shares the link, a crawler should not surface it.
const DISALLOW = [
  "/dashboard/",
  "/api/",
  "/learning-agent/chat",
  "/assess/",
  "/assessment/",
  "/verify/",
  "/shared/",
  "/login",
  "/register",
  "/reset-password",
  "/forgot-password",
  "/learn/welcome",
  "/learn/my-courses",
  "/learn/*/certificate",
];

// Named so the policy is explicit: we want AI search and answer engines to
// read and cite the public catalogue.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ALLOW, disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: ALLOW, disallow: DISALLOW },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
