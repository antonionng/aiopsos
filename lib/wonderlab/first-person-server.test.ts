import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as generationRules from "./generation-rules.ts";
import * as firstPerson from "./first-person.ts";

const childId = "10000000-0000-4000-a000-000000000001";
const requestId = "20000000-0000-4000-a000-000000000001";
const design = {
  title: "My private draft title",
  collectible: "star",
  target: 3,
  palette: "twilight",
  speed: "calm",
  bonus: false,
  challenge: "collect",
};
const body = () => ({
  childId,
  requestId,
  current: { ...design },
  intent: { target: 5 },
  allowanceSource: "game-concept-studio",
});
const output = () => ({
  design: { ...design, title: "The Lantern Arcade", target: 5 },
  explanation: "You can now collect five stars to open the gate.",
});

class TestError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
type Row = Record<string, unknown>;
function fixture(options: {
  enabled?: boolean;
  aiEnabled?: boolean;
  band?: string;
  authError?: boolean;
  reserveError?: string;
  finishFails?: boolean;
  blockedAt?: number;
  providerResult?: unknown;
  response?: unknown;
} = {}) {
  const requests: { url: string; body: Row }[] = [];
  const calls: { name: string; args: Row }[] = [];
  let saved: Row | null = null;
  let moderationCount = 0;
  const mocks: Record<string, unknown> = {
    "server-only": {},
    "node:crypto": { createHash },
    "./flags": { launchStatus: () => ({ ai: options.enabled !== false }) },
    "./generation-rules": generationRules,
    "./first-person": firstPerson,
    "./server": {
      WonderlabError: TestError,
      async requireMission(slug: string) {
        assert.equal(slug, "game-concept-studio");
        if (options.authError) throw new TestError("Sign in.", 401);
        return {
          child: { id: childId, nickname: "Player", band: options.band ?? "creators", ai_enabled: options.aiEnabled !== false },
          order: { id: "order", state: "granted", generations_used: 2, generation_period_start: new Date().toISOString() },
        };
      },
      db: {
        async rpc(name: string, args: Row) {
          calls.push({ name, args });
          if (name === "wonderlab_reserve_generation") {
            if (options.reserveError) return { error: { message: options.reserveError }, data: null };
            if (saved) return { error: null, data: saved };
            saved = { state: "pending" };
            return { error: null, data: { ...saved, reserved: true } };
          }
          if (args.p_response === null) {
            saved = { state: "failed" };
            return { error: null, data: false };
          }
          if (options.finishFails) return { error: null, data: false };
          saved = { state: "succeeded", response: args.p_response };
          return { error: null, data: true };
        },
      },
    },
  };
  const exported = {};
  runInNewContext(
    ts.transpileModule(readFileSync(new URL("./first-person-server.ts", import.meta.url), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      exports: exported,
      process: { env: { OPENAI_API_KEY: "test-only", WONDERLAB_AI_MODEL: "configured-model", WONDERLAB_AI_INPUT_USD_PER_MILLION: "1", WONDERLAB_AI_OUTPUT_USD_PER_MILLION: "2" } },
      AbortSignal,
      async fetch(url: string, init: { body: string }) {
        requests.push({ url, body: JSON.parse(init.body) });
        if (url.endsWith("moderations")) {
          moderationCount++;
          return { ok: true, json: async () => ({ results: [{ flagged: options.blockedAt === moderationCount }] }) };
        }
        return {
          ok: true,
          json: async () => options.providerResult ?? {
            choices: [{ finish_reason: "stop", message: { content: JSON.stringify(options.response ?? output()) } }],
            usage: { prompt_tokens: 100, completion_tokens: 40 },
          },
        };
      },
      require(name: string) {
        assert.ok(name in mocks, `Unexpected dependency ${name}`);
        return mocks[name];
      },
    },
  );
  return { server: exported as typeof import("./first-person-server"), requests, calls };
}

test("arcade designs reject executable fields, invalid bounds and coerced enums", () => {
  const { server } = fixture();
  for (const value of [
    { ...design, code: "alert(1)" },
    { ...design, title: "<script>code</script>" },
    { ...design, target: 9 },
    { ...design, target: "5" },
    { ...design, collectible: ["star"] },
    { ...design, bonus: "false" },
    { ...design, speed: "unlimited" },
    { ...design, challenge: "combat" },
    { ...design, challenge: ["key"] },
    { ...design, challenge: undefined },
  ]) assert.throws(() => server.readArcadeDesign(value));
});

test("arcade requests accept only supported changes and never free text", () => {
  const { server } = fixture();
  assert.equal(server.readArcadeRequest(body()).intent.target, 5);
  for (const value of [
    { ...body(), request: "My name is a private name." },
    { ...body(), intent: {} },
    { ...body(), intent: { title: "A new name" } },
    { ...body(), intent: { target: 3 } },
    { ...body(), intent: { target: 100 } },
    { ...body(), intent: { collectible: ["star"] } },
    { ...body(), intent: { challenge: "combat" } },
    { ...body(), allowanceSource: "prompt-repair-shop" },
    { ...body(), requestId: "invalid" },
  ]) assert.throws(() => server.readArcadeRequest(value));
});

test("a key challenge is a bounded change sent to the provider and validated on return", async () => {
  const response = {
    design: { ...design, title: "The Keykeeper's Arcade", challenge: "key" },
    explanation: "You asked for a key, so you will find it as well as three stars before the portal opens.",
  };
  const { server, requests } = fixture({ response });
  const result = await server.generateArcadeDesign({ ...body(), intent: { challenge: "key" } });
  assert.equal(result.design.challenge, "key");
  assert.equal(result.design.target, 3);
  const prompt = requests[1].body.messages as { content: string }[];
  const settings = JSON.parse(prompt[1].content);
  assert.equal(settings.currentDesign.challenge, "collect");
  assert.deepEqual(settings.requestedChange, { challenge: "key" });
});

test("a change to the treasure count preserves an existing key challenge", async () => {
  const request = { ...body(), current: { ...design, challenge: "key" } };
  const { server } = fixture({
    response: { ...output(), design: { ...output().design, challenge: "key" } },
  });
  const result = await server.generateArcadeDesign(request);
  assert.equal(result.design.challenge, "key");
  assert.equal(result.design.target, 5);
  const invalid = fixture();
  await assert.rejects(invalid.server.generateArcadeDesign(request), /requested settings/);
  assert.equal(invalid.calls.at(-1)?.args.p_response, null);
});

test("live context exposes only the active eligible profile and its explicit allowance", async () => {
  const { server, calls, requests } = fixture();
  const result = await server.arcadeContext();
  assert.equal(result.mode, "live-ai");
  assert.equal(result.child?.id, childId);
  assert.equal(result.remaining, 28);
  assert.equal(result.allowanceSource, "game-concept-studio");
  assert.match(result.allowanceLabel, /successful AI design/);
  assert.equal(calls.length, 0);
  assert.equal(requests.length, 0);
});

test("disabled provider gates, missing sessions and younger profiles stay in practice", async () => {
  for (const options of [{ enabled: false }, { aiEnabled: false }, { band: "explorers" }, { authError: true }]) {
    const { server, calls, requests } = fixture(options);
    const context = await server.arcadeContext();
    assert.equal(context.mode, "practice");
    assert.equal(context.child, null);
    await assert.rejects(server.generateArcadeDesign(body()));
    assert.equal(calls.length, 0);
    assert.equal(requests.length, 0);
  }
});

test("a body cannot select a different child's allowance", async () => {
  const { server, calls, requests } = fixture();
  await assert.rejects(server.generateArcadeDesign({ ...body(), childId: requestId }), /Open this child profile/);
  assert.equal(calls.length, 0);
  assert.equal(requests.length, 0);
});

test("successful designs send only enumerated settings and charge after moderation", async () => {
  const { server, requests, calls } = fixture();
  const result = await server.generateArcadeDesign(body());
  assert.equal(result.design.target, 5);
  assert.equal(result.source, "live-ai");
  assert.equal(requests.length, 3);
  const sent = JSON.stringify(requests);
  assert.ok(!sent.includes(design.title));
  assert.ok(!sent.includes(childId));
  assert.ok(!sent.includes(requestId));
  assert.ok(!sent.includes("Player"));
  assert.equal(requests[1].body.store, false);
  assert.equal(calls[0].name, "wonderlab_reserve_generation");
  assert.equal(calls[0].args.p_order, "order");
  assert.equal(calls[1].name, "wonderlab_finish_generation");
  assert.equal(calls[1].args.p_cost_microusd, 180);
  assert.equal(calls[1].args.p_input_tokens, 100);
});

test("duplicate submissions return the saved design without another provider call", async () => {
  const { server, requests, calls } = fixture();
  await server.generateArcadeDesign(body());
  const replay = await server.generateArcadeDesign(body());
  assert.equal(replay.design.target, 5);
  assert.equal(requests.length, 3);
  assert.equal(calls.filter((call) => call.name === "wonderlab_finish_generation").length, 1);
  await assert.rejects(server.generateArcadeDesign({ ...body(), intent: { target: 6 } }), /different design/);
  assert.equal(requests.length, 3);
});

test("exhausted allowance prevents all provider calls", async () => {
  const { server, requests } = fixture({ reserveError: "Allowance reached" });
  await assert.rejects(server.generateArcadeDesign(body()), /used this game's AI responses/);
  assert.equal(requests.length, 0);
});

test("blocked input and output release reservations without consuming allowance", async () => {
  for (const blockedAt of [1, 2]) {
    const { server, calls } = fixture({ blockedAt });
    await assert.rejects(server.generateArcadeDesign(body()), /allowance has not been used/);
    assert.equal(calls.at(-1)?.args.p_response, null);
    assert.equal(calls.filter((call) => call.name === "wonderlab_finish_generation" && call.args.p_response !== null).length, 0);
  }
});

test("invalid, truncated and incorrectly applied recipes are never charged", async () => {
  for (const options of [
    { response: { ...output(), design: { ...output().design, code: "doSomething()" } } },
    { response: { ...output(), design: { ...output().design, target: 4 } } },
    { response: { ...output(), design: { ...output().design, challenge: "key" } } },
    { response: { ...output(), explanation: "Visit https://example.com" } },
    { providerResult: { choices: [{ finish_reason: "length", message: { content: "{}" } }] } },
  ]) {
    const { server, calls } = fixture(options);
    await assert.rejects(server.generateArcadeDesign(body()));
    assert.equal(calls.at(-1)?.args.p_response, null);
    assert.equal(calls.filter((call) => call.name === "wonderlab_finish_generation" && call.args.p_response !== null).length, 0);
  }
});

test("a confirmed failed request can be distinguished from an in-flight request on retry", async () => {
  const { server, calls, requests } = fixture({
    providerResult: { choices: [{ finish_reason: "length", message: { content: "{}" } }] },
  });
  await assert.rejects(server.generateArcadeDesign(body()));
  assert.equal(calls.at(-1)?.args.p_response, null);
  const providerCalls = requests.length;
  await assert.rejects(server.generateArcadeDesign(body()), (error: unknown) => {
    assert.ok(error instanceof TestError);
    assert.equal(error.status, 422);
    assert.match(error.message, /new request/);
    return true;
  });
  assert.equal(requests.length, providerCalls);
  assert.equal(calls.filter((call) => call.name === "wonderlab_finish_generation" && call.args.p_response !== null).length, 0);
});

test("loss of entitlement before finalisation never returns the generated design", async () => {
  const { server, calls } = fixture({ finishFails: true });
  await assert.rejects(server.generateArcadeDesign(body()), /could not be saved/);
  assert.equal(calls.at(-1)?.args.p_response, null);
});
