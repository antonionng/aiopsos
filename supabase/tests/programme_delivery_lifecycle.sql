begin;
do $$
declare ai jsonb; claimed jsonb; publish_payload jsonb;
 provider uuid:=gen_random_uuid(); client uuid:=gen_random_uuid(); external_org uuid:=gen_random_uuid();
 manager uuid:=gen_random_uuid(); bank uuid:=gen_random_uuid(); trainer uuid:=gen_random_uuid(); panel uuid:=gen_random_uuid(); learner uuid:=gen_random_uuid(); peer uuid:=gen_random_uuid();
 course uuid; version uuid; programme uuid; assignment uuid; response jsonb; plan jsonb; content jsonb; connection uuid;
 baseline uuid:=gen_random_uuid(); common uuid:=gen_random_uuid(); path_a uuid:=gen_random_uuid(); path_b uuid:=gen_random_uuid(); capstone uuid:=gen_random_uuid(); criterion uuid:=gen_random_uuid(); criterion_two uuid:=gen_random_uuid();
 progress uuid; file_id uuid:=gen_random_uuid(); revision int; key uuid:=gen_random_uuid();
begin
 insert into organisations(id,name) values(provider,'Delivery rollback provider'),(client,'Delivery rollback bank'),(external_org,'Delivery rollback trainer');
 insert into auth.users(id,email,email_confirmed_at) values(manager,manager||'@example.invalid',now()),(bank,bank||'@example.invalid',now()),(trainer,trainer||'@example.invalid',now()),(panel,panel||'@example.invalid',now()),(learner,learner||'@example.invalid',now()),(peer,peer||'@example.invalid',now());
 insert into user_profiles(id,org_id,role,email,name) values(manager,provider,'admin',manager||'@example.invalid','Provider'),(bank,client,'admin',bank||'@example.invalid','Bank'),(trainer,external_org,'user',trainer||'@example.invalid','Trainer'),(panel,external_org,'user',panel||'@example.invalid','Panel'),(learner,client,'user',learner||'@example.invalid','Learner'),(peer,client,'user',peer||'@example.invalid','Peer') on conflict(id) do update set org_id=excluded.org_id,role=excluded.role,name=excluded.name;
 content:=jsonb_build_object('title','Delivery lifecycle test','summary','Synthetic rollback test','category','technology','outcomes',jsonb_build_array('Demonstrate SQL'),
 'activities',jsonb_build_array(
 jsonb_build_object('id',baseline,'title','Entry SQL','kind','practice','content','Describe a query','minutes',10,'criteria','Accuracy'),
 jsonb_build_object('id',common,'title','Foundation','kind','lesson','content','Read material','minutes',10),
 jsonb_build_object('id',path_a,'title','Applied','kind','lesson','content','Applied lesson','minutes',10),
 jsonb_build_object('id',path_b,'title','Modelling','kind','lesson','content','Model lesson','minutes',10),
 jsonb_build_object('id',capstone,'title','Final SQL','kind','practice','content','Demonstrate a solution','minutes',10,'criteria','Accuracy')));
 response:=lms_command(manager,'course.save',jsonb_build_object('content',content));course:=(response->>'id')::uuid;
 response:=lms_command(manager,'course.publish',jsonb_build_object('id',course,'revision',1));version:=(response->>'id')::uuid;
 response:=lms_command(manager,'client.request',jsonb_build_object('client_org_id',client));connection:=(response->>'id')::uuid;
 perform lms_command(bank,'client.respond',jsonb_build_object('id',connection,'accept',true));
 response:=lms_command(manager,'programme.create',jsonb_build_object('title','Lifecycle test','goal','Assess SQL competence','version_ids',jsonb_build_array(version),'client_org_id',client));programme:=(response->>'id')::uuid;
 perform lms_command(bank,'programme.assign',jsonb_build_object('id',programme,'user_ids',jsonb_build_array(learner,peer)));
 select id into assignment from lms_assignments where programme_id=programme and user_id=learner;
 begin perform lms_delivery_command(trainer,external_org,programme,'get');raise exception 'FAIL external read';exception when insufficient_privilege then null;end;
 perform lms_delivery_command(manager,provider,programme,'staff.invite',jsonb_build_object('email',trainer||'@example.invalid','role','trainer','target_user_id',trainer));
 begin perform lms_delivery_command(trainer,external_org,programme,'get');raise exception 'FAIL pending read';exception when insufficient_privilege then null;end;
 perform lms_delivery_command(trainer,external_org,programme,'staff.accept');
 perform lms_delivery_command(trainer,external_org,programme,'staff.accept');
 perform lms_discussion(trainer,programme);
 perform lms_delivery_command(manager,provider,programme,'staff.invite',jsonb_build_object('email',panel||'@example.invalid','role','reviewer','target_user_id',panel));
 perform lms_delivery_command(panel,external_org,programme,'staff.accept');
 plan:=jsonb_build_object('brief','Practical SQL and applied banking','targetRoles','Analyst','hours',100,'labUrl','','minimumPanelReviews',1,'activities',jsonb_build_array(
 jsonb_build_object('id',baseline,'stage','baseline','passPercent',60,'criteria',jsonb_build_array(jsonb_build_object('id',criterion,'skill','SQL','description','Accurate query'))),
 jsonb_build_object('id',common,'stage','core','passPercent',60,'criteria','[]'::jsonb),
 jsonb_build_object('id',path_a,'stage','pathway_a','passPercent',60,'criteria','[]'::jsonb),
 jsonb_build_object('id',path_b,'stage','pathway_b','passPercent',60,'criteria','[]'::jsonb),
 jsonb_build_object('id',capstone,'stage','capstone','passPercent',60,'criteria',jsonb_build_array(jsonb_build_object('id',criterion,'skill','SQL','description','Accurate query','weight',25),jsonb_build_object('id',criterion_two,'skill','Reasoning','description','Justified explanation','weight',75)))));
 perform lms_delivery_command(trainer,external_org,programme,'plan.save',jsonb_build_object('revision',0,'plan',plan));
 response:=lms_command(learner,'learning.get',jsonb_build_object('id',assignment));
 assert jsonb_array_length(response->'activities')=0,'Draft plan exposed learner activities';
 begin perform lms_delivery_command(manager,provider,programme,'plan.release','{"revision":1}');raise exception 'FAIL unapproved release';exception when insufficient_privilege then null;end;
 perform lms_delivery_command(manager,provider,programme,'plan.approve','{"revision":1}');
 perform lms_delivery_command(bank,client,programme,'plan.approve','{"revision":1}');
 perform lms_delivery_command(manager,provider,programme,'plan.release','{"revision":1}');
 response:=lms_command(learner,'learning.get',jsonb_build_object('id',assignment));
 assert jsonb_array_length(response->'activities')=2,'Pathway gate did not hide future content';
 begin perform lms_command(learner,'learning.submit',jsonb_build_object('id',assignment,'activity_id',path_b));raise exception 'FAIL bypass gate';exception when insufficient_privilege then null;end;
 perform lms_delivery_command(learner,client,programme,'file.register',jsonb_build_object('id',file_id,'assignment_id',assignment,'activity_id',baseline,'name','query.sql','bytes',100,'sha256',repeat('a',64),'object_path','rollback/'||file_id));
 response:=lms_command(learner,'learning.submit',jsonb_build_object('id',assignment,'activity_id',baseline,'answer','SELECT the correct values'),key);progress:=(response->>'id')::uuid;
 perform lms_command(learner,'learning.submit',jsonb_build_object('id',assignment,'activity_id',baseline,'answer','SELECT the correct values'),key);
 assert (select count(*)=1 from lms_attempt_history where assignment_id=assignment and action='learning.submit'),'Duplicate submission created an attempt';
 assert (select attempt_id is not null from lms_delivery_files where id=file_id),'File not linked to immutable attempt';
 assert (select count(*)=1 from lms_lab_ai_reviews where progress_id=progress),'AI queue must be atomic and idempotent';
 begin perform lms_lab_ai_ensure(learner,client,programme,progress);raise exception 'FAIL learner AI read';exception when insufficient_privilege then null;end;
 begin perform lms_lab_ai_ensure(bank,client,programme,progress);raise exception 'FAIL bank AI read';exception when insufficient_privilege then null;end;
 begin perform lms_lab_ai_ensure(panel,external_org,programme,progress);raise exception 'FAIL panel AI read';exception when insufficient_privilege then null;end;
 ai:=lms_lab_ai_ensure(trainer,external_org,programme,progress);
 claimed:=lms_lab_ai_claim((ai->>'id')::uuid);
 assert claimed->'files'->0->>'name'='query.sql','AI did not receive attempt-bound evidence';
 assert lms_lab_ai_claim((ai->>'id')::uuid) is null,'Concurrent worker claimed running job';
 assert not lms_lab_ai_finish((ai->>'id')::uuid,gen_random_uuid(),'{}','[]','test',1,1),'Wrong worker saved private draft';
 assert lms_lab_ai_finish((ai->>'id')::uuid,(claimed->'draft'->>'claim_token')::uuid,'{"summary":"PRIVATE DRAFT"}','[]','test',1,1),'Draft did not save';
 response:=lms_delivery_command(learner,client,programme,'get');
 assert position('PRIVATE DRAFT' in response::text)=0,'Draft leaked to learner';
 assert (select state='submitted' from lms_activity_progress where id=progress),'AI draft changed learner completion';
 begin perform lms_command(manager,'learning.review',jsonb_build_object('id',progress,'revision',1,'decision','passed','feedback','Bypass rubric'));raise exception 'FAIL legacy review';exception when raise_exception then assert sqlerrm like 'Use the programme assessment%','Unexpected legacy failure';end;
 begin perform lms_delivery_command(panel,external_org,programme,'review',jsonb_build_object('progress_id',progress,'revision',1,'decision','panel','feedback','Outside panel scope','scores',jsonb_build_object(criterion,3)));raise exception 'FAIL panel scope';exception when insufficient_privilege then null;end;
 publish_payload:=jsonb_build_object('ai_review_id',ai->>'id','progress_id',progress,'revision',1,'decision','returned','feedback','Human checked and edited the draft','scores',jsonb_build_object(criterion,1));
 begin perform lms_lab_ai_publish(learner,client,programme,publish_payload,gen_random_uuid());raise exception 'FAIL learner publishes';exception when insufficient_privilege then null;end;
 perform lms_lab_ai_publish(trainer,external_org,programme,publish_payload,gen_random_uuid());
 perform lms_lab_ai_publish(trainer,external_org,programme,publish_payload,gen_random_uuid());
 assert (select status='published' and insights->>'summary'='PRIVATE DRAFT' from lms_lab_ai_reviews where id=(ai->>'id')::uuid),'Original AI draft lost';
 assert (select feedback='Human checked and edited the draft' from lms_activity_progress where id=progress),'Human feedback not published';
 perform lms_command(learner,'learning.submit',jsonb_build_object('id',assignment,'activity_id',common));
 perform lms_delivery_command(trainer,external_org,programme,'decision',jsonb_build_object('assignment_id',assignment,'kind','pathway_a','reason','Baseline and common work reviewed; applied pathway agreed'));
 response:=lms_command(learner,'learning.get',jsonb_build_object('id',assignment));
 assert not exists(select 1 from jsonb_array_elements(response->'activities') a where a->>'id'=path_b::text),'Wrong pathway exposed';
 perform lms_command(learner,'learning.submit',jsonb_build_object('id',assignment,'activity_id',path_a));
 response:=lms_command(learner,'learning.submit',jsonb_build_object('id',assignment,'activity_id',capstone,'answer','Final accurate solution'));progress:=(response->>'id')::uuid;
 begin perform lms_delivery_command(trainer,external_org,programme,'review',jsonb_build_object('progress_id',progress,'revision',1,'decision','passed','feedback','Passed without panel','scores',jsonb_build_object(criterion,3,criterion_two,4)));raise exception 'FAIL panel requirement';exception when raise_exception then assert sqlerrm like 'Independent panel reviews%','Unexpected panel failure';end;
 perform lms_delivery_command(panel,external_org,programme,'review',jsonb_build_object('progress_id',progress,'revision',1,'decision','panel','feedback','Panel confirms accurate query','scores',jsonb_build_object(criterion,3,criterion_two,4)));
 begin perform lms_delivery_command(trainer,external_org,programme,'review',jsonb_build_object('progress_id',progress,'revision',1,'decision','passed','feedback','Below threshold test','scores',jsonb_build_object(criterion,1,criterion_two,1)));raise exception 'FAIL threshold';exception when raise_exception then assert sqlerrm like 'The evidence does not meet%','Unexpected threshold failure';end;
 perform lms_delivery_command(trainer,external_org,programme,'review',jsonb_build_object('progress_id',progress,'revision',1,'decision','passed','feedback','Reviewed panel evidence and passed','scores',jsonb_build_object(criterion,3,criterion_two,4)));
 assert (select (snapshot->>'percent')::numeric=93.75 from lms_attempt_history where assignment_id=assignment and action='learning.review' and snapshot->>'activity_id'=capstone::text order by created_at desc,id desc limit 1),'Weighted criteria did not produce 93.75 percent';
 assert (select completed_at is not null from lms_assignments where id=assignment),'Branch completion missing';
 begin perform lms_delivery_command(trainer,external_org,programme,'decision',jsonb_build_object('assignment_id',assignment,'kind','ready','reason','Trainer attempts final sign-off'));raise exception 'FAIL readiness authority';exception when insufficient_privilege then null;end;
 perform lms_delivery_command(manager,provider,programme,'decision',jsonb_build_object('assignment_id',assignment,'kind','ready','reason','Panel and trainer assessments reviewed; readiness signed off'));
 response:=lms_delivery_command(learner,client,programme,'get');
 assert jsonb_array_length(response->'records')=1,'Learner can read peer evidence';
 assert jsonb_array_length(response->'records'->0->'reviews')=0,'Learner sees private panel review';
 assert response::text not like '%object_path%','Storage paths exposed';
 begin perform lms_delivery_command(peer,client,programme,'file.read',jsonb_build_object('id',file_id));raise exception 'FAIL peer file access';exception when insufficient_privilege then null;end;
 perform lms_delivery_command(manager,provider,programme,'staff.revoke',jsonb_build_object('user_id',trainer));
 begin perform lms_discussion(trainer,programme);raise exception 'FAIL revoked discussion';exception when insufficient_privilege then null;end;
 begin perform lms_delivery_command(trainer,external_org,programme,'get');raise exception 'FAIL revoked trainer';exception when insufficient_privilege then null;end;
 assert not has_function_privilege('authenticated','lms_delivery_command(uuid,uuid,uuid,text,jsonb,uuid)','EXECUTE'),'Browser may impersonate delivery actor';
 assert not has_table_privilege('authenticated','lms_delivery_files','SELECT'),'Private files exposed';
 assert not has_schema_privilege('authenticated','learning_internal','USAGE'),'Legacy bypass exposed';
end $$;
select 'PASS: consent, roles, approval, pathway gates, immutable file evidence, rubric scoring, panel independence, readiness authority, isolation and revocation' as result;
rollback;
