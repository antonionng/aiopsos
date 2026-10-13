import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { PGlite } from "@electric-sql/pglite";
import { DEFAULT_DESIGN } from "./first-person.ts";
import { NEW_ADVENTURE } from "./arcade-adventure.ts";
import * as projectRules from "./arcade-project.ts";

const parent = "10000000-0000-4000-a000-000000000001";
const other = "10000000-0000-4000-a000-000000000002";
const child = "20000000-0000-4000-a000-000000000001";
const anotherChild = "20000000-0000-4000-a000-000000000002";
const snapshot = () => ({
  project: { version: 1, band: "inventors", avatar: { kind: "robot", colour: "#55aabb" }, design: { ...DEFAULT_DESIGN }, revisions: 2, playtests: 1 },
  adventure: { ...NEW_ADVENTURE, creations: [{ chapter: "first-game", design: { ...DEFAULT_DESIGN } }] },
});
const body = () => ({ childId: child, revision: 0, snapshot: snapshot() });
const row = (revision = 1) => ({
  child_id: child, mission_slug: projectRules.ARCADE_PROJECT_MISSION,
  game_version: projectRules.ARCADE_PROJECT_VERSION, revision,
  state: { version: projectRules.ARCADE_PROJECT_VERSION, ...snapshot() },
  completed: false, updated_at: "2026-10-11T12:00:00.000Z",
});
class TestError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
function fixture(options: { authStatus?: number; saved?: unknown; readError?: string; rpcError?: string } = {}) {
  const calls: { name: string; args: unknown }[] = [];
  const mocks = {
    "server-only": {},
    "./arcade-project": projectRules,
    "./server": {
      WonderlabError: TestError,
      async requireMission(slug: string) {
        calls.push({ name: "requireMission", args: slug });
        assert.equal(slug, projectRules.ARCADE_PROJECT_MISSION);
        if (options.authStatus) throw new TestError("Profile unavailable", options.authStatus);
        return { child: { id: child, parent_id: parent, nickname: "Comet", band: "inventors" } };
      },
      db: {
        from(table: string) {
          assert.equal(table, "wonderlab_adventure_progress");
          const filters: Record<string, string> = {};
          const query = {
            select() { return query; },
            eq(key: string, value: string) { filters[key] = value; return query; },
            async maybeSingle() {
              assert.deepEqual(filters, { child_id: child, mission_slug: projectRules.ARCADE_PROJECT_MISSION, game_version: projectRules.ARCADE_PROJECT_VERSION });
              calls.push({ name: "read", args: filters });
              return { data: options.saved ?? null, error: options.readError ? new Error(options.readError) : null };
            },
          };
          return query;
        },
        async rpc(name: string, args: Record<string, unknown>) {
          calls.push({ name, args });
          return { data: { ...row(Number(args.p_revision) + 1), state: args.p_state }, error: options.rpcError ? { message: options.rpcError } : null };
        },
      },
    },
  };
  const exported = {};
  runInNewContext(ts.transpileModule(readFileSync(new URL("./arcade-project-server.ts", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports: exported,
    require(name: keyof typeof mocks) { assert.ok(name in mocks); return mocks[name]; },
  });
  return { server: exported as typeof import("./arcade-project-server"), calls };
}

test("account snapshots reject unknown fields, old design schemas and malformed chapter reports", () => {
  assert.ok(projectRules.readArcadeSnapshot(snapshot()));
  const legacy = { ...DEFAULT_DESIGN } as Record<string, unknown>;
  delete legacy.challenge;
  for (const value of [
    { ...snapshot(), completed: true },
    { ...snapshot(), project: { ...snapshot().project, nickname: "Personal data" } },
    { ...snapshot(), project: { ...snapshot().project, avatar: { ...snapshot().project.avatar, photo: "image" } } },
    { ...snapshot(), project: { ...snapshot().project, design: legacy } },
    { ...snapshot(), project: { ...snapshot().project, playtests: 10001 } },
    { ...snapshot(), adventure: { ...snapshot().adventure, completed: true } },
    { ...snapshot(), adventure: { ...snapshot().adventure, creations: [{ chapter: "visitor-game", design: DEFAULT_DESIGN }] } },
    { ...snapshot(), adventure: { ...snapshot().adventure, creations: [{ chapter: "first-game", design: DEFAULT_DESIGN, reward: true }] } },
  ]) assert.equal(projectRules.readArcadeSnapshot(value), null);
});

test("account snapshots reject game names that carry personal details", () => {
  const named = (title: string) => ({ ...DEFAULT_DESIGN, title });
  assert.ok(projectRules.readArcadeSnapshot({ ...snapshot(), project: { ...snapshot().project, design: named("Moonlight Star Hunt") } }));
  for (const title of ["Email me at sam@example.com", "My name is Sam Taylor", "Call 07700 900123", "Game at SW1A 1AA"]) {
    assert.equal(projectRules.readArcadeSnapshot({ ...snapshot(), project: { ...snapshot().project, design: named(title) } }), null, title);
    const creations = [{ chapter: "first-game", design: named(title) }];
    assert.equal(projectRules.readArcadeSnapshot({ ...snapshot(), adventure: { ...snapshot().adventure, creations } }), null, title);
  }
});

test("family arcade reads exclude other families, old versions and assessed completion flags", () => {
  const results = projectRules.familyArcadeProjects([
    row(), { ...row(), child_id: anotherChild }, { ...row(), game_version: "district-2026-10-09.1" },
    { ...row(), mission_slug: "prompt-repair-shop" }, { ...row(), completed: true },
    { ...row(), state: { ...row().state, hidden: "data" } },
  ], [child]);
  assert.equal(results.length, 1);
  assert.equal(results[0].childId, child);
  assert.equal(results[0].summary.length, 1);
  assert.match(projectRules.arcadeProjectReport(results[0]), /not an assessment/);
});

test("profile context loads only its versioned arcade snapshot", async () => {
  const { server } = fixture({ saved: row(3) });
  const result = await server.loadArcadeProject();
  assert.equal(result.mode, "family");
  assert.equal(result.child?.id, child);
  assert.equal(result.revision, 3);
  assert.deepEqual(result.snapshot, snapshot());
  assert.equal((await fixture().server.loadArcadeProject()).snapshot, null);
  await assert.rejects(fixture({ saved: { ...row(), state: {} } }).server.loadArcadeProject(), /needs restoring/);
});

test("missing access stays local and never reads or writes private project rows", async () => {
  for (const status of [401, 403]) {
    const { server, calls } = fixture({ authStatus: status });
    const result = await server.loadArcadeProject();
    assert.equal(result.mode, "local");
    assert.equal(result.child, null);
    await assert.rejects(server.saveArcadeProject(body()));
    assert.ok(calls.every((call) => call.name === "requireMission"));
  }
  await assert.rejects(fixture({ authStatus: 503 }).server.loadArcadeProject());
});

test("saving binds child and parent to the session and cannot submit completion or a different slug", async () => {
  const { server, calls } = fixture();
  for (const invalid of [
    { ...body(), childId: "bad" }, { ...body(), revision: -1 }, { ...body(), revision: 0.5 },
    { ...body(), revision: 2_147_483_647 }, { ...body(), mission_slug: "another-mission" },
    { ...body(), completed: true }, { ...body(), snapshot: { ...snapshot(), completed: true } },
  ]) await assert.rejects(server.saveArcadeProject(invalid));
  assert.equal(calls.length, 0);
  await assert.rejects(server.saveArcadeProject({ ...body(), childId: anotherChild }), /active profile changed/);
  assert.equal(calls.filter((call) => call.name === "wonderlab_save_adventure").length, 0);
  const result = await server.saveArcadeProject(body());
  assert.equal(result.revision, 1);
  const args = calls.at(-1)?.args as Record<string, unknown>;
  assert.equal(args.p_child, child);
  assert.equal(args.p_parent, parent);
  assert.equal(args.p_slug, projectRules.ARCADE_PROJECT_MISSION);
  assert.equal(args.p_version, projectRules.ARCADE_PROJECT_VERSION);
  assert.equal(args.p_completed, false);
});

test("save conflicts and revoked access do not become successful project saves", async () => {
  for (const [rpcError, status] of [["Progress conflict", 409], ["Access unavailable", 403], ["Profile unavailable", 403]] as const) {
    await assert.rejects(fixture({ rpcError }).server.saveArcadeProject(body()), (error: unknown) => {
      assert.ok(error instanceof TestError);
      assert.equal(error.status, status);
      return true;
    });
  }
});

test("the existing database RPC isolates arcade versions and checks ownership, expiry, revisions and deletion", async () => {
  const pg = new PGlite();
  try {
    await pg.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); insert into auth.users values('${parent}'),('${other}');`);
    for (const file of ["20261005233138_wonderlab_family_learning.sql", "20261006162727_wonderlab_monthly_memberships.sql", "20261008182925_wonderlab_lifetime_access.sql", "20261009111033_wonderlab_adventure_checkpoints.sql"])
      await pg.exec(readFileSync(new URL(`../../supabase/migrations/${file}`, import.meta.url), "utf8"));
    await pg.exec(`insert into wonderlab_children(id,parent_id,nickname,band) values('${child}','${parent}','Comet','inventors'); insert into wonderlab_orders(parent_id,child_id,mission_slug,content_version,terms_version,state,amount,granted_at,grant_reason) values('${parent}','${child}','game-concept-studio','2026-10-05.1','test','granted',0,now(),'Family testing');`);
    const save = (revision = 0, owner = parent, version = projectRules.ARCADE_PROJECT_VERSION) =>
      pg.query<{ saved: { revision: number; completed: boolean } }>("select wonderlab_save_adventure($1,$2,$3,$4,$5,$6,false) as saved", [child, owner, projectRules.ARCADE_PROJECT_MISSION, version, revision, JSON.stringify({ ...snapshot(), version })]);
    await assert.rejects(save(0, other), /Profile unavailable/);
    await save(0, parent, "district-original");
    assert.equal((await save()).rows[0].saved.revision, 1);
    assert.equal((await save(1)).rows[0].saved.completed, false);
    await assert.rejects(save(1), /Progress conflict/);
    assert.equal((await pg.query("select * from wonderlab_adventure_progress")).rows.length, 2);
    assert.equal((await pg.query("select * from wonderlab_progress")).rows.length, 0);
    for (const role of ["anon", "authenticated"]) {
      await pg.exec(`set role ${role}`);
      await assert.rejects(pg.query("select * from wonderlab_adventure_progress"), /permission denied/);
      await assert.rejects(save(2), /permission denied/);
      await pg.exec("reset role");
    }
    await pg.exec("update wonderlab_orders set amount=2000,state='paid',expires_at=now()-interval '1 second'");
    await assert.rejects(save(2), /Access unavailable/);
    await pg.exec("update wonderlab_orders set state='refunded'");
    await assert.rejects(save(2), /Access unavailable/);
    await pg.exec("update wonderlab_orders set state='granted',amount=0,expires_at=null; update wonderlab_children set deletion_requested_at=now()");
    await assert.rejects(save(2), /Profile unavailable/);
    await pg.exec("delete from wonderlab_orders; delete from wonderlab_children");
    assert.equal((await pg.query("select * from wonderlab_adventure_progress")).rows.length, 0);
  } finally { await pg.close(); }
});
