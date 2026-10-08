#!/usr/bin/env node
// Rebuilds lib/self-serve/courses/index.ts from course files whose own tests pass.
// Usage: node scripts/register-courses.mjs [--only slug,slug,...]
// With --only, just the named courses are considered (courses still being written are left out).
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dir = join(root, "lib/self-serve/courses");
const skip = new Set(["index.ts", "types.ts"]);

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg > -1 ? new Set((process.argv[onlyArg + 1] ?? "").split(",").filter(Boolean)) : null;

const slugs = readdirSync(dir)
  .filter((file) => file.endsWith(".ts") && !skip.has(file))
  .map((file) => file.replace(/\.ts$/, ""))
  .filter((slug) => !only || only.has(slug))
  .sort();

const ready = [];
for (const slug of slugs) {
  const test = join(root, "lib/__tests__", `course-${slug}.test.ts`);
  if (!existsSync(test)) {
    console.log(`skip ${slug}: no test file`);
    continue;
  }
  try {
    execFileSync(process.execPath, ["--experimental-strip-types", "--test", test], {
      cwd: root,
      stdio: "pipe",
    });
    ready.push(slug);
    console.log(`ok   ${slug}`);
  } catch {
    console.log(`fail ${slug}: tests do not pass`);
  }
}

const ident = (slug) => slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^[0-9]/, "_$&");
const lines = [
  'import type { CourseContent } from "./types.ts";',
  ...ready.map((slug) => `import { COURSE as ${ident(slug)} } from "./${slug}.ts";`),
  "",
  "/** Courses with full lessons. An outline becomes playable when its content is registered here. */",
  "export const COURSE_CONTENT: CourseContent[] = [",
  ...ready.map((slug) => `  ${ident(slug)},`),
  "];",
  "",
];
writeFileSync(join(dir, "index.ts"), lines.join("\n"));
console.log(`registered ${ready.length} course(s)`);
