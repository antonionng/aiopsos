import test from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema, formatContactEnquiry } from '../contact-enquiry.ts';
const base = {request_id:'ec01d222-c456-4d70-8342-597933d0b445',name:'Test',email:'test@example.com',message:'Build a service'};
test('AI Labs brief retains delivery details and correct source paths',()=>{
 const input=contactSchema.parse({...base,interest:'AI Labs consulting & delivery',source_article:'ai-labs',source_case_study:'experrt-learning-agent-reliability',project_service:'HR transformation',project_stage:'Prototype or pilot',project_timeline:'Within 3 months',project_systems:'HRIS and payroll',team_size:'201+'});
 const message=formatContactEnquiry(input);
 for(const value of ['HR transformation','Prototype or pilot','Within 3 months','HRIS and payroll','From: /ai-labs','/case-studies/experrt-learning-agent-reliability']) assert.ok(message.includes(value));
 assert.ok(!message.includes('/insights/ai-labs'));assert.ok(!message.includes('People learning'));
});
test('normal contact remains compatible and ignores hidden project details',()=>{
 const message=formatContactEnquiry(contactSchema.parse({...base,interest:'Train my team',team_size:'11–50',project_systems:'Hidden'}));
 assert.ok(message.includes('People learning: 11–50'));assert.ok(!message.includes('Hidden'));
});
test('brief rejects unsupported options and oversized systems descriptions',()=>{
 assert.equal(contactSchema.safeParse({...base,project_service:'invalid'}).success,false);
 assert.equal(contactSchema.safeParse({...base,project_systems:'x'.repeat(1001)}).success,false);
});
