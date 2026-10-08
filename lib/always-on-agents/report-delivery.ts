import 'server-only';
import {Resend} from 'resend';
import {supabaseAdmin} from '@/lib/supabase/admin';
import {getPublicSiteUrl} from '@/lib/site';
import {reportHtml,type AgentAssessmentReport} from './report';
import {renderAgentAssessmentReport} from '@/lib/pdf/agent-assessment-report';
import type {AssessmentResult} from './assessment';
export async function loadAgentReport(assessmentId:string,ownedOrderId?:string):Promise<AgentAssessmentReport> {
 const {data:a,error}=await supabaseAdmin.from('agent_course_assessments').select('id,order_id,state,result,finished_at').eq('id',assessmentId).maybeSingle();
 if(error||!a||a.state!=='complete'||(ownedOrderId&&a.order_id!==ownedOrderId))throw new Error('That completed assessment could not be found.');
 const {data:o,error:oe}=await supabaseAdmin.from('agent_course_orders').select('id,user_id,title,learning_pack,status').eq('id',a.order_id).single();
 if(oe||!o)throw new Error('Course order could not be loaded.');
 const [{data:profile,error:pe},{data:cert,error:ce}]=await Promise.all([supabaseAdmin.from('user_profiles').select('name').eq('id',o.user_id).single(),supabaseAdmin.from('agent_course_certificates').select('public_ref').eq('assessment_id',a.id).maybeSingle()]);
 if(pe||ce)throw new Error('Assessment report could not be loaded.');
 const base=getPublicSiteUrl();return {name:profile?.name||'Learner',title:o.title,version:o.learning_pack.version,assessedAt:new Date(a.finished_at).toLocaleDateString('en-GB',{timeZone:'UTC'}),assessmentId:a.id,result:a.result as AssessmentResult,courseUrl:`${base}/courses/agents/learn/${o.id}#practical-assessment`,downloadUrl:`${base}/courses/agents/report/${o.id}?assessment=${a.id}`,certificateUrl:cert&&o.status==='captured'?`${base}/courses/agents/certificate/${cert.public_ref}`:undefined};
}
export async function deliverAgentReport(assessmentId:string){
 if(!process.env.RESEND_API_KEY)throw new Error('Assessment email delivery is not configured.');
 const now=new Date().toISOString();const stale=new Date(Date.now()-5*60*1000).toISOString();
 const {data:claimed,error}=await supabaseAdmin.from('agent_course_report_emails').update({claimed_at:now}).eq('assessment_id',assessmentId).is('sent_at',null).or(`claimed_at.is.null,claimed_at.lt.${stale}`).select('assessment_id,attempts,created_at').maybeSingle();
 if(error)throw new Error('Email delivery could not be reserved.');if(!claimed)return;
 // Provider idempotency lasts 24 hours; stop automatic retries before that window ends.
 if(Date.now()-Date.parse(claimed.created_at)>23*60*60*1000){await supabaseAdmin.from('agent_course_report_emails').update({error:'Automatic retry window expired; the learner can download the report.'}).eq('assessment_id',assessmentId);return;}
 try {
  const {data:a}=await supabaseAdmin.from('agent_course_assessments').select('order_id').eq('id',assessmentId).single();
  const {data:o}=await supabaseAdmin.from('agent_course_orders').select('user_id').eq('id',a!.order_id).single();
  const {data:user,error:ue}=await supabaseAdmin.auth.admin.getUserById(o!.user_id);
  if(ue||!user.user?.email)throw new Error('Learner email could not be loaded.');
  const report=await loadAgentReport(assessmentId);const pdf=await renderAgentAssessmentReport(report);
  const response=await new Resend(process.env.RESEND_API_KEY).emails.send({from:process.env.EMAIL_FROM||'Experrt <noreply@experrt.com>',to:user.user.email,subject:`Your assessment report: ${report.title}`,html:reportHtml(report),attachments:[{filename:'experrt-assessment-report.pdf',content:pdf}]},{idempotencyKey:'agent-assessment-report/'+assessmentId});
  if(response.error)throw new Error('The email provider could not accept the report.');
  const {error:saveError}=await supabaseAdmin.from('agent_course_report_emails').update({sent_at:new Date().toISOString(),error:null,attempts:claimed.attempts+1}).eq('assessment_id',assessmentId);
  if(saveError)throw new Error('Email delivery confirmation could not be saved.');
 }catch{await supabaseAdmin.from('agent_course_report_emails').update({error:'Email delivery will be retried. Your report remains available to download.',claimed_at:null,attempts:claimed.attempts+1}).eq('assessment_id',assessmentId);throw new Error('Assessment report email is pending retry.');}
}
