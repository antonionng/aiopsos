import {redirect,notFound} from 'next/navigation';
import {z} from 'zod';
import Link from 'next/link';
import {withSiteShareImages} from '@/lib/social-image';
import {ownedAgentCourse} from '@/lib/always-on-agents/learning';
import {LearningError} from '@/lib/lms/server';
export const dynamic='force-dynamic';
export const metadata=withSiteShareImages({title:'Download your assessment report | Experrt',robots:{index:false,follow:false}});
export default async function ReportDownload({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{assessment?:string}>}){
 const {id}=await params;const {assessment}=await searchParams;if(!z.string().uuid().safeParse(assessment).success)notFound();
 const next=`/courses/agents/report/${id}?assessment=${assessment}`;
 try{await ownedAgentCourse(id);}catch(error){if(error instanceof LearningError&&error.status===401)redirect('/login?next='+encodeURIComponent(next));return <section className="agent-study"><h1>Open your assessment report</h1><p>{error instanceof LearningError?error.message:'Your report could not be opened. Please try again.'}</p><Link href="/courses/agents">Explore your course options</Link></section>;}
 redirect(`/api/courses/agents/report/${id}?assessment=${assessment}`);
}
