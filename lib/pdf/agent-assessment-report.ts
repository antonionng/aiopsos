import { createElement as h } from 'react';
import { join } from 'node:path';
import { Document, Page, Text, View, Image, Font, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import type { AgentAssessmentReport } from '../always-on-agents/report.ts';
import { assessmentSkills } from '../always-on-agents/assessment.ts';

Font.register({family:'Experrt Grotesk',src:join(process.cwd(),'public/fonts/space-grotesk-bold.ttf'),fontWeight:700});
const ink='#201C29', violet='#7046EB', citrus='#E4F477', paper='#FFFEFA', muted='#716879';
const styles=StyleSheet.create({
 page:{padding:38,paddingBottom:52,fontFamily:'Helvetica',fontSize:9.5,lineHeight:1.45,color:ink,backgroundColor:paper},
 hero:{backgroundColor:ink,borderRadius:15,padding:22,marginBottom:18},logo:{width:114,height:25,objectFit:'contain',marginBottom:12},
 eyebrow:{fontSize:8,letterSpacing:1.5,color:citrus,marginBottom:10},heading:{fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:29,lineHeight:1.1,color:paper,marginBottom:12},heroText:{fontSize:10,color:'#DAD2E5',maxWidth:360},
 example:{fontSize:7,color:muted,marginBottom:10},name:{fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:17,marginBottom:4},course:{fontSize:12,marginBottom:12},meta:{flexDirection:'row',gap:20,marginBottom:14},metaCol:{flex:1},label:{fontSize:7,letterSpacing:.8,color:muted,marginBottom:3},metaValue:{fontSize:9},
 result:{backgroundColor:'#F0EAFB',borderRadius:12,padding:16,marginBottom:14},resultTitle:{fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:17,color:'#5030AE',marginBottom:12},paragraph:{marginBottom:6},
 sectionHeading:{fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:19,marginBottom:12},sectionIntro:{color:muted,fontSize:10,marginBottom:14},
 scoreRow:{flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#EAE3F0',paddingVertical:6},scoreName:{width:'53%',fontSize:10},dots:{width:'22%',flexDirection:'row',gap:4},dot:{width:15,height:6,borderRadius:3},score:{width:'10%',fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:12,color:violet},scoreStatus:{width:'15%',fontSize:8,color:muted},
 header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:15,borderBottomWidth:1,borderBottomColor:'#E6DFEC',marginBottom:22},miniBrand:{fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:17},miniLabel:{fontSize:8,color:muted},
 skill:{marginBottom:16},skillHead:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:10},number:{fontFamily:'Experrt Grotesk',fontWeight:700,color:violet,fontSize:13,width:22},skillTitle:{flex:1,fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:15,lineHeight:1.3},badge:{backgroundColor:ink,color:citrus,fontSize:12,fontFamily:'Experrt Grotesk',fontWeight:700,borderRadius:7,paddingVertical:5,paddingHorizontal:9},
 next:{backgroundColor:'#F1EDFA',borderRadius:9,padding:11,marginTop:5,marginBottom:10},nextLabel:{fontFamily:'Experrt Grotesk',fontWeight:700,fontSize:10,color:'#5030AE',marginBottom:4},evidence:{borderLeftWidth:2,borderLeftColor:'#C7B9E3',paddingLeft:11,fontSize:8.5,color:muted},
 limits:{borderTopWidth:1,borderTopColor:'#E6DFEC',paddingTop:16,marginTop:8},reference:{fontSize:7,color:muted,marginTop:12},footer:{position:'absolute',bottom:22,left:38,right:38,borderTopWidth:1,borderTopColor:'#E6DFEC',paddingTop:8,flexDirection:'row',justifyContent:'space-between',fontSize:7,color:muted},
});
export function renderAgentAssessmentReport(report:AgentAssessmentReport){
 const p=(text:string)=>h(Text,{style:styles.paragraph},text);
 const footer=()=>h(Text,{fixed:true,style:styles.footer},'EXPERRT ACADEMY  /  Your learning, put into practice.                                      experrt.com');
 const header=()=>h(View,{style:styles.header},h(Text,{style:styles.miniBrand},'Experrt'),h(Text,{style:styles.miniLabel},'YOUR PROJECT REVIEW'));
 const overview=h(Page,{size:'A4',style:styles.page},
  h(View,{style:styles.hero},h(Image,{src:join(process.cwd(),'public/experrt-logo.png'),style:styles.logo}),h(Text,{style:styles.eyebrow},'EXPERRT ACADEMY  /  PRACTICAL ASSESSMENT'),h(Text,{style:styles.heading},'Your project review'),h(Text,{style:styles.heroText},'Understand what your work shows, see where to improve and decide what to practise next.')),
  ...(report.example?[h(Text,{style:styles.example},'EXAMPLE REPORT: fictional learner and illustrative feedback. This is not an issued assessment or certificate.')]:[]),
  h(Text,{style:styles.name},report.name),h(Text,{style:styles.course},report.title),
  h(View,{style:styles.meta},...[[ 'ASSESSED ON',report.assessedAt],['COURSE VERSION',report.version]].map(([label,value])=>h(View,{key:label,style:styles.metaCol},h(Text,{style:styles.label},label),h(Text,{style:styles.metaValue},value)))),
  h(View,{style:styles.result},h(Text,{style:styles.resultTitle},report.result.passed?'You have passed your project assessment':'Your next step is to strengthen your evidence'),p(report.result.summary)),
  h(Text,{style:styles.sectionHeading},'How you did in each skill'),h(Text,{style:styles.sectionIntro},'You need at least 3 out of 4 in every skill to pass. Use the feedback on the following pages to plan your next steps.'),
  ...report.result.skills.map(s=>h(View,{key:s.id,style:styles.scoreRow,wrap:false},h(Text,{style:styles.scoreName},assessmentSkills.find(x=>x.id===s.id)!.title),h(View,{style:styles.dots},...[0,1,2,3].map(i=>h(View,{key:i,style:[styles.dot,{backgroundColor:i<s.score?violet:'#E5DEEE'}]}))),h(Text,{style:styles.score},`${s.score}/4`),h(Text,{style:styles.scoreStatus},s.score>=3?'Met standard':'Keep practising'))),
  h(Text,{style:styles.reference},'Assessment reference: '+report.assessmentId),footer());
 const feedback=[0,2,4].map(start=>h(Page,{key:start,size:'A4',style:styles.page},header(),h(Text,{style:styles.sectionHeading},'Your feedback and next steps'),h(Text,{style:styles.sectionIntro},'Read each skill in turn. Keep the parts that worked, then use the suggested next step to improve or extend your project.'),
  ...report.result.skills.slice(start,start+2).map((s,i)=>h(View,{key:s.id,style:styles.skill,wrap:s.feedback.length+s.nextStep.length+s.evidenceQuote.length>2200},
   h(View,{wrap:false},h(View,{style:styles.skillHead},h(Text,{style:styles.number},String(start+i+1).padStart(2,'0')),h(Text,{style:styles.skillTitle},assessmentSkills.find(x=>x.id===s.id)!.title),h(Text,{style:styles.badge},`${s.score}/4`)),p(s.feedback)),
   h(View,{style:styles.next,wrap:true},h(Text,{style:styles.nextLabel},'What to try next'),p(s.nextStep)),
   ...(s.evidenceQuote?[h(View,{style:styles.evidence},h(Text,{style:styles.label},'THE EVIDENCE USED FOR THIS FEEDBACK'),h(Text,{},s.evidenceQuote))]:[]))),
  ...(start===4?[h(View,{style:styles.limits},h(View,{wrap:false},h(Text,{style:styles.sectionHeading},'What this assessment could check'),p('The AI assessor reviews the text you submit. Keep these limits in mind when using your result.')),...report.result.limitations.map(p),p('This is an Experrt assessment of submitted evidence, not an externally accredited qualification.'),...(report.certificateUrl&&!report.example?[p('Your certificate: '+report.certificateUrl)]:[]))]:[]),footer()));
 return renderToBuffer(h(Document,{title:report.title+' | Your project review',author:'Experrt Academy'},overview,...feedback));
}
