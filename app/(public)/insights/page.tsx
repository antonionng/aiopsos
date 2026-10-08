import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Rss } from "lucide-react";
import { getInsightTopics, getPublishedInsights, insightReadingMinutes } from "@/lib/insights/catalog";
import { insightsIndexMetadata } from "@/lib/public-share-metadata";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";
import { InsightList } from "@/components/public/insight-list";
import { InsightSubscribe } from "@/components/public/insight-subscribe";
import { getPublicSiteUrl } from "@/lib/site";

export const metadata: Metadata = insightsIndexMetadata();
import { INSIGHT_TOPIC_PAGES } from "@/lib/insights/topics";

const paths = [
  {label: "Transform HR through technology", text: "A 90-day roadmap connecting employee experience, people operations and reliable systems.", slug: "hr-transformation-roadmap-template", number: "04"},
  {label: "Find the skills gap", text: "A practical question set to turn a broad training request into a useful brief.", slug: "ai-training-needs-analysis-template", number: "01"},
  {label: "Make AI useful at work", text: "One team. One workflow. A 30-day plan to learn what actually helps.", slug: "30-day-ai-adoption-plan", number: "02"},
  {label: "Choose your learning platform", text: "Bring your real delivery journey to the demo. Ask the questions that matter.", slug: "lms-buyers-checklist-training-providers", number: "03"},
];

export default function InsightsIndexPage() {
  const articles = getPublishedInsights();
  const cards = articles.map(article => ({slug: article.slug, title: article.title, dek: article.dek, publishedAt: article.publishedAt, topic: article.topic, readingMinutes: insightReadingMinutes(article)}));
  const site = getPublicSiteUrl();
  return (
    <div>
      <StructuredData data={ORGANISATION_LD} />
      <StructuredData data={{"@context":"https://schema.org", "@type":"CollectionPage", name:"Experrt Insights", url:`${site}/insights`, description:"Practical guides to AI training, HR transformation and better learning.", mainEntity: {"@type":"ItemList", itemListElement:articles.map((article,i) => ({"@type":"ListItem",position:i+1,url:`${site}/insights/${article.slug}`,name:article.title}))}}} />
      <header className="mb-12 grid items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">The Experrt playbook</p>
          <h1 className="mb-6 text-5xl font-bold tracking-[-0.045em] sm:text-6xl">Big ideas.<br />Useful next moves.</h1>
          <p className="mb-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Practical guides to AI training, HR transformation and better learning. Borrow a template. Try a new approach. Turn a good read into progress.</p>
          <a href="#guides" className="inline-flex items-center gap-2 text-sm font-semibold">Explore {articles.length} guides <ArrowRight className="h-4 w-4" /></a>
        </div>
        <aside className="relative overflow-hidden rounded-3xl bg-[#201C29] p-7 text-[#FFFEFA] sm:p-8">
          <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[25px] border-[#7046EB]" />
          <Compass className="relative mb-7 h-8 w-8 text-[#E4F477]" aria-hidden />
          <p className="relative mb-3 text-xs font-semibold uppercase tracking-widest text-[#E4F477]">Find your starting point</p>
          <h2 className="relative mb-4 max-w-xs text-2xl font-semibold leading-tight">What could learning unlock for you?</h2>
          <p className="relative mb-6 text-sm leading-relaxed text-white/75">Answer a few questions about your work. Get a clearer picture of where to start.</p>
          <Link href="/assessment/start" className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E4F477] px-5 py-3 text-sm font-semibold text-[#201C29]">Find my learning priorities <ArrowRight className="h-4 w-4" /></Link>
          <p className="relative mt-3 text-xs leading-relaxed text-white/65">Free learning check. Name and email unlock your results. Marketing is optional.</p>
        </aside>
      </header>
      <section className="mb-14" aria-labelledby="start-heading">
        <h2 id="start-heading" className="mb-5 text-xl font-semibold tracking-tight">Start with the question on your desk.</h2>
        <div className="grid gap-4 md:grid-cols-2">{paths.map(path => <Link key={path.slug} href={`/insights/${path.slug}`} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/60"><span className="mb-6 text-3xl font-bold tracking-tight text-brand/60" aria-hidden>{path.number}</span><h3 className="mb-3 text-lg font-semibold leading-tight group-hover:text-brand">{path.label}</h3><p className="mb-5 text-sm leading-relaxed text-muted-foreground">{path.text}</p><span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold">Get the guide <ArrowRight className="h-4 w-4" /></span></Link>)}</div>
      </section>
      <nav aria-label="Guide subjects" className="mb-10 flex flex-wrap gap-3">{INSIGHT_TOPIC_PAGES.map(entry=><Link key={entry.slug} href={`/insights/topic/${entry.slug}`} className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand">{entry.topic} guides</Link>)}</nav>
      <section id="guides" className="scroll-mt-24" aria-labelledby="guides-heading">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3"><h2 id="guides-heading" className="text-2xl font-semibold tracking-tight">Ideas you can put to work.</h2><Link href="/insights/rss.xml" className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Rss className="h-3.5 w-3.5" />Follow via RSS</Link></div>
        <InsightList articles={cards} topics={getInsightTopics()} />
      </section>
      <div className="mt-14"><InsightSubscribe source="insights_index" heading="Keep your curiosity moving." blurb="Get new Experrt briefings by email. Confirm your subscription first, and unsubscribe whenever you like." /></div>
      <section className="mt-6 flex flex-col gap-5 rounded-3xl bg-[#7046EB] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="max-w-xl"><h2 className="mb-2 text-2xl font-semibold tracking-tight">Ready to turn the page into a plan?</h2><p className="text-sm leading-relaxed text-white/80">Bring us the ambition. We’ll explore the training, platform or practical support to help you move forward.</p></div><Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E4F477] px-6 py-3 text-sm font-semibold text-[#201C29]">Let’s talk <ArrowRight className="h-4 w-4" /></Link></section>
    </div>
  );
}
