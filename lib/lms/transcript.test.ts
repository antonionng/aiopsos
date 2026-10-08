import {test} from 'node:test';
import assert from 'node:assert/strict';
import {transcriptCsv,type TranscriptRecord} from './transcript.ts';
test('transcript export preserves revoked status and neutralises spreadsheet formulas',()=>{const row:TranscriptRecord={id:'test',kind:'live',title:'=HYPERLINK("example")',status:'completed',completed_at:null,href:'/dashboard/my-learning',certificate:{public_ref:'CERT-1',issued_at:'2026-09-09',revoked_at:'2026-09-10'},attendance_pct:0,grade_pct:0};const csv=transcriptCsv([row]);assert(csv.includes("\"'=HYPERLINK"));assert(csv.includes('"Revoked"'));assert(csv.includes('"0","0"'));});
