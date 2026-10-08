import { liveNextStep, type LiveProgress } from './delivery-progress.ts';
export type CourseworkProgress = {passed:number;total:number;awaitingReview:number;needsRevision:number;completedAt:string|null};
export type JourneyStep = {
  state:'setup'|'learning'|'revision'|'review'|'live'|'certificate_review'|'complete';
  title:string;
  message:string;
  owner:'learner'|'trainer'|'manager'|'none';
  destination:'learning'|'sessions'|'results';
  cohortId?:string;
  completed:boolean;
};
/** Read-only reconciliation. Never issues a credential or overwrites completion. */
export function programmeJourney(course:CourseworkProgress, live:LiveProgress[]):JourneyStep {
  const step=(value:Omit<JourneyStep,'completed'>):JourneyStep=>({...value,completed:false});
  if(course.total<=0) return step({state:'setup',title:'Learning content needs attention',message:'No course activities are available. Your learning manager needs to check the programme.',owner:'manager',destination:'learning'});
  if(course.needsRevision>0) return step({state:'revision',title:'Put your feedback into practice',message:`${course.needsRevision} activit${course.needsRevision===1?'y needs':'ies need'} another attempt. Open your feedback before resubmitting.`,owner:'learner',destination:'learning'});
  if(course.passed<course.total) {
    const remaining=Math.max(0,course.total-course.passed-course.awaitingReview);
    if(remaining>0) return step({state:'learning',title:'Continue learning and practising',message:`${course.passed} of ${course.total} activities passed. ${remaining} still need your attention.`,owner:'learner',destination:'learning'});
    return step({state:'review',title:'Your trainer is reviewing your work',message:`${course.awaitingReview} submission${course.awaitingReview===1?' is':'s are'} awaiting review. You can continue preparing for any scheduled sessions.`,owner:'trainer',destination:'results'});
  }
  if(!course.completedAt) return step({state:'review',title:'Check the coursework completion record',message:'The activity results and completion record need to be reconciled by your learning team.',owner:'trainer',destination:'results'});
  // An issued credential is authoritative, but a cancellation, withdrawal or
  // revocation still needs attention even when an older certificate exists.
  const pending=live.map(item=>({item,next:liveNextStep(item)})).filter(({next})=>next.state!=='certified');
  if(!pending.length) return {state:'complete',title:live.length?'Your linked learning is complete':'Your coursework is complete',message:live.length?'Coursework completion and all linked live-training certificates are recorded.':'All programme activities are passed and coursework completion is recorded. No live groups are linked.',owner:'none',destination:'results',completed:true};
  const priority=['cancelled','withdrawn','review_needed','not_enrolled','invited','awaiting_schedule','attendance_gap','grade_gap','scheduled','awaiting_register','awaiting_grade','ready_for_review'];
  const {item,next}=pending.sort((a,b)=>priority.indexOf(a.next.state)-priority.indexOf(b.next.state))[0];
  const ready=next.state==='ready_for_review';
  const owner=next.state==='scheduled'?'learner': ['not_enrolled','invited','awaiting_schedule','cancelled','withdrawn'].includes(next.state)?'manager':'trainer';
  return step({state:ready?'certificate_review':'live',title:ready?'Ready for certificate review':next.state==='scheduled'?'Your next step is live training':'Your live training needs attention',message:`${item.title}: ${next.message}`,owner,destination:'sessions',cohortId:item.cohortId});
}
