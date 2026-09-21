import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { PublicSiteFooter } from '@/components/public/site-footer';
import { caseStudies } from '@/lib/case-studies';
import { withSiteShareImages } from '@/lib/social-image';
import '../ai-labs/labs.css';
export const metadata: Metadata = withSiteShareImages({title: 'AI & Product Build Case Studies | Experrt', description: 'Explore how we built connected learning workflows, agent execution records and controlled resource access in Experrt.', alternates: {canonical: '/case-studies'}});
export default function CaseStudiesPage() {
  return <div className="labs-page"><SiteNav/><main id="main-content" className="labs-wrap labs-case-main"><p className="labs-kicker">EXPERRT AI LABS / OUR WORK</p><h1>Inside the build.</h1><p className="labs-lead">Three implementation stories from our own Experrt platform. A closer look at the problems, engineering decisions and work delivered.</p><p>These are different parts of one in-house product, not separate client engagements.</p><div className="labs-guides">{caseStudies.map(item=><Link key={item.slug} href={`/case-studies/${item.slug}`}><span>IN-HOUSE BUILD / {item.category}</span><h2>{item.title}</h2><p>{item.summary}</p><strong>Find out more →</strong></Link>)}</div><div className="labs-final"><h2>What could this look like for you?</h2><p>Explore our consulting and delivery services, then bring us the workflow or product you want to improve.</p><Link className="labs-button" href="/ai-labs">Explore AI Labs →</Link></div></main><PublicSiteFooter showDisclaimer={false}/></div>;
}
