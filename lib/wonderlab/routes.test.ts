import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import * as crypto from "node:crypto";
import ts from "typescript";
import { PGlite } from "@electric-sql/pglite";
import * as catalogue from "./catalog.ts";
import * as versions from "./versions.ts";
import * as engine from "./engine.ts";
import * as membershipRules from "./membership-rules.ts";
import * as generationRules from "./generation-rules.ts";
import type Stripe from "stripe";

type Row = Record<string, unknown>;
const parent = "10000000-0000-4000-a000-000000000001";
const other = "10000000-0000-4000-a000-000000000002";
const origin = "https://wonderlab.example";
const quote = (name: string) => {
  assert.match(name, /^[a-z_][a-z_0-9]*$/);
  return `"${name}"`;
};

// Adapt the small PostgREST surface used by these routes to real isolated SQL.
// Ownership filters, mutations and RPC transactions run against the migration.
function database(pg: PGlite) {
  return {
    from(table: string) {
      let columns = "*",
        operation = "select",
        values: Row = {},
        single = false;
      let count = false,
        conflict = "";
      const predicates: string[] = [],
        params: unknown[] = [];
      const bind = (value: unknown) => {
        params.push(value);
        return `$${params.length}`;
      };
      const builder = {
        select(cols = "*", options?: { count?: string }) {
          columns = cols === "*" ? "*" : cols.split(",").map(quote).join(",");
          count = !!options?.count;
          return builder;
        },
        eq(key: string, value: unknown) {
          predicates.push(`${quote(key)}=${bind(value)}`);
          return builder;
        },
        gt(key: string, value: unknown) {
          predicates.push(`${quote(key)}>${bind(value)}`);
          return builder;
        },
        is(key: string, value: unknown) {
          assert.equal(value, null);
          predicates.push(`${quote(key)} is null`);
          return builder;
        },
        in(key: string, items: unknown[]) {
          predicates.push(`${quote(key)} in (${items.map(bind).join(",")})`);
          return builder;
        },
        order() {
          return builder;
        },
        insert(row: Row) {
          operation = "insert";
          values = row;
          return builder;
        },
        upsert(
          row: Row,
          options: { onConflict: string; ignoreDuplicates: boolean },
        ) {
          assert.equal(options.ignoreDuplicates, true);
          operation = "insert";
          values = row;
          conflict = ` on conflict (${options.onConflict.split(",").map(quote).join(",")}) do nothing`;
          return builder;
        },
        update(row: Row) {
          operation = "update";
          values = row;
          return builder;
        },
        delete() {
          operation = "delete";
          return builder;
        },
        maybeSingle() {
          single = true;
          return builder;
        },
        single() {
          single = true;
          return builder;
        },
        async then(resolve: (value: unknown) => unknown) {
          try {
            const where = predicates.length
              ? ` where ${predicates.join(" and ")}`
              : "";
            let sql = `select ${columns} from ${quote(table)}${where}`;
            if (operation === "insert")
              sql = `insert into ${quote(table)} (${Object.keys(values).map(quote).join(",")}) values (${Object.values(values).map(bind).join(",")})${conflict} returning *`;
            if (operation === "update")
              sql = `update ${quote(table)} set ${Object.entries(values)
                .map(([key, value]) => `${quote(key)}=${bind(value)}`)
                .join(",")}${where} returning *`;
            if (operation === "delete")
              sql = `delete from ${quote(table)}${where} returning *`;
            const result = await pg.query(sql, params);
            return resolve({
              data: single ? (result.rows[0] ?? null) : result.rows,
              error: null,
              count: count ? result.rows.length : null,
            });
          } catch (error) {
            return resolve({ data: null, error });
          }
        },
      };
      return builder;
    },
    async rpc(name: string, args: Row) {
      try {
        const result = await pg.query<{ value: unknown }>(
          `select ${quote(name)}(${Object.keys(args)
            .map((key, i) => `${quote(key)} => $${i + 1}`)
            .join(",")}) as value`,
          Object.values(args).map((value) =>
            value && typeof value === "object" ? JSON.stringify(value) : value,
          ),
        );
        return { data: result.rows[0].value, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
  };
}

function load<T>(path: string, mocks: Record<string, unknown>, env: Row): T {
  const exports = {};
  runInNewContext(
    ts.transpileModule(
      readFileSync(new URL(`../../${path}`, import.meta.url), "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
        },
      },
    ).outputText,
    {
      exports,
      URL,
      Error,
      Date: mocks["test:clock"] ?? Date,
      fetch: mocks["test:fetch"],
      AbortSignal,
      console: { error() {} },
      process: { env },
      require(name: string) {
        assert.ok(name in mocks, `Unexpected dependency ${name}`);
        return mocks[name];
      },
    },
  );
  return exports as T;
}
type Server = {
  issueSession(kind: string, parent: string, child?: string): Promise<void>;
  requireMission(slug: string): Promise<{ mission: { version: string } }>;
};
type Route = {
  GET(): Promise<Response>;
  POST(request: Request): Promise<Response>;
};

async function fixture() {
  const pg = new PGlite();
  await pg.exec(
    `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); insert into auth.users values('${parent}'),('${other}');`,
  );
  await pg.exec(
    readFileSync(
      new URL(
        "../../supabase/migrations/20261005233138_wonderlab_family_learning.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await pg.exec(
    readFileSync(
      new URL(
        "../../supabase/migrations/20261006162727_wonderlab_monthly_memberships.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const db = database(pg),
    cookies = new Map<string, string>();
  let user: { id: string; email: string; is_anonymous?: boolean } | null = {
    id: parent,
    email: "parent@example.test",
  };
  const env: Record<string, string> = {
    NEXT_PUBLIC_APP_URL: origin,
    NODE_ENV: "production",
  };
  const fixedTime = Date.now();
  class TestClock extends Date {
    constructor(value?: string | number) {
      super(value ?? fixedTime);
    }
    static now() {
      return fixedTime;
    }
  }
  const mocks: Record<string, unknown> = {
    "test:clock": TestClock,
    "server-only": {},
    "@/lib/wonderlab/membership-rules": membershipRules,
    "@/lib/wonderlab/memberships": {
      cancelMembership: async () => {
        throw new Error("Unexpected cancellation");
      },
    },
    "node:crypto": crypto,
    "next/server": { NextResponse: Response },
    "next/headers": {
      cookies: async () => ({
        get: (key: string) =>
          cookies.has(key) ? { value: cookies.get(key) } : undefined,
        set: (key: string, value: string, options: Row) => {
          assert.equal(
            options.path === "/" || options.path === "/wonderlab",
            true,
          );
          if (value) {
            assert.equal(options.httpOnly, true);
            assert.equal(options.secure, true);
            assert.equal(options.sameSite, "strict");
            cookies.set(key, value);
          } else cookies.delete(key);
        },
      }),
    },
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: { getUser: async () => ({ data: { user }, error: null }) },
      }),
    },
    "@/lib/supabase/admin": { supabaseAdmin: db },
    "./versions": versions,
    "./engine": engine,
    "@/lib/wonderlab/versions": versions,
    "@/lib/wonderlab/catalog": catalogue,
    "@/lib/wonderlab/engine": engine,
    "@/lib/wonderlab/generation-rules": generationRules,
    "@/lib/wonderlab/flags": {
      launchStatus: () => ({ commerce: true, ai: false, terms: "test-v1" }),
    },
    "@supabase/supabase-js": {
      createClient: () => ({
        auth: {
          signInWithPassword: async (input: { password: string }) => ({
            data: { user: input.password === "correct-password" ? user : null },
            error: null,
          }),
          signOut: async () => ({ error: null }),
        },
      }),
    },
  };
  const server = load<Server>("lib/wonderlab/server.ts", mocks, env);
  mocks["@/lib/wonderlab/server"] = server;
  const route = (name: string) =>
    load<Route>(`app/api/wonderlab/${name}/route.ts`, mocks, env);
  const post = (name: string, body: Row, requestOrigin = origin) =>
    route(name).POST(
      new Request(`${origin}/api/wonderlab/${name}`, {
        method: "POST",
        headers: { origin: requestOrigin, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  const createChild = async () => {
    await server.issueSession("parent", parent);
    const response = await post("family", {
      action: "create",
      nickname: "Comet",
      band: "creators",
      guardian: true,
    });
    assert.equal(response.status, 200, await response.text());
    return (await pg.query<{ id: string }>("select id from wonderlab_children"))
      .rows[0].id;
  };
  return {
    pg,
    server,
    post,
    route,
    mocks,
    env,
    cookies,
    createChild,
    setUser: (next: typeof user) => {
      user = next;
    },
  };
}

test("authenticated family routes isolate households and password reauthentication closes child play", async () => {
  const f = await fixture();
  try {
    const child = await f.createChild();
    assert.equal((await f.route("family").GET()).status, 200);
    assert.equal(
      (
        await f.post(
          "family",
          { action: "preferences", childId: child },
          "https://other.example",
        )
      ).status,
      403,
    );
    assert.equal(
      (await f.post("session", { action: "play", childId: child })).status,
      200,
    );
    assert.equal((await f.route("family").GET()).status, 403);
    await assert.rejects(
      f.server.requireMission("prompt-repair-shop"),
      /not currently open/,
    );
    f.setUser({ id: other, email: "other@example.test" });
    await assert.rejects(
      f.server.requireMission("prompt-repair-shop"),
      /grown-up/,
    );
    await f.server.issueSession("parent", other);
    const data = await (await f.route("family").GET()).json();
    assert.equal(data.children.length, 0);
    assert.equal(data.orders.length, 0);
    assert.equal(data.progress.length, 0);
    assert.equal(
      (
        await f.post("family", {
          action: "preferences",
          childId: child,
          aiEnabled: true,
        })
      ).status,
      404,
    );
    assert.equal(
      (await f.post("session", { action: "play", childId: child })).status,
      404,
    );
    f.setUser(null);
    await assert.rejects(
      f.server.requireMission("prompt-repair-shop"),
      /sign in/,
    );
    f.setUser({ id: parent, email: "parent@example.test" });
    assert.equal(
      (await f.post("session", { action: "unlock", password: "wrong" })).status,
      401,
    );
    assert.equal(
      (
        await f.post("session", {
          action: "unlock",
          password: "correct-password",
        })
      ).status,
      200,
    );
    assert.equal(f.cookies.has("wonderlab_child"), false);
    assert.equal(
      (await f.pg.query("select * from wonderlab_sessions where kind='child'"))
        .rows.length,
      0,
    );
    await f.pg.exec(
      "update wonderlab_sessions set expires_at='2000-01-01T00:00:00Z'",
    );
    assert.equal((await f.route("family").GET()).status, 403);
  } finally {
    await f.pg.close();
  }
});

test("paid route saves recompute outcomes, reject conflicting revisions and stop at expiry", async () => {
  const f = await fixture();
  try {
    const child = await f.createChild(),
      mission = catalogue.getMission("prompt-repair-shop")!;
    await f.pg.query(
      "insert into wonderlab_orders(parent_id,child_id,mission_slug,content_version,terms_version,state,expires_at) values($1,$2,$3,$4,'test','paid',now()+interval '1 year')",
      [parent, child, mission.slug, mission.version],
    );
    await f.post("session", { action: "play", childId: child });
    const body = {
      slug: mission.slug,
      revision: 0,
      creation: "My checked fictional project",
      checks: mission.project.checks.map(() => true),
      answers: {},
      completed: true,
      childId: "forged",
      parentId: other,
    };
    const first = await f.post("progress", body);
    assert.equal(first.status, 200);
    assert.equal((await first.json()).completed, false);
    assert.equal((await f.post("progress", body)).status, 409);
    const complete = await f.post("progress", {
      ...body,
      revision: 1,
      answers: Object.fromEntries(
        mission.activities.map((a) => [a.id, a.correct]),
      ),
    });
    assert.equal(complete.status, 200);
    assert.equal((await complete.json()).completed, true);
    assert.equal(
      (
        await f.pg.query<{ child_id: string }>(
          "select child_id from wonderlab_progress",
        )
      ).rows[0].child_id,
      child,
    );
    assert.equal(
      (await f.server.requireMission(mission.slug)).mission.version,
      mission.version,
    );
    await f.pg.exec(
      "update wonderlab_orders set content_version='unknown-version'",
    );
    assert.equal(
      (await f.post("progress", { ...body, revision: 2 })).status,
      409,
    );
    await f.pg.query("update wonderlab_orders set content_version=$1", [
      mission.version,
    ]);
    f.setUser({ id: other, email: "other@example.test" });
    await f.server.issueSession("parent", other);
    const unrelated = await (await f.route("family").GET()).json();
    assert.equal(unrelated.orders.length, 0);
    assert.equal(unrelated.progress.length, 0);
    f.setUser({ id: parent, email: "parent@example.test" });
    await f.pg.exec(
      "update wonderlab_orders set expires_at=now()-interval '1 second'",
    );
    assert.equal(
      (await f.post("progress", { ...body, revision: 2 })).status,
      403,
    );
    await f.post("session", { action: "unlock", password: "correct-password" });
    const family = await (await f.route("family").GET()).json();
    assert.equal(family.progress[0].creation, body.creation);
    assert.equal(family.orders[0].lesson.title, mission.title);
  } finally {
    await f.pg.close();
  }
});

test("monthly checkout ignores browser prices and lesson selection, retries one membership without granting access", async () => {
  const f = await fixture();
  try {
    const child = await f.createChild();
    let creates = 0;
    f.mocks["@/lib/wonderlab/payments"] = {
      WONDERLAB_PURPOSE: "wonderlab_mission",
    };
    f.mocks["@/lib/stripe"] = {
      getStripe: () => ({
        checkout: {
          sessions: {
            create: async (
              params: {
                mode: string;
                subscription_data: { metadata: Row };
                line_items: {
                  price_data: {
                    unit_amount: number;
                    currency: string;
                    recurring: { interval: string };
                    tax_behavior: string;
                  };
                }[];
                metadata: Row;
              },
              options: { idempotencyKey: string },
            ) => {
              creates++;
              assert.equal(params.line_items[0].price_data.unit_amount, 2000);
              assert.equal(params.line_items[0].price_data.currency, "gbp");
              assert.match(options.idempotencyKey, /^wonderlab-.*-first$/);
              assert.equal(params.metadata.purpose, "wonderlab_membership");
              assert.equal(params.mode, "subscription");
              assert.equal(
                params.line_items[0].price_data.recurring.interval,
                "month",
              );
              assert.equal(
                params.line_items[0].price_data.tax_behavior,
                "inclusive",
              );
              assert.deepEqual(
                params.metadata,
                params.subscription_data.metadata,
              );
              return {
                id: "cs_fixture",
                url: "https://checkout.stripe.com/fixture",
              };
            },
            retrieve: async () => ({
              id: "cs_fixture",
              status: "open",
              url: "https://checkout.stripe.com/fixture",
            }),
          },
        },
      }),
    };
    const body = {
      childId: child,
      slug: "prompt-repair-shop",
      acceptedTerms: "test-v1",
      immediateAccess: true,
      ukResident: true,
      amount: 1,
      currency: "usd",
    };
    assert.equal(
      (await f.post("checkout", { ...body, acceptedTerms: "old" })).status,
      400,
    );
    assert.equal(
      (await f.post("checkout", { ...body, childId: other })).status,
      404,
    );
    assert.equal((await f.post("checkout", body)).status, 200);
    assert.equal((await f.post("checkout", body)).status, 200);
    assert.equal(creates, 1);
    const orders = (
      await f.pg.query<{ state: string }>("select * from wonderlab_memberships")
    ).rows;
    assert.equal(orders.length, 1);
    assert.equal(orders[0].state, "pending");
    assert.equal(
      (await f.pg.query("select * from wonderlab_orders")).rows.length,
      0,
    );
    f.mocks["@/lib/wonderlab/flags"] = {
      launchStatus: () => ({ commerce: false, ai: false, terms: "test-v1" }),
    };
    assert.equal((await f.post("checkout", body)).status, 503);
    assert.equal(creates, 1);
    await f.post("session", { action: "play", childId: child });
    await assert.rejects(
      f.server.requireMission(body.slug),
      /not currently open/,
    );
  } finally {
    await f.pg.close();
  }
});

test("deletion requests immediately revoke play but retain private exports for the parent", async () => {
  const f = await fixture();
  try {
    const child = await f.createChild();
    await f.server.issueSession("child", parent, child);
    assert.equal(
      (await f.post("family", { action: "delete-request", childId: child }))
        .status,
      200,
    );
    assert.equal(
      (await f.pg.query("select * from wonderlab_sessions where kind='child'"))
        .rows.length,
      0,
    );
    await assert.rejects(
      f.server.requireMission("prompt-repair-shop"),
      /grown-up/,
    );
    assert.equal(
      (await f.post("session", { action: "play", childId: child })).status,
      404,
    );
    assert.equal(
      (
        await f.post("family", {
          action: "preferences",
          childId: child,
          narration: true,
        })
      ).status,
      400,
    );
    const data = await (await f.route("family").GET()).json();
    assert.ok(data.children[0].deletion_requested_at);
    assert.equal(data.children[0].ai_enabled, false);
  } finally {
    await f.pg.close();
  }
});

test("purchased versions resolve independently of the current catalogue and unknown versions fail closed", () => {
  for (const mission of catalogue.missions) {
    assert.equal(
      versions.getMissionForVersion(mission.slug, catalogue.CONTENT_VERSION),
      mission,
    );
    assert.equal(
      versions.getMissionForVersion(mission.slug, "2099-01-01.1"),
      undefined,
    );
    assert.equal(
      versions.getMissionForVersion(mission.slug, "__proto__"),
      undefined,
    );
  }
  assert.equal(
    versions.getMissionForVersion("missing-mission", "2026-10-05.1"),
    undefined,
  );
});

test("guided AI uses only reviewed inputs and charges once, with no allowance spent on failures", async () => {
  const f = await fixture();
  try {
    const child = await f.createChild();
    const mission = catalogue.getMission("prompt-repair-shop")!;
    await f.pg.query(
      "insert into wonderlab_orders(parent_id,child_id,mission_slug,content_version,terms_version,state,expires_at) values($1,$2,$3,$4,'test','paid',now()+interval '1 month')",
      [parent, child, mission.slug, mission.version],
    );
    await f.post("session", { action: "play", childId: child });
    Object.assign(f.env, {
      OPENAI_API_KEY: "test-only",
      WONDERLAB_AI_MODEL: "test-model",
      WONDERLAB_AI_INPUT_USD_PER_MILLION: "2",
      WONDERLAB_AI_OUTPUT_USD_PER_MILLION: "8",
    });
    let calls = 0;
    let mode = "success";
    f.mocks["test:fetch"] = async (url: string, options: { body: string }) => {
      calls++;
      const body = JSON.parse(options.body);
      assert.equal(options.body.includes("PRIVATE-INPUT"), false);
      assert.equal(options.body.includes(child), false);
      assert.equal(options.body.includes("Comet"), false);
      if (mode === "outage") throw new Error("Provider unavailable");
      if (url.endsWith("/moderations"))
        return Response.json({ results: [{ flagged: mode === "blocked" }] });
      assert.equal(body.store, false);
      assert.match(body.messages[0].content, /11–13/);
      assert.equal(body.messages[1].content.startsWith(mission.aiBrief), true);
      return Response.json({
        choices: [
          {
            finish_reason: mode === "truncated" ? "length" : "stop",
            message: {
              content:
                "This is a fictional draft. Check its claims against the source.",
            },
          },
        ],
        usage: { prompt_tokens: 100, completion_tokens: 20 },
      });
    };
    const request = (extra = {}) => ({
      slug: mission.slug,
      requestId: crypto.randomUUID(),
      variant: "ideas",
      ...extra,
    });
    const used = async () =>
      (
        await f.pg.query<{ generations_used: number }>(
          "select generations_used from wonderlab_orders",
        )
      ).rows[0].generations_used;
    // Closed launch, missing parent permission and younger profiles never contact a provider.
    assert.equal((await f.post("generate", request())).status, 503);
    f.mocks["@/lib/wonderlab/flags"] = { launchStatus: () => ({ ai: true }) };
    assert.equal((await f.post("generate", request())).status, 403);
    await assert.rejects(
      f.pg.exec(
        "update wonderlab_children set ai_enabled=true, band='inventors'",
      ),
      /check constraint/,
    );
    await f.pg.exec("update wonderlab_children set band='inventors'");
    assert.equal((await f.post("generate", request())).status, 403);
    await f.pg.exec(
      "update wonderlab_children set band='creators', ai_enabled=true",
    );
    assert.equal(
      (await f.post("generate", request({ variant: "PRIVATE-INPUT" }))).status,
      400,
    );
    assert.equal(calls, 0);
    const first = request({
      prompt: "PRIVATE-INPUT",
      nickname: "PRIVATE-INPUT",
      creation: "PRIVATE-INPUT",
    });
    assert.equal((await f.post("generate", first)).status, 200);
    assert.equal((await f.post("generate", first)).status, 200);
    assert.equal(calls, 2);
    assert.equal(await used(), 1);
    for (mode of ["blocked", "truncated", "outage"]) {
      const attempt = request();
      assert.equal((await f.post("generate", attempt)).status, 503);
      assert.equal(await used(), 1);
      const row = (
        await f.pg.query<{ state: string; response: unknown }>(
          "select state,response from wonderlab_generations where id=$1",
          [attempt.requestId],
        )
      ).rows[0];
      assert.equal(row.state, "failed");
      assert.equal(row.response, null);
    }
    const before = calls;
    await f.pg.exec("update wonderlab_orders set generations_used=30");
    assert.equal((await f.post("generate", request())).status, 409);
    assert.equal(calls, before);
    await f.pg.exec(
      "update wonderlab_orders set expires_at=now()-interval '1 second'",
    );
    assert.equal((await f.post("generate", request())).status, 403);
    assert.equal(calls, before);
  } finally {
    await f.pg.close();
  }
});

test("Stripe event handling retrieves provider records before granting or refunding membership access", async () => {
  const f = await fixture();
  try {
    const child = await f.createChild();
    const member = crypto.randomUUID();
    await f.pg.query(
      "insert into wonderlab_memberships(id,parent_id,child_id,terms_version) values($1,$2,$3,'test')",
      [member, parent, child],
    );
    const now = Math.floor(Date.now() / 1000);
    const metadata = { purpose: "wonderlab_membership", membership_id: member };
    const subscription = {
      id: "sub_test",
      customer: "cus_test",
      metadata,
      status: "active",
      cancel_at_period_end: false,
      items: {
        data: [
          {
            quantity: 1,
            price: {
              currency: "gbp",
              unit_amount: 2000,
              recurring: { interval: "month", interval_count: 1 },
            },
          },
        ],
      },
    };
    const invoice = {
      id: "in_test",
      status: "paid",
      currency: "gbp",
      total: 2000,
      amount_paid: 2000,
      parent: { subscription_details: { subscription: "sub_test" } },
      lines: {
        has_more: false,
        data: [
          { amount: 2000, period: { start: now - 60, end: now + 30 * 86400 } },
        ],
      },
    };
    let invoiceReads = 0;
    f.mocks["./catalog"] = catalogue;
    f.mocks["./membership-rules"] = membershipRules;
    f.mocks["@/lib/stripe"] = {
      getStripe: () => ({
        subscriptions: { retrieve: async () => subscription },
        checkout: {
          sessions: {
            retrieve: async () => ({
              id: "cs_test",
              subscription: "sub_test",
              metadata,
            }),
          },
        },
        invoices: {
          retrieve: async () => {
            invoiceReads++;
            return invoice;
          },
        },
        invoicePayments: {
          list: async () => ({ data: [{ invoice: "in_test" }] }),
        },
      }),
    };
    const handler = load<{
      fulfilMembershipEvent(event: Stripe.Event): Promise<boolean>;
    }>("lib/wonderlab/memberships.ts", f.mocks, f.env);
    const event = (type: string, object: unknown, id = crypto.randomUUID()) =>
      ({ id, type, created: now, data: { object } }) as Stripe.Event;
    const orders = async () =>
      (
        await f.pg.query<{ state: string }>(
          "select state from wonderlab_orders",
        )
      ).rows;
    assert.equal(
      await handler.fulfilMembershipEvent(
        event("checkout.session.completed", { id: "cs_test", metadata }),
      ),
      true,
    );
    assert.equal((await orders()).length, 0);
    const paid = event("invoice.paid", { ...invoice, amount_paid: 1 });
    assert.equal(await handler.fulfilMembershipEvent(paid), true);
    assert.equal(invoiceReads, 1);
    assert.equal((await orders()).length, 24);
    await handler.fulfilMembershipEvent(paid);
    assert.equal((await orders()).length, 24);
    assert.equal(
      await handler.fulfilMembershipEvent(
        event("checkout.session.completed", {
          metadata: { purpose: "adult_course" },
        }),
      ),
      false,
    );
    await handler.fulfilMembershipEvent(
      event("charge.refunded", {
        payment_intent: "pi_test",
        amount: 2000,
        amount_refunded: 1000,
      }),
    );
    assert.ok((await orders()).every((o) => o.state === "paid"));
    await handler.fulfilMembershipEvent(
      event("charge.refunded", {
        payment_intent: "pi_test",
        amount: 2000,
        amount_refunded: 2000,
      }),
    );
    assert.ok((await orders()).every((o) => o.state === "refunded"));
    await handler.fulfilMembershipEvent(event("invoice.paid", invoice));
    assert.ok((await orders()).every((o) => o.state === "refunded"));
  } finally {
    await f.pg.close();
  }
});
