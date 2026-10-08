import { agentMarketingCourses } from "./marketing.ts";

export const AGENT_SHARE_VERSION = "agents-20261002";
export const AGENT_CATALOGUE_DESCRIPTION = "Learn to work with OpenAI Dots, Grok Bot, Claude Cowork and other AI agents. Explore 13 practical courses at £99 each, with AI assessment and a certificate when you pass.";
export type MarketingCourse = (typeof agentMarketingCourses)[number];
export type PublicAgentOffer = { amount: number; currency: string; terms_url: string };

export function agentShareImage(slug: string, base: string) {
  return { url: `${base}/courses/agents/og/${slug}?v=${AGENT_SHARE_VERSION}`, width: 1200, height: 630, alt: `${slug === "catalogue" ? "Always-on AI agent courses" : agentMarketingCourses.find(course => course.slug === slug)?.title || "AI agent courses"} | Experrt Academy` };
}

export function agentCourseMetadata(course: MarketingCourse, base: string) {
  const title = `${course.title} | Experrt Academy`;
  const image = agentShareImage(course.slug, base);
  return {
    title: { absolute: title },
    description: course.summary,
    alternates: { canonical: `${base}${course.href}` },
    openGraph: { type: "website" as const, title, description: course.summary, url: `${base}${course.href}`, siteName: "Experrt", locale: "en_GB", images: [image] },
    twitter: { card: "summary_large_image" as const, title, description: course.summary, images: [image.url] },
  };
}

export function agentCourseFaqs(course: MarketingCourse) {
  return [
    { question: "Who is this course for?", answer: course.audience },
    { question: "What do I need before I start?", answer: `${course.prerequisites} Any subscription or eligible platform account is separate from the course fee.` },
    { question: "What will I make during the course?", answer: course.capstone },
    { question: "How long can I access the course?", answer: "Your purchase includes 12 months of access from payment confirmation. You can work through six modules at your own pace and save your notes in your account." },
    { question: "How do I earn my certificate?", answer: "Submit your practical project and explain the checks you made. The AI assessor checks six skill areas, and you need at least 3 out of 4 in every area to earn your Experrt certificate. You receive feedback and can revise your work. Your fee includes up to twenty completed assessments, with a limit of three in 24 hours. AI assesses the text you submit and cannot open external links, operate your account or independently verify authorship. This is not an externally accredited qualification." },
    { question: "How will I receive my assessment feedback?", answer: "You can read your feedback in the course, download your assessment report as a PDF and receive the report by email at the address on your account." },
  ];
}

export function agentCourseGraph(course: MarketingCourse, base: string, offer: PublicAgentOffer | null) {
  const url = `${base}${course.href}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Course", "@id": `${url}#course`, url, name: course.title, description: course.summary,
        image: `${base}${course.image}`, inLanguage: "en-GB", provider: { "@type": "EducationalOrganization", "@id": `${base}/#organisation`, name: "Experrt", url: base },
        teaches: course.modules.map(module => module.title), coursePrerequisites: course.prerequisites,
        educationalCredentialAwarded: "Experrt certificate after passing the AI practical project assessment",
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", inLanguage: "en-GB" },
        ...(offer ? { offers: { "@type": "Offer", url, price: offer.amount / 100, priceCurrency: offer.currency, availability: "https://schema.org/InStock", category: "Paid" } } : {}),
      },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "AI agent courses", item: `${base}/courses/agents` },
        { "@type": "ListItem", position: 3, name: course.title, item: url },
      ] },
      { "@type": "FAQPage", "@id": `${url}#questions`, mainEntity: agentCourseFaqs(course).map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    ] as const,
  };
}

export function agentCatalogueGraph(base: string) {
  return { "@context": "https://schema.org", "@type": "ItemList", "@id": `${base}/courses/agents#courses`, name: "Experrt always-on AI agent courses", numberOfItems: agentMarketingCourses.length,
    itemListElement: agentMarketingCourses.map((course, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "Course", "@id": `${base}${course.href}#course`, url: `${base}${course.href}`, name: course.title, description: course.summary, provider: { "@type": "EducationalOrganization", "@id": `${base}/#organisation`, name: "Experrt", url: base } } })),
  };
}
