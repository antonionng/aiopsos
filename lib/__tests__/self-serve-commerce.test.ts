import { test } from "node:test";
import assert from "node:assert/strict";

import {
  checkoutOrigin,
  courseAmountPence,
  isSelfServeCheckout,
  newCertificateRef,
  playablePaidCourse,
  SELF_SERVE_PURPOSE,
} from "../self-serve/commerce.ts";
import { SELF_SERVE_COURSES } from "../self-serve/catalog.ts";

test("the pilot is ninety-nine pounds in pence, and a course in preparation cannot be bought", () => {
  const course = playablePaidCourse("prompt-engineering-for-professional-work");
  assert.ok(course);
  assert.equal(courseAmountPence(course.priceGbp), 9900);
  const preparing = SELF_SERVE_COURSES.find((item) => !item.lessons?.length);
  if (preparing) assert.equal(playablePaidCourse(preparing.slug), undefined);
  for (const open of SELF_SERVE_COURSES.filter((item) => item.lessons?.length)) {
    assert.ok(playablePaidCourse(open.slug), open.slug);
  }
});

test("a public record reference is twelve characters a third party can type", () => {
  const ref = newCertificateRef();
  assert.match(ref, /^EX[0-9A-HJKMNPQRSTVWXYZ]{10}$/);
  assert.equal(ref.length, 12);
});

test("checkout uses the incoming host so a preview can return to itself", () => {
  const req = new Request("https://example.internal/api/learn/checkout", {
    headers: {
      host: "aiopsos-git-preview.vercel.app",
      "x-forwarded-proto": "https",
    },
  });
  assert.equal(checkoutOrigin(req), "https://aiopsos-git-preview.vercel.app");
});

test("only self-serve checkout sessions are fulfilled as course purchases", () => {
  assert.equal(
    isSelfServeCheckout({
      purpose: SELF_SERVE_PURPOSE,
      course_slug: "prompt-engineering-for-professional-work",
    }),
    true
  );
  assert.equal(isSelfServeCheckout({ org_id: "x", plan: "team" }), false);
});
