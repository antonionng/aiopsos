/* Isolated delivery and route checks. No real email or customer records. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function moduleFrom(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => name in mocks ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}
(async () => {
  const schema = moduleFrom('lib/guest-agent.ts', {});
  const session = { id: 'test-session', pack: { title: 'Workshop', summary: 'A practical workshop for the team.', items: [{ title: 'Worksheet', content: 'Complete fictional exercise. '.repeat(10) }] }, briefs: ['Prepare my workshop'], contact: { name: 'Visitor', email: 'visitor@example.com', organisation_name: 'Example', consent: true, company_website: '' }, user_sent: false, lead_sent: false };
  const provider = new Map(), calls = [], leads = [];
  let failLead = true;
  const savedKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = 'isolated-test-only';
  const { deliverGuestPack } = moduleFrom('lib/guest-agent-delivery.ts', {
    'server-only': {}, '@/lib/guest-agent': schema,
    '@/lib/inbound-capture': { captureInbound: async (lead) => { leads.push(lead); } },
    '@/lib/supabase/admin': { supabaseAdmin: { from: () => ({ update: (values) => ({ eq: async () => { Object.assign(session, values); return { error: null }; } }) }) } },
    resend: { Resend: class { emails = { send: async (body, options) => {
      calls.push({ body, key: options.idempotencyKey });
      if (failLead && body.to === 'ag@experrt.com') return { error: { message: 'Temporary test failure' } };
      if (!provider.has(options.idempotencyKey)) provider.set(options.idempotencyKey, body);
      return { data: { id: options.idempotencyKey } };
    } }; } },
  });
  await assert.rejects(deliverGuestPack(session));
  assert.equal(session.user_sent, true); assert.equal(session.lead_sent, false);
  failLead = false;
  await deliverGuestPack(session);
  assert.equal(session.lead_sent, true);
  assert.equal(calls.filter(call => call.body.to === 'visitor@example.com').length, 1);
  assert.equal(provider.size, 2);
  assert.equal(leads[0].source, 'guest_agent'); assert.equal(leads[0].marketing_consent, false);
  assert.deepEqual(leads[0], leads[1]);
  assert(calls[0].body.attachments[0].content.toString().includes(session.pack.items[0].content));
  assert.equal(calls.find(call => call.body.to === 'ag@experrt.com').body.replyTo, 'visitor@example.com');
  await deliverGuestPack(session); assert.equal(calls.length, 3);
  // Simulate a crash after provider acceptance but before the receipt persisted.
  session.user_sent = false;
  await deliverGuestPack(session); assert.equal(provider.size, 2);
  assert.equal(calls.at(-1).key, calls[0].key);
  delete process.env.RESEND_API_KEY; session.user_sent = false;
  await assert.rejects(deliverGuestPack(session)); assert.equal(provider.size, 2);
  if (savedKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = savedKey;
  console.log('PASS: visitor + lead routing, full attachments, saved lead, partial failure, exact retries, no duplicate sends, and missing email configuration.');
})();
