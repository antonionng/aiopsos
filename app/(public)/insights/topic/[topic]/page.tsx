import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSIGHT_TOPIC_PAGES } from '@/lib/insights/topics';
import { getInsightsByTopic, insightReadingMinutes } from '@/lib/insights/catalog';
import { InsightList } from '@/components/public/insight-list';
import { StructuredData } from '@/components/structured-data';
import { getPublicSiteUrl } from '@/lib/site';
import { siteShareImage } from '@/lib/social-image';

export function generateStaticParams() { return INSIGHT_TOPIC_PAGES.map(({slug}) => ({topic: slug})); }
export async function generateMetadata({params}:{params:Promise<{topic:string}>}):Promise<Metadata> {
  const {topic} = await params;
  const entry = INSIGHT_TOPIC_PAGES.find(item => item.slug === topic);
  if (!entry) return {title:'Topic not found',robots:{index:false,follow:false}};
  return {title:`${entry.topic} guides & templates`,description:entry.description,alternates:{canonical:`/insights/topic/${topic}`},openGraph:{title:`${entry.topic} guides | Experrt`,description:entry.description,url:`/insights/topic/${topic}`,images:[siteShareImage()]}};
}
export default async function TopicPage({params}:{params:Promise<{topic:string}>}) {
  const {topic} = await params;
  const entry = INSIGHT_TOPIC_PAGES.find(item => item.slug === topic);
  if (!entry) notFound();
  const articles = getInsightsByTopic(entry.topic);
  const site = getPublicSiteUrl();
  return <div>
    <StructuredData data={{'@context':'https://schema.org','@type':'CollectionPage',name:`${entry.topic} guides`,description:entry.description,url:`${site}/insights/topic/${topic}`,mainEntity:{'@type':'ItemList',itemListElement:articles.map((article,index)=>({'@type':'ListItem',position:index+1,name:article.title,url:`${site}/insights/${article.slug}`}))}}} />
    <Link href="/insights" className="text-sm text-brand">← All guides</Link>
    <header className="my-9 max-w-3xl"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand">The Experrt playbook</p><h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">{entry.topic} guides</h1><p className="text-lg leading-relaxed text-muted-foreground">{entry.description}</p></header>
    <InsightList articles={articles.map(article=>({slug:article.slug,title:article.title,dek:article.dek,publishedAt:article.publishedAt,topic:article.topic,readingMinutes:insightReadingMinutes(article)}))} topics={[]} />
    <div className="mt-10 rounded-2xl bg-brand/10 p-7"><h2 className="mb-3 text-xl font-semibold">Put the guide into practice.</h2><p className="mb-5 text-muted-foreground">Explore facilitated courses or discuss a programme for your team.</p><div className="flex flex-wrap gap-6"><Link className="font-semibold text-brand" href={topic==='hr-transformation'?'/courses?category=hr':'/courses'}>Explore the academy →</Link><Link className="font-semibold" href={`/contact?from=${topic}-guides`}>Discuss your goals →</Link></div></div>
  </div>;
}
