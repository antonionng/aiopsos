import { test } from "node:test";
import assert from "node:assert/strict";
import {
  safeFilename,
  materialStoragePath,
  submissionStoragePath,
  isAllowedMaterialType,
  formatBytes,
  MAX_MATERIAL_BYTES,
  MAX_SUBMISSION_BYTES,
} from "../materials.ts";

test("safeFilename cannot escape its folder", () => {
  // Storage keys are not the access boundary here - that is decided before a
  // URL is ever minted - but a traversal still misfiles an object or makes it
  // unreachable.
  assert.equal(safeFilename("../../etc/passwd"), "passwd");
  assert.equal(safeFilename("/absolute/path/pack.pdf"), "pack.pdf");
  assert.equal(safeFilename("windows\\style\\pack.pdf"), "pack.pdf");
  assert.doesNotMatch(safeFilename("a/b/c.pdf"), /\//);
});

test("safeFilename keeps something usable and never returns empty", () => {
  assert.equal(safeFilename("Day 1 Pack (final).pdf"), "Day-1-Pack-final-.pdf");
  assert.equal(safeFilename("...."), "file");
  assert.equal(safeFilename(""), "file");
  assert.ok(safeFilename("x".repeat(300)).length <= 120);
});

test("storage paths are scoped to what the file belongs to", () => {
  const cohortPath = materialStoragePath(
    { cohortId: "coh-1", courseId: null },
    "pack.pdf",
    "abcd1234"
  );
  assert.equal(cohortPath, "cohorts/coh-1/abcd1234-pack.pdf");

  const coursePath = materialStoragePath(
    { cohortId: null, courseId: "crs-1" },
    "pack.pdf",
    "abcd1234"
  );
  assert.equal(coursePath, "courses/crs-1/abcd1234-pack.pdf");

  // A cohort scope wins when both are given: that is this day's handout.
  const both = materialStoragePath(
    { cohortId: "coh-1", courseId: "crs-1" },
    "pack.pdf",
    "abcd1234"
  );
  assert.match(both, /^cohorts\/coh-1\//);
});

test("submissions are filed under the enrolment that handed them in", () => {
  assert.equal(
    submissionStoragePath("enr-9", "whiteboard.jpg", "beef1234"),
    "submissions/enr-9/beef1234-whiteboard.jpg"
  );
});

test("the upload allow-list accepts classroom formats", () => {
  for (const type of [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "text/plain",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ]) {
    assert.ok(isAllowedMaterialType(type), `${type} should be accepted`);
  }
});

test("the allow-list rejects anything that executes in a browser", () => {
  // These files are served back to other people in the room, so an
  // allow-list is the right shape - SVG and HTML both carry script, and a
  // block-list would have to anticipate every such format.
  for (const type of [
    "image/svg+xml",
    "text/html",
    "application/x-msdownload",
    "application/javascript",
    "application/x-sh",
    "",
  ]) {
    assert.equal(isAllowedMaterialType(type), false, `${type} must be refused`);
  }
});

test("submitted work has a tighter cap than a participant pack", () => {
  // A trainer ships a deck once; three hundred delegates hand work in.
  assert.ok(MAX_SUBMISSION_BYTES < MAX_MATERIAL_BYTES);
});

test("formatBytes stays readable on a phone", () => {
  assert.equal(formatBytes(0), "");
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(5 * 1024 * 1024), "5.0 MB");
});
