import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getUseCase,
  getUseCases,
  getUseCasesByKind,
  useCaseCourseSlugs,
} from "../use-cases.ts";
import {
  COURSE_TITLES,
  FALLBACK_PUBLISHED_COURSE_SLUGS,
} from "../published-course-slugs.ts";

test("every cited course slug exists in the published catalogue", () => {
  // A use-case page linking to a 404 course is worse than no link. The
  // fallback list mirrors what migrations 020/024/033 publish, so it is
  // the checkable stand-in for the live catalogue.
  const published = new Set<string>(FALLBACK_PUBLISHED_COURSE_SLUGS);
  for (const entry of getUseCases()) {
    for (const example of entry.examples) {
      assert.ok(
        example.courseSlugs.length > 0,
        `${entry.slug} / ${example.title} cites no courses`
      );
      for (const slug of example.courseSlugs) {
        assert.ok(published.has(slug), `${entry.slug} cites unknown course ${slug}`);
        assert.ok(COURSE_TITLES[slug], `${slug} has no fallback title`);
      }
    }
  }
});

test("slugs are unique and lookups resolve", () => {
  const slugs = getUseCases().map((entry) => entry.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.equal(getUseCase(slug)?.slug, slug);
  }
  assert.equal(getUseCase("not-a-use-case"), undefined);
});

test("both browse axes are populated", () => {
  // The index page renders two sections; an empty one is a layout bug
  // waiting to be discovered in production.
  assert.ok(getUseCasesByKind("audience").length >= 2);
  assert.ok(getUseCasesByKind("function").length >= 3);
});

test("no fabricated evidence: examples carry no percentage or currency claims", () => {
  // The pages describe what training looks like, not invented results.
  // Numerals with % or currency signs are the usual way fake case-study
  // metrics creep in; keep them out of this surface entirely.
  for (const entry of getUseCases()) {
    for (const example of entry.examples) {
      const text = `${example.scenario} ${example.inPractice}`;
      assert.doesNotMatch(text, /\d\s*%|[£$€]\s*\d/, `${entry.slug} / ${example.title}`);
    }
  }
});

test("useCaseCourseSlugs dedupes across examples", () => {
  for (const entry of getUseCases()) {
    const slugs = useCaseCourseSlugs(entry);
    assert.equal(new Set(slugs).size, slugs.length);
  }
});
