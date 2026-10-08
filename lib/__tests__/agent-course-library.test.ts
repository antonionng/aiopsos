import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { agentCourseBlueprints } from "../always-on-agents/catalogue.ts";
import {
  AGENT_COURSE_VERSION,
  getAgentCoursePack,
} from "../always-on-agents/courses.ts";

// Exercise the actual route with controlled identity and workspace checks.
// Database permission enforcement remains the existing lms_assert_workspace RPC.
class AccessError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
function route(role: string | null, managerAccess = true) {
  const source = readFileSync(
    new URL("../../app/api/lms/agent-course-packs/route.ts", import.meta.url),
    "utf8",
  );
  let assembled = 0;
  let permissionChecks = 0;
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse: Response },
    "@/lib/always-on-agents/catalogue": { agentCourseBlueprints },
    "@/lib/always-on-agents/courses": {
      AGENT_COURSE_VERSION,
      getAgentCoursePack: (slug: string) => {
        assembled++;
        return getAgentCoursePack(slug);
      },
    },
    "@/lib/lms/server": {
      learningActor: async () => {
        if (!role) throw new AccessError("Sign in", 401);
        return { userId: "user", orgId: "org", role };
      },
      assertLearningAccess: async (_actor: unknown, manager: boolean) => {
        permissionChecks++;
        assert.equal(manager, true);
        if (!managerAccess) throw new AccessError("No manager access", 403);
      },
      LearningError: AccessError,
      learningErrorResponse: (error: AccessError) =>
        Response.json({ error: error.message }, { status: error.status }),
    },
  };
  const exports: { GET?: (request: Request) => Promise<Response> } = {};
  runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    {
      exports,
      URL,
      require: (name: string) => {
        if (!(name in modules))
          throw new Error("Unexpected dependency: " + name);
        return modules[name];
      },
    },
  );
  return {
    get: (slug?: string) =>
      exports.GET!(
        new Request(
          "https://experrt.test/api/lms/agent-course-packs" +
            (slug ? "?slug=" + slug : ""),
        ),
      ),
    assembled: () => assembled,
    permissionChecks: () => permissionChecks,
  };
}

test("anonymous users and users without workspace management access receive no authored content", async () => {
  for (const handler of [
    route(null),
    route("super_admin", false),
    route("user", false),
  ]) {
    const response = await handler.get("always-on-agent-foundations");
    assert.ok([401, 403].includes(response.status));
    assert.equal(handler.assembled(), 0);
    assert.match(response.headers.get("cache-control")!, /no-store/);
  }
});
test("customer managers cannot retrieve Experrt's internal authored library", async () => {
  for (const role of ["admin", "manager"]) {
    const handler = route(role);
    assert.equal(
      (await handler.get("always-on-agent-foundations")).status,
      403,
    );
    assert.deepEqual(await (await handler.get()).json(), { courses: [] });
    assert.equal(handler.assembled(), 0);
    assert.equal(handler.permissionChecks(), 2);
  }
});
test("platform administrators can list and load all thirteen valid packs without a database write", async () => {
  const handler = route("super_admin");
  const list = await (await handler.get()).json();
  assert.equal(list.courses.length, 13);
  assert.equal(list.version, AGENT_COURSE_VERSION);
  for (const course of list.courses) {
    const response = await handler.get(course.slug);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control")!, /private, no-store/);
    const pack = await response.json();
    assert.equal(pack.content.title, course.title);
    assert.equal(pack.content.activities.length, 36);
    assert.equal(pack.version, AGENT_COURSE_VERSION);
  }
  assert.equal((await handler.get("missing-course")).status, 404);
  assert.equal(handler.permissionChecks(), 15);
});
