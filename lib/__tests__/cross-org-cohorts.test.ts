import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Source-level guards for the cross-organisation cohort work (migration 034).
 *
 * Following lib/__tests__/companions-privacy.test.ts: these modules pull in
 * the admin client and cannot be imported under node:test, so the invariants
 * are pinned against the source instead. Brittle on purpose - every failure
 * mode below is SILENT. A missing org filter produces a plausible-looking
 * evidence pack containing someone else's staff; a missing template filter
 * sends people to a working assessment that asks the wrong questions. Neither
 * throws, and neither looks wrong in review.
 */

const libDir = join(import.meta.dirname, "..");
const repoRoot = join(libDir, "..");

function read(...parts: string[]): string {
  return readFileSync(join(repoRoot, ...parts), "utf8");
}

/** Every .ts/.tsx file under a directory, recursively. */
function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

// ── The evidence pack ────────────────────────────────────────
//
// A shared cohort belongs to the delivering organisation, so selecting an
// org's training with `.eq("org_id", orgId)` on cohorts found nothing for
// any attending company. Widening that selection then exposes the opposite
// risk: the enrolments underneath it belong to several companies at once.

test("evidence pack finds cohorts the organisation does not own", () => {
  const source = read("lib", "evidence-pack.ts");
  const start = source.indexOf("── 3: measures taken ──");
  assert.ok(start > -1, "the measures section should still be labelled");

  const section = source.slice(start, start + 2000);
  assert.match(
    section,
    /\.in\("id", cohortCandidates\)/,
    "cohorts for the measures section must be selected by candidate id, " +
      "not by cohorts.org_id - otherwise a company that merely attended a " +
      "cohort somebody else delivered reports no training at all"
  );
});

test("every enrolment read in the evidence pack is scoped to the organisation", () => {
  const source = read("lib", "evidence-pack.ts");
  const reads = [...source.matchAll(/\.from\("enrolments"\)/g)];
  assert.ok(reads.length > 0, "the evidence pack should read enrolments");

  for (const match of reads) {
    const block = source.slice(match.index, match.index + 400);
    const statement = block.slice(0, block.indexOf(";"));
    assert.match(
      statement,
      /\.eq\("org_id", orgId\)/,
      "an unscoped enrolments read would put another company's delegates " +
        "into this organisation's evidence pack, by name"
    );
  }
});

// ── The share link ───────────────────────────────────────────
//
// assessment_links has no assessment_id; the template IS the instrument.
// Three call sites used to select the org's first active link regardless of
// template, so an org running both instruments could send people taking a
// training-needs assessment to the maturity questions.

test("the link resolver matches on the assessment's template", () => {
  const source = read("lib", "assessment-link.ts");
  assert.match(source, /\.eq\("template_id", templateId\)/);
  assert.match(
    source,
    /template_id: templateId/,
    "a link created here must carry the instrument it was created for, " +
      "rather than falling back to the 'org-wide' column default"
  );
});

test("no route selects an active link by org without filtering the template", () => {
  const offenders: string[] = [];

  for (const file of sourceFiles(join(repoRoot, "app", "api"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/\.from\("assessment_links"\)/g)) {
      const block = source.slice(match.index, match.index + 500);
      const statement = block.slice(0, block.indexOf(";"));

      // Selecting by token is how the public flow resolves one specific
      // link, and needs no template filter. The dangerous shape is
      // "any active link belonging to this org".
      const picksByOrgAndActive =
        /\.eq\("org_id"/.test(statement) && /\.eq\("active", true\)/.test(statement);

      if (picksByOrgAndActive && !/template_id/.test(statement)) {
        offenders.push(file.replace(repoRoot + "/", ""));
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    "these routes pick an arbitrary active link for the org, which serves " +
      "whichever instrument happens to come back first - use " +
      "resolveAssessmentLink from lib/assessment-link.ts instead"
  );
});

test("the distribute screen shares the token funnel, not the id funnel", () => {
  const source = read(
    "app",
    "dashboard",
    "(control)",
    "assessment",
    "[id]",
    "distribute",
    "page.tsx"
  );

  assert.doesNotMatch(
    source,
    /\/assessment\/\$\{assessmentId\}\/take/,
    "the QR code, embed snippet and social copy must point at /assess/<token>: " +
      "the /assessment/<id>/take flow keeps answers in React state until " +
      "signup succeeds and rejects any email that already has an account, " +
      "which is exactly what a returning delegate scanning a QR in a " +
      "training room is"
  );
});
