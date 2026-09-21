import test from "node:test";
import assert from "node:assert/strict";
import { extractLabText, labInsightsSchema } from "./lab-ai-schema.ts";
const bytes=(text:string)=>new TextEncoder().encode(text);
test("notebook review contains source, never stored outputs or embedded media",()=>{
 const r=extractLabText("lab.ipynb",bytes(JSON.stringify({cells:[{cell_type:"code",source:["print(1)"],outputs:[{text:"fake success"}],attachments:{secret:"blob"}}]})));
 assert.equal(r.coverage.status,"read");assert.match(r.text,/print\(1\)/);assert.doesNotMatch(r.text,/fake success|blob/);
});
test("unsupported, corrupt and oversized evidence is explicit",()=>{
 assert.equal(extractLabText("chart.pdf",bytes("pdf")).coverage.status,"manual");
 assert.equal(extractLabText("lab.ipynb",bytes("broken")).coverage.status,"unreadable");
 assert.equal(extractLabText("lab.py",new Uint8Array([255])).coverage.status,"unreadable");
 const r=extractLabText("lab.sql",bytes("123456789"),4);assert.equal(r.text,"1234");assert.equal(r.coverage.status,"truncated");
});
test("draft schema permits uncertainty but rejects scores outside approved range",()=>{
 const draft={summary:"Review",strengths:[],concerns:[],questions:[],criteria:[{criterion_id:"x",suggested_score:null,rationale:"Manual review needed"}],draftFeedback:"Explain your method."};
 assert(labInsightsSchema.safeParse(draft).success);
 assert(!labInsightsSchema.safeParse({...draft,criteria:[{...draft.criteria[0],suggested_score:5}]}).success);
});
