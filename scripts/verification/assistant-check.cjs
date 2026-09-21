/* Isolated tool-boundary and Markdown checks. No network or stored user data. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function moduleFrom(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => name in mocks ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}
(async () => {
  let role = 'user', writes = 0, runs = 0, allowed = true, fail = false;
  class LearningError extends Error {}
  const { contextualLearningTools } = moduleFrom('lib/lms/assistant-tools.ts', {
    'server-only': {}, '@/lib/supabase/server': {createClient: async () => {throw new Error('Unexpected live data read in isolated test');}}, ai: { tool: x => x }, './schema': { agentGoalSchema: {} },
    './server': { LearningError, learningActor: async () => ({ userId: 'verified', orgId: 'org', role }), commandForActor: async () => { writes++; return { id: 'task' }; } },
    './task-identity': { learningTaskRequestKey: () => 'stable-request' },
    './task-dispatch': { dispatchLearningTask: async () => { runs++; if (fail) throw new LearningError('Budget reached'); return { id: 'task', state: 'needs_review' }; } },
    '@/lib/rate-limit': { rateLimit: () => ({ success: allowed }) },
  });
  const goal = { kind: 'course', goal: 'Draft a course about checking AI outputs' };
  const tool = () => contextualLearningTools('verified', '/dashboard/agents').tools.prepareLearningTask;
  assert((await tool().execute(goal)).error); assert.equal(writes, 0); assert.equal(runs, 0);
  role = 'manager'; allowed = false;
  assert((await tool().execute(goal)).error); assert.equal(writes, 0);
  allowed = true; const one = tool();
  assert.equal((await one.execute(goal)).state, 'needs_review');
  assert((await one.execute(goal)).error); assert.equal(writes, 1); assert.equal(runs, 1);
  fail = true; const failure = await tool().execute(goal);
  assert.equal(failure.error, 'Budget reached'); assert.equal(failure.href, '/dashboard/agents');
  assert.equal(contextualLearningTools('verified', 'https://untrusted.test').currentPage, '/dashboard/learning');
  const React = require('react'); const { renderToStaticMarkup } = require('react-dom/server');
  const { AssistantMessage } = moduleFrom('components/lms/assistant-message.tsx', {});
  const html = renderToStaticMarkup(React.createElement(AssistantMessage, { text: '## Progress\n\n**Ready**\n\n1. Review\n2. Publish\n\n| Item | Status |\n| --- | --- |\n| Course | Draft |\n\n[unsafe](javascript:alert(1))\n\n<script>alert(1)</script>' }));
  assert(html.includes('<strong>Ready</strong>')); assert(html.includes('<ol>')); assert(html.includes('<table')); assert(html.includes('<h2>Progress</h2>'));
  assert(!html.includes('<script>')); assert(!html.includes('href="javascript:'));
  console.log('PASS: manager permission, rate limit, one task per request, saved-task failure recovery, page allowlist, Markdown headings/lists/tables and unsafe-content handling.');
})().catch(error => { console.error(error); process.exitCode = 1; });
