import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { ADVENTURE_VERSION } from "./types.ts";
import { initialAdventure } from "./engine.ts";
import { adventures } from "./catalog.ts";
const parent = "10000000-0000-4000-a000-000000000001",
  other = "10000000-0000-4000-a000-000000000002",
  child = "20000000-0000-4000-a000-000000000001";
test("game checkpoints enforce ownership, access, revisions, browser isolation and deletion", async () => {
  const pg = new PGlite();
  try {
    await pg.exec(
      `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); insert into auth.users values('${parent}'),('${other}');`,
    );
    for (const file of [
      "20261005233138_wonderlab_family_learning.sql",
      "20261006162727_wonderlab_monthly_memberships.sql",
      "20261008182925_wonderlab_lifetime_access.sql",
      "20261009111033_wonderlab_adventure_checkpoints.sql",
    ])
      await pg.exec(
        readFileSync(
          new URL(`../../../supabase/migrations/${file}`, import.meta.url),
          "utf8",
        ),
      );
    await pg.exec(
      `insert into wonderlab_children(id,parent_id,nickname,band) values('${child}','${parent}','Comet','creators');insert into wonderlab_orders(parent_id,child_id,mission_slug,content_version,terms_version,state,amount,granted_at,grant_reason) values('${parent}','${child}','prompt-repair-shop','2026-10-05.1','test','granted',0,now(),'Family testing');`,
    );
    const state = initialAdventure(
      adventures.find((g) => g.slug === "prompt-repair-shop")!,
    );
    const save = (owner = parent, revision = 0, done = false) =>
      pg.query<{ value: { revision: number; completed: boolean } }>(
        "select wonderlab_save_adventure($1,$2,$3,$4,$5,$6,$7) as value",
        [
          child,
          owner,
          "prompt-repair-shop",
          ADVENTURE_VERSION,
          revision,
          JSON.stringify(state),
          done,
        ],
      );
    await assert.rejects(save(other), /Profile unavailable/);
    assert.equal((await save()).rows[0].value.revision, 1);
    await assert.rejects(save(), /Progress conflict/);
    assert.equal((await save(parent, 1, true)).rows[0].value.completed, true);
    const replay = await save(parent, 2, false);
    assert.equal(replay.rows[0].value.completed, true);
    assert.equal(replay.rows[0].value.revision, 3);
    for (const role of ["anon", "authenticated"]) {
      await pg.exec(`set role ${role}`);
      await assert.rejects(
        pg.query("select * from wonderlab_adventure_progress"),
        /permission denied/,
      );
      await assert.rejects(save(parent, 3), /permission denied/);
      await pg.exec("reset role");
    }
    await pg.exec(
      "update wonderlab_orders set amount=2000,state='paid', expires_at=now()-interval '1 second'",
    );
    await assert.rejects(save(parent, 3), /Access unavailable/);
    await pg.exec("update wonderlab_orders set state='refunded'");
    await assert.rejects(save(parent, 3), /Access unavailable/);
    assert.equal(
      (await pg.query("select * from wonderlab_adventure_progress")).rows
        .length,
      1,
    );
    await pg.exec(
      `update wonderlab_orders set state='granted',amount=0,expires_at=null; update wonderlab_children set deletion_requested_at=now();`,
    );
    await assert.rejects(save(parent, 3), /Profile unavailable/);
    await pg.exec(
      "delete from wonderlab_orders; delete from wonderlab_children",
    );
    assert.equal(
      (await pg.query("select * from wonderlab_adventure_progress")).rows
        .length,
      0,
    );
  } finally {
    await pg.close();
  }
});
