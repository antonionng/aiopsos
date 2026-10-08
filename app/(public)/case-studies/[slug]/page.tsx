import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { PublicSiteFooter } from '@/components/public/site-footer';
import { caseStudies } from '@/lib/case-studies';
import { getPublicSiteUrl } from '@/lib/site';
import { withSiteShareImages } from '@/lib/social-image';
import '../../ai-labs/labs.css';
export function generateStaticParams() { return caseStudies.map(({slug})=>({slug})); }
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const item = caseStudies.find(s=>s.slug===slug);
  if (!item) return {};
  return withSiteShareImages({title: `${item.title} | Experrt Case Study`, description: item.summary, alternates: {canonical: `/case-studies/${slug}`}, openGraph: {title: item.title, description: item.summary, type: 'article', url: `/case-studies/${slug}`}});
}
export default async function CaseStudyPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const item = caseStudies.find(s=>s.slug===slug);
  if (!item) notFound();
  const schema = {'@context':'https://schema.org','@type':'Article',headline:item.title,description:item.summary,url:`${getPublicSiteUrl()}/case-studies/${slug}`,author:{'@type':'Organization',name:'Experrt',url:getPublicSiteUrl()},about:'Experrt in-house platform implementation'};
  return <div className="labs-page"><SiteNav/><main id="main-content" className="labs-wrap labs-case-main"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><nav aria-label="Breadcrumb"><Link href="/ai-labs">AI Labs</Link> / <Link href="/case-studies">Case studies</Link></nav><p className="labs-kicker">IN-HOUSE BUILD / {item.category}</p><h1>{item.title}</h1><p className="labs-lead">{item.summary}</p><div className="labs-case-context"><strong>Product: Experrt</strong><span>Our own platform · Implementation story</span></div><div className="labs-case-body"><section><h2>The challenge</h2><p>{item.problem}</p></section><section><h2>How we approached it</h2><p>{item.approach}</p></section><section><h2>What we built</h2><ul>{item.delivered.map(d=><li key={d}>{d}</li>)}</ul></section><section><h2>The result and current scope</h2><p>{item.outcome}</p></section><section><h2>What to take into your next project</h2><p>{item.lesson}</p><Link href={`/insights/${item.guide}`}>Read the related implementation guide →</Link></section></div><section className="labs-final"><p className="labs-kicker">FROM OUR BUILD TO YOUR BRIEF</p><h2>Have a similar challenge?</h2><p>Tell us what your users need to accomplish and what needs to connect.</p><Link className="labs-button" href={`/contact?from=ai-labs&case=${item.slug}`}>Discuss your project →</Link><p><Link href="/learning-agent">Explore Experrt’s learning agent</Link> · <Link href="/case-studies">More build stories</Link></p></section></main><PublicSiteFooter showDisclaimer={false}/></div>;
}
