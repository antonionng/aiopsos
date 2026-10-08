import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase/admin';
import {deliverAgentReport} from '@/lib/always-on-agents/report-delivery';
export const dynamic='force-dynamic';
export const maxDuration=120;
export async function GET(request:Request){
 const secret=process.env.CRON_SECRET;if(!secret)return NextResponse.json({error:'Cron is not configured'},{status:503});if(request.headers.get('authorization')!==`Bearer ${secret}`)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data,error}=await supabaseAdmin.from('agent_course_report_emails').select('assessment_id').is('sent_at',null).gte('created_at',new Date(Date.now()-23*60*60*1000).toISOString()).order('created_at').limit(10);
 if(error)return NextResponse.json({error:'Report queue unavailable'},{status:503});let sent=0,pending=0;for(const row of data||[]){try{await deliverAgentReport(row.assessment_id);sent++;}catch{pending++;}}return NextResponse.json({processed:sent,pending});
}
