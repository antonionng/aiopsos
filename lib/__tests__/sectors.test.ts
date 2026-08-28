import { test } from "node:test";
import assert from "node:assert/strict";

import {
  COURSE_SECTORS,
  COURSE_SECTOR_LABELS,
  COURSE_SECTOR_SHORT_LABELS,
  COURSE_SECTOR_SLUGS,
  courseSectorFromSlug,
  isCourseSector,
} from "../constants.ts";
import { getSector, getSectors, missingSectorCopy } from "../sectors.ts";

test("every sector has a page's worth of copy", () => {
  // A sector pill that routes to a page with no headline is worse than no
  // pill, and the filter row is generated straight from COURSE_SECTORS.
  assert.deepEqual(missingSectorCopy(), []);
  assert.equal(getSectors().length, COURSE_SECTORS.length);

  for (const sector of COURSE_SECTORS) {
    const entry = getSector(sector);
    assert.ok(entry, sector);
    assert.ok(entry.headline.length > 20, `${sector} headline`);
    assert.ok(entry.intro.length > 120, `${sector} intro`);
    assert.ok(entry.tensions.length >= 3, `${sector} needs three tensions`);
    for (const tension of entry.tensions) {
      assert.ok(tension.title.length > 10, `${sector} tension title`);
      assert.ok(tension.body.length > 60, `${sector} tension body`);
    }
  }
});

test("every sector has a label, a short label and a URL slug", () => {
  const slugs = new Set<string>();
  for (const sector of COURSE_SECTORS) {
    assert.ok(COURSE_SECTOR_LABELS[sector], sector);
    assert.ok(COURSE_SECTOR_SHORT_LABELS[sector], sector);
    const slug = COURSE_SECTOR_SLUGS[sector];
    assert.match(slug, /^[a-z]+(-[a-z]+)*$/, `${sector} slug is not URL-safe`);
    assert.equal(slugs.has(slug), false, `duplicate slug ${slug}`);
    slugs.add(slug);
    assert.equal(courseSectorFromSlug(slug), sector);
    assert.equal(isCourseSector(sector), true);
  }
});

test("an unknown sector slug resolves to null rather than a blank page", () => {
  assert.equal(courseSectorFromSlug("banking"), null);
  assert.equal(courseSectorFromSlug(""), null);
  assert.equal(courseSectorFromSlug("financial_services"), null);
  assert.equal(isCourseSector("financial-services"), false);
  assert.equal(isCourseSector(undefined), false);
});

test("sector copy makes no compliance claim", () => {
  // Same rule the use-case and insight copy is held to: training supports
  // documented literacy measures, it does not establish compliance.
  const banned = [
    /makes? you compliant/i,
    /ensures? compliance/i,
    /guarantees? compliance/i,
    /fully compliant/i,
    /certifies? compliance/i,
  ];
  for (const entry of getSectors()) {
    const prose = [
      entry.headline,
      entry.intro,
      ...entry.tensions.flatMap((t) => [t.title, t.body]),
    ].join(" ");
    for (const pattern of banned) {
      assert.equal(pattern.test(prose), false, `${entry.sector}: ${pattern}`);
    }
    // House style: no em dashes anywhere in site copy.
    assert.equal(prose.includes("—"), false, `${entry.sector} em dash`);
  }
});
