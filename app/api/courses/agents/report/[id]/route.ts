import {NextResponse} from 'next/server';
import {z} from 'zod';
import {ownedAgentCourse} from '@/lib/always-on-agents/learning';
import {loadAgentReport} from '@/lib/always-on-agents/report-delivery';
import {renderAgentAssessmentReport} from '@/lib/pdf/agent-assessment-report';
import {LearningError,learningErrorResponse} from '@/lib/lms/server';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 try{const {order}=await ownedAgentCourse((await params).id);const id=z.string().uuid().safeParse(new URL(request.url).searchParams.get('assessment'));if(!id.success)throw new LearningError('Choose a completed assessment report.',404);
 let report;try{report=await loadAgentReport(id.data,order.id);}catch{throw new LearningError('That report could not be loaded from your course.',404);}
 const pdf=await renderAgentAssessmentReport(report);return new NextResponse(new Uint8Array(pdf),{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="experrt-assessment-report.pdf"','Cache-Control':'private, no-store'}});
 }catch(error){return learningErrorResponse(error);}
}
